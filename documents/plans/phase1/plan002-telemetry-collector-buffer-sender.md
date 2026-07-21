# Plan: Telemetry Collector, Buffer and Sender

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase1-plan002` |
| Phase | [phase1](../../phases/phase1/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Implement the frontend telemetry path that captures high-frequency input, normalizes events, stores them in a bounded memory buffer, sends batches to the ingestion API and retries safely when the backend is slow or unavailable.

---

## 3. Related Decisions

| Decision | Why needed |
|---|---|
| [DEC-001](../../decisions/decision001-canvas-relative-telemetry-schema.md) | Event coordinate and field contract |
| [DEC-002](../../decisions/decision002-client-side-batching-and-sampling.md) | Sampling and flush policy |
| [DEC-003](../../decisions/decision003-react-state-vs-ref-boundary.md) | React state/ref boundary |
| [DEC-007](../../decisions/decision007-memory-bounded-retry-policy.md) | Retry and buffer limit |
| [DEC-011](../../decisions/decision011-vite-react-shadcn-frontend-stack.md) | Prevents UI stack from owning telemetry hot path |

---

## 4. Planned Modules

| Module | Responsibility |
|---|---|
| `frontend/src/telemetry/telemetryTypes.ts` | Event and batch types |
| `frontend/src/telemetry/telemetryConfig.ts` | Batch size, flush interval, sampling interval, buffer limit |
| `frontend/src/telemetry/eventCollector.ts` | Create normalized events and sequence numbers |
| `frontend/src/telemetry/eventBuffer.ts` | Append, flush and drop policy |
| `frontend/src/telemetry/batchSender.ts` | HTTP sending, retry and status |
| `frontend/src/api/telemetryApi.ts` | API request boundary |
| `frontend/src/hooks/useTelemetry.ts` | Wire collector/buffer/sender into UI lifecycle |

---

## 5. Work Breakdown

### Step 1: Define telemetry types

- Add discriminated event types for `session_start`, `mousemove`, `click`, `session_end`.
- Add `TelemetryBatch` with `sessionId`, `batchSequence`, `sentAt` and `events`.
- Keep type names aligned with API contract.

### Step 2: Implement collector

- Generate `eventId` for each event.
- Attach `sessionId`, `eventTime` and monotonic `sequence`.
- Convert coordinates to canvas-relative and normalized forms.
- Compute `targetHit` and `reactionTimeMs` for click events.

### Step 3: Implement sampling

- Record at most one `mousemove` every 16 ms by default.
- Never sample away `click`, `session_start` or `session_end`.
- Track skipped mousemove count separately if useful for debugging.

### Step 4: Implement buffer and flush policy

- Flush when buffer reaches 100 events.
- Flush every 250 ms while running.
- Flush all remaining events during finishing.
- Enforce `MAX_BUFFERED_EVENTS = 20000`.

### Step 5: Implement sender and retry

- Send batches to `POST /api/v1/events/batch`.
- Retry retryable failures with 500 ms, 1 s and 2 s backoff.
- Keep failed batch until success or max retry outcome is recorded.
- Expose stream status for UI.

---

## 6. Performance Notes

- The hot path must avoid allocation-heavy transformations where possible.
- React state may show counters, but buffer data lives in refs or plain objects outside render state.
- TanStack Query must not own telemetry events or buffer state.
- shadcn components may display stream status but must not process raw events.
- Sender should avoid unbounded parallel HTTP requests; one in-flight batch per sender is the safest MVP default.
- Batch payload size should stay small enough for local FastAPI parsing and Kafka produce.

---

## 7. Acceptance Criteria

- [ ] `mousemove` and `click` events are collected with required fields.
- [ ] `sequence` increases monotonically per session.
- [ ] Mousemove sampling is enforced.
- [ ] Buffer flushes by size and interval.
- [ ] Finishing a session flushes remaining events.
- [ ] Retry behavior handles backend failure without deleting unsent batches.
- [ ] UI can show event count, batch count and stream status.
- [ ] Unit tests cover batching, sequence, coordinate normalization and retry classification.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Unit tests for buffer | PASS |
| Unit tests for collector | PASS |
| Mock API integration test | Sends batch and handles accepted response |
| Manual offline test | Backend down changes status and preserves bounded buffer |

---

## 9. Handoff

This plan feeds [phase1-plan003](plan003-session-result-and-client-analytics.md) and [phase2-plan001](../phase2/plan001-fastapi-ingestion-contract.md).
