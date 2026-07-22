# Plan: Contract-first schema và API

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase0-plan002` |
| Phase | [phase0](../../phases/phase0/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Định nghĩa shared telemetry schema và HTTP API contract trước khi triển khai frontend, ingestion API hoặc Spark parsing. Cách làm contract-first giúp ngữ nghĩa event ổn định xuyên suốt pipeline.

---

## 3. Decisions liên quan

| Decision | Vì sao cần |
|---|---|
| [DEC-001: Canvas-relative telemetry schema](../../decisions/decision001-canvas-relative-telemetry-schema.md) | Định nghĩa ngữ nghĩa tọa độ và event fields |
| [DEC-002: Client-side batching and sampling](../../decisions/decision002-client-side-batching-and-sampling.md) | Định nghĩa batch size và giả định sampling |
| [DEC-004: HTTP ingestion before Kafka](../../decisions/decision004-http-ingestion-before-kafka.md) | Định nghĩa boundary frontend/backend |
| [DEC-005: Kafka topic layout and event keys](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Định nghĩa giả định routing downstream |

---

## 4. Output dự kiến

* Schema docs hoặc JSON Schema/Pydantic-compatible definitions cho:
  * `session_start`
  * `mousemove`
  * `click`
  * `session_end`
  * telemetry batch
* API contract cho:
  * `POST /api/v1/sessions`
  * `POST /api/v1/events/batch`
  * `POST /api/v1/sessions/{sessionId}/complete`
  * `GET /api/v1/sessions/{sessionId}/metrics`
* Contract examples bám kiến trúc.
* Compatibility rules cho schema changes trong tương lai.

---

## 5. Work breakdown

### Step 1: Trích xuất event fields

* Bắt đầu từ section 11 của tài liệu kiến trúc.
* Đánh dấu required và optional fields.
* Chuẩn hóa tên timestamp và đơn vị.
* Giữ `eventTime` là client event time theo epoch milliseconds.

### Step 2: Định nghĩa shared invariants

* `eventId` unique cho từng event.
* `sessionId` nhóm mọi event trong một game session.
* `sequence` tăng đơn điệu trong một session.
* `batchSequence` tăng đơn điệu trong một session sender.
* `x` và `y` là canvas-relative pixels.
* `normalizedX` và `normalizedY` nằm trong `[0, 1]` khi có mặt.

### Step 3: Định nghĩa API response behavior

* Dùng `202 Accepted` khi batch hợp lệ được nhận vào ingestion path.
* Dùng `400` cho invalid JSON hoặc schema errors.
* Dùng `413` cho payload quá lớn.
* Dùng `429` hoặc `503` cho overload/dependency failure có thể retry.

### Step 4: Định nghĩa contract tests

* Frontend fixture events phải validate được với backend schema.
* Backend accepted payload phải parse được bằng Spark schema.
* Các case invalid coordinate/session/sequence phải bị reject.

---

## 6. Ghi chú performance và data correctness

* Contract phải hỗ trợ batch processing; không thiết kế endpoint xoay quanh một event/request.
* Tránh payload lồng quá sâu làm tăng parsing overhead cho mỗi event.
* Không đưa expensive analytics fields vào ingestion request path.
* Giữ raw event contract append-friendly để Spark ghi Parquet mà không cần transformation giòn.

---

## 7. Acceptance criteria

* [ ] Tất cả MVP event types có documented required fields.
* [ ] Batch payload có documented limits và examples.
* [ ] API status codes phân biệt schema errors và retryable ingestion errors.
* [ ] Frontend, API và Spark dùng được cùng event semantics.
* [ ] Future schema changes có decision/update path.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Manual schema review | Event examples khớp kiến trúc |
| Contract fixture validation | Frontend example payload pass backend model khi có code |
| Spark parse smoke test | Kafka message value parse được khi phase3 tồn tại |

---

## 9. Bàn giao

Plan này feed trực tiếp vào:

* [phase1-plan002](../phase1/plan002-telemetry-collector-buffer-sender.md)
* [phase2-plan001](../phase2/plan001-fastapi-ingestion-contract.md)
* [phase3-plan002](../phase3/plan002-spark-streaming-to-minio-influxdb.md)
