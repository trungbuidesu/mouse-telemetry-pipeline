# Phase 2: Ingestion API

## 1. Mục tiêu

Phase 2 xây FastAPI ingestion API làm cửa vào duy nhất cho browser. API nhận session metadata và telemetry batch, validate payload, trả response nhanh, sau đó đẩy event vào Kafka.

Backend phải hấp thụ được burst nhỏ từ frontend mà không buộc browser hiểu Kafka hoặc retry logic phức tạp.

---

## 2. Scope

### In scope

- Endpoint tạo session.
- Endpoint nhận telemetry batch.
- Endpoint complete session.
- Endpoint lấy trạng thái metrics/session cơ bản.
- uv-managed Python API environment từ DEC-012.
- FastAPI/Pydantic/pydantic-settings/orjson stack từ DEC-013.
- Schema validation cho event và batch.
- Idempotency tối thiểu theo `eventId`, `sessionId`, `batchSequence`.
- Produce event sang Kafka.
- Backpressure response rõ ràng khi Kafka hoặc API quá tải.

### Out of scope

- Authentication.
- User profile.
- Query analytics phức tạp.
- Spark processing logic.
- Long-term raw storage trong API.

---

## 3. Dependencies

| Dependency | Từ phase | Ghi chú |
|---|---|---|
| Telemetry schema | phase0, phase1 | API phải giữ backward compatibility hoặc cập nhật decision |
| Batch policy | phase1 | API không giả định mỗi request chỉ có một event |
| Kafka topic decision | phase3 planning | Producer config phải khớp topic/key strategy |

---

## 4. Plans

| Plan | Vai trò | Output chính |
|---|---|---|
| [plan001-fastapi-ingestion-contract](../../plans/phase2/plan001-fastapi-ingestion-contract.md) | Xây API và schema | Pydantic models, routes, validation |
| [plan002-backpressure-and-idempotent-ingestion](../../plans/phase2/plan002-backpressure-and-idempotent-ingestion.md) | Làm ingestion ổn định hơn | Error mapping, idempotency, bounded queue |

---

## 5. Decisions

| Decision | Áp dụng trong phase |
|---|---|
| [DEC-001: Canvas-relative telemetry schema](../../decisions/decision001-canvas-relative-telemetry-schema.md) | Validate event fields |
| [DEC-004: HTTP ingestion before Kafka](../../decisions/decision004-http-ingestion-before-kafka.md) | API là boundary giữa browser và Kafka |
| [DEC-005: Kafka topic layout and event keys](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Producer topic/key |
| [DEC-007: Memory-bounded retry policy](../../decisions/decision007-memory-bounded-retry-policy.md) | HTTP error semantics cho frontend retry |
| [DEC-012: uv-managed Python API environment](../../decisions/decision012-uv-managed-python-api-environment.md) | Python version and command reproducibility |
| [DEC-013: FastAPI performance-oriented API stack](../../decisions/decision013-fastapi-performance-oriented-api-stack.md) | API stack and request-path constraints |

---

## 6. Performance Requirements

- `POST /api/v1/events/batch` trả nhanh với `202 Accepted` khi batch hợp lệ và đã được nhận vào pipeline.
- API không xử lý analytics nặng trong request path.
- Payload quá lớn phải bị reject bằng lỗi rõ ràng.
- Kafka produce lỗi phải được map sang trạng thái retryable hoặc non-retryable.
- Logging không ghi toàn bộ raw event payload ở mức info trong đường nóng.
- Validation chạy qua `uv run`, không dùng Python hệ thống.

---

## 7. Completion Gate

Phase 2 hoàn thành khi:

1. Frontend phase1 gửi session và batch thành công vào API.
2. API validate được đủ các event type MVP.
3. Batch hợp lệ được produce vào Kafka topic đã định.
4. Lỗi schema, lỗi payload quá lớn và lỗi Kafka được trả về có cấu trúc.
5. Test contract cho endpoint batch đã phủ happy path và lỗi chính.
