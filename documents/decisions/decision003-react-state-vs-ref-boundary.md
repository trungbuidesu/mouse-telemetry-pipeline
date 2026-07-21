# Decision DEC-003: React State vs Ref Boundary

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

Aim Trainer collects high-frequency input. If each `mousemove` updates React state, React can re-render far more often than needed and degrade gameplay. The architecture explicitly requires not causing React re-render for every mouse movement.

---

## 3. Decision

Use React state only for values that must affect rendered UI at human-visible frequency:

- `GameStatus`
- score
- hit count
- miss count
- time remaining
- stream status
- displayed counters such as total events and sent batches

Use refs or non-rendering objects for hot-path mutable data:

- event buffer
- current mouse position
- sequence number
- canvas context
- flush interval handle
- retry state
- last sampled mousemove timestamp

---

## 4. Rationale

- React state is excellent for UI state but expensive for every raw pointer event.
- Refs preserve mutable data across renders without triggering renders.
- Canvas drawing is naturally imperative and should not require full React reconciliation per mousemove.

---

## 5. Consequences

### Positive

- Lower render pressure during gameplay.
- Cleaner separation between UI and telemetry.
- Easier to reason about which updates are user-visible.

### Trade-offs

- Ref-based state must be carefully initialized and cleaned up.
- Tests should cover lifecycle cleanup because refs do not follow reducer-style state transitions automatically.

---

## 6. Implementation Constraints

- Do not put telemetry event arrays in React state.
- UI counters should update on batch/timer cadence, not every event.
- Hooks must clean intervals and pending sender state on unmount.
- Canvas coordinate conversion can happen in event handlers but should append to buffer without forcing render.

---

## 7. Linked Documents

- [phase1](../phases/phase1/README.md)
- [phase1-plan001](../plans/phase1/plan001-frontend-gameplay-shell.md)
- [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)

