# 🚀 k6 Performance & Load Testing Suite — FarmFlow

This performance and load testing suite was developed with **k6 (Grafana Labs)** to validate scalability, resilience, and latency benchmarks for the **FarmFlow Super App** and its backend microservices (Java Spring Boot / C# .NET + PostgreSQL PostGIS).

---

## 🏗️ Suite Structure

```bash
k6/
├── config/
│   └── thresholds.js
├── scenarios/
│   ├── load_test.js
│   ├── stress_test.js
│   ├── spike_test.js
│   └── offline_sync_test.js
└── README.md
```

---

## ⚡ How to Install k6

### On Windows (via Winget or Chocolatey)
```powershell
winget install grafana.k6
# or via Chocolatey:
choco install k6
```

### On macOS / Linux
```bash
brew install k6          # macOS
sudo apt-get install k6  # Debian / Ubuntu
```

### Via Docker (Zero local footprint)
```bash
docker pull grafana/k6:latest
```

---

## 🧪 How to Run Tests

Run directly via configured scripts in `package.json`:

```bash
npm run test:k6
npm run test:k6:stress
npm run test:k6:spike
npm run test:k6:sync
```

### Running with Custom Parameters:
```bash
# Target custom local or staging API URL:
API_BASE_URL="http://localhost:8080" k6 run k6/scenarios/load_test.js

# Execute via Docker container:
docker run -i -e API_BASE_URL="http://host.docker.internal:8080" grafana/k6 run - < k6/scenarios/load_test.js
```

---

## 📊 SLAs and Success Criteria (Thresholds)

All scenarios enforce high-performance agribusiness SLAs defined in `k6/config/thresholds.js`:

| Metric | Target SLA | Description |
| :--- | :--- | :--- |
| **`http_req_duration (p95)`** | `< 300ms` | 95% of operational HTTP requests must resolve under 300 milliseconds. |
| **`http_req_duration (p99)`** | `< 800ms` | 99% of requests must resolve under 800 milliseconds. |
| **`http_req_failed`** | `< 1%` | Global HTTP failure rate must remain below 1% (0.01). |
| **`offline_sync_batch`** | `< 500ms` | Processing time for queued offline farm activity batches. |
