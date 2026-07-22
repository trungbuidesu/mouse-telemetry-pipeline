# HTTP API contract (MVP)

Contract-first expectations for the ingestion API. Endpoint implementation belongs to phase2; this document freezes request/response semantics for shared fixtures.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/v1/sessions` | Register or acknowledge a session |
| `POST` | `/api/v1/events/batch` | Ingest a telemetry batch |
| `POST` | `/api/v1/sessions/{sessionId}/complete` | Mark session complete on client finish |
| `GET` | `/api/v1/sessions/{sessionId}/metrics` | Read provisional/completed metrics |

## `POST /api/v1/events/batch`

* Request body: [telemetry_batch.schema.json](telemetry_batch.schema.json)
* Success: `202 Accepted` with `{ "accepted": true, "batchSequence": <int>, "eventCount": <int> }`
* Schema/JSON errors: `400`
* Payload too large (> 1 MiB): `413`
* Overload / dependency failure (retryable): `429` or `503`

## `POST /api/v1/sessions`

Request fields (minimum):

* `sessionId` (string)
* `startedAt` (epoch millis)
* `durationSeconds` (`30` | `60`)
* `canvasWidth`, `canvasHeight`, `viewportWidth`, `viewportHeight` (positive numbers)

Success response:

```json
{ "accepted": true, "sessionId": "<id>" }
```

## `POST /api/v1/sessions/{sessionId}/complete`

Acknowledges client-side session completion. May be followed by async Spark processing.

## `GET /api/v1/sessions/{sessionId}/metrics`

* Processing: `{ "status": "processing" }`
* Completed: includes `score`, `accuracy`, and session identifiers

## Non-goals

* Analytics computation inside the request path
* Direct Kafka produce from the browser
