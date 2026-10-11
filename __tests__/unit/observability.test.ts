import { ObservabilityService } from '../../src/services/observability/observability.service';
import {
  IObservabilityTransport,
  ObservabilityEvent,
  Breadcrumb,
  PerformanceSpan,
} from '../../src/services/observability/types';

describe('Production Observability & APM Suite', () => {
  let service: ObservabilityService;
  let mockTransport: IObservabilityTransport;
  let sentEvents: ObservabilityEvent[];
  let sentBreadcrumbs: Breadcrumb[];
  let sentSpans: PerformanceSpan[];

  beforeEach(() => {
    service = ObservabilityService.getInstance();
    service.clearBreadcrumbs();
    service.clearUser();
    service.setNetworkStatus(true);

    sentEvents = [];
    sentBreadcrumbs = [];
    sentSpans = [];

    mockTransport = {
      name: 'mock-test-transport',
      sendEvent: async (event) => {
        sentEvents.push(event);
      },
      sendBreadcrumb: (breadcrumb) => {
        sentBreadcrumbs.push(breadcrumb);
      },
      sendSpan: async (span) => {
        sentSpans.push(span);
      },
    };

    service.setTransport(mockTransport);
  });

  describe('Exception and Error Tracking', () => {
    test('captures standard Error instance and attaches metadata', async () => {
      const error = new Error('Database connection failed');
      const eventId = await service.captureException(error, {
        level: 'fatal',
        tags: { module: 'database' },
        extra: { retryAttempts: 3 },
      });

      expect(eventId).toBeDefined();
      expect(sentEvents.length).toBe(1);

      const captured = sentEvents[0];
      expect(captured.errorMessage).toBe('Database connection failed');
      expect(captured.errorName).toBe('Error');
      expect(captured.level).toBe('fatal');
      expect(captured.tags.module).toBe('database');
      expect(captured.extra?.retryAttempts).toBe(3);
    });

    test('captures raw string error messages gracefully', async () => {
      const eventId = await service.captureException('Out of memory exception', {
        level: 'error',
      });

      expect(eventId).toBeDefined();
      expect(sentEvents[0].errorMessage).toBe('Out of memory exception');
      expect(sentEvents[0].level).toBe('error');
    });

    test('captures log message without explicit error object', async () => {
      const eventId = await service.captureMessage('Sprayer calibration finished', 'info');

      expect(eventId).toBeDefined();
      expect(sentEvents[0].errorMessage).toBe('Sprayer calibration finished');
      expect(sentEvents[0].level).toBe('info');
    });
  });

  describe('Breadcrumbs Trail and Buffer', () => {
    test('records breadcrumbs and attaches them to subsequent exception event', async () => {
      service.addBreadcrumb('navigation', 'Navigated to FieldMapScreen');
      service.addBreadcrumb('http', 'GET /api/v1/plantations');
      service.addBreadcrumb('user', 'User tapped Spray Calculator');

      await service.captureException(new Error('Calculation failed'));

      expect(sentEvents[0].breadcrumbs.length).toBe(3);
      expect(sentEvents[0].breadcrumbs[0].message).toBe('Navigated to FieldMapScreen');
      expect(sentEvents[0].breadcrumbs[1].type).toBe('http');
      expect(sentEvents[0].breadcrumbs[2].message).toBe('User tapped Spray Calculator');
    });

    test('enforces FIFO rolling limit when breadcrumbs exceed maximum capacity', () => {
      for (let i = 0; i < 60; i++) {
        service.addBreadcrumb('system', `Telemetry ping ${i}`);
      }

      const active = service.getBreadcrumbs();
      expect(active.length).toBe(50);
      expect(active[0].message).toBe('Telemetry ping 10');
      expect(active[49].message).toBe('Telemetry ping 59');
    });
  });

  describe('User Context Management', () => {
    test('attaches user identity to events when authenticated', async () => {
      service.setUser({
        id: 'usr-agro-007',
        email: 'agronomo@farmflow.ag',
        role: 'AGRONOMIST',
        farmId: 'faz-01',
      });

      await service.captureMessage('Critical pest threshold detected', 'warning');

      expect(sentEvents[0].user?.id).toBe('usr-agro-007');
      expect(sentEvents[0].user?.email).toBe('agronomo@farmflow.ag');
      expect(sentEvents[0].user?.role).toBe('AGRONOMIST');
    });

    test('clears user identity upon logout and stops attaching user info', async () => {
      service.setUser({ id: 'usr-123' });
      service.clearUser();

      await service.captureMessage('Anonymous event after sign out', 'info');

      expect(sentEvents[0].user).toBeUndefined();
    });
  });

  describe('Application Performance Monitoring (APM Spans)', () => {
    test('measures execution time and records performance span', async () => {
      const span = service.startSpan('calculate_fertilizer', 'agronomy.math', {
        crop: 'SOY',
      });

      await new Promise((resolve) => setTimeout(resolve, 25));
      const finished = await span.finish('ok');

      expect(finished.name).toBe('calculate_fertilizer');
      expect(finished.op).toBe('agronomy.math');
      expect(finished.durationMs).toBeGreaterThanOrEqual(20);
      expect(finished.status).toBe('ok');
      expect(sentSpans.length).toBe(1);
    });

    test('measureAsync helper executes function and reports span with error status on failure', async () => {
      const faultyOperation = async () => {
        throw new Error('Sensor telemetry timeout');
      };

      await expect(
        service.measureAsync('pivot_telemetry', 'hardware.iot', faultyOperation)
      ).rejects.toThrow('Sensor telemetry timeout');

      expect(sentSpans.length).toBe(1);
      expect(sentSpans[0].status).toBe('error');
      expect(sentEvents.length).toBe(1);
      expect(sentEvents[0].errorMessage).toBe('Sensor telemetry timeout');
    });
  });

  describe('Offline Event Queue and Synchronization', () => {
    test('buffers events while offline and flushes them when connection restores', async () => {
      await service.setNetworkStatus(false);

      await service.captureException(new Error('Offline crash 1'));
      await service.captureException(new Error('Offline crash 2'));

      expect(service.getOfflineQueueLength()).toBe(2);
      expect(sentEvents.length).toBe(0);

      const flushedCount = await service.setNetworkStatus(true);

      expect(flushedCount).toBe(2);
      expect(sentEvents.length).toBe(2);
      expect(service.getOfflineQueueLength()).toBe(0);
    });
  });
});
