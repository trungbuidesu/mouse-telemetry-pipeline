# Task: Session lifecycle endpoints

## 1. Thông tin task

* **Task ID:** `phase2-task003`
* **Task Name:** `Session lifecycle endpoints`
* **Phase:** `phase2`
* **Status:** `DONE`
* **Started At:** `2026-07-24 05:10`
* **Last Updated:** `2026-07-24 05:20`
* **Completed At:** `2026-07-24 05:20`
* **Branch:** `main`
* **Base Commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Task File:** `documents/phases/phase2/task003-session-lifecycle-endpoints.md`

---

## 2. Yêu cầu gốc

> Implement T2.3 for the mouse-telemetry-pipeline repo at:
> c:\Users\bdtrung29.1\Documents\codework\github\mouse-telemetry-pipeline
>
> ## Confirmed plan decisions (locked)
> - In-memory session store (process-local dict)
> - Metrics return `{ "status": "processing" }` stub until Spark/P4
> - Create session success HTTP **200** with `{ "accepted": true, "sessionId": "..." }`
> - Complete: **404** if session never created; **200** if open→completed
> - No Kafka, no analytics computation
> - Follow AGENTS.md task-file workflow BEFORE code
>
> ## Required process (AGENTS.md)
> 1. Read documents/agents/AGENTS.md, coding_rules.md, coding_rules_api.md
> 2. Create `documents/phases/phase2/task003-session-lifecycle-endpoints.md` from `documents/templates/task.md`
> 3. Fill discovery, mark TRACKING T2.3 IN_PROGRESS
> 4. Baseline: `uv run ruff check .`, `uv run mypy app`, `uv run pytest` in ingestion-api/
> 5. Implement, validate, update task to DONE, update TRACKING (P2 progress), lightly update plan001 if needed
> 6. Do NOT commit unless user asks (they did not ask to commit in this message)
>
> ## Implementation
> CREATE:
> - `ingestion-api/app/schemas/sessions.py` — CreateSessionRequest, CreateSessionResponse, SessionCompleteResponse, SessionMetricsResponse
> - `ingestion-api/app/services/session_store.py` — Protocol + in-memory dict impl
> - `ingestion-api/tests/test_sessions_routes.py`
>
> EXTEND:
> - `ingestion-api/app/api/routes/sessions.py` — POST ``, POST `/{sessionId}/complete`, GET `/{sessionId}/metrics`
> - Wire store via FastAPI Depends / app.state in create_app as appropriate
>
> REUSE fixture: `contracts/fixtures/valid/create_session_request.json`
>
> CreateSessionRequest fields (api-contract): sessionId, startedAt, durationSeconds (30|60), canvasWidth/Height, viewportWidth/Height (positive).
>
> ## Validation
> ```
> cd ingestion-api
> uv run ruff check .
> uv run mypy app
> uv run pytest
> ```
>
> ## Done criteria
> - Task003 DONE with work log + validation evidence
> - TRACKING T2.3 DONE with task path
> - All tests pass
> - No batch/Kafka/producer work (that's T2.4+)
>
> Return: short summary of files changed, test counts, and next action (T2.4).

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Implement POST /api/v1/sessions, POST /api/v1/sessions/{sessionId}/complete, and GET /api/v1/sessions/{sessionId}/metrics with an in-memory session store and contract-aligned schemas; metrics remain a processing stub.
```

### Motivation

```text
Frontend and contract fixtures expect session create/complete/metrics before batch ingestion. T2.1 left empty session routers; T2.2 added telemetry schemas only. T2.3 fills the session lifecycle boundary without Kafka or analytics.
```

### Tiêu chí nghiệm thu

* [x] `app/schemas/sessions.py` exports CreateSessionRequest/Response, SessionCompleteResponse, SessionMetricsResponse
* [x] `app/services/session_store.py` provides Protocol + in-memory dict implementation
* [x] Routes: create 200 accepted; complete 404 unknown / 200 open→completed; metrics stub `{status: processing}` for known sessions
* [x] Fixture-backed route tests in `tests/test_sessions_routes.py`
* [x] No batch/Kafka/producer/analytics computation
* [x] `uv run ruff check .`, `uv run mypy app`, `uv run pytest` pass
* [x] TRACKING T2.3 DONE with task path; P2 progress updated
* [x] Không có thay đổi ngoài phạm vi.
* [x] Các validation liên quan pass hoặc lỗi còn lại được giải thích.

### Ngoài scope

* `POST /api/v1/events/batch` (T2.4)
* Kafka producer (T2.5)
* Backpressure / 413/429/503 error envelope (T2.6)
* Real Spark metrics / completed analytics payload (P4)
* Persistent session store (Redis/DB)

---

## 4. Bối cảnh phase

### Task đã có trong phase

| Task          | Status     | Relationship                            |
| ------------- | ---------- | --------------------------------------- |
| `task001-fastapi-ingestion-route-package.md` | `DONE` | `DEPENDENCY` — empty sessions router + create_app |
| `task002-pydantic-telemetry-models.md` | `DONE` | `DEPENDENCY` — schema style; CreateSession deferred here |
| `task003-session-lifecycle-endpoints.md` | `DONE` | `CURRENT` |

### Task liên quan trước đó

* **Task:** `documents/phases/phase2/task001-fastapi-ingestion-route-package.md`
* **Outcome:** Empty `sessions.router` mounted at `/api/v1/sessions`; health + Settings ready
* **Decisions inherited:**

  * FastAPI app factory in `create_app`
  * No handlers on sessions until T2.3
  * uv-managed validation commands

### Phụ thuộc của task

* T2.1 route package must exist (DONE)
* T2.2 telemetry models DONE (orthogonal schemas; session schemas are separate)
* Contract fixture `create_session_request.json` and `api-contract.md` semantics

### Kiểm tra trùng lặp

* **Equivalent task already exists:** `NO`
* **Overlapping task:** `None`
* **Quyết định:** `CREATE NEW`
* **Lý do:**

```text
T2.3 is the next TRACKING item; no IN_PROGRESS session-lifecycle task exists. task001 left empty routers intentionally; task002 deferred CreateSessionRequest to T2.3.
```

---

## 5. Trạng thái project ban đầu

### Trạng thái Git

* **Current branch:** `main`
* **Current commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Working tree:** `CLEAN`

### File đã sửa từ trước

* `None`

### File chưa track từ trước

* `None`

### Tóm tắt diff đã có

```text
Clean tree on main after T2.2 commit (feat(api): add Pydantic telemetry event and batch models).
```

### Stack project

* **Language/runtime:** Python 3.12 (uv-managed)
* **Framework:** FastAPI + Pydantic v2
* **Package manager:** uv
* **Build command:** N/A (library/app)
* **Test command:** `uv run pytest`
* **Lint command:** `uv run ruff check .`
* **Type-check command:** `uv run mypy app`

### Validation baseline

| Command     | Kết quả | Ghi chú   |
| ----------- | ------- | --------- |
| `uv run ruff check .` | `PASS` | All checks passed |
| `uv run mypy app` | `PASS` | 12 source files |
| `uv run pytest` | `PASS` | 17 passed |

### Kiến trúc quan sát được

* **Relevant module:** `ingestion-api/app/api/routes/sessions.py` (empty router)
* **Current responsibility owner:** Empty `APIRouter(prefix="/sessions")`
* **Entry point:** `app.main.create_app` → `build_api_router` → sessions.router

### Data flow hiện tại

```text
HTTP → create_app → /api/v1/sessions (no handlers) → (none)
```

### Rủi ro hiện có

* `test_health.py` asserts `/api/v1/sessions` absent from OpenAPI paths — must update when routes land
* Locked decisions: in-memory only; metrics stub; create 200; complete 404/200

---

## 6. Related Files

| File     | Current Responsibility | Why Relevant | Planned Action                    |
| -------- | ---------------------- | ------------ | --------------------------------- |
| `ingestion-api/app/schemas/sessions.py` | Session HTTP models | Session request/response models | `CREATE` |
| `ingestion-api/app/services/session_store.py` | In-memory store | Session lifecycle state | `CREATE` |
| `ingestion-api/app/services/__init__.py` | Package marker | New services package | `CREATE` |
| `ingestion-api/app/api/routes/sessions.py` | Session routes | create/complete/metrics handlers | `MODIFY` |
| `ingestion-api/app/main.py` | App factory | Wire session store on app.state | `MODIFY` |
| `ingestion-api/app/api/router.py` | Router aggregate | Docstring update | `MODIFY` |
| `ingestion-api/tests/test_sessions_routes.py` | Route tests | Fixture-backed lifecycle tests | `CREATE` |
| `ingestion-api/tests/test_health.py` | OpenAPI assertions | Expect session paths | `MODIFY` |
| `contracts/fixtures/valid/create_session_request.json` | Valid create body | REUSE in tests | `READ` |
| `documents/TRACKING.md` | Progress | T2.3 DONE; P2 3/8 | `MODIFY` |
| `documents/plans/phase2/plan001-fastapi-ingestion-contract.md` | Plan | Step 3 session endpoints checked | `MODIFY` |

---

## 7. Tìm kiếm code hiện có

### Searches Performed

| Search Term or Responsibility | Results                 |
| ----------------------------- | ----------------------- |
| `sessions.py` router | `app/api/routes/sessions.py` empty router only |
| `session_store` / `services/` | none before CREATE |
| `CreateSessionRequest` | deferred in task002; fields in api-contract + fixture |
| `create_session_request.json` | `contracts/fixtures/valid/create_session_request.json` |
| metrics processing stub | frontend `analyticsApi.ts` expects `{status: "processing"}` |

### Implementation hiện có liên quan

* `router` (sessions)
  Location: `ingestion-api/app/api/routes/sessions.py`
  Responsibility: `/sessions` mount with create/complete/metrics

* `create_app`
  Location: `ingestion-api/app/main.py`
  Responsibility: FastAPI factory; attaches `InMemorySessionStore` to `app.state`

### Quyết định triển khai

* **Quyết định:** `CREATE` schemas + store; `EXTEND` sessions routes + create_app
* **Target:** `app/schemas/sessions.py`, `app/services/session_store.py`, `app/api/routes/sessions.py`
* **Lý do:**

```text
No session schemas or store existed. Telemetry schemas are event/batch only. Empty sessions router was the T2.1 extension point. In-memory Protocol+impl matches locked plan.
```

### Creation Justification

* **REUSE không phù hợp vì:** No existing session request models or store; telemetry.py is event/batch scoped
* **EXTEND không phù hợp vì:** Putting session HTTP models into telemetry.py mixes concerns; no services module to extend
* **Responsibility mới là:** Session lifecycle validation + process-local session state
* **Người dùng dự kiến:** sessions route handlers and route tests
* **Public or internal:** Public HTTP schemas; internal store Protocol/impl

---

## 8. Kế hoạch triển khai

* [x] **Step 1:** CREATE session schemas

  * Files: `ingestion-api/app/schemas/sessions.py`
  * Kết quả kỳ vọng: CreateSessionRequest/Response, SessionCompleteResponse, SessionMetricsResponse
  * Validation: suite

* [x] **Step 2:** CREATE session store Protocol + in-memory impl

  * Files: `ingestion-api/app/services/__init__.py`, `session_store.py`
  * Kết quả kỳ vọng: create/get/complete; None when missing
  * Validation: route tests

* [x] **Step 3:** EXTEND sessions routes + wire store in create_app; update health OpenAPI test

  * Files: `sessions.py`, `main.py`, `test_health.py`, `test_sessions_routes.py`
  * Kết quả kỳ vọng: create 200; complete 404/200; metrics processing stub
  * Validation: ruff/mypy/pytest PASS (26)

* [x] **Step 4:** Close task — TRACKING, plan001, DONE

  * Files: task003, TRACKING.md, plan001
  * Kết quả kỳ vọng: T2.3 DONE; P2 3/8; next T2.4
  * Validation: evidence recorded

---

## 9. Work Log

### `[2026-07-24 05:10]` — Khởi tạo task

* **Status:** `DISCOVERY`

* **Action:**

  * Copied task template.
  * Copied original request.
  * Inspected phase tasks (task001 DONE, task002 DONE).
  * Inspected project and Git state (clean main @ 7183ae8).
  * Baseline validation PASS (ruff, mypy, 17 pytest).
  * Marked TRACKING T2.3 IN_PROGRESS.

* **Files inspected:**

  * `documents/agents/AGENTS.md`, `coding_rules.md`, `coding_rules_api.md`
  * `documents/templates/task.md`, `TRACKING.md`, `plan001-fastapi-ingestion-contract.md`
  * `app/api/routes/sessions.py`, `app/main.py`, `app/schemas/telemetry.py`
  * `contracts/telemetry/api-contract.md`, `contracts/fixtures/valid/create_session_request.json`
  * `tests/test_health.py`

* **Kết quả:**

  * Task003 created; ready to implement.

* **Next verified action:**

  * CREATE schemas + store; EXTEND routes.

### `[2026-07-24 05:15]` — Implement schemas, store, routes, tests

* **Status:** `IN_PROGRESS`

* **Action:**

  * CREATE `app/schemas/sessions.py`
  * CREATE `app/services/session_store.py` + `__init__.py`
  * EXTEND `sessions.py` routes with Depends(`app.state.session_store`)
  * EXTEND `create_app` to accept optional store and set `app.state`
  * CREATE `tests/test_sessions_routes.py` (fixture-backed)
  * Update `test_health.py` OpenAPI expectations
  * Fixed mypy `no-any-return` via `cast(SessionStore, ...)`

* **Files changed:**

  * `ingestion-api/app/schemas/sessions.py`
  * `ingestion-api/app/services/__init__.py`
  * `ingestion-api/app/services/session_store.py`
  * `ingestion-api/app/api/routes/sessions.py`
  * `ingestion-api/app/main.py`
  * `ingestion-api/app/api/router.py`
  * `ingestion-api/tests/test_sessions_routes.py`
  * `ingestion-api/tests/test_health.py`

* **Symbols changed:**

  * `CreateSessionRequest`, `CreateSessionResponse`, `SessionCompleteResponse`, `SessionMetricsResponse`
  * `SessionStore`, `InMemorySessionStore`, `SessionRecord`, `SessionLifecycleStatus`
  * `create_session`, `complete_session`, `get_session_metrics`, `get_session_store`

* **Kết quả:**

  * Create 200; complete 404/200; metrics processing stub for known sessions; unknown metrics 404

* **Validation:**

  * `uv run ruff check .` → `PASS`
  * `uv run mypy app` → `PASS` (15 files)
  * `uv run pytest` → `PASS` (26 passed)

* **Quyết định hoặc phát hiện:**

  * Path params use `{sessionId}` to match api-contract OpenAPI naming
  * Metrics 404 for unknown sessions (consistent with complete); known sessions always `processing`

* **Next verified action:**

  * Mark DONE; update TRACKING + plan001

### `[2026-07-24 05:20]` — Close task

* **Status:** `DONE`

* **Action:**

  * TRACKING T2.3 DONE; P2 3/8; total 25/52
  * plan001 Step 3 session endpoints checked; modules table updated
  * Final summary filled

* **Validation:**

  * Final suite already PASS (26)

* **Next verified action:**

  * T2.4 Batch ingestion endpoint

---

## 10. Thay đổi

### Added Files

#### `ingestion-api/app/schemas/sessions.py`

* **Mục đích:** Pydantic models for session create/complete/metrics
* **Why required:** api-contract session endpoints need typed request/response
* **Used by:** `app/api/routes/sessions.py`, `session_store.create`
* **Visibility:** `PUBLIC`

#### `ingestion-api/app/services/session_store.py`

* **Mục đích:** Protocol + in-memory dict session lifecycle store
* **Why required:** Track open/completed without Kafka/DB
* **Used by:** session routes via Depends
* **Visibility:** `INTERNAL`

#### `ingestion-api/app/services/__init__.py`

* **Mục đích:** Package marker for services
* **Why required:** New services package
* **Used by:** imports under `app.services`
* **Visibility:** `INTERNAL`

#### `ingestion-api/tests/test_sessions_routes.py`

* **Mục đích:** ASGI tests for create/complete/metrics
* **Why required:** Acceptance coverage including fixture reuse
* **Used by:** pytest
* **Visibility:** `INTERNAL`

### Modified Files

#### `ingestion-api/app/api/routes/sessions.py`

* **Previous responsibility:** Empty `/sessions` router
* **Changes made:** Added create, complete, metrics handlers + store dependency
* **Lý do:** T2.3 lifecycle endpoints
* **Behavioral impact:** Three new HTTP endpoints under `/api/v1/sessions`
* **Compatibility impact:** Public API expansion (expected)

#### `ingestion-api/app/main.py`

* **Previous responsibility:** App factory without state
* **Changes made:** Optional `session_store`; attach to `app.state`
* **Lý do:** Wire injectable store for routes/tests
* **Behavioral impact:** Process-local store per app instance
* **Compatibility impact:** Optional kwarg; default InMemorySessionStore

#### `ingestion-api/tests/test_health.py`

* **Previous responsibility:** Assert empty session paths
* **Changes made:** Expect session OpenAPI paths; keep events empty
* **Lý do:** Placeholder assertion obsolete after T2.3
* **Behavioral impact:** Test-only
* **Compatibility impact:** none

#### `ingestion-api/app/api/router.py`

* **Previous responsibility:** Aggregate routers
* **Changes made:** Docstring only
* **Lý do:** Reflect session lifecycle presence
* **Behavioral impact:** none
* **Compatibility impact:** none

#### `documents/TRACKING.md`

* **Previous responsibility:** Progress tracker
* **Changes made:** T2.3 DONE; P2 3/8; total 25/52
* **Lý do:** AGENTS workflow closeout
* **Behavioral impact:** docs only
* **Compatibility impact:** none

#### `documents/plans/phase2/plan001-fastapi-ingestion-contract.md`

* **Previous responsibility:** P2 ingestion plan
* **Changes made:** Step 3 session checks; modules; acceptance; status IN_PROGRESS
* **Lý do:** Light plan sync after T2.3
* **Behavioral impact:** docs only
* **Compatibility impact:** none

### Deleted Files

#### N/A

---

## 11. Thay đổi symbol

### Added Symbols

#### `CreateSessionRequest`

* **Location:** `ingestion-api/app/schemas/sessions.py`
* **Type:** `CLASS`
* **Responsibility:** Validate POST /sessions body
* **Inputs:** sessionId, startedAt, durationSeconds, canvas/viewport dims
* **Outputs:** validated model
* **State mutation:** none
* **Lifetime:** request
* **Used by:** `create_session`, `InMemorySessionStore.create`
* **Visibility:** `PUBLIC`

#### `CreateSessionResponse`

* **Location:** `ingestion-api/app/schemas/sessions.py`
* **Type:** `CLASS`
* **Responsibility:** `{accepted, sessionId}` success body
* **Inputs:** accepted, sessionId
* **Outputs:** JSON response
* **State mutation:** none
* **Lifetime:** response
* **Used by:** `create_session`
* **Visibility:** `PUBLIC`

#### `SessionCompleteResponse`

* **Location:** `ingestion-api/app/schemas/sessions.py`
* **Type:** `CLASS`
* **Responsibility:** complete success body
* **Inputs:** accepted, sessionId, status=completed
* **Outputs:** JSON response
* **State mutation:** none
* **Lifetime:** response
* **Used by:** `complete_session`
* **Visibility:** `PUBLIC`

#### `SessionMetricsResponse`

* **Location:** `ingestion-api/app/schemas/sessions.py`
* **Type:** `CLASS`
* **Responsibility:** processing stub until P4
* **Inputs:** status=processing
* **Outputs:** JSON response
* **State mutation:** none
* **Lifetime:** response
* **Used by:** `get_session_metrics`
* **Visibility:** `PUBLIC`

#### `SessionStore` / `InMemorySessionStore`

* **Location:** `ingestion-api/app/services/session_store.py`
* **Type:** `CLASS`
* **Responsibility:** create/get/complete process-local sessions
* **Inputs:** CreateSessionRequest / sessionId
* **Outputs:** SessionRecord | None
* **State mutation:** dict of SessionRecord
* **Lifetime:** app process
* **Used by:** session routes via Depends
* **Visibility:** `INTERNAL`

#### `create_session` / `complete_session` / `get_session_metrics`

* **Location:** `ingestion-api/app/api/routes/sessions.py`
* **Type:** `FUNCTION`
* **Responsibility:** HTTP handlers for session lifecycle
* **Inputs:** request body / sessionId + store
* **Outputs:** response models or 404
* **State mutation:** via store
* **Lifetime:** request
* **Used by:** FastAPI router
* **Visibility:** `PUBLIC`

### Modified Symbols

#### `create_app`

* **Location:** `ingestion-api/app/main.py`
* **Previous behavior:** Built app without app.state store
* **New behavior:** Accepts optional `session_store`; sets `app.state.session_store`
* **Signature changed:** `YES`
* **Callers affected:** tests may inject store; default unchanged for callers without kwargs

### Removed Symbols

#### N/A

### Important Variables Added

#### `app.state.session_store`

* **Meaning:** Injected SessionStore for request handlers
* **Created in:** `create_app`
* **Read by:** `get_session_store`
* **Mutated by:** store methods during requests
* **Possible states:** InMemorySessionStore instance (or test double)
* **Lifetime:** app lifetime

---

## 12. Validation

### Validation tập trung

| Command     | Kết quả | Bằng chứng hoặc ghi chú |
| ----------- | ------- | ----------------- |
| baseline `ruff`/`mypy`/`pytest` | `PASS` | 17 tests before implementation |
| post-impl suite | `PASS` | ruff + mypy 15 files + 26 pytest |

### Validation cuối

| Check             | Kết quả | Ghi chú   |
| ----------------- | ------- | --------- |
| Unit tests        | `PASS` | 26 passed (was 17) |
| Integration tests | `PASS` | ASGI route tests in test_sessions_routes |
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
None required for T2.3; Kafka/batch deferred to T2.4+.
```

---

## 13. Discovered Issues

### Health OpenAPI assertion will break

* **Location:** `ingestion-api/tests/test_health.py`
* **Description:** Asserted `/api/v1/sessions` absent from OpenAPI (placeholder era).
* **Impact:** Would fail once session routes exist.
* **Action in this task:** Updated assertion to expect session paths.
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
T2.4 — implement POST /api/v1/events/batch (no Kafka produce yet until T2.5, per TRACKING blockers).
```

---

## 15. Tổng kết cuối

* **Final Status:** `DONE`
* **Completed At:** `2026-07-24 05:20`

### Outcome

```text
Session lifecycle endpoints are live: create (200 accepted), complete (404 unknown / 200 completed), metrics processing stub for known sessions, backed by an in-memory SessionStore.
```

### Kết quả tiêu chí nghiệm thu

* [x] Session schemas + store + routes
* [x] Fixture-backed tests
* [x] Validation PASS (26)
* [x] TRACKING/plan updated; no Kafka/batch

### File đã thay đổi

* `ingestion-api/app/schemas/sessions.py` — session HTTP models
* `ingestion-api/app/services/session_store.py` — Protocol + in-memory store
* `ingestion-api/app/api/routes/sessions.py` — create/complete/metrics
* `ingestion-api/app/main.py` — wire store via app.state
* `ingestion-api/tests/test_sessions_routes.py` — route tests
* `ingestion-api/tests/test_health.py` — OpenAPI expectations
* docs: task003, TRACKING, plan001

### Thay đổi hành vi chính

* `POST /api/v1/sessions` accepts valid metadata with 200 `{accepted, sessionId}`
* `POST .../complete` 404 unknown, 200 open→completed (idempotent)
* `GET .../metrics` returns `{status: processing}` for known sessions; 404 unknown

### Kết quả validation

* **Tests:** `PASS` (26)
* **Lint:** `PASS`
* **Type-check:** `PASS`
* **Build:** `NOT RUN`

### Việc còn lại

* None for T2.3

### Giới hạn đã biết

* Metrics always `processing` until P4; store is process-local only

### Task tiếp theo

* T2.4 Batch ingestion endpoint

### Commit message gợi ý

```text
feat(api): add session create, complete, and metrics endpoints
```
