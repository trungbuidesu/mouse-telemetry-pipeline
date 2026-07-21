# Plan: Backpressure and Idempotent Ingestion

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase2-plan002` |
| Phase | [phase2](../../phases/phase2/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Make ingestion failure modes explicit so frontend retry behavior is safe. The API should distinguish invalid data from retryable overload, prevent unbounded memory growth and reduce duplicate effects from retried batches.

---

## 3. Related Decisions

| Decision | Why needed |
|---|---|
| [DEC-002](../../decisions/decision002-client-side-batching-and-sampling.md) | Expected batch frequency and size |
| [DEC-005](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Ordering and duplicate handling downstream |
| [DEC-007](../../decisions/decision007-memory-bounded-retry-policy.md) | Frontend retry semantics |

---

## 4. Planned Behaviors

| Behavior | Requirement |
|---|---|
| Payload limit | Reject oversized request with `413` |
| Schema error | Return `400`, not retryable |
| Kafka unavailable | Return `503`, retryable |
| API overloaded | Return `429`, retryable |
| Duplicate batch | Accept idempotently when possible |
| Duplicate event | Preserve `eventId` so downstream can deduplicate |

---

## 5. Work Breakdown

### Step 1: Define error model

- Use a consistent JSON error shape.
- Include retryable flag for client behavior.
- Avoid exposing internal stack traces.

### Step 2: Add request limits

- Limit max events per batch.
- Limit max request body size if framework/runtime supports it.
- Reject empty batches unless explicitly allowed for heartbeat.

### Step 3: Add idempotency support

- Treat `(sessionId, batchSequence)` as batch-level idempotency key for MVP.
- Keep `eventId` for downstream duplicate detection.
- Document retention limits for any in-memory duplicate cache.

### Step 4: Add backpressure mapping

- Map Kafka producer timeout to `503`.
- Map local queue full to `429`.
- Keep response fast and deterministic.

---

## 6. Performance Notes

- Idempotency cache must be bounded.
- API should avoid synchronous disk writes in the hot request path.
- Do not retry Kafka indefinitely inside one HTTP request; let frontend retry according to DEC-007.
- Metrics/logging should count dropped/rejected/accepted batches.

---

## 7. Acceptance Criteria

- [ ] Invalid payloads are not retried by frontend contract.
- [ ] Retryable failures return status code and body that identify retryability.
- [ ] Oversized batches are rejected before Kafka produce.
- [ ] Duplicate batch behavior is documented and tested at MVP level.
- [ ] Backpressure does not grow memory without bound.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Unit tests for error mapping | PASS |
| Producer failure test | `503` retryable response |
| Oversized batch test | `413` response |
| Duplicate batch test | Deterministic behavior |

---

## 9. Handoff

This plan supports frontend retry handling in [phase1-plan002](../phase1/plan002-telemetry-collector-buffer-sender.md) and stable stream input for [phase3](../../phases/phase3/README.md).

