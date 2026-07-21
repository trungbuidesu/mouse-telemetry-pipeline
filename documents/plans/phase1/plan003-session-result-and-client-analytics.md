# Plan: Session Result and Client Analytics

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase1-plan003` |
| Phase | [phase1](../../phases/phase1/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Show immediate session results from frontend state while backend metrics are still processing. This keeps the user experience responsive and demonstrates asynchronous pipeline behavior.

---

## 3. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| [phase1-plan001](plan001-frontend-gameplay-shell.md) | Frontend gameplay | Provides score, hit/miss and session lifecycle |
| [phase1-plan002](plan002-telemetry-collector-buffer-sender.md) | Telemetry | Provides event and batch counters |
| [phase2-plan001](../phase2/plan001-fastapi-ingestion-contract.md) | API | Metrics polling contract |
| [DEC-009](../../decisions/decision009-session-analytics-event-time-watermark.md) | Analytics | Processing status may lag final event |

---

## 4. Planned Modules

| Module | Responsibility |
|---|---|
| `frontend/src/pages/ResultPage.tsx` | Display result for `sessionId` |
| `frontend/src/api/analyticsApi.ts` | Fetch backend metrics |
| `frontend/src/hooks/useSessionMetrics.ts` | Poll and expose processing status |
| `frontend/src/utils/calculations.ts` | Client-side accuracy, distance and basic stats |
| `frontend/src/components/MouseTrajectory.tsx` | Basic trajectory rendering if local samples are available |
| `frontend/src/components/ClickHeatmap.tsx` | Basic click density view if local samples are available |

---

## 5. Work Breakdown

### Step 1: Define client result model

- Capture score, hit count, miss count, total click count.
- Capture generated event count and sent batch count.
- Capture dropped event count if buffer limit was reached.

### Step 2: Build result page

- Show immediate client-calculated result after finishing.
- Show backend status: `processing`, `completed` or `error`.
- Let user play again or view analytics/dashboard.

### Step 3: Poll backend metrics

- Call `GET /api/v1/sessions/{sessionId}/metrics`.
- Use a bounded polling interval.
- Stop polling when status is `completed` or on terminal error.

### Step 4: Add basic visual analytics

- Show heatmap or trajectory for current session at MVP level.
- Prefer derived or sampled data, not every raw mousemove in React state.

---

## 6. Data Correctness Notes

- Client result is immediate and provisional.
- Backend result is authoritative for Spark-derived metrics such as total distance and average speed.
- UI should label processing state clearly so delayed Spark metrics are not mistaken for lost data.

---

## 7. Acceptance Criteria

- [ ] Result page displays score, accuracy, hits, misses, total events and batches.
- [ ] Result page distinguishes client result from backend processed metrics.
- [ ] Metrics polling handles `processing` and `completed`.
- [ ] Play Again starts a clean session with new `sessionId`.
- [ ] No large raw telemetry array is stored in long-lived React state.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Unit tests for calculations | PASS |
| Mock metrics polling test | Handles processing then completed |
| Manual session test | Result appears after flush completes |

---

## 9. Handoff

This plan provides the user-facing result surface used by [phase4-plan001](../phase4/plan001-dashboard-session-analytics.md).

