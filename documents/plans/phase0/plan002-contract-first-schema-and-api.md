# Plan: Contract-First Schema and API

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase0-plan002` |
| Phase | [phase0](../../phases/phase0/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Define shared telemetry schema and HTTP API contract before implementing frontend, ingestion API or Spark parsing. This keeps event semantics stable across the pipeline.

---

## 3. Related Decisions

| Decision | Why needed |
|---|---|
| [DEC-001: Canvas-relative telemetry schema](../../decisions/decision001-canvas-relative-telemetry-schema.md) | Defines coordinate and event field semantics |
| [DEC-002: Client-side batching and sampling](../../decisions/decision002-client-side-batching-and-sampling.md) | Defines batch size and sampling assumptions |
| [DEC-004: HTTP ingestion before Kafka](../../decisions/decision004-http-ingestion-before-kafka.md) | Defines frontend/backend boundary |
| [DEC-005: Kafka topic layout and event keys](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Defines downstream routing assumptions |

---

## 4. Planned Outputs

- Schema docs or JSON Schema/Pydantic-compatible definitions for:
  - `session_start`
  - `mousemove`
  - `click`
  - `session_end`
  - telemetry batch
- API contract for:
  - `POST /api/v1/sessions`
  - `POST /api/v1/events/batch`
  - `POST /api/v1/sessions/{sessionId}/complete`
  - `GET /api/v1/sessions/{sessionId}/metrics`
- Contract examples aligned with architecture.
- Compatibility rules for future schema changes.

---

## 5. Work Breakdown

### Step 1: Extract event fields

- Start from section 11 of the architecture document.
- Mark required and optional fields.
- Normalize timestamp names and units.
- Keep `eventTime` as client event time in epoch milliseconds.

### Step 2: Define shared invariants

- `eventId` is unique per event.
- `sessionId` groups all events in one game session.
- `sequence` increases monotonically within one session.
- `batchSequence` increases monotonically within one session sender.
- `x` and `y` are canvas-relative pixels.
- `normalizedX` and `normalizedY` are in `[0, 1]` when present.

### Step 3: Define API response behavior

- Use `202 Accepted` for valid batch accepted into ingestion path.
- Use `400` for invalid JSON or schema errors.
- Use `413` for payload too large.
- Use `429` or `503` for retryable overload/dependency failure.

### Step 4: Define contract tests

- Frontend fixture events should validate against backend schema.
- Backend accepted payload should be parseable by Spark schema.
- Invalid coordinate/session/sequence cases should be rejected.

---

## 6. Performance and Data Correctness Notes

- Contract must allow batch processing; do not design endpoint around one event per request.
- Avoid overly nested payloads that increase parsing overhead for every event.
- Do not put expensive analytics fields in the ingestion request path.
- Keep raw event contract append-friendly so Spark can write Parquet without fragile transformations.

---

## 7. Acceptance Criteria

- [ ] All MVP event types have documented required fields.
- [ ] Batch payload has documented limits and examples.
- [ ] API status codes distinguish schema errors from retryable ingestion errors.
- [ ] Frontend, API and Spark can share the same event semantics.
- [ ] Future schema changes require a decision/update path.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Manual schema review | Event examples match architecture |
| Contract fixture validation | Frontend example payload passes backend model once code exists |
| Spark parse smoke test | Kafka message value can be parsed once phase3 exists |

---

## 9. Handoff

This plan feeds directly into:

- [phase1-plan002](../phase1/plan002-telemetry-collector-buffer-sender.md)
- [phase2-plan001](../phase2/plan001-fastapi-ingestion-contract.md)
- [phase3-plan002](../phase3/plan002-spark-streaming-to-minio-influxdb.md)

