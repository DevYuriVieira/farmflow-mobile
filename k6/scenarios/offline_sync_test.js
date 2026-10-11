import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { syncBatchThresholds } from '../config/thresholds.js';

const syncBatchDuration = new Trend('offline_sync_batch_duration');
const syncBatchErrors = new Rate('offline_sync_batch_errors');

export const options = {
  stages: [
    { duration: '20s', target: 30 },
    { duration: '40s', target: 150 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    ...syncBatchThresholds,
    offline_sync_batch_duration: ['p(95)<500'],
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'https://api.farmflow.ag';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'X-Client-Id': `mobile-device-${__VU}`,
  };

  group('Batch Offline Mutation Synchronization', () => {
    const batchPayload = JSON.stringify({
      deviceId: `device-${__VU}`,
      lastSyncedAt: new Date(Date.now() - 3600 * 4 * 1000).toISOString(),
      mutations: [
        {
          type: 'CREATE_ACTIVITY',
          entityId: `act-offline-${__VU}-1`,
          payload: {
            title: 'Foliar application performed in Sector B',
            type: 'PEST_CONTROL',
            completed: true,
            timestamp: new Date().toISOString(),
          },
        },
        {
          type: 'UPDATE_PLANTATION_STATUS',
          entityId: 'plt-001',
          payload: {
            status: 'HARVEST_READY',
            updatedAt: new Date().toISOString(),
          },
        },
      ],
    });

    const start = Date.now();
    const res = http.post(`${BASE_URL}/api/v1/sync/batch`, batchPayload, { headers });
    syncBatchDuration.add(Date.now() - start);

    const success = check(res, {
      'batch sync accepted (200 or 207 Multi-Status)': (r) =>
        r.status === 200 || r.status === 201 || r.status === 207,
    });

    if (!success) {
      syncBatchErrors.add(1);
    }

    sleep(1.5);
  });
}
