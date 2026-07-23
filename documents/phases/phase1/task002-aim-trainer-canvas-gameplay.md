# Task: Aim Trainer canvas gameplay

## 1. Thông tin task

* **Task ID:** `phase1-task002`
* **Task Name:** `Aim Trainer canvas gameplay`
* **Phase:** `phase1`
* **Status:** `DONE`
* **Started At:** `2026-07-23 23:12`
* **Last Updated:** `2026-07-23 23:16`
* **Completed At:** `2026-07-23 23:16`
* **Branch:** `main`
* **Base Commit:** `ce94136`
* **Task File:** `documents/phases/phase1/task002-aim-trainer-canvas-gameplay.md`

---

## 2. Yêu cầu gốc

> T1.2 Aim Trainer Canvas Gameplay
>
> Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.
>
> To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Complete Aim Trainer canvas gameplay on the T1.1 shell: target generation within bounds, Euclidean hit detection, score/miss/accuracy, session timer that finishes the session at zero.
```

### Motivation

```text
T1.1 delivered lifecycle shell only; plan001 acceptance for playable targets/score/timer remains open and blocks later telemetry work that depends on real clicks and session timing.
```

### Tiêu chí nghiệm thu

* [x] User can play a 30 or 60 second session
* [x] Targets always lie fully inside the canvas
* [x] Score increases only on hit
* [x] Miss count increases on click outside target
* [x] Accuracy uses hitCount / totalClickCount
* [x] Timer expiry transitions to finishing/completed
* [x] Unit tests cover hit detection, accuracy, and target bounds
* [x] Không có thay đổi ngoài phạm vi
* [x] Frontend lint/typecheck/test/e2e pass or failures explained

### Ngoài scope

* Telemetry collector/buffer/sender (T1.3–T1.5 / plan002)
* Result page and client analytics (plan003)
* Stream status UI
* Full T1.8 frontend unit-test package beyond hit/accuracy/bounds

---

## 4. Bối cảnh phase

### Task đã có trong phase

| Task | Status | Relationship |
| --- | --- | --- |
| `task001-frontend-gameplay-shell.md` | `DONE` | `DEPENDENCY` |

### Task liên quan trước đó

* **Task:** `documents/phases/phase1/task001-frontend-gameplay-shell.md`
* **Outcome:** Playable `/play` shell with GameStatus lifecycle, AimCanvas, SessionHUD; score/timer placeholders
* **Decisions inherited:**
  * DEC-003: no mousemove React state
  * DEC-011: shadcn for HUD only, not canvas drawing
  * Lifecycle transitions in `gameEngine.ts` stay authoritative

### Phụ thuộc của task

* T1.1 DONE (shell + lifecycle)
* plan001 remaining acceptance criteria

### Kiểm tra trùng lặp

* **Equivalent task already exists:** `NO`
* **Overlapping task:** `None`
* **Quyết định:** `CREATE NEW`
* **Lý do:**

```text
task001 explicitly deferred target/hit/score/timer to T1.2; TRACKING lists T1.2 as TODO.
```

---

## 5. Trạng thái project ban đầu

### Trạng thái Git

* **Current branch:** `main`
* **Current commit:** `ce94136`
* **Working tree:** `CLEAN`

### Stack project

* **Language/runtime:** TypeScript / Node
* **Framework:** React + Vite
* **Package manager:** npm
* **Build command:** `npm run build`
* **Test command:** `npm run test`
* **Lint command:** `npm run lint`
* **Type-check command:** `npm run typecheck`

---

## 6. Related Files

| File | Current Responsibility | Why Relevant | Planned Action |
| --- | --- | --- | --- |
| `frontend/src/game/types.ts` | Session status types | Add Target + score fields | `MODIFY` |
| `frontend/src/game/gameEngine.ts` | Lifecycle transitions | registerClick, applyTarget, accuracy | `MODIFY` |
| `frontend/src/game/hitDetection.ts` | — | Euclidean hit math | `CREATE` |
| `frontend/src/game/targetGenerator.ts` | — | In-bounds spawn | `CREATE` |
| `frontend/src/hooks/useAimTrainer.ts` | Shell hook | Timer, click, draw target | `MODIFY` |
| `frontend/src/components/AimCanvas.tsx` | Canvas + move | Add pointerdown | `MODIFY` |
| `frontend/src/components/SessionHUD.tsx` | HUD placeholders | Wire score/accuracy/time | `MODIFY` |
| `frontend/src/pages/TrainerPage.tsx` | Page composition | Pass new props | `MODIFY` |

---

## 7. Tìm kiếm code hiện có

### Quyết định triển khai

* **Quyết định:** `EXTEND` shell + `CREATE` pure game modules
* **Target:** `hitDetection.ts`, `targetGenerator.ts`, extend engine/hook/HUD

---

## 8. Kế hoạch triển khai

* [x] **Step 1:** Pure hit + target + score math (TDD)
* [x] **Step 2:** Session timer + canvas click wiring
* [x] **Step 3:** Close task + tracking

---

## 9. Work Log

### `[2026-07-23 23:12]` — Khởi tạo task

* **Status:** `IN_PROGRESS`
* **Action:** Created task002; marked T1.2 IN_PROGRESS
* **Next verified action:** Pure game math TDD

### `[2026-07-23 23:14]` — Pure game math

* **Status:** `IN_PROGRESS`
* **Action:** Added hitDetection, targetGenerator, score helpers + tests
* **Validation:** `npm run test -- --run src/game/` → PASS (14 tests)
* **Next verified action:** Wire timer/click/HUD

### `[2026-07-23 23:15]` — Wire timer and clicks

* **Status:** `IN_PROGRESS`
* **Action:** Extended useAimTrainer, AimCanvas, SessionHUD, TrainerPage; Stop during countdown returns to idle
* **Validation:** typecheck/lint/test/e2e → PASS
* **Next verified action:** Finalize task + TRACKING + plan001

### `[2026-07-23 23:16]` — Close task

* **Status:** `DONE`
* **Action:** Updated TRACKING (2/10), plan001 ACs, Final Summary
* **Next verified action:** T1.3 Telemetry type definitions

### `[2026-07-23 23:17]` — Commit

* **Status:** `DONE`
* **Action:** Stage T1.2 code + docs; create final task commit per commit_rules
* **Validation:** prior `typecheck`/`lint`/`test`/`test:e2e` → PASS
* **Next verified action:** T1.3 Telemetry type definitions

---

## 10. Thay đổi

### Added Files

* `frontend/src/game/hitDetection.ts` (+ test)
* `frontend/src/game/targetGenerator.ts` (+ test)
* `documents/phases/phase1/task002-aim-trainer-canvas-gameplay.md`

### Modified Files

* `frontend/src/game/types.ts` — Target, ScoreState, session score fields
* `frontend/src/game/gameEngine.ts` — applyTarget, registerClick, accuracyPercent
* `frontend/src/game/gameEngine.test.ts` — scoring tests
* `frontend/src/hooks/useAimTrainer.ts` — timer, click, target paint
* `frontend/src/components/AimCanvas.tsx` — onPointerDown
* `frontend/src/components/SessionHUD.tsx` — live score/accuracy/time
* `frontend/src/pages/TrainerPage.tsx` — wire props; heading Gameplay
* `frontend/tests/e2e/app.spec.ts` — heading assertion
* `documents/TRACKING.md`
* `documents/plans/phase1/plan001-frontend-gameplay-shell.md`

---

## 11. Thay đổi symbol

### Added Symbols

* `Target`, `ScoreState`, `EMPTY_SCORE`, `TARGET_RADIUS`
* `isHit`, `createTarget`
* `applyTarget`, `clearTarget`, `registerClick`, `accuracyPercent`

### Modified Symbols

* `GameSessionState` — score + currentTarget fields
* `useAimTrainer` — timeRemaining, score, accuracyLabel, onPointerDown
* `SessionHUD` / `AimCanvas` — new props

---

## 12. Validation

### Validation cuối

| Check | Kết quả | Ghi chú |
| --- | --- | --- |
| Unit tests | `PASS` | 15 tests |
| Lint | `PASS` | `npm run lint` |
| Type-check | `PASS` | `npm run typecheck` |
| E2E | `PASS` | 1 Playwright test |
| Build | `PASS` | via `test:e2e` |

### Diff Review

* [x] Chỉ các file thuộc phạm vi bị thay đổi.
* [x] Không có debug code.
* [x] Không có placeholder ngoài chủ đích.
* [x] Không có abstraction không cần thiết.
* [x] Không có circular import mới.

### Validation chưa thực hiện

```text
Manual long 30/60s playthrough in browser (unit/e2e cover mechanics; timer logic covered by interval wiring).
```

---

## 13. Discovered Issues

None.

---

## 14. Resume Check

N/A

---

## 15. Tổng kết cuối

* **Final Status:** `DONE`
* **Completed At:** `2026-07-23 23:16`

### Outcome

```text
/play is a playable Aim Trainer: targets spawn in bounds, clicks score hit/miss with accuracy, session timer auto-finishes, HUD shows live score/accuracy/time left.
```

### Kết quả tiêu chí nghiệm thu

* [x] 30/60s session
* [x] Target bounds
* [x] Score on hit only
* [x] Miss count
* [x] Accuracy formula
* [x] Timer → finishing
* [x] Unit tests
* [x] Scope + validation

### Việc còn lại

* None for T1.2

### Giới hạn đã biết

* Finishing→completed still uses 150ms stub delay for future telemetry flush
* No telemetry events emitted yet (T1.3+)

### Task tiếp theo

* T1.3 Telemetry type definitions

### Commit message gợi ý

```text
feat(frontend): add aim trainer target hit score and session timer
```
