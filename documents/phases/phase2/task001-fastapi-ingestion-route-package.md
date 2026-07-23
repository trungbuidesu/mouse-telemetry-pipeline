# Task: FastAPI ingestion route package and health baseline

## 1. Thông tin task

* **Task ID:** `phase2-task001`
* **Task Name:** `FastAPI ingestion route package and health baseline`
* **Phase:** `phase2`
* **Status:** `DONE`
* **Started At:** `2026-07-24 02:28`
* **Last Updated:** `2026-07-24 02:35`
* **Completed At:** `2026-07-24 02:35`
* **Branch:** `main`
* **Base Commit:** `25747d5`
* **Task File:** `documents/phases/phase2/task001-fastapi-ingestion-route-package.md`

---

## 2. Yêu cầu gốc

> T2.1 FastAPI Route Package + Health Baseline
>
> Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.
>
> To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.
>
> Scope confirmed: Routes + health + Kafka settings typed (`kafka_bootstrap_servers` / `kafka_topic` in Settings + `.env.example`, chưa producer) — khớp plan001 Step 1.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Scaffold app/api/routes package, keep GET /health as reviewed baseline via dedicated router, and add typed Kafka settings without producer or ingestion endpoints.
```

### Tiêu chí nghiệm thu

* [x] Phase2 task file exists and is updated through DONE.
* [x] `app/api/routes/{health,sessions,events}.py` exist; sessions/events have no handlers.
* [x] `GET /health` still returns 200 with `{status, service, version, environment}`.
* [x] `Settings` exposes `kafka_bootstrap_servers` and `kafka_topic` with DEC-005 defaults; `.env.example` documents them.
* [x] No producer, no batch/session business endpoints, no analytics in request path.
* [x] `uv run ruff check .`, `uv run mypy app`, `uv run pytest` pass.
* [x] TRACKING T2.1 marked DONE with task file path.
* [x] Không có thay đổi ngoài phạm vi.

### Ngoài scope

* Pydantic telemetry models (T2.2)
* Session create/complete/metrics endpoints (T2.3)
* `POST /api/v1/events/batch` (T2.4)
* Kafka producer service (T2.5)
* Backpressure / idempotency (T2.6)
* Contract fixture API tests (T2.7)
* CORS middleware wiring
* Stub 501 endpoints

---

## 4. Bối cảnh phase

| Task | Status | Relationship |
| ---- | ------ | ------------ |
| None (first phase2 task) | — | NONE |

* **Dependency:** T0.6 create_app + health; T0.7/T0.8 contracts DONE; G1 PASSED
* **Decisions:** DEC-012, DEC-013, DEC-005

---

## 8. Kế hoạch triển khai

* [x] **Step 1:** Typed Kafka settings + `.env.example` + config test
* [x] **Step 2:** Create route package; move health; empty sessions/events; wire `create_app`
* [x] **Step 3:** Health/router tests; ruff/mypy/pytest
* [x] **Step 4:** TRACKING + plan001 + environment_setup; close task DONE

---

## 9. Work Log

### `[2026-07-24 02:28]` — Khởi tạo task

* **Status:** `IN_PROGRESS`
* **Action:** Created task001; baseline ruff/mypy/pytest PASS (3); T2.1 IN_PROGRESS
* **Next verified action:** Kafka settings

### `[2026-07-24 02:30]` — Kafka settings

* **Action:** EXTEND Settings + `.env.example` + `tests/test_config.py`
* **Files changed:** `app/core/config.py`, `.env.example`, `tests/test_config.py`

### `[2026-07-24 02:32]` — Route package

* **Action:** CREATE `app/api` package; move health via `build_health_router`; empty sessions/events; wire `create_app`
* **Files changed:** `app/main.py`, `app/api/**`

### `[2026-07-24 02:34]` — Validation

* **Validation:** `uv run ruff check .` → PASS; `uv run mypy app` → PASS; `uv run pytest -q` → 6 passed
* **Note:** OpenAPI-based mount assertion (empty routers expose no paths)

### `[2026-07-24 02:35]` — Close task

* **Status:** `DONE`
* **Action:** TRACKING 1/8; plan001 Step 1 checked; environment_setup Kafka note updated
* **Next verified action:** T2.2 Pydantic telemetry models

### `[2026-07-24 02:32]` — Commit

* **Status:** `DONE`
* **Action:** Stage T2.1 API route package + Kafka settings + docs; exclude unrelated `frontend/src/hooks/useAimTrainer.ts`
* **Validation:** `uv run ruff check .` → PASS; `uv run mypy app` → PASS; `uv run pytest -q` → 6 passed
* **Next verified action:** T2.2 Pydantic telemetry models

---

## 10. Thay đổi

### Added

* `ingestion-api/app/api/__init__.py`
* `ingestion-api/app/api/router.py` — `build_api_router`
* `ingestion-api/app/api/routes/__init__.py`
* `ingestion-api/app/api/routes/health.py` — `HealthResponse`, `build_health_router`
* `ingestion-api/app/api/routes/sessions.py` — empty `/sessions` router
* `ingestion-api/app/api/routes/events.py` — empty `/events` router
* `ingestion-api/tests/test_config.py`
* `documents/phases/phase2/task001-fastapi-ingestion-route-package.md`

### Modified

* `ingestion-api/app/main.py` — include `build_api_router`; remove inline health
* `ingestion-api/app/core/config.py` — `kafka_bootstrap_servers`, `kafka_topic`
* `ingestion-api/.env.example` — active Kafka env keys
* `ingestion-api/tests/test_health.py` — OpenAPI mount smoke
* `documents/TRACKING.md` — T2.1 DONE; P2 1/8
* `documents/environment_setup.md` — typed Kafka settings note
* `documents/plans/phase2/plan001-fastapi-ingestion-contract.md` — Step 1 done

### Not touched

* `frontend/src/hooks/useAimTrainer.ts` (pre-existing dirty WIP)

---

## 11. Thay đổi symbol

### Added

* `build_health_router(settings: Settings) -> APIRouter`
* `build_api_router(settings: Settings) -> APIRouter`
* `Settings.kafka_bootstrap_servers`, `Settings.kafka_topic`

### Moved

* `HealthResponse` from `app.main` → `app.api.routes.health`

---

## 12. Validation

| Command | Kết quả | Ghi chú |
| ------- | ------- | ------- |
| `uv run ruff check .` | `PASS` | final |
| `uv run mypy app` | `PASS` | 10 source files |
| `uv run pytest -q` | `PASS` | 6 passed |

### Diff Review

* [x] Chỉ các file thuộc phạm vi bị thay đổi (plus docs).
* [x] Không có debug code.
* [x] Không có producer / session / batch endpoints.
* [x] Empty routers do not advertise OpenAPI ingestion paths.

---

## 15. Tổng kết cuối

* **Final Status:** `DONE`
* **Completed At:** `2026-07-24 02:35`

### Outcome

```text
Phase2 route package exists with GET /health baseline and typed Kafka settings; sessions/events routers are empty placeholders for T2.3/T2.4.
```

### File đã thay đổi

* See section 10

### Kết quả validation

* **Tests:** `PASS`
* **Lint:** `PASS`
* **Type-check:** `PASS`

### Việc còn lại

* None for T2.1

### Task tiếp theo

* T2.2 Pydantic telemetry models

### Commit message gợi ý

```text
feat(api): scaffold route package and typed Kafka settings (T2.1)
```
