# Task: Telemetry collector and coordinate normalization

## 1. Thông tin task

* **Task ID:** `phase1-task004`
* **Task Name:** `Telemetry collector and coordinate normalization`
* **Phase:** `phase1`
* **Status:** `DONE`
* **Started At:** `2026-07-24 00:31`
* **Last Updated:** `2026-07-24 00:35`
* **Completed At:** `2026-07-24 00:35`
* **Branch:** `main`
* **Base Commit:** `e9a3d1e`
* **Task File:** `documents/phases/phase1/task004-telemetry-collector-coordinate-normalization.md`

---

## 2. Yêu cầu gốc

> T1.4 Telemetry Collector and Coordinate Normalization
>
> Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.
>
> To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Add pure telemetryConfig, coordinates, and eventCollector modules: canvas-relative + normalized coords, monotonic sequence, mousemove sampling at 16ms; no buffer/sender/UI wiring.
```

### Tiêu chí nghiệm thu

* [x] telemetryConfig holds DEC-002 defaults (no magic numbers in collector)
* [x] Coordinate conversion and normalization unit-tested
* [x] Collector emits session_start/mousemove/click/session_end with required fields
* [x] sequence increases by 1 per emitted event
* [x] mousemove sampled; click/session_* never dropped by sampling
* [x] Không có thay đổi ngoài phạm vi
* [x] Frontend typecheck/lint/test pass

### Ngoài scope

* eventBuffer, batchSender, telemetryApi, useTelemetry
* Wiring into useAimTrainer
* HTTP / React state for events

---

## 8. Kế hoạch triển khai

* [x] Step 1: Config + coordinates (TDD)
* [x] Step 2: Event collector + sampling (TDD)
* [x] Step 3: Close task + tracking

---

## 9. Work Log

### `[2026-07-24 00:31]` — Khởi tạo task

* **Status:** `IN_PROGRESS`
* **Action:** Created task004; marked T1.4 IN_PROGRESS

### `[2026-07-24 00:33]` — Config + coordinates

* **Status:** `IN_PROGRESS`
* **Action:** Added telemetryConfig.ts, coordinates.ts + tests
* **Validation:** coordinates tests PASS (5)

### `[2026-07-24 00:34]` — Event collector

* **Status:** `IN_PROGRESS`
* **Action:** Added eventCollector.ts + sampling/sequence/reactionTime tests
* **Validation:** telemetry suite PASS (16); typecheck/lint PASS

### `[2026-07-24 00:35]` — Close task

* **Status:** `DONE`
* **Action:** TRACKING 4/10; plan002 Steps 2–3 checked
* **Validation:** full `npm run test` → PASS (31)
* **Next verified action:** T1.5 Event buffer and batch sender

### `[2026-07-24 00:36]` — Commit

* **Status:** `DONE`
* **Action:** Stage T1.4 collector modules + docs; create final task commit per commit_rules
* **Validation:** prior typecheck/lint/test → PASS
* **Next verified action:** T1.5 Event buffer and batch sender

---

## 10. Thay đổi

### Added Files

* `frontend/src/telemetry/telemetryConfig.ts`
* `frontend/src/telemetry/coordinates.ts`
* `frontend/src/telemetry/coordinates.test.ts`
* `frontend/src/telemetry/eventCollector.ts`
* `frontend/src/telemetry/eventCollector.test.ts`
* `documents/phases/phase1/task004-telemetry-collector-coordinate-normalization.md`

### Modified Files

* `documents/TRACKING.md`
* `documents/plans/phase1/plan002-telemetry-collector-buffer-sender.md`

---

## 11. Thay đổi symbol

### Added Symbols

* `TELEMETRY_CONFIG`
* `toCanvasPoint`, `withNormalizedCoordinates`, `hasNormalizedCoordinates`
* `createEventCollector`, `EventCollector`

---

## 12. Validation

| Check | Kết quả | Ghi chú |
| --- | --- | --- |
| Unit tests | `PASS` | 31 tests |
| Lint | `PASS` | |
| Type-check | `PASS` | |
| E2E | `NOT RUN` | No UI change |

---

## 15. Tổng kết cuối

* **Final Status:** `DONE`
* **Completed At:** `2026-07-24 00:35`

### Outcome

```text
Pure collector creates DEC-001 events with normalized canvas coords, monotonic sequence, and DEC-002 mousemove sampling; ready for T1.5 buffer/sender wiring.
```

### Việc còn lại

* None for T1.4

### Giới hạn đã biết

* Collector not wired into gameplay yet
* No buffer/HTTP

### Task tiếp theo

* T1.5 Event buffer and batch sender

### Commit message gợi ý

```text
feat(frontend): add telemetry collector with coordinate sampling
```
