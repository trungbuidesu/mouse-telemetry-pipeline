# Task: API contract tests

## 1. Thông tin task

* **Task ID:** `phase2-task007`
* **Task Name:** `API contract tests`
* **Phase:** `phase2`
* **Status:** `DONE`
* **Started At:** `2026-07-24 05:32`
* **Last Updated:** `2026-07-24 05:34`
* **Completed At:** `2026-07-24 05:34`
* **Branch:** `main`
* **Base Commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Task File:** `documents/phases/phase2/task007-api-contract-tests.md`

---

## 2. Yêu cầu gốc

> Implement T2.7 for mouse-telemetry-pipeline at:
> c:\Users\bdtrung29.1\Documents\codework\github\mouse-telemetry-pipeline
>
> T2.3–T2.6 are done (likely uncommitted). Do NOT revert. Continue from current tree.
>
> ## Locked plan for T2.7
> HTTP contract tests via httpx ASGI + `contracts/fixtures` proving G2 behaviors:
>
> Minimum matrix:
> - Valid telemetry batch → **202** shape (`accepted`, `batchSequence`, `eventCount`)
> - Invalid fixtures → **400** with error envelope (`retryable: false`)
> - Oversized body → **413**
> - Producer failure → **503** + `retryable: true`
> - Create session fixture → success **200**
> - Health still **200**
>
> Out of scope: Playwright, live Kafka (optional integration mark skipped by default)
>
> ## AGENTS.md
> 1. Create `documents/phases/phase2/task007-api-contract-tests.md`
> 2. TRACKING T2.7 IN_PROGRESS → DONE
> 3. `uv run ruff check .`, `uv run mypy app`, `uv run pytest`
> 4. Do NOT commit
>
> ## Files
> - CREATE: `tests/test_api_contracts.py` (and small `tests/support/` helper if useful)
> - REUSE: all `contracts/fixtures/valid/*` and `invalid/*`
> - Override producer with Recording/failing fake as needed (NoOp/Kafka pattern from existing tests)
>
> ## Acceptance
> Full suite green; contract matrix covered; task DONE; TRACKING updated.
>
> Return: pytest count, files, next=T2.8.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Prove G2 HTTP behaviors with httpx ASGI contract tests driven by shared contracts/fixtures (valid/invalid), plus 413/503/health/session create matrix. No live Kafka by default.
```

### Motivation

```text
G2 requires FastAPI to accept valid batches, reject invalid payloads, and make retryable failures explicit. Shared fixtures must be exercised end-to-end over HTTP so schema drift is caught before the gate review (T2.8).
```

### Tiêu chí nghiệm thu

* [x] Valid telemetry batch fixture → 202 with `accepted`, `batchSequence`, `eventCount`
* [x] Invalid fixtures → 400 error envelope with `retryable: false`
* [x] Oversized body → 413
* [x] Producer failure → 503 with `retryable: true`
* [x] Create session fixture → 200
* [x] Health → 200
* [x] Live Kafka optional integration marked and skipped by default
* [x] ruff / mypy / pytest PASS; no commit
* [x] Không có thay đổi ngoài phạm vi.
* [x] Các validation liên quan pass hoặc lỗi còn lại được giải thích.

### Ngoài scope

* Playwright / frontend e2e
* Live Kafka broker tests (except skipped optional mark)
* Changing production route behavior unless a contract gap forces a fix
* G2 gate review package (T2.8)

---

## 4. Bối cảnh phase

### Task đã có trong phase

| Task          | Status     | Relationship                            |
| ------------- | ---------- | --------------------------------------- |
| `task001-fastapi-ingestion-route-package.md` | `DONE` | `RELATED` — health + create_app |
| `task002-pydantic-telemetry-models.md` | `DONE` | `DEPENDENCY` — batch models |
| `task003-session-lifecycle-endpoints.md` | `DONE` | `RELATED` — create session |
| `task004-batch-ingestion-endpoint.md` | `DONE` | `DEPENDENCY` — batch 202/400 |
| `task005-kafka-producer-service.md` | `DONE` | `RELATED` — producer doubles |
| `task006-backpressure-error-idempotency.md` | `DONE` | `DEPENDENCY` — error envelope / 413 / 503 |
| `task007-api-contract-tests.md` | `DONE` | `CURRENT` |

### Task liên quan trước đó

* **Task:** `documents/phases/phase2/task006-backpressure-error-idempotency.md`
* **Outcome:** Error envelope, 413, 503, idempotency; suite at 47 tests
* **Decisions inherited:**

  * Error body `{ error: { code, message, retryable } }`
  * Inject Recording / failing producer via `create_app`
  * No live Kafka in default unit suite

### Phụ thuộc của task

* T2.2 / T2.4 batch validation + accept
* T2.6 error mapping
* `contracts/fixtures` from T0.8

### Kiểm tra trùng lặp

* **Equivalent task already exists:** `NO`
* **Overlapping task:** `test_events_batch_route.py`, `test_error_mapping.py` (partial coverage)
* **Quyết định:** `CREATE NEW`
* **Lý do:**

```text
T2.7 is the TRACKING contract-matrix task. Existing route/error tests cover pieces; this task consolidates fixture-driven HTTP matrix for G2 evidence.
```

---

## 5. Trạng thái project ban đầu

### Trạng thái Git

* **Current branch:** `main`
* **Current commit:** `7183ae84360191c88a578d9cebcbdcad1a6f68e1`
* **Working tree:** `DIRTY`

### File đã sửa từ trước

* Uncommitted T2.3–T2.6: sessions, batch, Kafka producer, error/idempotency, tests, TRACKING, plans

### File chưa track từ trước

* `documents/phases/phase2/task003-*.md` … `task006-*.md`
* `ingestion-api/app/schemas/`, `app/services/`, `app/api/errors.py`
* Related test modules for T2.3–T2.6

### Tóm tắt diff đã có

```text
T2.3–T2.6 implemented on working tree (not committed). Do not revert; add contract tests only.
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
| `uv run pytest --collect-only` | `PASS` | 47 collected |

### Kiến trúc quan sát được

* **Relevant module:** `ingestion-api/app/main.py`, routes, fixtures under `contracts/fixtures`
* **Current responsibility owner:** ASGI app + producer injection
* **Entry point:** `create_app` → httpx `ASGITransport`

### Data flow hiện tại

```text
Fixture JSON → httpx ASGI → FastAPI routes → Recording/failing producer → status + body asserts
```

### Rủi ro hiện có

* Invalid *event* fixtures need wrapping into batch envelopes for `/events/batch`
* Duplicate coverage with existing route tests is acceptable for G2 evidence

---

## 6. Related Files

| File     | Current Responsibility | Why Relevant | Planned Action                    |
| -------- | ---------------------- | ------------ | --------------------------------- |
| `ingestion-api/tests/test_api_contracts.py` | — | G2 contract matrix | `CREATE` |
| `ingestion-api/tests/support/contracts.py` | — | Shared fixture/helpers | `CREATE` |
| `contracts/fixtures/**` | Shared JSON | Drive tests | `REUSE` |
| `documents/TRACKING.md` | Progress | T2.7 status | `MODIFY` |
| `ingestion-api/pyproject.toml` | pytest config | Optional integration marker | `MODIFY` (light) |

---

## 7. Tìm kiếm code hiện có

### Searches Performed

| Search Term or Responsibility | Results                 |
| ----------------------------- | ----------------------- |
| `load_fixture` / fixtures path | `test_events_batch_route.py`, `test_error_mapping.py`, `test_sessions_routes.py` |
| `RecordingTelemetryProducer` / `ProducerUnavailableError` | `telemetry_producer.py`, error tests |
| `pytest.mark.integration` | none yet |

### Implementation hiện có liên quan

* Batch / error / session route tests
  Location: `tests/test_*`
  Responsibility: Partial HTTP coverage without full invalid-fixture matrix

### Quyết định triển khai

* **Quyết định:** `CREATE` contract test module + small support helpers; register skipped integration marker
* **Target:** `tests/test_api_contracts.py`, `tests/support/`
* **Lý do:**

```text
Locked T2.7 file list. Reuse fixtures and producer fakes; no production changes expected.
```

### Creation Justification

* **REUSE không phù hợp vì:** Existing tests do not cover full invalid fixture matrix as G2 evidence
* **EXTEND không phù hợp vì:** Dedicated contract module keeps gate evidence clear
* **Responsibility mới là:** Fixture-driven HTTP contract matrix
* **Người dùng dự kiến:** pytest / T2.8 gate review
* **Public or internal:** INTERNAL tests

---

## 8. Kế hoạch triển khai

* [x] **Step 1:** Mark TRACKING T2.7 IN_PROGRESS; scaffold task file

  * Files: TRACKING, task007
  * Kết quả kỳ vọng: Status IN_PROGRESS
  * Validation: file exists

* [x] **Step 2:** Add support helpers + contract tests (matrix + skipped integration)

  * Files: `tests/support/`, `tests/test_api_contracts.py`, pyproject marker
  * Kết quả kỳ vọng: New tests pass; suite green
  * Validation: `uv run pytest`

* [x] **Step 3:** Close task — ruff/mypy/pytest; TRACKING DONE

  * Files: TRACKING, task007
  * Kết quả kỳ vọng: T2.7 DONE; P2 7/8
  * Validation: full suite PASS

---

## 9. Work Log

### `[2026-07-24 05:32]` — Khởi tạo task

* **Status:** `DISCOVERY`

* **Action:**

  * Copied task template.
  * Copied original request.
  * Inspected T2.3–T2.6 deliverables and fixtures.
  * Baseline: 47 pytest collected; dirty tree preserved.

* **Files inspected:**

  * TRACKING, task006, fixtures README, batch/error/session tests, telemetry_producer

* **Kết quả:**

  * Ready to add fixture-driven contract tests without touching production routes.

* **Next verified action:**

  * Write `tests/support` helpers and `test_api_contracts.py`.

### `[2026-07-24 05:33]` — Contract matrix tests

* **Status:** `IN_PROGRESS`

* **Action:**

  * CREATE `tests/support/contracts.py` helpers (`load_fixture`, `wrap_event_in_batch`, `assert_error_envelope`).
  * CREATE `tests/test_api_contracts.py` covering minimum G2 matrix + all valid/invalid fixtures.
  * Register `integration` marker; skip live Kafka by default.
  * Fix ruff SIM108 ternary in invalid-fixture payload selection.

* **Files changed:**

  * `ingestion-api/tests/support/__init__.py`
  * `ingestion-api/tests/support/contracts.py`
  * `ingestion-api/tests/__init__.py`
  * `ingestion-api/tests/test_api_contracts.py`
  * `ingestion-api/pyproject.toml`

* **Symbols changed:**

  * `load_fixture`, `wrap_event_in_batch`, `assert_error_envelope`
  * Contract test functions + `_UnavailableProducer`

* **Kết quả:**

  * 13 contract tests passed, 1 integration skipped; full suite 60 passed, 1 skipped

* **Validation:**

  * `uv run ruff check .` → `PASS`
  * `uv run mypy app` → `PASS` (19 files)
  * `uv run pytest` → `PASS` (60 passed, 1 skipped)

* **Quyết định hoặc phát hiện:**

  * Single-event invalid fixtures must be wrapped into batch bodies for `/events/batch`

* **Next verified action:**

  * Mark DONE; update TRACKING

### `[2026-07-24 05:34]` — Close task

* **Status:** `DONE`

* **Action:**

  * TRACKING T2.7 DONE; P2 7/8; total 29/52
  * Final summary filled

* **Validation:**

  * Final suite PASS (60 passed, 1 skipped)

* **Next verified action:**

  * T2.8 P2 gate review package

---

## 10. Thay đổi

### Added Files

#### `ingestion-api/tests/support/contracts.py`

* **Mục đích:** Shared fixture load / batch wrap / error envelope asserts
* **Why required:** Keep contract tests DRY and fixture-path consistent
* **Used by:** `tests/test_api_contracts.py`
* **Visibility:** `INTERNAL`

#### `ingestion-api/tests/support/__init__.py` / `tests/__init__.py`

* **Mục đích:** Package markers for `tests.support` imports
* **Why required:** Import path under pytest `pythonpath = ["."]`
* **Used by:** contract tests
* **Visibility:** `INTERNAL`

#### `ingestion-api/tests/test_api_contracts.py`

* **Mục đích:** G2 HTTP contract matrix via httpx ASGI + shared fixtures
* **Why required:** T2.7 acceptance / gate evidence
* **Used by:** pytest
* **Visibility:** `INTERNAL`

#### `documents/phases/phase2/task007-api-contract-tests.md`

* **Mục đích:** Task file for T2.7
* **Why required:** AGENTS.md process
* **Used by:** agents / tracking
* **Visibility:** `INTERNAL`

### Modified Files

#### `ingestion-api/pyproject.toml`

* **Previous responsibility:** pytest asyncio / paths
* **Changes made:** Register `integration` marker
* **Lý do:** Avoid unknown-marker warnings for skipped live Kafka test
* **Behavioral impact:** none on default suite
* **Compatibility impact:** none

#### `documents/TRACKING.md`

* **Previous responsibility:** Progress
* **Changes made:** T2.7 DONE; P2 7/8; total 29/52
* **Lý do:** AGENTS closeout
* **Behavioral impact:** docs only
* **Compatibility impact:** none

### Deleted Files

#### N/A

---

## 11. Thay đổi symbol

### Added Symbols

#### `load_fixture` / `wrap_event_in_batch` / `assert_error_envelope`

* **Location:** `ingestion-api/tests/support/contracts.py`
* **Type:** `FUNCTION`
* **Responsibility:** Fixture I/O and contract assertions
* **Inputs:** fixture parts / event dict / response body
* **Outputs:** JSON / batch body / assertions
* **State mutation:** none
* **Lifetime:** test
* **Used by:** `test_api_contracts.py`
* **Visibility:** `INTERNAL`

#### `_UnavailableProducer`

* **Location:** `ingestion-api/tests/test_api_contracts.py`
* **Type:** `CLASS`
* **Responsibility:** Raise `ProducerUnavailableError` for 503 contract
* **Inputs:** batch
* **Outputs:** raises
* **State mutation:** none
* **Lifetime:** test
* **Used by:** producer-failure contract test
* **Visibility:** `INTERNAL`

### Modified Symbols

#### N/A (production symbols unchanged)

### Removed Symbols

#### N/A

---

## 12. Validation

### Validation tập trung

| Command     | Kết quả | Bằng chứng hoặc ghi chú |
| ----------- | ------- | ----------------- |
| baseline collect | `PASS` | 47 collected |
| contract module | `PASS` | 13 passed, 1 skipped |
| full suite | `PASS` | 60 passed, 1 skipped |

### Validation cuối

| Check             | Kết quả | Ghi chú   |
| ----------------- | ------- | --------- |
| Unit tests        | `PASS` | 60 passed, 1 skipped |
| Integration tests | `SKIPPED` | live Kafka marked + skipped |
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
Live Kafka broker integration (intentionally skipped).
```

---

## 13. Discovered Issues

### N/A

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
T2.8 — P2 gate review package (G2).
```

---

## 15. Tổng kết cuối

* **Final Status:** `DONE`
* **Completed At:** `2026-07-24 05:34`

### Outcome

```text
HTTP contract suite proves G2 matrix from shared fixtures: valid batch 202, invalid 400 envelopes, oversized 413, producer failure 503 retryable, create session 200, health 200. Live Kafka integration marked and skipped by default.
```

### Kết quả tiêu chí nghiệm thu

* [x] Full minimum matrix covered
* [x] All valid/invalid fixtures reused
* [x] Validation PASS (60 passed, 1 skipped); no commit

### File đã thay đổi

* `ingestion-api/tests/test_api_contracts.py` — contract matrix
* `ingestion-api/tests/support/contracts.py` — helpers
* `ingestion-api/tests/support/__init__.py`, `tests/__init__.py`
* `ingestion-api/pyproject.toml` — integration marker
* docs: task007, TRACKING

### Thay đổi hành vi chính

* None in production; tests only

### Kết quả validation

* **Tests:** `PASS` (60 passed, 1 skipped)
* **Lint:** `PASS`
* **Type-check:** `PASS`
* **Build:** `NOT RUN`

### Việc còn lại

* None for T2.7

### Giới hạn đã biết

* Live Kafka opt-in not implemented beyond skipped placeholder

### Task tiếp theo

* T2.8 P2 gate review package

### Commit message gợi ý

```text
test(api): add HTTP contract matrix from shared fixtures
```
