# Task: Batch ingestion endpoint

## 1. Thông tin task

* **Task ID:** `phase2-task004`
* **Task Name:** `Batch ingestion endpoint`
* **Phase:** `phase2`
* **Status:** `DONE`
* **Started At:** `2026-07-24 05:14`
* **Last Updated:** `2026-07-24 05:25`
* **Completed At:** `2026-07-24 05:25`
* **Branch:** `main`
* **Base Commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Task File:** `documents/phases/phase2/task004-batch-ingestion-endpoint.md`

---

## 2. Yêu cầu gốc

> Implement T2.4 for mouse-telemetry-pipeline at:
> c:\Users\bdtrung29.1\Documents\codework\github\mouse-telemetry-pipeline
>
> T2.3 was just completed by another agent. EXTEND from current main working tree (may have uncommitted T2.3 files — do not revert them; continue).
>
> ## Locked plan decisions for T2.4
> - `POST /api/v1/events/batch` → **202** + `BatchAcceptedResponse` (`accepted`, `batchSequence`, `eventCount`)
> - Validate with existing `TelemetryBatch` from `app/schemas/telemetry.py`
> - CREATE `TelemetryProducer` Protocol + `NoOpTelemetryProducer` + `RecordingTelemetryProducer` (test double) in `app/services/telemetry_producer.py`
> - Default dep = NoOp until T2.5; inject Recording in tests
> - Batch does **NOT** require prior session create
> - Add **minimal** validation exception handler returning **400** (not 422) for request validation errors so frontend/DEC-007 align
> - No real Kafka, no 413/429/503/idempotency (T2.5/T2.6)
>
> ## AGENTS.md process
> 1. Create `documents/phases/phase2/task004-batch-ingestion-endpoint.md` from template
> 2. Mark TRACKING T2.4 IN_PROGRESS → DONE when finished
> 3. Baseline then implement then `uv run ruff check .`, `uv run mypy app`, `uv run pytest`
> 4. Do NOT commit
>
> ## Files
> - CREATE: `app/services/telemetry_producer.py`, `tests/test_events_batch_route.py`, task004
> - EXTEND: `app/api/routes/events.py` (POST `/batch`), `app/main.py` (deps + validation→400 handler)
> - REUSE: fixtures under `contracts/fixtures/valid/telemetry_batch.json` and invalid fixtures for 400 path
> - Wire producer via Depends / app.state like session store pattern from T2.3
>
> ## Acceptance
> - Valid batch → 202 with correct body; producer called once
> - Invalid schema → 400
> - No analytics; routes don't import kafka
>
> Return short summary: files, pytest count, next=T2.5.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Implement POST /api/v1/events/batch that validates TelemetryBatch, accepts with 202 BatchAcceptedResponse, and forwards to a TelemetryProducer boundary (NoOp by default). Map request validation errors to HTTP 400.
```

### Motivation

```text
Frontend batch sender and api-contract expect 202 accept + 400 for schema errors. T2.2 added models; T2.3 added session lifecycle. T2.4 opens the batch ingestion path without Kafka (T2.5).
```

### Tiêu chí nghiệm thu

* [x] `POST /api/v1/events/batch` returns 202 + BatchAcceptedResponse for valid fixture
* [x] Producer Protocol + NoOp default + Recording test double; producer called once on accept
* [x] Invalid schema → 400 (not 422)
* [x] Batch does not require prior session create
* [x] No Kafka import in routes; no analytics
* [x] `uv run ruff check .`, `uv run mypy app`, `uv run pytest` pass
* [x] TRACKING T2.4 DONE; task file closed
* [x] Không có thay đổi ngoài phạm vi.
* [x] Các validation liên quan pass hoặc lỗi còn lại được giải thích.

### Ngoài scope

* Real Kafka producer (T2.5)
* 413 / 429 / 503 / idempotency (T2.5/T2.6)
* Requiring session create before batch
* Analytics computation

---

## 4. Bối cảnh phase

### Task đã có trong phase

| Task          | Status     | Relationship                            |
| ------------- | ---------- | --------------------------------------- |
| `task001-fastapi-ingestion-route-package.md` | `DONE` | `DEPENDENCY` — empty events router |
| `task002-pydantic-telemetry-models.md` | `DONE` | `DEPENDENCY` — TelemetryBatch + BatchAcceptedResponse |
| `task003-session-lifecycle-endpoints.md` | `DONE` | `RELATED` — Depends/app.state pattern to mirror |
| `task004-batch-ingestion-endpoint.md` | `DONE` | `CURRENT` |

### Task liên quan trước đó

* **Task:** `documents/phases/phase2/task003-session-lifecycle-endpoints.md`
* **Outcome:** Session lifecycle + InMemorySessionStore wired via `app.state` / Depends
* **Decisions inherited:**

  * Injectable service via `create_app(...)` + `app.state`
  * No Kafka in request path yet
  * Fixture-backed ASGI tests with httpx

### Phụ thuộc của task

* T2.2 TelemetryBatch / BatchAcceptedResponse (DONE)
* T2.1 empty events router (DONE)
* Contract fixtures valid/invalid batch

### Kiểm tra trùng lặp

* **Equivalent task already exists:** `NO`
* **Overlapping task:** `None`
* **Quyết định:** `CREATE NEW`
* **Lý do:**

```text
T2.4 is next TRACKING item; events router still empty; no producer service exists.
```

---

## 5. Trạng thái project ban đầu

### Trạng thái Git

* **Current branch:** `main`
* **Current commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Working tree:** `DIRTY`

### File đã sửa từ trước

* T2.3 uncommitted: sessions routes/schemas/store, main.py, test_health, TRACKING, plan001, task003

### File chưa track từ trước

* `documents/phases/phase2/task003-session-lifecycle-endpoints.md`
* `ingestion-api/app/schemas/sessions.py`
* `ingestion-api/app/services/`
* `ingestion-api/tests/test_sessions_routes.py`

### Tóm tắt diff đã có

```text
T2.3 session lifecycle implemented on working tree (not committed). Do not revert; extend for T2.4.
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
| `uv run mypy app` | `PASS` | 15 source files |
| `uv run pytest` | `PASS` | 26 passed |

### Kiến trúc quan sát được

* **Relevant module:** `ingestion-api/app/api/routes/events.py` (empty router)
* **Current responsibility owner:** Empty `APIRouter(prefix="/events")`
* **Entry point:** `app.main.create_app` → `build_api_router` → events.router

### Data flow hiện tại

```text
HTTP → create_app → /api/v1/events (no handlers) → (none)
```

### Rủi ro hiện có

* App-wide validation→400 will change session route tests that currently assert 422 — update those assertions
* `test_health.py` asserts `/api/v1/events/batch` absent — update when route lands

---

## 6. Related Files

| File     | Current Responsibility | Why Relevant | Planned Action                    |
| -------- | ---------------------- | ------------ | --------------------------------- |
| `ingestion-api/app/services/telemetry_producer.py` | Producer boundary | Protocol + NoOp + Recording | `CREATE` |
| `ingestion-api/app/api/routes/events.py` | Events router | POST /batch | `MODIFY` |
| `ingestion-api/app/main.py` | App factory | Wire producer + 400 handler | `MODIFY` |
| `ingestion-api/tests/test_events_batch_route.py` | Batch route tests | Acceptance | `CREATE` |
| `ingestion-api/tests/test_sessions_routes.py` | Session tests | 422→400 after handler | `MODIFY` |
| `ingestion-api/tests/test_health.py` | OpenAPI assertions | Expect batch path | `MODIFY` |
| `ingestion-api/app/schemas/telemetry.py` | TelemetryBatch models | REUSE | `READ` |
| `contracts/fixtures/valid/telemetry_batch.json` | Valid body | REUSE | `READ` |
| `contracts/fixtures/invalid/batch_empty_events.json` | Invalid body | REUSE for 400 | `READ` |
| `documents/TRACKING.md` | Progress | T2.4 status | `MODIFY` |
| `documents/plans/phase2/plan001-fastapi-ingestion-contract.md` | Plan | Step 3 batch check | `MODIFY` |

---

## 7. Tìm kiếm code hiện có

### Searches Performed

| Search Term or Responsibility | Results                 |
| ----------------------------- | ----------------------- |
| `events.py` router | empty `APIRouter(prefix="/events")` |
| `TelemetryBatch` / `BatchAcceptedResponse` | `app/schemas/telemetry.py` |
| `telemetry_producer` / kafka | none |
| `telemetry_batch.json` | `contracts/fixtures/valid/` |
| `batch_empty_events.json` | `contracts/fixtures/invalid/` |
| session_store Depends pattern | `sessions.py` + `create_app` |

### Implementation hiện có liên quan

* `TelemetryBatch`, `BatchAcceptedResponse`
  Location: `ingestion-api/app/schemas/telemetry.py`
  Responsibility: request/response models for batch endpoint

* `SessionStore` + `create_app(session_store=...)`
  Location: `session_store.py`, `main.py`
  Responsibility: Pattern to mirror for TelemetryProducer

### Quyết định triển khai

* **Quyết định:** `CREATE` producer service; `EXTEND` events routes + create_app
* **Target:** `telemetry_producer.py`, `events.py`, `main.py`
* **Lý do:**

```text
Empty events router is the extension point. Batch models already exist. Producer Protocol keeps Kafka out of routes until T2.5 (NoOp default).
```

### Creation Justification

* **REUSE không phù hợp vì:** No producer or batch handler exists
* **EXTEND không phù hợp vì:** session_store is session-scoped; producer is a separate boundary
* **Responsibility mới là:** Accept validated batches and hand off to producer Protocol
* **Người dùng dự kiến:** events route handlers and route tests
* **Public or internal:** Public HTTP endpoint; internal producer Protocol/impls

---

## 8. Kế hoạch triển khai

* [x] **Step 1:** CREATE failing tests for batch accept / 400 / producer call

  * Files: `tests/test_events_batch_route.py`
  * Kết quả kỳ vọng: RED
  * Validation: collection ImportError (missing producer) then implement

* [x] **Step 2:** CREATE TelemetryProducer + EXTEND events route + main (deps + 400 handler)

  * Files: `telemetry_producer.py`, `events.py`, `main.py`
  * Kết quả kỳ vọng: GREEN for batch tests
  * Validation: ruff/mypy/pytest PASS (31)

* [x] **Step 3:** Update session 422→400 assertions + health OpenAPI; close task

  * Files: `test_sessions_routes.py`, `test_health.py`, TRACKING, plan001, task004
  * Kết quả kỳ vọng: full suite PASS; T2.4 DONE
  * Validation: full suite PASS

---

## 9. Work Log

### `[2026-07-24 05:14]` — Khởi tạo task

* **Status:** `DISCOVERY`

* **Action:**

  * Copied task template.
  * Copied original request.
  * Inspected phase tasks (task001–003 DONE).
  * Git dirty with uncommitted T2.3 — will extend, not revert.
  * Baseline validation PASS (ruff, mypy, 26 pytest).
  * Marked TRACKING T2.4 IN_PROGRESS.

* **Files inspected:**

  * `documents/agents/AGENTS.md`, `coding_rules_api.md`, `TRACKING.md`, `plan001`
  * `events.py`, `main.py`, `session_store.py`, `sessions.py`, `telemetry.py`
  * fixtures valid/invalid; `api-contract.md`; `test_health.py`, `test_sessions_routes.py`

* **Kết quả:**

  * Task004 created; ready for TDD implementation.

* **Next verified action:**

  * Write failing batch route tests.

### `[2026-07-24 05:20]` — Implement producer, route, 400 handler, tests

* **Status:** `IN_PROGRESS`

* **Action:**

  * CREATE `tests/test_events_batch_route.py` (RED: missing module)
  * CREATE `app/services/telemetry_producer.py` (Protocol + NoOp + Recording)
  * EXTEND `events.py` with POST `/batch`
  * EXTEND `create_app` with `telemetry_producer` + RequestValidationError→400
  * Update session tests 422→400; health OpenAPI expects batch path

* **Files changed:**

  * `ingestion-api/app/services/telemetry_producer.py`
  * `ingestion-api/app/api/routes/events.py`
  * `ingestion-api/app/main.py`
  * `ingestion-api/app/api/router.py`
  * `ingestion-api/tests/test_events_batch_route.py`
  * `ingestion-api/tests/test_sessions_routes.py`
  * `ingestion-api/tests/test_health.py`

* **Symbols changed:**

  * `TelemetryProducer`, `NoOpTelemetryProducer`, `RecordingTelemetryProducer`
  * `ingest_batch`, `get_telemetry_producer`
  * `create_app` (+telemetry_producer, validation handler)

* **Kết quả:**

  * Valid batch → 202; invalid → 400; producer called once; no kafka in routes

* **Validation:**

  * `uv run ruff check .` → `PASS`
  * `uv run mypy app` → `PASS` (16 files)
  * `uv run pytest` → `PASS` (31 passed)

* **Quyết định hoặc phát hiện:**

  * App-wide 400 handler also applies to session validation failures (tests updated)

* **Next verified action:**

  * Mark DONE; update TRACKING + plan001

### `[2026-07-24 05:25]` — Close task

* **Status:** `DONE`

* **Action:**

  * TRACKING T2.4 DONE; P2 4/8; total 26/52
  * plan001 Step 3 batch + acceptance checks updated
  * Final summary filled

* **Validation:**

  * Final suite PASS (31)

* **Next verified action:**

  * T2.5 Kafka producer service boundary

---

## 10. Thay đổi

### Added Files

#### `ingestion-api/app/services/telemetry_producer.py`

* **Mục đích:** TelemetryProducer Protocol + NoOp default + Recording test double
* **Why required:** Keep Kafka out of routes until T2.5 while allowing injectable handoff
* **Used by:** `events.py` routes, `create_app`, batch tests
* **Visibility:** `INTERNAL`

#### `ingestion-api/tests/test_events_batch_route.py`

* **Mục đích:** ASGI tests for batch accept / 400 / producer call / no-kafka
* **Why required:** Acceptance coverage with contract fixtures
* **Used by:** pytest
* **Visibility:** `INTERNAL`

### Modified Files

#### `ingestion-api/app/api/routes/events.py`

* **Previous responsibility:** Empty `/events` router
* **Changes made:** POST `/batch` with TelemetryBatch validation + producer handoff
* **Lý do:** T2.4 batch ingestion
* **Behavioral impact:** New `POST /api/v1/events/batch` → 202
* **Compatibility impact:** Public API expansion (expected)

#### `ingestion-api/app/main.py`

* **Previous responsibility:** App factory with session store only
* **Changes made:** Optional `telemetry_producer`; RequestValidationError→400 handler
* **Lý do:** Wire producer + DEC-007/frontend 400 alignment
* **Behavioral impact:** Validation errors return 400 app-wide; NoOp producer default
* **Compatibility impact:** Optional kwarg; session invalid payloads now 400 not 422

#### `ingestion-api/tests/test_sessions_routes.py`

* **Previous responsibility:** Session lifecycle tests asserting 422
* **Changes made:** Assert 400 for invalid create payloads
* **Lý do:** App-wide validation handler
* **Behavioral impact:** Test-only
* **Compatibility impact:** none

#### `ingestion-api/tests/test_health.py`

* **Previous responsibility:** Assert batch path absent
* **Changes made:** Expect `/api/v1/events/batch` in OpenAPI
* **Lý do:** Route now exists
* **Behavioral impact:** Test-only
* **Compatibility impact:** none

#### `ingestion-api/app/api/router.py`

* **Previous responsibility:** Aggregate routers
* **Changes made:** Docstring only
* **Lý do:** Reflect batch route presence
* **Behavioral impact:** none
* **Compatibility impact:** none

#### `documents/TRACKING.md`

* **Previous responsibility:** Progress tracker
* **Changes made:** T2.4 DONE; P2 4/8; total 26/52
* **Lý do:** AGENTS workflow closeout
* **Behavioral impact:** docs only
* **Compatibility impact:** none

#### `documents/plans/phase2/plan001-fastapi-ingestion-contract.md`

* **Previous responsibility:** P2 ingestion plan
* **Changes made:** Step 3 batch checked; modules + acceptance updated
* **Lý do:** Light plan sync after T2.4
* **Behavioral impact:** docs only
* **Compatibility impact:** none

### Deleted Files

#### N/A

---

## 11. Thay đổi symbol

### Added Symbols

#### `TelemetryProducer` / `NoOpTelemetryProducer` / `RecordingTelemetryProducer`

* **Location:** `ingestion-api/app/services/telemetry_producer.py`
* **Type:** `CLASS`
* **Responsibility:** Accept validated batches for downstream produce
* **Inputs:** `TelemetryBatch`
* **Outputs:** None (side-effect / record)
* **State mutation:** Recording accumulates batches; NoOp none
* **Lifetime:** app process
* **Used by:** events routes via Depends; tests
* **Visibility:** `INTERNAL`

#### `ingest_batch` / `get_telemetry_producer`

* **Location:** `ingestion-api/app/api/routes/events.py`
* **Type:** `FUNCTION`
* **Responsibility:** HTTP handler for batch ingestion
* **Inputs:** TelemetryBatch + producer
* **Outputs:** BatchAcceptedResponse (202)
* **State mutation:** via producer
* **Lifetime:** request
* **Used by:** FastAPI router
* **Visibility:** `PUBLIC`

### Modified Symbols

#### `create_app`

* **Location:** `ingestion-api/app/main.py`
* **Previous behavior:** Optional session_store only; default FastAPI 422 validation
* **New behavior:** Optional telemetry_producer (NoOp default); RequestValidationError→400
* **Signature changed:** `YES`
* **Callers affected:** tests may inject producer; default unchanged for callers without kwargs

### Removed Symbols

#### N/A

### Important Variables Added

#### `app.state.telemetry_producer`

* **Meaning:** Injected TelemetryProducer for batch handlers
* **Created in:** `create_app`
* **Read by:** `get_telemetry_producer`
* **Mutated by:** producer methods during requests
* **Possible states:** NoOpTelemetryProducer (or Recording/test double)
* **Lifetime:** app lifetime

---

## 12. Validation

### Validation tập trung

| Command     | Kết quả | Bằng chứng hoặc ghi chú |
| ----------- | ------- | ----------------- |
| baseline suite | `PASS` | ruff + mypy 15 files + 26 pytest |
| post-impl suite | `PASS` | ruff + mypy 16 files + 31 pytest |

### Validation cuối

| Check             | Kết quả | Ghi chú   |
| ----------------- | ------- | --------- |
| Unit tests        | `PASS` | 31 passed (was 26) |
| Integration tests | `PASS` | ASGI batch + session route tests |
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
None required for T2.4; real Kafka deferred to T2.5.
```

---

## 13. Discovered Issues

### Session tests assert 422

* **Location:** `ingestion-api/tests/test_sessions_routes.py`
* **Description:** Two tests expected FastAPI default 422; app-wide 400 handler changed them.
* **Impact:** Updated assertions to 400 in this task.
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
T2.5 — Kafka producer service boundary (replace NoOp with real producer).
```

---

## 15. Tổng kết cuối

* **Final Status:** `DONE`
* **Completed At:** `2026-07-24 05:25`

### Outcome

```text
POST /api/v1/events/batch accepts valid TelemetryBatch with 202 BatchAcceptedResponse, hands off to TelemetryProducer (NoOp default), and maps validation errors to 400. No Kafka yet.
```

### Kết quả tiêu chí nghiệm thu

* [x] Batch endpoint + producer boundary + 400 handler
* [x] Fixture-backed tests
* [x] Validation PASS (31)
* [x] TRACKING/plan updated; no Kafka

### File đã thay đổi

* `ingestion-api/app/services/telemetry_producer.py` — Protocol + NoOp + Recording
* `ingestion-api/app/api/routes/events.py` — POST /batch
* `ingestion-api/app/main.py` — producer wiring + 400 handler
* `ingestion-api/tests/test_events_batch_route.py` — route tests
* `ingestion-api/tests/test_sessions_routes.py` — 422→400
* `ingestion-api/tests/test_health.py` — OpenAPI batch path
* docs: task004, TRACKING, plan001

### Thay đổi hành vi chính

* `POST /api/v1/events/batch` → 202 `{accepted, batchSequence, eventCount}`
* Invalid request bodies → 400 (app-wide)
* Producer called once per accepted batch (NoOp in production path)

### Kết quả validation

* **Tests:** `PASS` (31)
* **Lint:** `PASS`
* **Type-check:** `PASS`
* **Build:** `NOT RUN`

### Việc còn lại

* None for T2.4

### Giới hạn đã biết

* NoOp producer only; no 413/429/503/idempotency until later tasks

### Task tiếp theo

* T2.5 Kafka producer service boundary

### Commit message gợi ý

```text
feat(api): accept telemetry batches via POST /events/batch
```
