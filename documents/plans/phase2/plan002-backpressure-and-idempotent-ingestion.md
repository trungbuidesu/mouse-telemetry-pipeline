# Plan: Backpressure và idempotent ingestion

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase2-plan002` |
| Phase | [phase2](../../phases/phase2/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Làm failure modes của ingestion rõ ràng để frontend retry an toàn. API phải phân biệt invalid data với retryable overload, ngăn memory tăng không giới hạn và giảm tác động duplicate từ các batch bị retry.

`backpressure` là cách backend nói với client rằng hệ thống đang quá tải hoặc dependency chưa sẵn sàng, để client giảm tốc/retry thay vì tiếp tục dồn request.

`idempotent` nghĩa là cùng một request hoặc batch bị gửi lại không gây hiệu ứng trùng lặp ngoài ý muốn.

---

## 3. Decisions liên quan

| Decision | Vì sao cần |
|---|---|
| [DEC-002](../../decisions/decision002-client-side-batching-and-sampling.md) | Batch frequency và size kỳ vọng |
| [DEC-005](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Ordering và duplicate handling downstream |
| [DEC-007](../../decisions/decision007-memory-bounded-retry-policy.md) | Frontend retry semantics |

---

## 4. Behavior dự kiến

| Behavior | Yêu cầu |
|---|---|
| Payload limit | Reject oversized request bằng `413` |
| Schema error | Trả `400`, không retryable |
| Kafka unavailable | Trả `503`, retryable |
| API overloaded | Trả `429`, retryable |
| Duplicate batch | Accept idempotently khi có thể |
| Duplicate event | Giữ `eventId` để downstream deduplicate |

---

## 5. Work breakdown

### Step 1: Định nghĩa error model

* Dùng JSON error shape nhất quán.
* Bao gồm retryable flag cho client behavior.
* Không expose internal stack traces.

### Step 2: Thêm request limits

* Giới hạn max events per batch.
* Giới hạn max request body size nếu framework/runtime hỗ trợ.
* Reject empty batches trừ khi được cho phép rõ để làm heartbeat.

### Step 3: Thêm idempotency support

* Xem `(sessionId, batchSequence)` là batch-level idempotency key cho MVP.
* Giữ `eventId` cho downstream duplicate detection.
* Document retention limits cho mọi in-memory duplicate cache.

### Step 4: Thêm backpressure mapping

* Map Kafka producer timeout sang `503`.
* Map local queue full sang `429`.
* Giữ response nhanh và deterministic.

---

## 6. Ghi chú performance

* Idempotency cache phải bounded.
* API nên tránh sync disk writes trong hot request path.
* Không retry Kafka vô hạn bên trong một HTTP request; để frontend retry theo DEC-007.
* Metrics/logging nên đếm dropped/rejected/accepted batches.

---

## 7. Acceptance criteria

* [ ] Invalid payloads không được frontend contract retry.
* [ ] Retryable failures trả status code và body nhận diện retryability.
* [ ] Oversized batches bị reject trước Kafka produce.
* [ ] Duplicate batch behavior được document và test ở mức MVP.
* [ ] Backpressure không làm memory tăng vô hạn.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Unit tests cho error mapping | PASS |
| Producer failure test | `503` retryable response |
| Oversized batch test | `413` response |
| Duplicate batch test | Deterministic behavior |

---

## 9. Bàn giao

Plan này hỗ trợ frontend retry handling trong [phase1-plan002](../phase1/plan002-telemetry-collector-buffer-sender.md) và stream input ổn định cho [phase3](../../phases/phase3/README.md).
