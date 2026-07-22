# Plan: Telemetry collector, buffer và sender

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase1-plan002` |
| Phase | [phase1](../../phases/phase1/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Triển khai frontend telemetry path: capture input tần suất cao, normalize events, lưu trong bounded memory buffer, gửi batches đến ingestion API và retry an toàn khi backend chậm hoặc unavailable.

---

## 3. Decisions liên quan

| Decision | Vì sao cần |
|---|---|
| [DEC-001](../../decisions/decision001-canvas-relative-telemetry-schema.md) | Event coordinate và field contract |
| [DEC-002](../../decisions/decision002-client-side-batching-and-sampling.md) | Sampling và flush policy |
| [DEC-003](../../decisions/decision003-react-state-vs-ref-boundary.md) | Boundary giữa React state/ref |
| [DEC-007](../../decisions/decision007-memory-bounded-retry-policy.md) | Retry và buffer limit |
| [DEC-011](../../decisions/decision011-vite-react-shadcn-frontend-stack.md) | Ngăn UI stack sở hữu telemetry hot path |

---

## 4. Module dự kiến

| Module | Responsibility |
|---|---|
| `frontend/src/telemetry/telemetryTypes.ts` | Event và batch types |
| `frontend/src/telemetry/telemetryConfig.ts` | Batch size, flush interval, sampling interval, buffer limit |
| `frontend/src/telemetry/eventCollector.ts` | Tạo normalized events và sequence numbers |
| `frontend/src/telemetry/eventBuffer.ts` | Append, flush và drop policy |
| `frontend/src/telemetry/batchSender.ts` | HTTP sending, retry và status |
| `frontend/src/api/telemetryApi.ts` | API request boundary |
| `frontend/src/hooks/useTelemetry.ts` | Wire collector/buffer/sender vào UI lifecycle |

---

## 5. Work breakdown

### Step 1: Định nghĩa telemetry types

* Thêm discriminated event types cho `session_start`, `mousemove`, `click`, `session_end`.
* Thêm `TelemetryBatch` với `sessionId`, `batchSequence`, `sentAt` và `events`.
* Giữ type names khớp API contract.

### Step 2: Triển khai collector

* Sinh `eventId` cho từng event.
* Gắn `sessionId`, `eventTime` và `sequence` tăng đơn điệu.
* Convert coordinates sang canvas-relative và normalized forms.
* Tính `targetHit` và `reactionTimeMs` cho click events.

### Step 3: Triển khai sampling

* Ghi tối đa một `mousemove` mỗi 16 ms theo default.
* Không bao giờ sample bỏ `click`, `session_start` hoặc `session_end`.
* Track skipped mousemove count riêng nếu hữu ích cho debugging.

### Step 4: Triển khai buffer và flush policy

* Flush khi buffer đạt 100 events.
* Flush mỗi 250 ms khi running.
* Flush toàn bộ events còn lại trong finishing.
* Enforce `MAX_BUFFERED_EVENTS = 20000`.

### Step 5: Triển khai sender và retry

* Gửi batches đến `POST /api/v1/events/batch`.
* Retry retryable failures với backoff 500 ms, 1 s và 2 s.
* Giữ failed batch đến khi success hoặc max retry outcome được ghi nhận.
* Expose stream status cho UI.

---

## 6. Ghi chú performance

* Hot path phải tránh allocation-heavy transformations khi có thể.
* React state có thể hiển thị counters, nhưng buffer data nằm trong refs hoặc plain objects ngoài render state.
* TanStack Query không được sở hữu telemetry events hoặc buffer state.
* shadcn components có thể hiển thị stream status nhưng không xử lý raw events.
* Sender tránh HTTP requests song song vô hạn; một in-flight batch cho mỗi sender là default an toàn nhất cho MVP.
* Batch payload size nên đủ nhỏ cho local FastAPI parsing và Kafka produce.

---

## 7. Acceptance criteria

* [ ] `mousemove` và `click` events được thu với required fields.
* [ ] `sequence` tăng đơn điệu theo session.
* [ ] Mousemove sampling được enforce.
* [ ] Buffer flush theo size và interval.
* [ ] Finishing session flush toàn bộ events còn lại.
* [ ] Retry behavior xử lý backend failure mà không xóa unsent batches.
* [ ] UI hiển thị được event count, batch count và stream status.
* [ ] Unit tests cover batching, sequence, coordinate normalization và retry classification.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Unit tests cho buffer | PASS |
| Unit tests cho collector | PASS |
| Mock API integration test | Gửi batch và xử lý accepted response |
| Manual offline test | Backend down đổi status và giữ bounded buffer |

---

## 9. Bàn giao

Plan này feed [phase1-plan003](plan003-session-result-and-client-analytics.md) và [phase2-plan001](../phase2/plan001-fastapi-ingestion-contract.md).
