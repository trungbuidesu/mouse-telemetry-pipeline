# Plan Index

## 1. Mục đích

Thư mục `documents/plans/` chứa kế hoạch triển khai chi tiết cho từng phase. Plan là cầu nối giữa phase overview và task file thực thi.

Một plan phải trả lời:

- Plan thuộc phase nào?
- Plan phụ thuộc tài liệu, decision và plan nào?
- Output nào sẽ được tạo ra?
- Cần validation gì để xem là hoàn thành?
- Những ràng buộc performance/data correctness nào phải giữ?

---

## 2. Quy ước

| Quy ước | Giá trị |
|---|---|
| Đường dẫn | `documents/plans/<phase>/planNNN-<short-name>.md` |
| Phase owner | Mỗi plan chỉ thuộc một phase chính |
| Status | `PLANNED`, `IN_PROGRESS`, `DONE`, `DEFERRED` |
| Decision links | Mọi quyết định kiến trúc phải link sang `documents/decisions/` |
| Task links | Khi triển khai, task file cụ thể được thêm vào mục `Implementation Tasks` |

Plan không ghi nhật ký từng thao tác code. Nhật ký thực thi nằm trong task file theo [Agent Development Protocol](../agents/AGENTS.md).

---

## 3. Plan Map

| Phase | Plan | Depends on | Produces |
|---|---|---|---|
| phase0 | [plan001-repository-and-doc-governance](phase0/plan001-repository-and-doc-governance.md) | Architecture, agent rules | Repo/doc governance |
| phase0 | [plan002-contract-first-schema-and-api](phase0/plan002-contract-first-schema-and-api.md) | DEC-001, DEC-004 | Schema and API contract |
| phase1 | [plan001-frontend-gameplay-shell](phase1/plan001-frontend-gameplay-shell.md) | phase0 contracts | Playable Aim Trainer |
| phase1 | [plan002-telemetry-collector-buffer-sender](phase1/plan002-telemetry-collector-buffer-sender.md) | DEC-001, DEC-002, DEC-003, DEC-007 | Collector, buffer, sender |
| phase1 | [plan003-session-result-and-client-analytics](phase1/plan003-session-result-and-client-analytics.md) | Gameplay and telemetry | Result page and client metrics |
| phase2 | [plan001-fastapi-ingestion-contract](phase2/plan001-fastapi-ingestion-contract.md) | Schema/API decisions | FastAPI routes and models |
| phase2 | [plan002-backpressure-and-idempotent-ingestion](phase2/plan002-backpressure-and-idempotent-ingestion.md) | API routes, DEC-007 | Retry/backpressure behavior |
| phase3 | [plan001-kafka-topics-and-local-infrastructure](phase3/plan001-kafka-topics-and-local-infrastructure.md) | DEC-005, DEC-010 | Local streaming infrastructure |
| phase3 | [plan002-spark-streaming-to-minio-influxdb](phase3/plan002-spark-streaming-to-minio-influxdb.md) | Kafka topics, DEC-006, DEC-009 | Spark jobs and storage writes |
| phase4 | [plan001-dashboard-session-analytics](phase4/plan001-dashboard-session-analytics.md) | Stream/storage outputs | Dashboard and session analytics |
| phase4 | [plan002-demo-scenarios-and-load-generation](phase4/plan002-demo-scenarios-and-load-generation.md) | End-to-end pipeline | Demo script and load generator |
| phase5 | [plan001-performance-validation-and-observability](phase5/plan001-performance-validation-and-observability.md) | All runtime components | Benchmarks and observability |
| phase5 | [plan002-packaging-runbooks-and-final-report](phase5/plan002-packaging-runbooks-and-final-report.md) | All phases | Runbooks and final report |

---

## 4. Update Rules

Khi một plan thay đổi kiến trúc:

1. Cập nhật decision record liên quan hoặc tạo decision mới.
2. Cập nhật phase README nếu dependency/gate thay đổi.
3. Cập nhật plan index nếu thêm/xóa/đổi tên plan.
4. Khi triển khai code, tạo task file theo template trong phase tương ứng.

