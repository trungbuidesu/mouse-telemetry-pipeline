# Task: Kafka producer service boundary

## 1. Thông tin task

* **Task ID:** `phase2-task005`
* **Task Name:** `Kafka producer service boundary`
* **Phase:** `phase2`
* **Status:** `DONE`
* **Started At:** `2026-07-24 05:18`
* **Last Updated:** `2026-07-24 05:24`
* **Completed At:** `2026-07-24 05:24`
* **Branch:** `main`
* **Base Commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Task File:** `documents/phases/phase2/task005-kafka-producer-service.md`

---

## 2. Yêu cầu gốc

> Implement T2.5 for mouse-telemetry-pipeline at:
> c:\Users\bdtrung29.1\Documents\codework\github\mouse-telemetry-pipeline
>
> T2.3 and T2.4 are done (possibly uncommitted). Do NOT revert their work. Continue from current tree.
>
> ## Locked plan decisions for T2.5
> - Real `aiokafka` producer implementing existing `TelemetryProducer` Protocol from T2.4
> - Key = `sessionId` (DEC-005); topic from `Settings.kafka_topic` (default `mouse.telemetry.events.v1`)
> - One Kafka message **per event** in the batch (JSON event payload)
> - Lifespan-managed singleton producer (start/stop); NOT create per request
> - Routes must NOT import aiokafka directly
> - Unit tests with **mocked** AIOKafkaProducer — no live broker required
> - On failure raise typed domain error (e.g. `ProducerUnavailableError`) for T2.6 to map to 503
> - Wire as default producer when not in tests; tests keep Recording/NoOp via override
>
> ## AGENTS.md
> 1. Create `documents/phases/phase2/task005-kafka-producer-service.md` from template
> 2. TRACKING T2.5 IN_PROGRESS → DONE
> 3. `uv sync --all-groups` after adding aiokafka to pyproject.toml
> 4. `uv run ruff check .`, `uv run mypy app`, `uv run pytest`
> 5. Do NOT commit
>
> ## Files
> - MODIFY: `ingestion-api/pyproject.toml` (+ uv.lock via sync) — add aiokafka
> - EXTEND: `app/services/telemetry_producer.py` — KafkaTelemetryProducer + ProducerUnavailableError
> - EXTEND: `app/main.py` — lifespan start/stop; default Kafka producer for runtime
> - CREATE: `tests/test_kafka_producer.py`
> - EXTEND `.env.example` only if new knobs needed (prefer keep minimal)
>
> ## Acceptance
> - produce_batch sends N messages for N events; key = batch.sessionId
> - Producer reused; closed on shutdown
> - Mocked tests pass; existing batch/session/health tests still pass
> - No topic bootstrap / Spark / dead-letter (out of scope)
>
> Return: files changed, pytest count, next=T2.6.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Implement KafkaTelemetryProducer (aiokafka) behind TelemetryProducer Protocol, lifespan-managed singleton, one JSON message per event keyed by sessionId, with ProducerUnavailableError on failure. Mocked unit tests; no live broker.
```

### Motivation

```text
T2.4 accepted batches via NoOp producer. T2.5 owns the Kafka produce boundary (DEC-004/005) so T2.6 can map producer failures to retryable 503.
```

### Tiêu chí nghiệm thu

* [x] `KafkaTelemetryProducer.produce_batch` sends N Kafka messages for N events; key = batch.sessionId
* [x] Lifespan start/stop reuses singleton; not created per request
* [x] Routes do not import aiokafka; `ProducerUnavailableError` on failure
* [x] Mocked AIOKafkaProducer tests pass; existing suite still passes
* [x] `aiokafka` in pyproject; `uv sync --all-groups`; ruff/mypy/pytest pass
* [x] TRACKING T2.5 DONE; task file closed
* [x] Không có thay đổi ngoài phạm vi.
* [x] Các validation liên quan pass hoặc lỗi còn lại được giải thích.

### Ngoài scope

* Topic bootstrap (T3.1)
* Spark / MinIO / InfluxDB
* Dead-letter topic
* HTTP 503 mapping (T2.6)
* Live broker integration tests

---

## 4. Bối cảnh phase

### Task đã có trong phase

| Task          | Status     | Relationship                            |
| ------------- | ---------- | --------------------------------------- |
| `task001-fastapi-ingestion-route-package.md` | `DONE` | `DEPENDENCY` — Settings kafka_* |
| `task002-pydantic-telemetry-models.md` | `DONE` | `DEPENDENCY` — TelemetryBatch / events |
| `task003-session-lifecycle-endpoints.md` | `DONE` | `RELATED` — create_app deps pattern |
| `task004-batch-ingestion-endpoint.md` | `DONE` | `DEPENDENCY` — TelemetryProducer Protocol + batch route |
| `task005-kafka-producer-service.md` | `DONE` | `CURRENT` |

### Task liên quan trước đó

* **Task:** `documents/phases/phase2/task004-batch-ingestion-endpoint.md`
* **Outcome:** Protocol + NoOp/Recording + POST /events/batch → 202
* **Decisions inherited:**

  * Routes must not import kafka/aiokafka
  * Injectable producer via `create_app(telemetry_producer=...)` + `app.state`
  * Batch does not require prior session create

### Phụ thuộc của task

* T2.4 TelemetryProducer Protocol + batch route (DONE on working tree)
* Settings.kafka_bootstrap_servers / kafka_topic (T2.1)

### Kiểm tra trùng lặp

* **Equivalent task already exists:** `NO`
* **Overlapping task:** `None`
* **Quyết định:** `CREATE NEW`
* **Lý do:**

```text
T2.5 is next TRACKING item; producer was still NoOp; plan001 Step 4 Kafka produce was unchecked.
```

---

## 5. Trạng thái project ban đầu

### Trạng thái Git

* **Current branch:** `main`
* **Current commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Working tree:** `DIRTY`

### File đã sửa từ trước

* T2.3/T2.4 uncommitted: sessions, events batch, telemetry_producer Protocol/NoOp/Recording, main, tests, TRACKING, plan001

### File chưa track từ trước

* `documents/phases/phase2/task003-session-lifecycle-endpoints.md`
* `documents/phases/phase2/task004-batch-ingestion-endpoint.md`
* `ingestion-api/app/schemas/sessions.py`
* `ingestion-api/app/services/`
* `ingestion-api/tests/test_events_batch_route.py`
* `ingestion-api/tests/test_sessions_routes.py`

### Tóm tắt diff đã có

```text
T2.3 + T2.4 implemented on working tree (not committed). Do not revert; extend for T2.5 Kafka producer.
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
| `uv run pytest` | `PASS` | 31 passed |

### Kiến trúc quan sát được

* **Relevant module:** `ingestion-api/app/services/telemetry_producer.py`
* **Current responsibility owner:** Protocol + NoOp + Recording
* **Entry point:** `create_app` → `app.state.telemetry_producer` → events route

### Data flow hiện tại

```text
HTTP batch → TelemetryBatch validate → TelemetryProducer.produce_batch (NoOp default) → 202
```

### Rủi ro hiện có

* health/smoke/sessions tests call `create_app()` without producer override — lifespan Kafka start would hit broker unless tests inject NoOp
* Protocol `produce_batch` is sync; aiokafka requires async — Protocol/route/NoOp/Recording must become async

---

## 6. Related Files

| File     | Current Responsibility | Why Relevant | Planned Action                    |
| -------- | ---------------------- | ------------ | --------------------------------- |
| `ingestion-api/pyproject.toml` | deps | add aiokafka | `MODIFY` |
| `ingestion-api/uv.lock` | lockfile | sync after aiokafka | `MODIFY` (via sync) |
| `ingestion-api/app/services/telemetry_producer.py` | Protocol + NoOp/Recording | KafkaTelemetryProducer + error | `MODIFY` |
| `ingestion-api/app/main.py` | app factory | lifespan start/stop + Kafka default | `MODIFY` |
| `ingestion-api/app/api/routes/events.py` | batch route | await async produce_batch | `MODIFY` |
| `ingestion-api/tests/test_kafka_producer.py` | — | mocked producer tests | `CREATE` |
| `ingestion-api/tests/test_health.py` | health | inject NoOp to avoid broker | `MODIFY` |
| `ingestion-api/tests/test_sessions_routes.py` | sessions | inject NoOp | `MODIFY` |
| `ingestion-api/.env.example` | env docs | comment only | `MODIFY` (minimal) |
| `documents/TRACKING.md` | progress | T2.5 status | `MODIFY` |
| `documents/plans/phase2/plan001-fastapi-ingestion-contract.md` | plan | Step 4 Kafka | `MODIFY` |

---

## 7. Tìm kiếm code hiện có

### Searches Performed

| Search Term or Responsibility | Results                 |
| ----------------------------- | ----------------------- |
| `TelemetryProducer` / `produce_batch` | `telemetry_producer.py` Protocol + NoOp + Recording |
| `kafka` / `aiokafka` | Settings typed only; no producer impl |
| `create_app(telemetry_producer=` | batch tests override; health/sessions did not |
| `kafka_topic` / DEC-005 | Settings default `mouse.telemetry.events.v1` |

### Implementation hiện có liên quan

* `TelemetryProducer` / `NoOpTelemetryProducer` / `RecordingTelemetryProducer`
  Location: `ingestion-api/app/services/telemetry_producer.py`
  Responsibility: Service boundary for accepted batches

* `Settings.kafka_bootstrap_servers` / `kafka_topic`
  Location: `ingestion-api/app/core/config.py`
  Responsibility: Typed Kafka config (DEC-005)

### Quyết định triển khai

* **Quyết định:** `EXTEND` telemetry_producer.py + main lifespan; `CREATE` mocked tests
* **Target:** `KafkaTelemetryProducer`, `ProducerUnavailableError`, lifespan wiring
* **Lý do:**

```text
User locked EXTEND telemetry_producer.py (not separate kafka_producer.py). Protocol already exists from T2.4; make produce_batch async for aiokafka; lifespan owns singleton start/stop.
```

### Creation Justification

* **REUSE không phù hợp vì:** No Kafka produce implementation exists
* **EXTEND không phù hợp vì:** N/A for new test file; producer extends existing module
* **Responsibility mới là:** aiokafka produce of per-event JSON messages keyed by sessionId
* **Người dùng dự kiến:** lifespan + events route via Protocol; T2.6 error mapping
* **Public or internal:** INTERNAL service; public behavior via existing batch endpoint

---

## 8. Kế hoạch triển khai

* [x] **Step 1:** Add aiokafka dep + sync; write failing/mocked producer tests

  * Files: `pyproject.toml`, `uv.lock`, `tests/test_kafka_producer.py`
  * Kết quả kỳ vọng: sync OK; tests RED until impl
  * Validation: `uv sync --all-groups`

* [x] **Step 2:** Implement KafkaTelemetryProducer + async Protocol; lifespan wiring

  * Files: `telemetry_producer.py`, `main.py`, `events.py`, test NoOp overrides
  * Kết quả kỳ vọng: GREEN mocked + existing suite
  * Validation: ruff / mypy / pytest

* [x] **Step 3:** Close task — TRACKING DONE, plan001 Step 4, final summary

  * Files: TRACKING, plan001, task005
  * Kết quả kỳ vọng: T2.5 DONE
  * Validation: full suite PASS (38)

---

## 9. Work Log

### `[2026-07-24 05:18]` — Khởi tạo task

* **Status:** `DISCOVERY`

* **Action:**

  * Copied task template.
  * Copied original request.
  * Inspected phase tasks (task001–004 DONE).
  * Git dirty with uncommitted T2.3/T2.4 — will extend, not revert.
  * Baseline validation PASS (ruff, mypy, 31 pytest).
  * Marked TRACKING T2.5 IN_PROGRESS.

* **Files inspected:**

  * `documents/agents/AGENTS.md`, `coding_rules_api.md`, `TRACKING.md`, `plan001`, DEC-005
  * `telemetry_producer.py`, `main.py`, `events.py`, `config.py`, `.env.example`
  * existing tests (health/smoke/sessions/batch)

* **Kết quả:**

  * Task005 created; Protocol must become async for aiokafka; tests without override need NoOp.

* **Next verified action:**

  * Add aiokafka + implement producer + lifespan + mocked tests.

### `[2026-07-24 05:22]` — Implement Kafka producer + lifespan

* **Status:** `IN_PROGRESS`

* **Action:**

  * Added `aiokafka` to pyproject; `uv sync --all-groups` (0.14.0).
  * EXTEND `telemetry_producer.py`: async Protocol, `KafkaTelemetryProducer`, `ProducerUnavailableError`.
  * EXTEND `main.py`: lifespan start/stop; Kafka default when producer not overridden.
  * EXTEND events route to `async` + `await produce_batch`.
  * CREATE `tests/test_kafka_producer.py` (mocked AIOKafkaProducer).
  * Inject NoOp in health/sessions ASGI tests to avoid live broker.

* **Files changed:**

  * `ingestion-api/pyproject.toml`, `uv.lock`
  * `ingestion-api/app/services/telemetry_producer.py`
  * `ingestion-api/app/main.py`
  * `ingestion-api/app/api/routes/events.py`
  * `ingestion-api/tests/test_kafka_producer.py`
  * `ingestion-api/tests/test_health.py`
  * `ingestion-api/tests/test_sessions_routes.py`
  * `ingestion-api/.env.example` (comment only)

* **Symbols changed:**

  * `ProducerUnavailableError`, `KafkaTelemetryProducer`
  * async `TelemetryProducer.produce_batch` / NoOp / Recording
  * lifespan in `create_app`

* **Kết quả:**

  * N messages per N events; key=sessionId; lifespan start/stop; failures raise domain error

* **Validation:**

  * `uv run ruff check .` → `PASS`
  * `uv run mypy app` → `PASS` (16 files)
  * `uv run pytest` → `PASS` (38 passed)

* **Quyết định hoặc phát hiện:**

  * httpx ASGITransport here has no `lifespan=` kwarg; lifespan tests use `app.router.lifespan_context`
  * aiokafka has no py.typed; use `# type: ignore[import-untyped]`

* **Next verified action:**

  * Mark DONE; update TRACKING + plan001

### `[2026-07-24 05:24]` — Close task

* **Status:** `DONE`

* **Action:**

  * TRACKING T2.5 DONE; P2 5/8; total 27/52
  * plan001 Step 4 checked; module table updated
  * Final summary filled

* **Validation:**

  * Final suite PASS (38)

* **Next verified action:**

  * T2.6 Backpressure and error response model (map ProducerUnavailableError → 503)

---

## 10. Thay đổi

### Added Files

#### `ingestion-api/tests/test_kafka_producer.py`

* **Mục đích:** Mocked unit tests for KafkaTelemetryProducer + lifespan start/stop
* **Why required:** Acceptance without live broker
* **Used by:** pytest
* **Visibility:** `INTERNAL`

#### `documents/phases/phase2/task005-kafka-producer-service.md`

* **Mục đích:** Task file for T2.5
* **Why required:** AGENTS.md process
* **Used by:** agents / tracking
* **Visibility:** `INTERNAL`

### Modified Files

#### `ingestion-api/pyproject.toml` / `uv.lock`

* **Previous responsibility:** API dependencies without Kafka client
* **Changes made:** Added `aiokafka>=0.12.0` (resolved 0.14.0)
* **Lý do:** Real producer client
* **Behavioral impact:** Runtime can produce to Kafka
* **Compatibility impact:** New dependency

#### `ingestion-api/app/services/telemetry_producer.py`

* **Previous responsibility:** Protocol + NoOp + Recording (sync)
* **Changes made:** Async Protocol; KafkaTelemetryProducer; ProducerUnavailableError
* **Lý do:** T2.5 Kafka boundary
* **Behavioral impact:** Real produce path available
* **Compatibility impact:** `produce_batch` now async (callers updated)

#### `ingestion-api/app/main.py`

* **Previous responsibility:** NoOp default producer; no lifespan
* **Changes made:** Lifespan-managed Kafka singleton when producer not overridden
* **Lý do:** Reuse producer; start/stop with app
* **Behavioral impact:** Runtime default is Kafka; tests override
* **Compatibility impact:** Tests that enter lifespan without override need NoOp or mock

#### `ingestion-api/app/api/routes/events.py`

* **Previous responsibility:** Sync batch handler
* **Changes made:** async handler awaiting producer
* **Lý do:** Match async Protocol / aiokafka
* **Behavioral impact:** none for clients
* **Compatibility impact:** none

#### `ingestion-api/tests/test_health.py` / `test_sessions_routes.py`

* **Previous responsibility:** create_app without producer override
* **Changes made:** Inject NoOpTelemetryProducer
* **Lý do:** Avoid lifespan Kafka connect in unit tests
* **Behavioral impact:** test-only
* **Compatibility impact:** none

#### `ingestion-api/.env.example`

* **Previous responsibility:** Document kafka env knobs
* **Changes made:** Comment that T2.5 producer uses them
* **Lý do:** Minimal doc sync; no new knobs
* **Behavioral impact:** none
* **Compatibility impact:** none

#### `documents/TRACKING.md` / `documents/plans/phase2/plan001-fastapi-ingestion-contract.md`

* **Previous responsibility:** Progress / plan
* **Changes made:** T2.5 DONE; Step 4 checked
* **Lý do:** AGENTS closeout
* **Behavioral impact:** docs only
* **Compatibility impact:** none

### Deleted Files

#### N/A

---

## 11. Thay đổi symbol

### Added Symbols

#### `ProducerUnavailableError`

* **Location:** `ingestion-api/app/services/telemetry_producer.py`
* **Type:** `CLASS`
* **Responsibility:** Typed domain error when producer cannot start/send (T2.6 → 503)
* **Inputs:** message / cause
* **Outputs:** Exception
* **State mutation:** none
* **Lifetime:** raise site
* **Used by:** KafkaTelemetryProducer; future T2.6 handler
* **Visibility:** `INTERNAL`

#### `KafkaTelemetryProducer`

* **Location:** `ingestion-api/app/services/telemetry_producer.py`
* **Type:** `CLASS`
* **Responsibility:** Lifespan-managed aiokafka produce; one JSON msg per event; key=sessionId
* **Inputs:** bootstrap_servers, topic, TelemetryBatch
* **Outputs:** Kafka messages / ProducerUnavailableError
* **State mutation:** holds AIOKafkaProducer instance
* **Lifetime:** app lifespan
* **Used by:** create_app lifespan (default)
* **Visibility:** `INTERNAL`

### Modified Symbols

#### `TelemetryProducer.produce_batch` / NoOp / Recording

* **Location:** `ingestion-api/app/services/telemetry_producer.py`
* **Previous behavior:** sync `produce_batch`
* **New behavior:** async `produce_batch`
* **Signature changed:** `YES`
* **Callers affected:** events route (await); tests unchanged structurally

#### `create_app`

* **Location:** `ingestion-api/app/main.py`
* **Previous behavior:** NoOp default; no lifespan
* **New behavior:** Kafka default + lifespan start/stop; override still supported
* **Signature changed:** `NO` (same optional kwargs)
* **Callers affected:** tests without override must inject NoOp if lifespan runs produce/start

#### `ingest_batch`

* **Location:** `ingestion-api/app/api/routes/events.py`
* **Previous behavior:** sync call to producer
* **New behavior:** async await produce_batch
* **Signature changed:** `YES` (async def)
* **Callers affected:** FastAPI router

### Removed Symbols

#### N/A

### Important Variables Added

#### `app.state.telemetry_producer` (Kafka default)

* **Meaning:** Injectable TelemetryProducer; Kafka singleton when not overridden
* **Created in:** `create_app`
* **Read by:** `get_telemetry_producer`
* **Mutated by:** lifespan start/stop on KafkaTelemetryProducer
* **Possible states:** Kafka (runtime) / NoOp / Recording (tests)
* **Lifetime:** app lifetime

---

## 12. Validation

### Validation tập trung

| Command     | Kết quả | Bằng chứng hoặc ghi chú |
| ----------- | ------- | ----------------- |
| baseline suite | `PASS` | ruff + mypy 16 files + 31 pytest |
| `uv sync --all-groups` | `PASS` | aiokafka==0.14.0 installed |
| post-impl suite | `PASS` | ruff + mypy 16 files + 38 pytest |

### Validation cuối

| Check             | Kết quả | Ghi chú   |
| ----------------- | ------- | --------- |
| Unit tests        | `PASS` | 38 passed (was 31) |
| Integration tests | `PASS` | ASGI + lifespan_context mocked |
| Lint              | `PASS` | `uv run ruff check .` |
| Type-check        | `PASS` | `uv run mypy app` |
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
Live Kafka broker integration (deferred to P3 topic bootstrap / later smoke).
HTTP 503 mapping for ProducerUnavailableError (T2.6).
```

---

## 13. Discovered Issues

### httpx ASGITransport lacks lifespan kwarg

* **Location:** `tests/test_kafka_producer.py`
* **Description:** Installed httpx ASGITransport rejects `lifespan="on"`.
* **Impact:** Lifespan tests use `app.router.lifespan_context(app)` instead.
* **Action in this task:** Done.
* **Suggested future task:** None

### Sync Protocol vs aiokafka

* **Location:** `telemetry_producer.py`
* **Description:** T2.4 Protocol was sync; aiokafka requires async.
* **Impact:** Protocol/NoOp/Recording/route made async.
* **Action in this task:** Done.
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
T2.6 — map ProducerUnavailableError to retryable 503 / backpressure model.
```

---

## 15. Tổng kết cuối

* **Final Status:** `DONE`
* **Completed At:** `2026-07-24 05:24`

### Outcome

```text
KafkaTelemetryProducer (aiokafka) implements TelemetryProducer: lifespan singleton, one JSON message per event keyed by sessionId, ProducerUnavailableError on failure. Mocked tests; no live broker. Routes do not import aiokafka.
```

### Kết quả tiêu chí nghiệm thu

* [x] N messages / key=sessionId / lifespan reuse
* [x] Mocked tests + existing suite PASS (38)
* [x] TRACKING/plan updated; no commit

### File đã thay đổi

* `ingestion-api/pyproject.toml` / `uv.lock` — aiokafka
* `ingestion-api/app/services/telemetry_producer.py` — Kafka + error
* `ingestion-api/app/main.py` — lifespan wiring
* `ingestion-api/app/api/routes/events.py` — async await
* `ingestion-api/tests/test_kafka_producer.py` — mocked tests
* `ingestion-api/tests/test_health.py` / `test_sessions_routes.py` — NoOp override
* `ingestion-api/.env.example` — comment
* docs: task005, TRACKING, plan001

### Thay đổi hành vi chính

* Runtime default producer is KafkaTelemetryProducer (lifespan start/stop)
* `produce_batch` sends one Kafka message per event with key=sessionId
* Producer failures raise ProducerUnavailableError (HTTP mapping in T2.6)

### Kết quả validation

* **Tests:** `PASS` (38)
* **Lint:** `PASS`
* **Type-check:** `PASS`
* **Build:** `NOT RUN`

### Việc còn lại

* None for T2.5

### Giới hạn đã biết

* No live broker tests; no 503 mapping until T2.6; topic bootstrap is T3.1

### Task tiếp theo

* T2.6 Backpressure and error response model

### Commit message gợi ý

```text
feat(api): produce telemetry events to Kafka via aiokafka
```
