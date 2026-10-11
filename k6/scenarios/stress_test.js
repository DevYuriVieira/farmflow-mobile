import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { stressThresholds } from '../config/thresholds.js';

const stressLatency = new Trend('agro_stress_latency');
const stressErrors = new Rate('agro_stress_errors');

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 200 },
    { duration: '1m', target: 500 },
    { duration: '1m', target: 1000 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    ...stressThresholds,
    agro_stress_latency: ['p(95)<600'],
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'https://api.farmflow.ag';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'FarmFlow-Mobile/1.0.0 (k6-stress-agent)',
  };

  group('Stress: Critical Agricultural Financials & Break-Even Simulation', () => {
    const payload = JSON.stringify({
      plantationId: 'plt-001',
      cropType: 'SOY',
      areaHectares: 120,
      bagsPerHectare: 68,
      bagPriceBrl: 134.5,
      costPerHectareBrl: 4200,
    });

    const start = Date.now();
    const res = http.post(`${BASE_URL}/api/v1/finances/simulate-roi`, payload, { headers });
    stressLatency.add(Date.now() - start);

    const success = check(res, {
      'roi simulation responds successfully': (r) => r.status === 200 || r.status === 201,
      'response time acceptable': (r) => r.timings.duration < 1200,
    });

    if (!success) {
      stressErrors.add(1);
    }

    sleep(1);
  });
}
