# Plan: Performance Validation and Observability

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase5-plan001` |
| Phase | [phase5](../../phases/phase5/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Validate that the pipeline meets the performance expectations needed for a reliable local demo and add observability signals that explain where data is flowing or stuck.

---

## 3. Related Decisions

| Decision | Why needed |
|---|---|
| [DEC-002](../../decisions/decision002-client-side-batching-and-sampling.md) | Frontend event rate and batch policy |
| [DEC-007](../../decisions/decision007-memory-bounded-retry-policy.md) | Failure behavior |
| [DEC-010](../../decisions/decision010-local-first-docker-compose-stack.md) | Local performance target |

---

## 4. Validation Areas

| Area | What to measure |
|---|---|
| Frontend | Render stability, batch counts, dropped event count |
| API | Request latency, accepted/rejected batches, producer failures |
| Kafka | Topic lag, message throughput |
| Spark | Micro-batch duration, input rows per second, processing latency |
| Storage | Raw Parquet writes, Influx metrics writes |
| Dashboard | Refresh behavior and query load |

---

## 5. Work Breakdown

### Step 1: Define performance budgets

- Frontend remains responsive during a 60 second session.
- Batch interval and size match defaults unless overridden.
- API handles load generator defaults without request errors.
- Spark keeps up with demo throughput on local machine.

### Step 2: Add observability counters

- Frontend: generated events, sent batches, failed batches, dropped events.
- API: accepted batches, rejected batches, Kafka produce errors.
- Spark: parsed events, malformed events, written rows.

### Step 3: Run focused benchmarks

- Manual single session.
- Multiple synthetic sessions.
- Backend unavailable then restored.
- Spark restart with checkpoint.

### Step 4: Record results

- Record commands.
- Record environment assumptions.
- Record pass/fail and limitations.
- Add follow-up tasks for bottlenecks.

---

## 6. Performance Notes

- Do not optimize blindly; tie optimization to measured bottleneck.
- Keep benchmark defaults realistic for a student/demo laptop.
- Prefer aggregate metrics over verbose logs in hot paths.
- Treat dropped events as visible telemetry health data, not silent failure.

---

## 7. Acceptance Criteria

- [ ] Frontend session can run without obvious UI degradation.
- [ ] Request count is batch-level, not event-level.
- [ ] API exposes meaningful accepted/rejected counters or logs.
- [ ] Spark processing latency is visible.
- [ ] Failure-mode behavior is documented.
- [ ] Validation results are recorded in docs or task files.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Manual 60 second session | No lost final flush |
| Load generator default run | Pipeline remains responsive |
| Backend outage test | Frontend moves to offline/buffering and recovers within policy |
| Spark restart test | Checkpoint resumes stream |

---

## 9. Handoff

This plan feeds [phase5-plan002](plan002-packaging-runbooks-and-final-report.md) with measured results and known limitations.

