# Task: Backpressure, error envelope, and idempotency

## 1. Thông tin task

* **Task ID:** `phase2-task006`
* **Task Name:** `Backpressure, error envelope, and idempotency`
* **Phase:** `phase2`
* **Status:** `DONE`
* **Started At:** `2026-07-24 05:25`
* **Last Updated:** `2026-07-24 05:35`
* **Completed At:** `2026-07-24 05:35`
* **Branch:** `main`
* **Base Commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Task File:** `documents/phases/phase2/task006-backpressure-error-idempotency.md`

---

## 2. Yêu cầu gốc

> Implement T2.6 for mouse-telemetry-pipeline at:
> c:\Users\bdtrung29.1\Documents\codework\github\mouse-telemetry-pipeline
>
> T2.3–T2.5 are done (likely uncommitted). Do NOT revert. Continue from current tree.
>
> ## Locked plan decisions for T2.6
> - Error envelope: `{ "error": { "code", "message", "retryable" } }`
> - Schema/invalid → **400**, retryable=false (keep/align with T2.4 handler)
> - Body > **1 MiB** → **413**, retryable=false
> - In-flight **asyncio.Semaphore(32)**; cannot acquire → **429**, retryable=true
> - `ProducerUnavailableError` → **503**, retryable=true
> - Idempotency key `(sessionId, batchSequence)` bounded cache max **10_000** entries; duplicate → prior **202** without re-produce
> - EXTEND Settings: `max_request_body_bytes=1_048_576`, `max_events_per_batch` aligned with 100, `idempotency_cache_max_entries=10_000`
> - No infinite Kafka retry inside one HTTP request (DEC-007: client retries)
>
> ## AGENTS.md
> 1. Create `documents/phases/phase2/task006-backpressure-error-idempotency.md`
> 2. TRACKING T2.6 IN_PROGRESS → DONE; update P2 progress
> 3. Validate: `uv run ruff check .`, `uv run mypy app`, `uv run pytest`
> 4. Do NOT commit
>
> ## Files (suggested)
> - CREATE: `app/schemas/errors.py`, `app/api/errors.py` (handlers/helpers), `app/services/idempotency.py`
> - EXTEND: `app/core/config.py`, `app/api/routes/events.py`, `app/main.py` (register handlers, semaphore, cache)
> - CREATE: `tests/test_error_mapping.py`, `tests/test_idempotency.py`
> - Keep existing tests green; override deps as needed
>
> ## Acceptance
> All mapping behaviors above tested. Cache never unbounded. Routes stay free of analytics/aiokafka imports.
>
> Return: files, pytest count, next=T2.7.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Map ingestion failures to a consistent error envelope with retryable flags; enforce 1 MiB body limit, Semaphore(32) backpressure, ProducerUnavailableError→503, and bounded (sessionId, batchSequence) idempotency returning prior 202 without re-produce.
```

### Motivation

```text
Frontend DEC-007 retries only on 429/503. T2.5 raises ProducerUnavailableError; plan002 requires explicit backpressure and MVP idempotency so duplicate client retries do not re-produce Kafka.
```

### Tiêu chí nghiệm thu

* [x] Error envelope `{ error: { code, message, retryable } }` for mapped failures
* [x] Schema/invalid → 400 retryable=false
* [x] Body > 1 MiB → 413 retryable=false
* [x] Semaphore(32) cannot acquire → 429 retryable=true
* [x] ProducerUnavailableError → 503 retryable=true
* [x] Idempotency `(sessionId, batchSequence)` bounded ≤10_000; duplicate → prior 202, no re-produce
* [x] Settings extended with body/events/idempotency limits
* [x] Routes free of analytics/aiokafka imports
* [x] ruff / mypy / pytest PASS; no commit
* [x] Không có thay đổi ngoài phạm vi.
* [x] Các validation liên quan pass hoặc lỗi còn lại được giải thích.

### Ngoài scope

* Live Kafka broker tests
* Analytics / Spark / topic bootstrap
* Persistent idempotency store
* Infinite Kafka retry inside HTTP request

---

## 4. Bối cảnh phase

### Task đã có trong phase

| Task          | Status     | Relationship                            |
| ------------- | ---------- | --------------------------------------- |
| `task001-fastapi-ingestion-route-package.md` | `DONE` | `RELATED` — Settings / app factory |
| `task002-pydantic-telemetry-models.md` | `DONE` | `RELATED` — TelemetryBatch max 100 |
| `task003-session-lifecycle-endpoints.md` | `DONE` | `RELATED` — create_app deps |
| `task004-batch-ingestion-endpoint.md` | `DONE` | `DEPENDENCY` — batch route + 400 handler |
| `task005-kafka-producer-service.md` | `DONE` | `DEPENDENCY` — ProducerUnavailableError |
| `task006-backpressure-error-idempotency.md` | `DONE` | `CURRENT` |

### Task liên quan trước đó

* **Task:** `documents/phases/phase2/task005-kafka-producer-service.md`
* **Outcome:** KafkaTelemetryProducer + ProducerUnavailableError (HTTP mapping deferred to T2.6)
* **Decisions inherited:**

  * Routes must not import aiokafka
  * Injectable producer via create_app
  * No infinite produce retry in request path

### Phụ thuộc của task

* T2.4 batch route + validation→400
* T2.5 ProducerUnavailableError
* plan002 locked behaviors (user query)

### Kiểm tra trùng lặp

* **Equivalent task already exists:** `NO`
* **Overlapping task:** `None`
* **Quyết định:** `CREATE NEW`
* **Lý do:**

```text
T2.6 is next TRACKING item; error envelope / 413 / 429 / 503 / idempotency not implemented.
```

---

## 5. Trạng thái project ban đầu

### Trạng thái Git

* **Current branch:** `main`
* **Current commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Working tree:** `DIRTY`

### File đã sửa từ trước

* Uncommitted T2.3–T2.5: sessions, batch, Kafka producer, tests, TRACKING, plan001

### File chưa track từ trước

* `documents/phases/phase2/task003-*.md` … `task005-*.md`
* `ingestion-api/app/schemas/sessions.py`
* `ingestion-api/app/services/`
* `ingestion-api/tests/test_events_batch_route.py`, `test_kafka_producer.py`, `test_sessions_routes.py`

### Tóm tắt diff đã có

```text
T2.3–T2.5 implemented on working tree (not committed). Do not revert; extend for T2.6.
```

### Stack project

* **Language/runtime:** Python 3.12 (uv-managed)
* **Framework:** FastAPI + Pydantic v2
* **Package manager:** uv
* **Build command:** N/A
* **Test command:** `uv run pytest`
* **Lint command:** `uv run ruff check .`
* **Type-check command:** `uv run mypy app`

### Validation baseline

| Command     | Kết quả | Ghi chú   |
| ----------- | ------- | --------- |
| `uv run ruff check .` | `PASS` | All checks passed |
| `uv run mypy app` | `PASS` | 16 source files |
| `uv run pytest` | `PASS` | 38 collected |

### Kiến trúc quan sát được

* **Relevant module:** `ingestion-api/app/api/routes/events.py`, `app/main.py`
* **Current responsibility owner:** Batch accept + validation→400 detail payload
* **Entry point:** `create_app` → POST `/api/v1/events/batch`

### Data flow hiện tại

```text
HTTP batch → TelemetryBatch validate → produce_batch → 202
(validation errors → 400 with FastAPI detail shape; no 413/429/503/idempotency)
```

### Rủi ro hiện có

* Changing 400 body to error envelope may affect clients expecting `detail` (frontend classifies by status only)
* Body-size middleware must not break ASGI tests that omit Content-Length incorrectly

---

## 6. Related Files

| File     | Current Responsibility | Why Relevant | Planned Action                    |
| -------- | ---------------------- | ------------ | --------------------------------- |
| `ingestion-api/app/schemas/errors.py` | — | Error envelope models | `CREATE` |
| `ingestion-api/app/api/errors.py` | — | Handlers/helpers | `CREATE` |
| `ingestion-api/app/services/idempotency.py` | — | Bounded cache | `CREATE` |
| `ingestion-api/app/core/config.py` | Settings | New limits | `MODIFY` |
| `ingestion-api/app/api/routes/events.py` | Batch route | Semaphore + idempotency | `MODIFY` |
| `ingestion-api/app/main.py` | App factory | Register handlers/middleware/state | `MODIFY` |
| `ingestion-api/tests/test_error_mapping.py` | — | 400/413/429/503 | `CREATE` |
| `ingestion-api/tests/test_idempotency.py` | — | Duplicate + bound | `CREATE` |
| `documents/TRACKING.md` | Progress | T2.6 status | `MODIFY` |
| `documents/plans/phase2/plan002-backpressure-and-idempotent-ingestion.md` | Plan | Acceptance sync | `MODIFY` (light) |

---

## 7. Tìm kiếm code hiện có

### Searches Performed

| Search Term or Responsibility | Results                 |
| ----------------------------- | ----------------------- |
| `RequestValidationError` / 400 | `main.py` detail JSON |
| `ProducerUnavailableError` | `telemetry_producer.py` |
| `idempotency` / Semaphore | none in app |
| `max_request_body` | none |
| frontend retryable | `classifyBatchHttpStatus` 429/503 |

### Implementation hiện có liên quan

* `ingest_batch` / validation handler
  Location: `events.py`, `main.py`
  Responsibility: Accept batch; map validation to 400

* `ProducerUnavailableError`
  Location: `telemetry_producer.py`
  Responsibility: Domain produce failure for 503 mapping

### Quyết định triển khai

* **Quyết định:** `CREATE` error schemas/helpers + idempotency; `EXTEND` config/events/main
* **Target:** error envelope, body middleware, semaphore, cache on app.state
* **Lý do:**

```text
User locked file list and behaviors. T2.4 handler must be aligned to envelope; T2.5 error mapped to 503; plan002 + DEC-007.
```

### Creation Justification

* **REUSE không phù hợp vì:** No error envelope, body limit, semaphore, or idempotency cache exists
* **EXTEND không phù hợp vì:** New modules for clear boundaries (schemas/errors, api/errors, services/idempotency)
* **Responsibility mới là:** Consistent failure mapping + bounded backpressure/idempotency
* **Người dùng dự kiến:** batch route, exception handlers, frontend retry classifier
* **Public or internal:** Public HTTP error shape; internal cache/limiter

---

## 8. Kế hoạch triển khai

* [x] **Step 1:** Write failing tests for error mapping + idempotency

  * Files: `tests/test_error_mapping.py`, `tests/test_idempotency.py`
  * Kết quả kỳ vọng: RED
  * Validation: `uv run pytest tests/test_error_mapping.py tests/test_idempotency.py`

* [x] **Step 2:** Implement schemas, helpers, cache, Settings, wire main/events

  * Files: errors.py, api/errors.py, idempotency.py, config.py, main.py, events.py
  * Kết quả kỳ vọng: GREEN + existing suite
  * Validation: ruff / mypy / pytest

* [x] **Step 3:** Close task — TRACKING DONE, plan002, final summary

  * Files: TRACKING, plan002, task006
  * Kết quả kỳ vọng: T2.6 DONE; P2 6/8
  * Validation: full suite PASS

---

## 9. Work Log

### `[2026-07-24 05:25]` — Khởi tạo task

* **Status:** `DISCOVERY`

* **Action:**

  * Copied task template.
  * Copied original request.
  * Inspected phase tasks (task001–005 DONE).
  * Git dirty with uncommitted T2.3–T2.5 — will extend, not revert.
  * Baseline validation PASS (ruff, mypy, 38 pytest).
  * Marked TRACKING T2.6 IN_PROGRESS.

* **Files inspected:**

  * TRACKING, plan001/002, task004/005, events.py, main.py, config.py, telemetry_producer.py
  * api-contract.md, coding_rules_api.md, frontend classifyBatchHttpStatus

* **Kết quả:**

  * Task006 created; ready for TDD tests then implementation.

* **Next verified action:**

  * Write failing error-mapping and idempotency tests.

### `[2026-07-24 05:30]` — Implement error mapping + idempotency

* **Status:** `IN_PROGRESS`

* **Action:**

  * CREATE failing tests then implement schemas/helpers/cache/Settings/wiring.
  * Fixed `wait_for(timeout=0)` false 429 (always TimeoutError) → `Semaphore.locked()` + acquire.
  * Pure ASGI body-limit middleware (Content-Length) for mypy-friendly typing.

* **Files changed:**

  * `app/schemas/errors.py`, `app/api/errors.py`, `app/services/idempotency.py`
  * `app/core/config.py`, `app/api/routes/events.py`, `app/main.py`
  * `tests/test_error_mapping.py`, `tests/test_idempotency.py`
  * `.env.example`

* **Symbols changed:**

  * `ErrorDetail`, `ErrorEnvelope`, error helpers, `IdempotencyCache`
  * `LimitRequestBodyMiddleware`, `IN_FLIGHT_LIMIT`
  * Settings limits; `ingest_batch` semaphore + cache

* **Kết quả:**

  * 400/413/429/503 envelopes; duplicate 202 without re-produce; cache bounded

* **Validation:**

  * `uv run ruff check .` → `PASS`
  * `uv run mypy app` → `PASS` (19 files)
  * `uv run pytest` → `PASS` (47 passed)

* **Quyết định hoặc phát hiện:**

  * `asyncio.wait_for(..., timeout=0)` cannot be used for non-blocking semaphore acquire

* **Next verified action:**

  * Mark DONE; update TRACKING + plan002

### `[2026-07-24 05:35]` — Close task

* **Status:** `DONE`

* **Action:**

  * TRACKING T2.6 DONE; P2 6/8; total 28/52
  * plan002 steps/acceptance checked; plan001 producer-failure acceptance checked
  * Final summary filled

* **Validation:**

  * Final suite PASS (47)

* **Next verified action:**

  * T2.7 API contract tests

---

## 10. Thay đổi

### Added Files

#### `ingestion-api/app/schemas/errors.py`

* **Mục đích:** Pydantic error envelope models
* **Why required:** Locked `{ error: { code, message, retryable } }` shape
* **Used by:** `app/api/errors.py`
* **Visibility:** `PUBLIC` (HTTP contract)

#### `ingestion-api/app/api/errors.py`

* **Mục đích:** Helpers building JSONResponse envelopes for 400/413/429/503
* **Why required:** Shared mapping without duplicating payload shape
* **Used by:** `main.py`, `events.py`
* **Visibility:** `INTERNAL`

#### `ingestion-api/app/services/idempotency.py`

* **Mục đích:** Bounded FIFO cache for `(sessionId, batchSequence)` → BatchAcceptedResponse
* **Why required:** MVP idempotent duplicate accept without re-produce
* **Used by:** `events.py`, `create_app`
* **Visibility:** `INTERNAL`

#### `ingestion-api/tests/test_error_mapping.py`

* **Mục đích:** Cover 400/413/429/503 + Settings defaults
* **Why required:** Acceptance
* **Used by:** pytest
* **Visibility:** `INTERNAL`

#### `ingestion-api/tests/test_idempotency.py`

* **Mục đích:** Duplicate batch + bounded cache tests
* **Why required:** Acceptance
* **Used by:** pytest
* **Visibility:** `INTERNAL`

#### `documents/phases/phase2/task006-backpressure-error-idempotency.md`

* **Mục đích:** Task file for T2.6
* **Why required:** AGENTS.md process
* **Used by:** agents / tracking
* **Visibility:** `INTERNAL`

### Modified Files

#### `ingestion-api/app/core/config.py`

* **Previous responsibility:** App + Kafka settings
* **Changes made:** `max_request_body_bytes`, `max_events_per_batch`, `idempotency_cache_max_entries`
* **Lý do:** T2.6 locked Settings knobs
* **Behavioral impact:** Configurable limits (defaults match lock)
* **Compatibility impact:** Additive env knobs

#### `ingestion-api/app/api/routes/events.py`

* **Previous responsibility:** Validate + produce → 202
* **Changes made:** Semaphore backpressure, idempotency, ProducerUnavailableError→503 envelope
* **Lý do:** T2.6 behaviors
* **Behavioral impact:** 429/503/duplicate-202 paths
* **Compatibility impact:** Still no aiokafka/analytics imports

#### `ingestion-api/app/main.py`

* **Previous responsibility:** App factory + validation→400 detail
* **Changes made:** Body middleware; semaphore/cache on app.state; validation→envelope; injectable deps
* **Lý do:** Wire T2.6
* **Behavioral impact:** 413 on oversized Content-Length; 400 envelope body
* **Compatibility impact:** Optional new create_app kwargs

#### `ingestion-api/.env.example`

* **Previous responsibility:** Document kafka env
* **Changes made:** Commented T2.6 limit knobs
* **Lý do:** Document Settings
* **Behavioral impact:** none
* **Compatibility impact:** none

#### `documents/TRACKING.md` / `plan001` / `plan002`

* **Previous responsibility:** Progress / plans
* **Changes made:** T2.6 DONE; P2 6/8; plan002 acceptance checked
* **Lý do:** AGENTS closeout
* **Behavioral impact:** docs only
* **Compatibility impact:** none

### Deleted Files

#### N/A

---

## 11. Thay đổi symbol

### Added Symbols

#### `ErrorDetail` / `ErrorEnvelope`

* **Location:** `ingestion-api/app/schemas/errors.py`
* **Type:** `CLASS`
* **Responsibility:** Typed error envelope
* **Inputs:** code, message, retryable
* **Outputs:** model dump for JSON
* **State mutation:** none
* **Lifetime:** request
* **Used by:** error helpers
* **Visibility:** `PUBLIC`

#### `IdempotencyCache`

* **Location:** `ingestion-api/app/services/idempotency.py`
* **Type:** `CLASS`
* **Responsibility:** Bounded FIFO `(sessionId, batchSequence)` → prior 202 body
* **Inputs:** max_entries, key, BatchAcceptedResponse
* **Outputs:** cached response or None
* **State mutation:** OrderedDict entries with FIFO eviction
* **Lifetime:** app process
* **Used by:** events route
* **Visibility:** `INTERNAL`

#### `LimitRequestBodyMiddleware`

* **Location:** `ingestion-api/app/main.py`
* **Type:** `CLASS`
* **Responsibility:** 413 when Content-Length > max_request_body_bytes
* **Inputs:** ASGI scope headers
* **Outputs:** error envelope or passthrough
* **State mutation:** none
* **Lifetime:** app
* **Used by:** create_app
* **Visibility:** `INTERNAL`

### Modified Symbols

#### `create_app`

* **Location:** `ingestion-api/app/main.py`
* **Previous behavior:** Kafka/NoOp producer + validation detail 400
* **New behavior:** + semaphore/cache/middleware; validation envelope
* **Signature changed:** `YES` (optional semaphore/cache kwargs)
* **Callers affected:** tests may inject; defaults unchanged for callers without kwargs

#### `ingest_batch`

* **Location:** `ingestion-api/app/api/routes/events.py`
* **Previous behavior:** produce then 202
* **New behavior:** backpressure / idempotency / 503 mapping
* **Signature changed:** `YES` (extra Depends)
* **Callers affected:** FastAPI router

#### `Settings`

* **Location:** `ingestion-api/app/core/config.py`
* **Previous behavior:** app + kafka fields
* **New behavior:** + body/events/idempotency limits
* **Signature changed:** `YES` (new fields)
* **Callers affected:** create_app middleware/cache sizing

### Removed Symbols

#### N/A

### Important Variables Added

#### `app.state.in_flight_semaphore` / `app.state.idempotency_cache`

* **Meaning:** In-flight limit (32) and bounded duplicate-batch cache
* **Created in:** `create_app`
* **Read by:** events Depends getters
* **Mutated by:** acquire/release; cache.put
* **Possible states:** Semaphore permits 0..32; cache size 0..max_entries
* **Lifetime:** app lifetime

---

## 12. Validation

### Validation tập trung

| Command     | Kết quả | Bằng chứng hoặc ghi chú |
| ----------- | ------- | ----------------- |
| baseline suite | `PASS` | ruff + mypy 16 files + 38 pytest |
| post-impl suite | `PASS` | ruff + mypy 19 files + 47 pytest |

### Validation cuối

| Check             | Kết quả | Ghi chú   |
| ----------------- | ------- | --------- |
| Unit tests        | `PASS` | 47 passed (was 38) |
| Integration tests | `PASS` | ASGI error/idempotency/batch |
| Lint              | `PASS` | `uv run ruff check .` |
| Type-check        | `PASS` | `uv run mypy app` (19 files) |
| Build             | `NOT RUN` | N/A for API package |

### Diff Review

* [x] Chỉ các file thuộc phạm vi bị thay đổi.
* [x] Không có debug code.
* [x] Không có placeholder ngoài chủ đích.
* [x] Không có implementation trùng rõ ràng.
* [x] Không có abstraction không cần thiết.
* [x] Không có circular import mới.
* [x] Không có internal barrel import mới.
* [x] Public API changes đã được ghi lại.
* [x] Error paths đã được xem xét.

### Validation chưa thực hiện

```text
Live Kafka broker integration; chunked-body without Content-Length still relies on framework defaults (Content-Length path covered).
```

---

## 13. Discovered Issues

### wait_for(timeout=0) always times out on Semaphore.acquire

* **Location:** `events.py` (initial attempt)
* **Description:** `asyncio.wait_for(sem.acquire(), timeout=0)` raises TimeoutError before acquire runs.
* **Impact:** Every batch returned 429 until fixed.
* **Action in this task:** Done — use `locked()` then `acquire()`.
* **Suggested future task:** None

---

## 14. Resume Check

* **Resumed At:** N/A
* **Current branch:** `main`
* **Current commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Task status before resume:** N/A
* **Working tree matches task log:** `YES`
* **Plan remains valid:** `YES`

### Differences Found

```text
N/A — completed in single session
```

### Files Rechecked

* N/A

### Next Verified Action

```text
T2.7 — API contract tests (valid/invalid batch fixtures).
```

---

## 15. Tổng kết cuối

* **Final Status:** `DONE`
* **Completed At:** `2026-07-24 05:35`

### Outcome

```text
Batch ingestion now returns a consistent error envelope, enforces 1 MiB body limit (413), Semaphore(32) backpressure (429), ProducerUnavailableError→503, and bounded (sessionId, batchSequence) idempotency returning prior 202 without re-produce.
```

### Kết quả tiêu chí nghiệm thu

* [x] Error envelope + 400/413/429/503 mapping tested
* [x] Bounded idempotency cache; no unbounded growth
* [x] Validation PASS (47); no commit

### File đã thay đổi

* `ingestion-api/app/schemas/errors.py` — envelope models
* `ingestion-api/app/api/errors.py` — response helpers
* `ingestion-api/app/services/idempotency.py` — bounded cache
* `ingestion-api/app/core/config.py` — limits
* `ingestion-api/app/api/routes/events.py` — semaphore + idempotency + 503
* `ingestion-api/app/main.py` — middleware + wiring
* `ingestion-api/tests/test_error_mapping.py` / `test_idempotency.py`
* docs: task006, TRACKING, plan001, plan002; `.env.example`

### Thay đổi hành vi chính

* Invalid → 400 `{error:{code:VALIDATION_ERROR,retryable:false}}`
* Oversized Content-Length → 413 `PAYLOAD_TOO_LARGE`
* In-flight full → 429 `TOO_MANY_REQUESTS`
* Producer down → 503 `PRODUCER_UNAVAILABLE`
* Duplicate `(sessionId,batchSequence)` → prior 202, produce once

### Kết quả validation

* **Tests:** `PASS` (47)
* **Lint:** `PASS`
* **Type-check:** `PASS`
* **Build:** `NOT RUN`

### Việc còn lại

* None for T2.6

### Giới hạn đã biết

* Body limit primarily via Content-Length; no live Kafka tests

### Task tiếp theo

* T2.7 API contract tests

### Commit message gợi ý

```text
feat(api): add backpressure, error envelope, and batch idempotency
```
