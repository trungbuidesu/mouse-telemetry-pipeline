# Phase 5: Hardening and Delivery

## 1. Mục tiêu

Phase 5 đóng gói dự án thành một đồ án có thể chạy, kiểm chứng và trình bày. Trọng tâm là performance, observability, tài liệu vận hành và độ tin cậy của demo local.

---

## 2. Phạm vi

### Trong scope

* Performance validation cho frontend telemetry và ingestion path.
* Observability tối thiểu: logs, counters, health checks.
* Runbook chạy local bằng Docker Compose.
* Troubleshooting guide cho lỗi thường gặp.
* Cleanup/reset script cho data volume local nếu cần.
* Báo cáo cuối hoặc phần mô tả kiến trúc có thể đưa vào đồ án.

### Ngoài scope

* Production deployment trên cloud.
* Autoscaling.
* Security hardening đầy đủ.
* CI/CD phức tạp.
* Multi-user authentication.

---

## 3. Phụ thuộc

Phase 5 phụ thuộc tất cả phase trước vì đây là phase xác nhận toàn hệ thống.

| Dependency | Từ phase | Ghi chú |
|---|---|---|
| Frontend playable | phase1 | Cần kiểm tra UX và telemetry performance |
| API ingestion | phase2 | Cần kiểm tra request path và error behavior |
| Stream/storage | phase3 | Cần kiểm tra end-to-end throughput |
| Dashboard/demo | phase4 | Cần tài liệu hóa kịch bản trình bày |

---

## 4. Plans

| Plan | Vai trò | Output chính |
|---|---|---|
| [plan001-performance-validation-and-observability](../../plans/phase5/plan001-performance-validation-and-observability.md) | Đo và quan sát hệ thống | Benchmarks, metrics, health checks |
| [plan002-packaging-runbooks-and-final-report](../../plans/phase5/plan002-packaging-runbooks-and-final-report.md) | Chuẩn bị bàn giao | Runbook, README, final report outline |

---

## 5. Decisions

| Decision | Áp dụng trong phase |
|---|---|
| [DEC-002: Client-side batching and sampling](../../decisions/decision002-client-side-batching-and-sampling.md) | Performance acceptance |
| [DEC-007: Memory-bounded retry policy](../../decisions/decision007-memory-bounded-retry-policy.md) | Failure-mode validation |
| [DEC-010: Local-first Docker Compose stack](../../decisions/decision010-local-first-docker-compose-stack.md) | Packaging và demo repeatability |

---

## 6. Trọng tâm validation

Phase 5 cần chứng minh:

* Frontend không giật khi di chuột liên tục trong phiên MVP.
* Batch sender không tạo request storm.
* API trả lỗi rõ ràng khi backend dependency lỗi.
* Spark và storage có checkpoint/data path ngoài Git.
* Demo có thể reset và chạy lại.
* README đủ để người khác dựng local environment.

---

## 7. Completion gate

Phase 5 hoàn thành khi:

1. Có runbook chạy toàn hệ thống local.
2. Có danh sách validation đã chạy và kết quả.
3. Có troubleshooting guide cho Kafka, Spark, MinIO, InfluxDB và frontend.
4. Có final report outline liên kết lại architecture, plans và decisions.
5. Không còn dữ liệu runtime lớn hoặc secret nằm trong working tree.
