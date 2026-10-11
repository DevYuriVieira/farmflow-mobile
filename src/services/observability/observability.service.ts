import { ENV } from '../../config/env';
import {
  Breadcrumb,
  BreadcrumbType,
  IObservabilityTransport,
  ObservabilityEvent,
  PerformanceSpan,
  SeverityLevel,
  UserContext,
} from './types';

class ConsoleObservabilityTransport implements IObservabilityTransport {
  public readonly name = 'console-transport';

  async sendEvent(event: ObservabilityEvent): Promise<void> {
    if (__DEV__) {
      if (event.level === 'error' || event.level === 'fatal') {
        console.error(`[Observability:${event.level.toUpperCase()}] ${event.errorMessage}`, {
          event,
        });
      }
    }
  }

  sendBreadcrumb(_breadcrumb: Breadcrumb): void {
    // Silent in production, can be inspected via service buffer
  }

  async sendSpan(span: PerformanceSpan): Promise<void> {
    if (__DEV__ && span.durationMs && span.durationMs > 1000) {
      console.warn(`[APM Slow Span] ${span.op}:${span.name} took ${span.durationMs}ms`);
    }
  }
}

export class ObservabilityService {
  private static instance: ObservabilityService;

  private breadcrumbs: Breadcrumb[] = [];
  private readonly maxBreadcrumbs = 50;
  private userContext: UserContext | undefined;
  private globalTags: Record<string, string> = {};
  private globalExtra: Record<string, unknown> = {};

  private isOnline = true;
  private offlineEventQueue: ObservabilityEvent[] = [];
  private eventHistory: ObservabilityEvent[] = [];
  private readonly maxHistory = 30;

  private transport: IObservabilityTransport;

  private constructor() {
    this.transport = new ConsoleObservabilityTransport();
    this.globalTags = {
      environment: ENV.environment,
      platform: typeof window !== 'undefined' ? 'web' : 'native',
    };
  }

  public static getInstance(): ObservabilityService {
    if (!ObservabilityService.instance) {
      ObservabilityService.instance = new ObservabilityService();
    }
    return ObservabilityService.instance;
  }

  public setTransport(transport: IObservabilityTransport): void {
    this.transport = transport;
  }

  public setUser(user: UserContext): void {
    this.userContext = { ...user };
    this.addBreadcrumb('user', `User authenticated: ${user.id}`, { role: user.role });
  }

  public clearUser(): void {
    const prevId = this.userContext?.id;
    this.userContext = undefined;
    if (prevId) {
      this.addBreadcrumb('user', `User signed out: ${prevId}`);
    }
  }

  public getUser(): UserContext | undefined {
    return this.userContext;
  }

  public setTag(key: string, value: string): void {
    this.globalTags[key] = value;
  }

  public setExtra(key: string, value: unknown): void {
    this.globalExtra[key] = value;
  }

  public addBreadcrumb(
    type: BreadcrumbType,
    message: string,
    data?: Record<string, unknown>,
    level: SeverityLevel = 'info'
  ): void {
    const breadcrumb: Breadcrumb = {
      type,
      message,
      timestamp: Date.now(),
      data,
      level,
    };

    this.breadcrumbs.push(breadcrumb);
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }

    this.transport.sendBreadcrumb(breadcrumb);
  }

  public getBreadcrumbs(): Breadcrumb[] {
    return [...this.breadcrumbs];
  }

  public clearBreadcrumbs(): void {
    this.breadcrumbs = [];
  }

  public async setNetworkStatus(online: boolean): Promise<number | void> {
    const previous = this.isOnline;
    this.isOnline = online;

    if (previous !== online) {
      this.addBreadcrumb('system', `Network status changed: ${online ? 'ONLINE' : 'OFFLINE'}`, {
        online,
      });

      if (online && this.offlineEventQueue.length > 0) {
        return await this.flushOfflineEvents();
      }
    }
  }

  public async captureException(
    error: unknown,
    context?: {
      level?: SeverityLevel;
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
    }
  ): Promise<string> {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const level = context?.level || 'error';

    let errorName = 'UnknownError';
    let errorMessage = 'An unexpected error occurred';
    let stack: string | undefined;

    if (error instanceof Error) {
      errorName = error.name;
      errorMessage = error.message;
      stack = error.stack;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    const event: ObservabilityEvent = {
      id: eventId,
      errorName,
      errorMessage,
      stack,
      level,
      timestamp: Date.now(),
      breadcrumbs: this.getBreadcrumbs(),
      user: this.userContext,
      tags: { ...this.globalTags, ...(context?.tags || {}) },
      extra: { ...this.globalExtra, ...(context?.extra || {}) },
    };

    this.recordEvent(event);

    if (!this.isOnline) {
      this.offlineEventQueue.push(event);
      return eventId;
    }

    try {
      await this.transport.sendEvent(event);
    } catch {
      this.offlineEventQueue.push(event);
    }

    return eventId;
  }

  public async captureMessage(
    message: string,
    level: SeverityLevel = 'info',
    context?: {
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
    }
  ): Promise<string> {
    const eventId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const event: ObservabilityEvent = {
      id: eventId,
      errorMessage: message,
      level,
      timestamp: Date.now(),
      breadcrumbs: this.getBreadcrumbs(),
      user: this.userContext,
      tags: { ...this.globalTags, ...(context?.tags || {}) },
      extra: { ...this.globalExtra, ...(context?.extra || {}) },
    };

    this.recordEvent(event);

    if (this.isOnline) {
      await this.transport.sendEvent(event);
    } else {
      this.offlineEventQueue.push(event);
    }

    return eventId;
  }

  public startSpan(name: string, op: string, tags?: Record<string, string>) {
    const id = `span_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const startTime = Date.now();

    return {
      finish: async (status: 'ok' | 'error' = 'ok'): Promise<PerformanceSpan> => {
        const endTime = Date.now();
        const durationMs = endTime - startTime;

        const span: PerformanceSpan = {
          id,
          name,
          op,
          startTime,
          endTime,
          durationMs,
          tags,
          status,
        };

        await this.transport.sendSpan(span);
        return span;
      },
    };
  }

  public async measureAsync<T>(
    name: string,
    op: string,
    fn: () => Promise<T>,
    tags?: Record<string, string>
  ): Promise<T> {
    const span = this.startSpan(name, op, tags);
    try {
      const result = await fn();
      await span.finish('ok');
      return result;
    } catch (err) {
      await span.finish('error');
      await this.captureException(err, { tags: { operation: op } });
      throw err;
    }
  }

  public getRecentEvents(): ObservabilityEvent[] {
    return [...this.eventHistory];
  }

  public getOfflineQueueLength(): number {
    return this.offlineEventQueue.length;
  }

  public async flushOfflineEvents(): Promise<number> {
    const count = this.offlineEventQueue.length;
    const pending = [...this.offlineEventQueue];
    this.offlineEventQueue = [];

    for (const event of pending) {
      try {
        await this.transport.sendEvent(event);
      } catch {
        this.offlineEventQueue.push(event);
      }
    }

    return count - this.offlineEventQueue.length;
  }

  private recordEvent(event: ObservabilityEvent): void {
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistory) {
      this.eventHistory.shift();
    }
  }
}

export const observabilityService = ObservabilityService.getInstance();
