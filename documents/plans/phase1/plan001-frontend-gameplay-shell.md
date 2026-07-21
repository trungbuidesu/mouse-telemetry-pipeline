# Plan: Frontend Gameplay Shell

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase1-plan001` |
| Phase | [phase1](../../phases/phase1/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Build the playable Aim Trainer shell: routing, canvas play area, game state machine, target generation, hit detection, timer, score and accuracy.

---

## 3. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| [phase0-plan001](../phase0/plan001-repository-and-doc-governance.md) | Repo setup | Frontend folder and tooling conventions |
| [phase0-plan002](../phase0/plan002-contract-first-schema-and-api.md) | Contract | Session and event semantics |
| [DEC-003](../../decisions/decision003-react-state-vs-ref-boundary.md) | Architecture | Avoid render storm from mousemove |
| [DEC-011](../../decisions/decision011-vite-react-shadcn-frontend-stack.md) | Frontend stack | Defines Vite, shadcn, router and query boundaries |

---

## 4. Planned Modules

| Module | Responsibility |
|---|---|
| `frontend/src/app/router.tsx` | Routes for `/`, `/play`, `/result/:sessionId`, `/dashboard` |
| `frontend/src/app/providers.tsx` | TanStack Query provider for server state only |
| `frontend/src/pages/TrainerPage.tsx` | Page composition for game screen |
| `frontend/src/components/AimCanvas.tsx` | Canvas rendering and pointer event boundary |
| `frontend/src/components/SessionHUD.tsx` | Timer, score, accuracy, stream status |
| `frontend/src/game/gameEngine.ts` | Game lifecycle and score transitions |
| `frontend/src/game/targetGenerator.ts` | Valid target placement |
| `frontend/src/game/hitDetection.ts` | Hit/miss math |
| `frontend/src/hooks/useAimTrainer.ts` | UI-facing game hook |

---

## 5. Work Breakdown

### Step 1: Initialize frontend app

- Use the existing clean Vite React TypeScript shadcn foundation.
- Add routing and basic pages.
- Keep first screen usable, not a marketing-only page.

### Step 2: Implement game model

- Define `Target`, `GameStatus`, session settings and score state.
- Implement target generation within canvas bounds.
- Implement hit detection using Euclidean distance.

### Step 3: Implement canvas boundary

- Render target on canvas.
- Convert pointer client coordinates to canvas coordinates.
- Do not store every pointer coordinate in React state.

### Step 4: Implement session lifecycle

- Start from idle.
- Run countdown.
- Start timer.
- Stop on timer expiry or manual stop.
- Move to finishing so telemetry can flush in phase1-plan002.

---

## 6. Performance Notes

- Canvas drawing should be imperative and bounded.
- shadcn components are allowed for HUD/layout controls, not canvas drawing.
- HUD state updates should be limited to meaningful UI values such as timer, score and accuracy.
- Pointer move handling must be compatible with telemetry sampling in [phase1-plan002](plan002-telemetry-collector-buffer-sender.md).

---

## 7. Acceptance Criteria

- [ ] User can play a 30 or 60 second session.
- [ ] Target is always fully inside canvas.
- [ ] Score increments only on hit.
- [ ] Miss count increments on off-target click.
- [ ] Accuracy uses `hitCount / totalClickCount`.
- [ ] Timer expiration transitions to finishing/completed flow.
- [ ] Unit tests cover hit detection, accuracy and target bounds.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Unit tests for game utilities | PASS |
| Manual browser test | Target can be clicked and score changes |
| Render behavior inspection | Pointer move does not visibly degrade UI |

---

## 9. Handoff

This plan unlocks [phase1-plan002](plan002-telemetry-collector-buffer-sender.md), which attaches telemetry collection to the gameplay shell.
