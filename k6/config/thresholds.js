export const standardThresholds = {
  http_req_duration: ['p(95)<300', 'p(99)<800'],
  http_req_failed: ['rate<0.01'],
};

export const stressThresholds = {
  http_req_duration: ['p(95)<600', 'p(99)<1500'],
  http_req_failed: ['rate<0.02'],
};

export const spikeThresholds = {
  http_req_duration: ['p(95)<450', 'p(99)<1200'],
  http_req_failed: ['rate<0.02'],
};

export const syncBatchThresholds = {
  http_req_duration: ['p(95)<500', 'p(99)<1200'],
  http_req_failed: ['rate<0.005'],
};
