# Task: Frontend e2e smoke test

## 1. Thông tin task

* **Task ID:** `phase1-task009`
* **Task Name:** `Frontend e2e smoke test`
* **Phase:** `phase1`
* **Status:** `DONE`
* **Started At:** `2026-07-24 01:43`
* **Last Updated:** `2026-07-24 01:45`
* **Completed At:** `2026-07-24 01:45`
* **Branch:** `main`
* **Base Commit:** `050031b`
* **Task File:** `documents/phases/phase1/task009-frontend-e2e-smoke-test.md`

---

## 2. Yêu cầu gốc

> T1.9 Frontend E2E Smoke Test Implementation Plan
>
> Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.
>
> To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Add Playwright e2e smoke that starts a short session (countdown → Running → Stop), flushes telemetry against mocked APIs, and asserts /result/:sessionId shows Client (provisional) metrics.
```

### Motivation

```text
TRACKING T1.9 requires “Play one short session”. Existing e2e only checks shell routes; phase1 needs a playthrough to result without waiting a full 30/60s timer.
```

### Tiêu chí nghiệm thu

* [x] Playwright covers Start → short play → Stop → `/result/:sessionId`
* [x] Client provisional result visible without real FastAPI
* [x] Existing shell smoke still PASS
* [x] `npm run test:e2e` PASS (or R-09 documented)
* [x] No full 30/60s wait; no DurationSeconds product change
* [x] T1.10 / G1 package not started in this task
* [x] Không có thay đổi ngoài phạm vi.
* [x] Các validation liên quan pass hoặc lỗi còn lại được giải thích.

### Ngoài scope

* Real ingestion API / Kafka (P2+)
* Asserting batch payload fields in network
* Heatmap / trajectory (T4.3)
* G1 gate review package (T1.10)
* Expanding DurationSeconds for test-only durations

---

## 4. Bối cảnh phase

### Task đã có trong phase

| Task | Status | Relationship |
| ---- | ------ | ------------ |
| `task007-session-result-client-metrics.md` | DONE | DEPENDENCY |
| `task008-frontend-unit-tests.md` | DONE | RELATED |
| `task001`–`task006` | DONE | RELATED |

### Task liên quan trước đó

* **Task:** `task007-session-result-client-metrics.md`
* **Outcome:** Result page + client snapshot after flush
* **Decisions inherited:** Stop while running uses same finish path as timer expiry; no short duration API

### Phụ thuộc của task

* T1.7 DONE (result navigation + client snapshot)
* Playwright chromium via `npm run test:e2e`

### Kiểm tra trùng lặp

* **Equivalent task already exists:** `NO`
* **Overlapping task:** `None`
* **Quyết định:** `CREATE NEW`
* **Lý do:**

```text
T1.9 has no task file; existing app.spec.ts is shell-only.
```

---

## 5. Trạng thái project ban đầu

### Trạng thái Git

* **Current branch:** `main`
* **Current commit:** `050031b`
* **Working tree:** `CLEAN`

### Stack project

* **Language/runtime:** TypeScript / Node
* **Framework:** Vite React + Playwright
* **Package manager:** npm
* **Test command:** `npm run test` / `npm run test:e2e`

---

## 6. Related Files

| File | Current Responsibility | Why Relevant | Planned Action |
| ---- | ---------------------- | ------------ | -------------- |
| `frontend/tests/e2e/app.spec.ts` | Shell + short-session smoke | EXTEND session flow | MODIFY |
| `frontend/playwright.config.ts` | Playwright config | REUSE | READ |
| `documents/TRACKING.md` | Progress | Status | MODIFY |
| `documents/phases/phase1/task009-frontend-e2e-smoke-test.md` | Task SoT | This task | CREATE |

---

## 7. Tìm kiếm code hiện có

### Quyết định triển khai

* **Quyết định:** `EXTEND` `app.spec.ts`; `REUSE` playwright config
* **Target:** `frontend/tests/e2e/app.spec.ts`

---

## 8. Kế hoạch triển khai

* [x] **Step 1:** EXTEND app.spec.ts with short-session test + route mocks
* [x] **Step 2:** Run `npm run test:e2e` and stabilize
* [x] **Step 3:** Close task + TRACKING DONE

---

## 9. Work Log

### `[2026-07-24 01:43]` — Khởi tạo task

* **Status:** `IN_PROGRESS`
* **Action:** Created task009; set TRACKING T1.9 IN_PROGRESS; project check clean at 050031b
* **Next verified action:** EXTEND app.spec.ts

### `[2026-07-24 01:44]` — EXTEND app.spec.ts

* **Status:** `IN_PROGRESS`
* **Action:** Added short-session test with batch/metrics route mocks; Start → Running → Stop → result
* **Files changed:** `frontend/tests/e2e/app.spec.ts`
* **Next verified action:** `npm run test:e2e`

### `[2026-07-24 01:45]` — E2E validation

* **Status:** `IN_PROGRESS`
* **Action:** Ran `npm run test:e2e`
* **Validation:** 2 Chromium tests PASS (shell 202ms; short session 3.8s)
* **Next verified action:** Close task + TRACKING

### `[2026-07-24 01:45]` — Close task

* **Status:** `DONE`
* **Action:** TRACKING T1.9 DONE; P1 9/10; next T1.10
* **Next verified action:** T1.10 P1 gate review package

### `[2026-07-24 01:47]` — Final commit

* **Status:** `DONE`
* **Action:** Stage T1.9 short-session e2e + task009 + TRACKING; create final task commit per commit_rules
* **Validation:** npm run test:e2e → PASS (2) prior run
* **Next verified action:** T1.10 P1 gate review package

---

## 10. Thay đổi

### Added Files

#### `documents/phases/phase1/task009-frontend-e2e-smoke-test.md`

* **Mục đích:** Task source of truth for T1.9

### Modified Files

#### `frontend/tests/e2e/app.spec.ts`

* **Changes made:** Added `plays a short session and shows client result` with API mocks
* **Behavioral impact:** none (tests only)

#### `documents/TRACKING.md`

* **Changes made:** T1.9 DONE; P1 9/10; total 20/52

---

## 11. Thay đổi symbol

None (e2e test only).

---

## 12. Validation

### Validation cuối

| Check | Kết quả | Ghi chú |
| ----- | ------- | ------- |
| E2E | `PASS` | 2 Chromium tests |
| Unit tests | `NOT RUN` | no production src change |
| Lint | `NOT RUN` | e2e-only change |
| Type-check | `NOT RUN` | e2e-only change |
| Build | `PASS` | via `test:e2e` |

### Diff Review

* [x] Chỉ các file thuộc phạm vi bị thay đổi.
* [x] Không có debug code.
* [x] Không có DurationSeconds product change.
* [x] Không bắt đầu T1.10.

### Validation chưa thực hiện

```text
Real FastAPI integration (P2). Full 30s timer path (covered by Stop = same finish path).
```

---

## 13. Discovered Issues

None.

---

## 15. Tổng kết cuối

* **Final Status:** `DONE`
* **Completed At:** `2026-07-24 01:45`

### Outcome

```text
Playwright short-session smoke: Start → Running (~3s countdown) → Stop → /result with Client (provisional); batch/metrics mocked; shell smoke retained.
```

### Kết quả tiêu chí nghiệm thu

* [x] Short session → result
* [x] Client provisional without FastAPI
* [x] Shell smoke PASS
* [x] test:e2e PASS (2)

### File đã thay đổi

* `frontend/tests/e2e/app.spec.ts` — short-session e2e
* `documents/phases/phase1/task009-frontend-e2e-smoke-test.md`
* `documents/TRACKING.md`

### Kết quả validation

* **Tests (e2e):** `PASS`
* **Build:** `PASS` (via test:e2e)

### Việc còn lại

* None for T1.9

### Giới hạn đã biết

* Batch/metrics APIs mocked; real ingestion deferred to P2

### Task tiếp theo

* T1.10 P1 gate review package

### Commit message gợi ý

```text
test(frontend): add short-session Playwright e2e smoke
```
