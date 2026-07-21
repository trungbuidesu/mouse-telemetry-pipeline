# Decision DEC-007: Memory-Bounded Retry Policy

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

The frontend must continue collecting telemetry when the backend is slow, but it cannot keep infinite data in memory. The MVP does not need IndexedDB persistence, so retry behavior must be bounded and transparent.

---

## 3. Decision

Frontend retry policy:

- Retry a failed batch up to 3 times.
- Use backoff delays: 500 ms, 1 s, 2 s.
- Keep a failed batch until it succeeds or reaches retry limit.
- Maintain a maximum buffered event count of `20000`.
- Prefer retaining click/session lifecycle events over sampled mousemove events when pressure requires dropping.
- Record `droppedEventCount`.
- Use one in-flight batch per session sender for MVP.
- Do not implement IndexedDB persistence in MVP.

---

## 4. Rationale

- Bounded memory prevents a failed backend from crashing the browser.
- Limited retries avoid request storms.
- Preserving clicks protects scoring and accuracy analytics.
- Dropped event count makes data loss visible.

---

## 5. Consequences

### Positive

- Failure behavior is predictable.
- UI can show `buffering`, `offline` or `error`.
- API overload does not cause unbounded browser memory growth.

### Trade-offs

- If outage lasts too long, some sampled movement data can be dropped.
- Browser refresh loses in-memory unsent data in MVP.

---

## 6. Implementation Constraints

- Batch sender must not delete a batch before successful accepted response.
- Error classification must align with API responses from phase2.
- Buffer limit enforcement must not drop `session_end` silently.
- Result page should show dropped event count when nonzero.

---

## 7. Linked Documents

- [phase1](../phases/phase1/README.md)
- [phase2](../phases/phase2/README.md)
- [phase5](../phases/phase5/README.md)
- [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)
- [phase2-plan002](../plans/phase2/plan002-backpressure-and-idempotent-ingestion.md)
- [phase5-plan001](../plans/phase5/plan001-performance-validation-and-observability.md)

