# Decision DEC-004: HTTP Ingestion Before Kafka

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

Browsers should not connect directly to Kafka. Direct Kafka access would add security, networking and protocol complexity that is outside the MVP. The architecture already identifies FastAPI Ingestion as the component between Aim Trainer and Kafka.

---

## 3. Decision

The browser sends session and telemetry data to FastAPI over HTTP. FastAPI validates payloads and produces accepted events to Kafka.

Primary endpoints:

- `POST /api/v1/sessions`
- `POST /api/v1/events/batch`
- `POST /api/v1/sessions/{sessionId}/complete`
- `GET /api/v1/sessions/{sessionId}/metrics`

The frontend must not know Kafka broker addresses, topic names or producer configuration.

---

## 4. Rationale

- HTTP is browser-native and simple to debug.
- FastAPI centralizes schema validation and error handling.
- Kafka credentials and networking stay server-side.
- Backend can evolve topic layout without changing frontend code.

---

## 5. Consequences

### Positive

- Clear boundary between client and pipeline.
- Easier local demo using browser + API.
- API can apply backpressure and idempotency rules.

### Trade-offs

- FastAPI becomes a required component for end-to-end ingestion.
- API availability affects telemetry delivery, so frontend retry and buffer limits are required.

---

## 6. Implementation Constraints

- FastAPI request path should return quickly after validating and accepting batch.
- API must distinguish invalid payload errors from retryable Kafka/API overload.
- API must reuse Kafka producer resources rather than creating producers per request.
- Frontend must use batch endpoint, not per-event endpoint.

---

## 7. Linked Documents

- [phase0](../phases/phase0/README.md)
- [phase2](../phases/phase2/README.md)
- [phase0-plan002](../plans/phase0/plan002-contract-first-schema-and-api.md)
- [phase2-plan001](../plans/phase2/plan001-fastapi-ingestion-contract.md)

