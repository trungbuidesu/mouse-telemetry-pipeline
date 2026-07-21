# Decision DEC-013: FastAPI Performance-Oriented API Stack

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

The ingestion API sits on the hot path between the browser and Kafka. It must validate and accept telemetry batches quickly, then hand work to downstream systems. The API should not become an analytics processor.

---

## 3. Decision

Use the following API stack:

- FastAPI.
- Pydantic v2 for request/response models.
- `pydantic-settings` for environment config.
- Uvicorn standard extras for local ASGI serving.
- `orjson` available for custom response paths where profiling shows benefit; routes with response models should use FastAPI/Pydantic direct serialization.
- pytest, pytest-asyncio, httpx, ruff and mypy for validation.

Foundation scope includes only app factory and `GET /health`. Session and batch ingestion endpoints remain phase2 work.

---

## 4. Rationale

- FastAPI and Pydantic fit schema-heavy HTTP ingestion.
- `pydantic-settings` keeps config typed and testable.
- `orjson` keeps a fast JSON option available for future high-volume responses without forcing deprecated response defaults onto typed routes.
- Keeping analytics out of the request path protects frontend retry and API latency.

---

## 5. Consequences

### Positive

- API routes can be added behind a typed app factory.
- Health checks are available before ingestion endpoints.
- Performance constraints are present before the API grows.

### Trade-offs

- `orjson` adds a native dependency and should be used intentionally, not as a blanket default.
- API schema discipline must be maintained as endpoints are added.

---

## 6. Implementation Constraints

- Request handlers must not compute Spark-style analytics.
- Do not write raw telemetry synchronously to disk in the request path.
- Kafka producer integration must live behind a service boundary.
- Keep error responses explicit about retryability when ingestion endpoints are added.

---

## 7. Linked Documents

- [phase2](../phases/phase2/README.md)
- [phase2-plan001](../plans/phase2/plan001-fastapi-ingestion-contract.md)
- [phase2-plan002](../plans/phase2/plan002-backpressure-and-idempotent-ingestion.md)
- [coding rules api](../agents/coding_rules_api.md)
