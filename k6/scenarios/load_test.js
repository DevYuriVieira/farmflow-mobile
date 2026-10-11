import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { standardThresholds } from '../config/thresholds.js';

const dashboardLatency = new Trend('agro_dashboard_duration');
const commodityLatency = new Trend('agro_commodity_duration');
const errorRate = new Rate('agro_errors');

export const options = {
  stages: [
    { duration: '30s', target: 25 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    ...standardThresholds,
    agro_dashboard_duration: ['p(95)<300'],
    agro_commodity_duration: ['p(95)<250'],
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'https://api.farmflow.ag';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'FarmFlow-Mobile/1.0.0 (k6-load-agent)',
  };

  group('01. Producer Authentication & Session', () => {
    const authPayload = JSON.stringify({
      email: 'demo@farmflow.ag',
      password: 'demoSecretPassword123',
    });

    const res = http.post(`${BASE_URL}/api/v1/auth/login`, authPayload, { headers });
    const success = check(res, {
      'auth status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    });
    if (!success) errorRate.add(1);
    sleep(1);
  });

  group('02. Dashboard & Precision Weather Feed', () => {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/api/v1/weather?lat=-21.1767&lon=-47.8208`, { headers });
    dashboardLatency.add(Date.now() - start);

    const success = check(res, {
      'weather feed status 200': (r) => r.status === 200 || r.status === 304,
    });
    if (!success) errorRate.add(1);
    sleep(1.5);
  });

  group('03. Fields & Plantation Occupancy Query', () => {
    const res = http.get(`${BASE_URL}/api/v1/plantations`, { headers });
    const success = check(res, {
      'plantations query returned 200': (r) => r.status === 200,
    });
    if (!success) errorRate.add(1);
    sleep(1);
  });

  group('04. Live Commodity Quotes & Freight Matrix', () => {
    const start = Date.now();
    const res = http.get(`${BASE_URL}/api/v1/market/commodities`, { headers });
    commodityLatency.add(Date.now() - start);

    const success = check(res, {
      'commodities status 200': (r) => r.status === 200,
    });
    if (!success) errorRate.add(1);
    sleep(2);
  });
}
