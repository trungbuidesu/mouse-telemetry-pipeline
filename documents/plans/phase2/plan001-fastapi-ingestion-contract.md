# Plan: FastAPI Ingestion Contract

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase2-plan001` |
| Phase | [phase2](../../phases/phase2/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Implement FastAPI as the stable HTTP ingestion boundary for browser clients. The API validates session and telemetry payloads, accepts valid batches quickly and forwards events to Kafka.

---

## 3. Related Decisions

| Decision | Why needed |
|---|---|
| [DEC-001](../../decisions/decision001-canvas-relative-telemetry-schema.md) | Shared payload semantics |
| [DEC-004](../../decisions/decision004-http-ingestion-before-kafka.md) | Browser sends HTTP, backend owns Kafka |
| [DEC-005](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Producer topic and key behavior |
| [DEC-012](../../decisions/decision012-uv-managed-python-api-environment.md) | uv-managed Python reproducibility |
| [DEC-013](../../decisions/decision013-fastapi-performance-oriented-api-stack.md) | FastAPI stack and request-path performance constraints |

---

## 4. Planned Modules

| Module | Responsibility |
|---|---|
| `ingestion-api/app/main.py` | FastAPI application factory |
| `ingestion-api/app/core/config.py` | pydantic-settings configuration |
| `ingestion-api/app/api/routes/sessions.py` | Session lifecycle endpoints |
| `ingestion-api/app/api/routes/events.py` | Telemetry batch endpoint |
| `ingestion-api/app/schemas/telemetry.py` | Pydantic event and batch models |
| `ingestion-api/app/services/kafka_producer.py` | Kafka producer boundary |
| `ingestion-api/app/core/config.py` | Environment config |
| `schemas/telemetry/` | Shared schema fixtures/docs |

---

## 5. Work Breakdown

### Step 1: Initialize API project

- Create FastAPI app with health endpoint.
- Run with uv-managed Python 3.12.13.
- Add config for Kafka bootstrap servers and topic names.
- Add `.env.example` entries.

### Step 2: Implement schema models

- Define base telemetry event model.
- Define event models for `session_start`, `mousemove`, `click`, `session_end`.
- Define batch model and request size constraints.
- Validate normalized coordinate ranges when provided.

### Step 3: Implement endpoints

- `POST /api/v1/sessions`
- `POST /api/v1/events/batch`
- `POST /api/v1/sessions/{sessionId}/complete`
- `GET /api/v1/sessions/{sessionId}/metrics`

### Step 4: Produce Kafka messages

- Key telemetry messages by `sessionId`.
- Preserve event payload and add ingestion metadata only when needed.
- Return `202 Accepted` after valid batch is accepted for produce.

---

## 6. Performance Notes

- Request path must not compute session analytics.
- Validation should reject bad payloads before Kafka.
- Logging should summarize batch counts and identifiers, not dump every event.
- Kafka producer should be reused, not recreated per request.
- API should expose payload size and batch count limits in config.
- Keep `orjson` available for profiled custom response paths, but do not force deprecated response defaults onto `response_model` routes or use JSON speed as an excuse to put analytics in the request path.

---

## 7. Acceptance Criteria

- [ ] Session endpoint accepts valid session metadata.
- [ ] Batch endpoint accepts valid mixed event batches.
- [ ] Invalid event type or missing required field returns structured `400`.
- [ ] Batch accepted by API is produced to Kafka topic.
- [ ] Health endpoint reports API liveness.
- [ ] Tests cover accepted batch, invalid payload and producer failure.

---

## 8. Validation

| Check | Expected result |
|---|---|
| FastAPI unit tests | PASS |
| Contract fixture tests | PASS |
| Local API smoke test | `POST /api/v1/events/batch` returns expected status |

---

## 9. Handoff

This plan unlocks [phase2-plan002](plan002-backpressure-and-idempotent-ingestion.md) and [phase3-plan001](../phase3/plan001-kafka-topics-and-local-infrastructure.md).
