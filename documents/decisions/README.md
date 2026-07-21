# Decision Records

## 1. Mục đích

Thư mục `documents/decisions/` lưu các quyết định kiến trúc có ảnh hưởng xuyên suốt nhiều phase. Mỗi decision record giải thích bối cảnh, quyết định, lý do, hệ quả và những plan/phase phải tuân theo.

Với dự án này, decision records đặc biệt quan trọng vì ứng dụng là nguồn thu thập dữ liệu tần suất cao. Một thay đổi nhỏ ở frontend telemetry, schema hoặc storage có thể ảnh hưởng đến ingestion API, Kafka, Spark, dashboard và demo.

---

## 2. Decision Map

| ID | Decision | Status | Main phases |
|---|---|---|---|
| [DEC-001](decision001-canvas-relative-telemetry-schema.md) | Canvas-relative telemetry schema | `DECIDED` | phase0, phase1, phase2, phase3 |
| [DEC-002](decision002-client-side-batching-and-sampling.md) | Client-side batching and sampling | `DECIDED` | phase1, phase2, phase5 |
| [DEC-003](decision003-react-state-vs-ref-boundary.md) | React state vs ref boundary | `DECIDED` | phase1 |
| [DEC-004](decision004-http-ingestion-before-kafka.md) | HTTP ingestion before Kafka | `DECIDED` | phase0, phase2 |
| [DEC-005](decision005-kafka-topic-layout-and-event-keys.md) | Kafka topic layout and event keys | `DECIDED` | phase2, phase3 |
| [DEC-006](decision006-raw-parquet-and-timeseries-metrics.md) | Raw Parquet and time-series metrics | `DECIDED` | phase3, phase4 |
| [DEC-007](decision007-memory-bounded-retry-policy.md) | Memory-bounded retry policy | `DECIDED` | phase1, phase2, phase5 |
| [DEC-008](decision008-load-generator-separated-from-player-app.md) | Load generator separated from player app | `DECIDED` | phase4, phase5 |
| [DEC-009](decision009-session-analytics-event-time-watermark.md) | Session analytics event-time watermark | `DECIDED` | phase3, phase4 |
| [DEC-010](decision010-local-first-docker-compose-stack.md) | Local-first Docker Compose stack | `DECIDED` | phase0, phase3, phase5 |
| [DEC-011](decision011-vite-react-shadcn-frontend-stack.md) | Vite React shadcn frontend stack | `DECIDED` | phase0, phase1 |
| [DEC-012](decision012-uv-managed-python-api-environment.md) | uv-managed Python API environment | `DECIDED` | phase0, phase2 |
| [DEC-013](decision013-fastapi-performance-oriented-api-stack.md) | FastAPI performance-oriented API stack | `DECIDED` | phase2 |

---

## 3. Status Values

| Status | Meaning |
|---|---|
| `PROPOSED` | Đang được cân nhắc, chưa được dùng làm constraint triển khai |
| `DECIDED` | Đã chốt và các plan/task phải tuân theo |
| `SUPERSEDED` | Đã bị thay thế bởi decision mới |
| `DEFERRED` | Ghi nhận nhưng chưa quyết trong MVP |

Nếu một plan cần quyết định mới, tạo file `decisionNNN-<short-name>.md` trước hoặc trong cùng thay đổi tài liệu.
