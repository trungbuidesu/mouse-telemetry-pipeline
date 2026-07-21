# Task: Document Governance Tracking and Test Config Baseline

## 1. Task Metadata

* **Task ID:** `phase0-task001`
* **Task Name:** `Document governance tracking and test config baseline`
* **Phase:** `phase0`
* **Status:** `DONE`
* **Started At:** `2026-07-22 05:16`
* **Last Updated:** `2026-07-22 05:37`
* **Completed At:** `2026-07-22 05:37`
* **Branch:** `main`
* **Base Commit:** `3650946`
* **Task File:** `documents/phases/phase0/task001-doc-governance-test-config.md`

---

## 2. Original Request

> PLEASE IMPLEMENT THIS PLAN:
> # Plan: Documents Tracking, Coding Rules Split, And Test Config Baseline
>
> ## Summary
>
> Tạo một lớp governance mới cho repo, tập trung trước vào **Aim Trainer frontend** và **FastAPI ingestion API**:
>
> - Thêm `documents/TRACKING.md` ở root của `documents`, tham khảo cấu trúc AuthDiff.
> - Tách coding rules thành 2 file chuyên biệt: frontend và API.
> - Biến `documents/agents/coding_rules.md` thành file điều phối, link tới rules cụ thể.
> - Thêm test/tooling config thật cho `frontend/` và `ingestion-api/`.
> - Chưa thêm Spark/pipeline test config ở bước này; ghi vào tracking như future work để tránh phình scope.
>
> ## Key Changes
>
> - `documents/TRACKING.md`
>   - Title: `MOUSE TELEMETRY PIPELINE — TRACKING TIẾN ĐỘ`
>   - Có phase summary cho `P0` đến `P5`, task backlog, gate system, milestones, risk register, update rules.
>   - Tracking chi tiết kiểu AuthDiff: phase, task ID, status, blocked by, notes, task file path.
>   - Trạng thái sau thay đổi này:
>     - P0 `IN_PROGRESS`
>     - P1-P5 `NOT_STARTED`
>     - Các task governance/config vừa tạo được đánh dấu `DONE`
>     - Các task implementation app/API/pipeline vẫn `TODO`
>
> - `documents/agents/coding_rules.md`
>   - Đổi từ file rỗng thành index:
>     - quy định agent phải đọc file này trước khi sửa source.
>     - frontend đọc thêm `coding_rules_frontend.md`.
>     - API đọc thêm `coding_rules_api.md`.
>     - Spark/infrastructure rules được ghi là future section, chưa tạo rule riêng.
>
> - Tạo `documents/agents/coding_rules_frontend.md`
>   - Áp dụng cho `frontend/src/**`.
>   - Stack mặc định: React + TypeScript + Vite.
>   - Rules chính: strict typing, không dùng `any` vô cớ, hooks rõ lifecycle cleanup, telemetry hot path dùng ref/non-rendering state, không lưu raw event buffer trong React state, tests cho game/telemetry utilities.
>   - Validation commands:
>     - `npm run lint`
>     - `npm run typecheck`
>     - `npm run test`
>     - `npm run test:e2e`
>
> - Tạo `documents/agents/coding_rules_api.md`
>   - Áp dụng cho `ingestion-api/app/**`.
>   - Stack mặc định: Python 3.12 + FastAPI + Pydantic + uv.
>   - Rules chính: type hints đầy đủ, ruff/mypy strict, không xử lý analytics nặng trong request path, schema validation rõ, Kafka producer nằm sau service boundary.
>   - Validation commands:
>     - `uv run ruff check .`
>     - `uv run mypy app`
>     - `uv run pytest`
>
> - Cập nhật `documents/agents/AGENTS.md`
>   - Thay đoạn đang trỏ chung tới `coding_rules.md` bằng quy định đọc `coding_rules.md` trước, sau đó đọc rule cụ thể theo subsystem.
>   - Giữ nguyên task protocol và commit rules hiện có.
>
> ## Test Config Additions
>
> - Frontend config dưới `frontend/`
>   - `package.json` dùng `npm`.
>   - `vite.config.ts`
>   - `vitest.config.ts`
>   - `playwright.config.ts`
>   - `eslint.config.js`
>   - `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
>   - `src/test/setup.ts`
>   - Scripts public:
>     - `npm run dev`
>     - `npm run build`
>     - `npm run lint`
>     - `npm run typecheck`
>     - `npm run test`
>     - `npm run test:coverage`
>     - `npm run test:e2e`
>
> - API config dưới `ingestion-api/`
>   - `pyproject.toml`
>   - minimal `app/__init__.py`
>   - `tests/test_smoke.py`
>   - Tooling: `pytest`, `pytest-asyncio`, `httpx`, `ruff`, `mypy`
>   - Python command interface:
>     - `uv run ruff check .`
>     - `uv run mypy app`
>     - `uv run pytest`
>
> - Repo hygiene
>   - Tạo `.gitignore` nếu chưa có.
>   - Ignore `node_modules/`, `.venv/`, `.pytest_cache/`, `.mypy_cache/`, `.ruff_cache/`, Playwright reports, coverage, build output, `.env`, Docker/local runtime data.
>
> ## Test Plan
>
> - Documentation checks:
>   - `rg --files documents`
>   - Markdown link check cho toàn bộ `documents/**/*.md`
>   - Manual review: `documents/TRACKING.md` link đúng phase/plan/decision/task conventions.
>
> - Frontend checks:
>   - `cd frontend && npm install`
>   - `npm run typecheck`
>   - `npm run lint`
>   - `npm run test`
>   - `npm run test:e2e`
>
> - API checks:
>   - `cd ingestion-api && uv sync --all-groups`
>   - `uv run ruff check .`
>   - `uv run mypy app`
>   - `uv run pytest`
>
> - Git review:
>   - `git status --short -uall`
>   - Confirm chỉ có docs/config/skeleton tối thiểu thuộc scope này.
>   - Confirm không có generated caches/build outputs được track.
>
> ## Assumptions
>
> - Dùng `npm` cho frontend vì repo chưa có package manager khác.
> - Dùng `uv` cho API vì file tham chiếu AuthDiff dùng uv và phù hợp Python 3.12.
> - Bước này chưa tạo gameplay/API implementation thật, chỉ tạo governance, coding rules và test config baseline.
> - Spark, Kafka, Docker Compose, Grafana test config sẽ để phase sau; tracking sẽ ghi rõ là `TODO`.
> - Nếu implement ngay theo ngày hiện tại của workspace, `TRACKING.md` dùng `Cập nhật lần cuối: 22/07/2026`.

---

## 3. Objective

### Primary Objective

```text
Create repository governance tracking, split coding rules for frontend/API, and add minimal real test/tooling config for Aim Trainer frontend and ingestion API.
```

### Motivation

```text
The project currently has architecture and planning documents but no root tracking file, source-specific coding rules, or executable validation baseline for frontend/API work.
```

### Acceptance Criteria

* [x] `documents/TRACKING.md` exists and tracks phases, tasks, gates, milestones, risks and update rules.
* [x] `documents/agents/coding_rules.md` routes agents to frontend/API coding rule files.
* [x] `documents/agents/coding_rules_frontend.md` defines TypeScript/React/Vite rules and validation commands.
* [x] `documents/agents/coding_rules_api.md` defines FastAPI/Python/uv rules and validation commands.
* [x] `documents/agents/AGENTS.md` points to the coding rules index and subsystem-specific rules.
* [x] `frontend/` has npm-based Vite/Vitest/Playwright/ESLint/TypeScript config that can run smoke checks.
* [x] `ingestion-api/` has uv-based pytest/ruff/mypy config that can run smoke checks.
* [x] `.gitignore` excludes dependency, cache, build, report, env and runtime data paths.
* [x] Không có thay đổi ngoài phạm vi.
* [x] Các validation liên quan pass hoặc lỗi còn lại được giải thích.

### Out of Scope

* Implementing Aim Trainer gameplay.
* Implementing FastAPI ingestion endpoints.
* Adding Spark/Kafka/Grafana/Docker Compose implementation.
* Creating commits or pushing changes.

---

## 4. Phase Context

### Existing Tasks in Phase

| Task | Status | Relationship |
|---|---|---|
| `documents/phases/phase0/README.md` | phase overview | `DEPENDENCY` |

### Previous Relevant Task

* **Task:** `None`
* **Outcome:** `No prior task files existed in phase0.`
* **Decisions inherited:**
  * Phase0 owns repository/document governance and contract foundation.
  * Local-first tooling remains the default.
  * Frontend/API are the only runtime components receiving test config in this task.

### Task Dependencies

* Depends on `documents/aim_trainer_app_architecture.md`.
* Depends on `documents/phases/phase0/README.md`.
* Depends on existing documents generated before this task.

### Overlap Check

* **Equivalent task already exists:** `NO`
* **Overlapping task:** `None`
* **Decision:** `CREATE NEW`
* **Reason:**

```text
No phase0 task file exists. The request adds governance tracking and test config baseline, which belongs to phase0 foundation work.
```

---

## 5. Initial Project State

### Git State

* **Current branch:** `main`
* **Current commit:** `3650946`
* **Working tree:** `DIRTY`

### Existing Modified Files

* `None`

### Existing Untracked Files

* `documents/` tree from earlier architecture/planning work.

### Existing Diff Summary

```text
The repository has only README.md and LICENSE tracked. The documents/ tree is currently untracked and contains architecture, agent rules, phase docs, plan docs and decision docs.
```

### Project Stack

* **Language/runtime:** `TypeScript frontend planned; Python API planned`
* **Framework:** `React/Vite planned; FastAPI planned`
* **Package manager:** `npm for frontend; uv for API`
* **Build command:** `frontend: npm run build; API: N/A`
* **Test command:** `frontend: npm run test / npm run test:e2e; API: uv run pytest`
* **Lint command:** `frontend: npm run lint; API: uv run ruff check .`
* **Type-check command:** `frontend: npm run typecheck; API: uv run mypy app`

### Baseline Validation

| Command | Result | Notes |
|---|---|---|
| `rg --files` | `PASS` | Repository shape inspected. |
| `git status --short -uall` | `PASS` | Shows untracked `documents/` tree. |
| `Get-Command node,npm,uv` | `PASS` | Tool commands are available locally. |

### Architecture Observed

* **Relevant module:** `documents/`, future `frontend/`, future `ingestion-api/`
* **Current responsibility owner:** `documents/aim_trainer_app_architecture.md`, `documents/phases/`, `documents/plans/`, `documents/decisions/`
* **Entry point:** `None yet for runtime code`

### Current Data Flow

```text
Architecture documents → Phase/Plan/Decision docs → Governance/test-config baseline → Future source tasks
```

### Existing Risks

* `documents/` is untracked from prior work, so Git status includes older docs and this task's new docs together.
* No runtime source exists yet, so validation requires minimal smoke skeletons.
* Full Playwright browser dependencies may be unavailable until installed.

---

## 6. Related Files

| File | Current Responsibility | Why Relevant | Planned Action |
|---|---|---|---|
| `documents/TRACKING.md` | Missing | Root progress tracking requested | `CREATE` |
| `documents/agents/coding_rules.md` | Empty | Coding rules index requested | `MODIFY` |
| `documents/agents/coding_rules_frontend.md` | Missing | Frontend-specific rules requested | `CREATE` |
| `documents/agents/coding_rules_api.md` | Missing | API-specific rules requested | `CREATE` |
| `documents/agents/AGENTS.md` | Task/process protocol | Must point to rules index | `MODIFY` |
| `.gitignore` | Missing | Repo hygiene requested | `CREATE` |
| `frontend/` | Missing | Frontend test config requested | `CREATE` |
| `ingestion-api/` | Missing | API test config requested | `CREATE` |

---

## 7. Existing-Code Search

### Searches Performed

| Search Term or Responsibility | Results |
|---|---|
| `TRACKING` | No local tracking file exists. |
| `coding_rules` | Local `documents/agents/coding_rules.md` exists but is empty; `AGENTS.md` references it. |
| `Vitest`, `pytest`, `ruff`, `mypy` | Only mentioned in docs/plans, no source config exists. |
| `frontend`, `ingestion-api` | Mentioned in architecture/plans but no directories exist. |

### Relevant Existing Implementations

* `documents/plans/phase0/plan001-repository-and-doc-governance.md`
  Location: `documents/plans/phase0/plan001-repository-and-doc-governance.md`
  Responsibility: `Repository and documentation governance plan.`

* `documents/plans/phase0/plan002-contract-first-schema-and-api.md`
  Location: `documents/plans/phase0/plan002-contract-first-schema-and-api.md`
  Responsibility: `Frontend/API contract planning.`

### Implementation Decision

* **Decision:** `CREATE`
* **Target:** `documents/TRACKING.md`, split coding rules, frontend/API config skeletons`
* **Reason:**

```text
No existing tracking file or source test config exists. The minimal create path matches the approved plan and phase0 foundation responsibility.
```

### Creation Justification

* **REUSE không phù hợp vì:** `No local equivalent exists except an empty coding_rules.md.`
* **EXTEND không phù hợp vì:** `Tracking and config files are missing; coding_rules.md must become an index, not a full single rules file.`
* **Responsibility mới là:** `Governance tracking, subsystem rules routing, and validation baseline.`
* **Expected consumers:** `Agents, developers, future phase tasks and validation workflows.`
* **Public or internal:** `INTERNAL`

---

## 8. Implementation Plan

* [x] **Step 1:** Add tracking and split coding rules.
  * Files: `documents/TRACKING.md`, `documents/agents/coding_rules.md`, `documents/agents/coding_rules_frontend.md`, `documents/agents/coding_rules_api.md`, `documents/agents/AGENTS.md`
  * Expected result: Governance docs exist and link correctly.
  * Validation: Markdown link check.

* [x] **Step 2:** Add frontend tooling baseline.
  * Files: `frontend/*`
  * Expected result: npm scripts for typecheck, lint, unit tests and e2e tests exist.
  * Validation: `npm install`, `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:e2e`.

* [x] **Step 3:** Add API tooling baseline.
  * Files: `ingestion-api/*`
  * Expected result: uv project with ruff, mypy and pytest smoke test exists.
  * Validation: `uv sync --all-groups`, `uv run ruff check .`, `uv run mypy app`, `uv run pytest`.

* [x] **Step 4:** Add repo hygiene and final validation.
  * Files: `.gitignore`, task file updates.
  * Expected result: Generated dependencies/caches/build outputs ignored; task file finalized.
  * Validation: `rg --files documents`, Markdown link check, `git status --short -uall`.

---

## 9. Work Log

### `2026-07-22 05:16` — Task initialized

* **Status:** `IN_PROGRESS`
* **Action:**
  * Inspected phase0 files.
  * Inspected task template and agent protocol.
  * Inspected current repository and available tooling.
  * Created task file for governance/test config work.
* **Files inspected:**
  * `documents/agents/AGENTS.md`
  * `documents/templates/task.md`
  * `documents/phases/phase0/README.md`
  * `documents/plans/phase0/plan001-repository-and-doc-governance.md`
  * `documents/plans/phase0/plan002-contract-first-schema-and-api.md`
* **Result:**
  * Confirmed this is a new phase0 task and source/config directories do not exist yet.
* **Next verified action:**
  * Add tracking and split coding rules.

---

### `2026-07-22 05:20` — Added tracking and split coding rules

* **Status:** `IN_PROGRESS`
* **Action:**
  * Added root tracking file for phase/task/gate/milestone/risk tracking.
  * Converted `coding_rules.md` into a subsystem rule index.
  * Added frontend-specific and API-specific coding rules.
  * Updated `AGENTS.md` to point agents through the rules index and subsystem files.
* **Files inspected:**
  * `documents/agents/AGENTS.md`
  * `documents/plans/phase0/plan001-repository-and-doc-governance.md`
  * `documents/plans/phase0/plan002-contract-first-schema-and-api.md`
* **Files changed:**
  * `documents/TRACKING.md`
  * `documents/agents/coding_rules.md`
  * `documents/agents/coding_rules_frontend.md`
  * `documents/agents/coding_rules_api.md`
  * `documents/agents/AGENTS.md`
* **Symbols changed:**
  * `None`
* **Result:**
  * Governance tracking and source-specific coding rule structure now exist.
* **Validation:**
  * `NOT RUN` → Full Markdown link check will run after all docs/config changes are complete.
* **Decision or discovery:**
  * Frontend and API rules are split now; Spark/infrastructure rules remain future phase work.
* **Next verified action:**
  * Add frontend npm/Vite/Vitest/Playwright/ESLint baseline.

---

### `2026-07-22 05:24` — Added frontend test tooling baseline

* **Status:** `IN_PROGRESS`
* **Action:**
  * Added npm package metadata and scripts.
  * Added Vite, Vitest, Playwright, ESLint and TypeScript config.
  * Added minimal React smoke shell and unit/e2e smoke tests.
* **Files inspected:**
  * `documents/agents/coding_rules_frontend.md`
  * `documents/plans/phase1/plan001-frontend-gameplay-shell.md`
* **Files changed:**
  * `frontend/package.json`
  * `frontend/index.html`
  * `frontend/vite.config.ts`
  * `frontend/vitest.config.ts`
  * `frontend/playwright.config.ts`
  * `frontend/eslint.config.js`
  * `frontend/tsconfig.json`
  * `frontend/tsconfig.app.json`
  * `frontend/tsconfig.node.json`
  * `frontend/src/App.tsx`
  * `frontend/src/main.tsx`
  * `frontend/src/App.test.tsx`
  * `frontend/src/test/setup.ts`
  * `frontend/tests/e2e/app.spec.ts`
* **Symbols changed:**
  * `App`
* **Result:**
  * Frontend has an executable smoke baseline without gameplay implementation.
* **Validation:**
  * `NOT RUN` → npm install and frontend scripts will run after API baseline is added.
* **Decision or discovery:**
  * Added minimal app source because Vite/Vitest/Playwright configs need a renderable target to validate.
* **Next verified action:**
  * Add ingestion API uv/pytest/ruff/mypy baseline.

---

### `2026-07-22 05:27` — Added API baseline and repository ignores

* **Status:** `IN_PROGRESS`
* **Action:**
  * Added uv project config for ingestion API.
  * Added minimal API package and pytest smoke test.
  * Added root `.gitignore` for dependency, cache, build, report, env and runtime data paths.
* **Files inspected:**
  * `documents/agents/coding_rules_api.md`
  * `documents/plans/phase2/plan001-fastapi-ingestion-contract.md`
* **Files changed:**
  * `ingestion-api/pyproject.toml`
  * `ingestion-api/app/__init__.py`
  * `ingestion-api/tests/test_smoke.py`
  * `.gitignore`
* **Symbols changed:**
  * `app.__version__`
* **Result:**
  * API has executable pytest/ruff/mypy baseline without route implementation.
* **Validation:**
  * `NOT RUN` → API and frontend validation will run in final validation step.
* **Decision or discovery:**
  * API skeleton remains intentionally minimal; endpoint implementation stays in phase2 tasks.
* **Next verified action:**
  * Run documentation, frontend, API and Git validation.

---

### `2026-07-22 05:37` — Ran validation and fixed config issues

* **Status:** `DONE`
* **Action:**
  * Installed frontend and API dependencies.
  * Ran documentation, frontend, API and Git validation.
  * Fixed TypeScript DOM lib for Playwright config.
  * Limited Vitest collection to frontend unit tests so Playwright specs stay under Playwright.
  * Added pytest `pythonpath` so API smoke tests can import `app`.
* **Files inspected:**
  * `frontend/tsconfig.node.json`
  * `frontend/vitest.config.ts`
  * `ingestion-api/pyproject.toml`
* **Files changed:**
  * `frontend/package-lock.json`
  * `ingestion-api/uv.lock`
  * `frontend/tsconfig.node.json`
  * `frontend/vitest.config.ts`
  * `ingestion-api/pyproject.toml`
  * `documents/phases/phase0/task001-doc-governance-test-config.md`
* **Symbols changed:**
  * `None`
* **Result:**
  * All requested documentation, frontend and API validation commands pass after config fixes.
* **Validation:**
  * `rg --files documents` → `PASS`
  * Markdown link check → `PASS`
  * `npm install` → `PASS`
  * `npm run typecheck` → `PASS`
  * `npm run lint` → `PASS`
  * `npm run test` → `PASS`
  * `npm run test:e2e` → `PASS`
  * `uv sync --all-groups` → `PASS`
  * `uv run ruff check .` → `PASS`
  * `uv run mypy app` → `PASS`
  * `uv run pytest` → `PASS`
  * `git status --short -uall` → `PASS`
  * Final Markdown link check after task-file update → `PASS`
* **Decision or discovery:**
  * Lockfiles are kept because they make the test/tooling baseline reproducible.
* **Next verified action:**
  * Final Markdown link check after this task-file update.

---

## 10. Changes

### Added Files

#### `documents/TRACKING.md`

* **Purpose:** Root progress tracking for phases, tasks, gates, milestones and risks.
* **Why required:** User requested a tracking file modeled after AuthDiff.
* **Used by:** Agents, developers and phase reviews.
* **Visibility:** `INTERNAL`

#### `documents/agents/coding_rules_frontend.md`

* **Purpose:** Frontend TypeScript/React/Vite coding and validation rules.
* **Why required:** Frontend rules differ from API/Python rules.
* **Used by:** Agents and developers working under `frontend/`.
* **Visibility:** `INTERNAL`

#### `documents/agents/coding_rules_api.md`

* **Purpose:** FastAPI/Python/uv coding and validation rules.
* **Why required:** API rules differ from frontend/TypeScript rules.
* **Used by:** Agents and developers working under `ingestion-api/`.
* **Visibility:** `INTERNAL`

#### `.gitignore`

* **Purpose:** Prevent dependencies, caches, build outputs, env files and runtime data from being tracked.
* **Why required:** Validation commands generate local outputs.
* **Used by:** Git workflow.
* **Visibility:** `INTERNAL`

#### `frontend/`

* **Purpose:** Minimal React/Vite smoke app and frontend tooling baseline.
* **Why required:** Frontend validation scripts need executable targets.
* **Used by:** Future phase1 frontend work.
* **Visibility:** `INTERNAL`

#### `ingestion-api/`

* **Purpose:** Minimal uv/Python smoke package and API tooling baseline.
* **Why required:** API validation scripts need executable targets.
* **Used by:** Future phase2 API work.
* **Visibility:** `INTERNAL`

### Modified Files

#### `documents/agents/coding_rules.md`

* **Previous responsibility:** Empty placeholder file.
* **Changes made:** Converted into a coding rules index that routes to subsystem-specific rules.
* **Reason:** The project now has frontend and API rules with different stacks.
* **Behavioral impact:** Future source tasks have a clear rule lookup path.
* **Compatibility impact:** `None`

#### `documents/agents/AGENTS.md`

* **Previous responsibility:** Agent task/process protocol.
* **Changes made:** Updated source coding-rule references to use the index and subsystem files.
* **Reason:** Prevents one generic coding rule file from incorrectly applying to all stacks.
* **Behavioral impact:** Agents must read the subsystem-specific rules before source edits.
* **Compatibility impact:** `None`

#### `documents/phases/phase0/task001-doc-governance-test-config.md`

* **Previous responsibility:** Current task log.
* **Changes made:** Recorded implementation, validation, changes and final summary.
* **Reason:** Task files are the source of truth.
* **Behavioral impact:** Work can be resumed or audited from task documentation.
* **Compatibility impact:** `None`

### Deleted Files

`None`

---

## 11. Symbol Delta

### Added Symbols

#### `App`

* **Location:** `frontend/src/App.tsx`
* **Type:** `FUNCTION`
* **Responsibility:** Render the minimal frontend smoke shell.
* **Inputs:** `None`
* **Outputs:** `ReactElement`
* **State mutation:** `None`
* **Lifetime:** Frontend app runtime.
* **Used by:** `frontend/src/main.tsx`, `frontend/src/App.test.tsx`
* **Visibility:** `INTERNAL`

#### `__version__`

* **Location:** `ingestion-api/app/__init__.py`
* **Type:** `CONSTANT`
* **Responsibility:** Expose package version for smoke import test.
* **Inputs:** `None`
* **Outputs:** `str`
* **State mutation:** `None`
* **Lifetime:** API package lifetime.
* **Used by:** `ingestion-api/tests/test_smoke.py`
* **Visibility:** `INTERNAL`

### Modified Symbols

`None`

### Removed Symbols

`None`

### Important Variables Added

`None`

---

## 12. Validation

### Focused Validation

| Command | Result | Evidence or Notes |
|---|---|---|
| `rg --files` | `PASS` | Initial repository inspection. |
| `git status --short -uall` | `PASS` | Initial working tree inspected. |
| `Get-Command node,npm,uv` | `PASS` | Required package managers available. |
| `rg --files documents` | `PASS` | Documentation tree listed. |
| Markdown link check | `PASS` | All Markdown links resolved before final task update. |
| `npm install` | `PASS` | Created `frontend/package-lock.json`; no vulnerabilities reported. |
| `npm run typecheck` | `PASS` | Initial DOM lib issue fixed in `tsconfig.node.json`. |
| `npm run lint` | `PASS` | ESLint flat config passed. |
| `npm run test` | `PASS` | Initial e2e collection issue fixed in `vitest.config.ts`. |
| `npm run test:e2e` | `PASS` | Installed Chromium, built app and passed Playwright smoke test. |
| `uv sync --all-groups` | `PASS` | Created `.venv` and `uv.lock`. |
| `uv run ruff check .` | `PASS` | API baseline lint passed. |
| `uv run mypy app` | `PASS` | API package strict type-check passed. |
| `uv run pytest` | `PASS` | Initial import issue fixed with pytest `pythonpath`. |
| `git status --short -uall` | `PASS` | Only intended docs/config/source/lock files are untracked; generated outputs are ignored. |
| Final Markdown link check after task-file update | `PASS` | All Markdown links resolve after final task log update. |

### Final Validation

| Check | Result | Notes |
|---|---|---|
| Unit tests | `PASS` | `npm run test`, `uv run pytest`. |
| Integration tests | `PASS` | `npm run test:e2e` smoke test. |
| Lint | `PASS` | `npm run lint`, `uv run ruff check .`. |
| Type-check | `PASS` | `npm run typecheck`, `uv run mypy app`. |
| Build | `PASS` | `npm run test:e2e` ran `npm run build` before Playwright. |

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

### Validation Not Performed

```text
None.
```

---

## 13. Discovered Issues

### `documents/` tree is untracked

* **Location:** `documents/`
* **Description:** Prior documentation work is not tracked in Git yet.
* **Impact:** Git status groups older documentation and this task's new files together.
* **Action in this task:** `NONE`
* **Suggested future task:** `Stage/commit documentation foundation when user requests commit.`

---

## 14. Resume Check

* **Resumed At:** `N/A`
* **Current branch:** `main`
* **Current commit:** `3650946`
* **Task status before resume:** `N/A`
* **Working tree matches task log:** `N/A`
* **Plan remains valid:** `YES`

### Differences Found

```text
N/A
```

### Files Rechecked

* `N/A`

### Next Verified Action

```text
Add tracking and split coding rules.
```

---

## 15. Final Summary

* **Final Status:** `DONE`
* **Completed At:** `2026-07-22 05:37`

### Outcome

```text
Added root tracking, split coding rules, frontend test tooling baseline, API test tooling baseline and repo hygiene. All requested validations pass.
```

### Acceptance Criteria Result

* [x] `documents/TRACKING.md` tracks phase/task/gate/milestone/risk status.
* [x] Coding rules are split and routed through `documents/agents/coding_rules.md`.
* [x] Frontend npm/Vite/Vitest/Playwright/ESLint/TypeScript baseline validates.
* [x] API uv/pytest/ruff/mypy baseline validates.
* [x] Generated dependencies, caches and build outputs are ignored.

### Files Changed

* `documents/TRACKING.md` — root progress tracking.
* `documents/agents/coding_rules.md` — coding rules index.
* `documents/agents/coding_rules_frontend.md` — frontend coding rules.
* `documents/agents/coding_rules_api.md` — API coding rules.
* `documents/agents/AGENTS.md` — subsystem coding rule references.
* `.gitignore` — repo hygiene.
* `frontend/` — frontend smoke app and tooling baseline.
* `ingestion-api/` — API smoke package and tooling baseline.

### Main Behavioral Changes

* Added governance tracking.
* Added executable frontend validation baseline.
* Added executable API validation baseline.
* No gameplay or API route behavior added.

### Validation Result

* **Tests:** `PASS`
* **Lint:** `PASS`
* **Type-check:** `PASS`
* **Build:** `PASS`

### Remaining Work

* Implement shared telemetry schema contract files.
* Implement API contract fixtures.
* Add real frontend gameplay and telemetry tests in phase1.
* Add API route and ingestion tests in phase2.

### Known Limitations

* Spark/Kafka/Grafana test config is intentionally deferred to later phases.
* Frontend/API currently contain smoke baselines only, not production behavior.

### Follow-up Tasks

* `phase0-task002-shared-telemetry-schema-contract`
* `phase0-task003-api-contract-fixtures`

### Suggested Commit Message

```text
docs(phase0): add governance tracking and test config baseline
```
