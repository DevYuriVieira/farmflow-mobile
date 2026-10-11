export type SeverityLevel = 'debug' | 'info' | 'warning' | 'error' | 'fatal';

export type BreadcrumbType = 'navigation' | 'http' | 'user' | 'system' | 'agronomic_calc';

export interface Breadcrumb {
  type: BreadcrumbType;
  message: string;
  timestamp: number;
  data?: Record<string, unknown>;
  level?: SeverityLevel;
}

export interface UserContext {
  id: string;
  email?: string;
  role?: string;
  farmId?: string;
}

export interface PerformanceSpan {
  id: string;
  name: string;
  op: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  tags?: Record<string, string>;
  status: 'ok' | 'error';
}

export interface ObservabilityEvent {
  id: string;
  errorName?: string;
  errorMessage: string;
  stack?: string;
  level: SeverityLevel;
  timestamp: number;
  breadcrumbs: Breadcrumb[];
  user?: UserContext;
  tags: Record<string, string>;
  extra?: Record<string, unknown>;
}

export interface IObservabilityTransport {
  name: string;
  sendEvent(event: ObservabilityEvent): Promise<void>;
  sendBreadcrumb(breadcrumb: Breadcrumb): void;
  sendSpan(span: PerformanceSpan): Promise<void>;
}
