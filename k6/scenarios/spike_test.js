import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { spikeThresholds } from '../config/thresholds.js';

const telemetryDuration = new Trend('iot_telemetry_duration');
const telemetryFailures = new Rate('iot_telemetry_failures');

export const options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '15s', target: 350 },
    { duration: '30s', target: 350 },
    { duration: '15s', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    ...spikeThresholds,
    iot_telemetry_duration: ['p(95)<450'],
  },
};

const BASE_URL = __ENV.API_BASE_URL || 'https://api.farmflow.ag';

export default function () {
  const telemetryData = JSON.stringify({
    sensorId: `sensor-${__VU}-${__ITER}`,
    farmId: 'farm-001',
    plantationId: 'plt-001',
    metrics: {
      soilMoisturePercent: 68.4 + (Math.random() * 5),
      soilTemperatureCelsius: 24.2 + (Math.random() * 2),
      pivotFlowRateM3h: 120.0,
      timestamp: new Date().toISOString(),
    },
  });

  const headers = {
    'Content-Type': 'application/json',
    'X-Device-Type': 'Agro-IoT-Edge-Gateway',
  };

  const start = Date.now();
  const res = http.post(`${BASE_URL}/api/v1/telemetry/sensors`, telemetryData, { headers });
  telemetryDuration.add(Date.now() - start);

  const passed = check(res, {
    'telemetry ingested 200 or 202': (r) => r.status === 200 || r.status === 202,
  });

  if (!passed) {
    telemetryFailures.add(1);
  }

  sleep(0.5);
}
