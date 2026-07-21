# Decision DEC-002: Client-Side Batching and Sampling

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

`mousemove` can fire at high frequency. Sending one HTTP request per mouse event would overload the browser, API and Kafka producer while adding little analytical value for MVP.

The architecture requires the demo to show continuous data generation and batch transmission. It also requires the UI to remain responsive while collecting telemetry.

---

## 3. Decision

The frontend will batch telemetry before sending it to FastAPI.

Default policy:

- Flush when buffer reaches `100` events.
- Flush every `250 ms` while a session is running.
- Sample `mousemove` to at most one recorded event every `16 ms`.
- Never sample away `click`, `session_start` or `session_end`.
- Keep batch sending through HTTP API, not direct Kafka.

---

## 4. Rationale

- 100-event batches are small enough for local API parsing and large enough to avoid request storms.
- 250 ms interval gives near-real-time demo feedback.
- 16 ms mousemove sampling approximates 60 samples/second, enough for trajectory and speed metrics.
- Preserving clicks keeps accuracy and reaction metrics correct.

---

## 5. Consequences

### Positive

- Browser sends predictable request volume.
- API and Kafka receive controlled batches.
- UI has fewer hot-path side effects.
- Demo can still show thousands of events in a session.

### Trade-offs

- Raw browser mousemove events above the sample rate are intentionally not retained.
- Very fine-grained movement reconstruction is out of MVP scope.

---

## 6. Implementation Constraints

- Sampling must happen before appending `mousemove` to the telemetry buffer.
- Batch flush must also run during session finishing.
- Config values should come from environment variables or telemetry config defaults.
- Load testing must not be achieved by disabling sampling in the player app; use DEC-008 instead.

---

## 7. Linked Documents

- [phase1](../phases/phase1/README.md)
- [phase5](../phases/phase5/README.md)
- [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)
- [phase4-plan002](../plans/phase4/plan002-demo-scenarios-and-load-generation.md)
- [DEC-008](decision008-load-generator-separated-from-player-app.md)

