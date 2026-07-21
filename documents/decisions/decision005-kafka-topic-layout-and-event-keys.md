# Decision DEC-005: Kafka Topic Layout and Event Keys

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

Kafka must carry telemetry from FastAPI to Spark. The pipeline needs per-session ordering for analytics such as trajectory, speed and session completion. MVP should keep topic layout simple enough for local demo.

---

## 3. Decision

Use one primary telemetry topic for MVP:

```text
mouse.telemetry.events.v1
```

Use message key:

```text
sessionId
```

Use message value as JSON event payload compatible with DEC-001. The payload keeps `eventType`, so Spark can branch logic without separate topics per event type.

Optional dead-letter topic:

```text
mouse.telemetry.deadletter.v1
```

---

## 4. Rationale

- Keying by `sessionId` keeps events for one session in the same partition, preserving relative order.
- A single telemetry topic simplifies local setup and Spark consumption.
- Event type inside payload avoids topic sprawl for MVP.
- Version suffix allows future incompatible topic/schema changes.

---

## 5. Consequences

### Positive

- Simple producer configuration.
- Spark can read one stream for all event types.
- Per-session analytics are easier because related events are keyed together.

### Trade-offs

- A single hot session could concentrate load on one partition, acceptable for MVP.
- Consumers must filter by `eventType` inside the payload.

---

## 6. Implementation Constraints

- FastAPI producer must set Kafka key to `sessionId`.
- Spark should not assume global ordering across sessions.
- Topic creation should be scripted for local repeatability.
- Any topic rename requires updating phase2 and phase3 plans.

---

## 7. Linked Documents

- [phase2](../phases/phase2/README.md)
- [phase3](../phases/phase3/README.md)
- [phase2-plan001](../plans/phase2/plan001-fastapi-ingestion-contract.md)
- [phase3-plan001](../plans/phase3/plan001-kafka-topics-and-local-infrastructure.md)
- [phase3-plan002](../plans/phase3/plan002-spark-streaming-to-minio-influxdb.md)

