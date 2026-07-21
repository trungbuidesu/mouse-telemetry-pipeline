# Plan: Spark Streaming to MinIO and InfluxDB

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase3-plan002` |
| Phase | [phase3](../../phases/phase3/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Implement Spark Structured Streaming job that reads Kafka telemetry, parses events, writes raw records to MinIO as Parquet and writes aggregate metrics to InfluxDB.

---

## 3. Related Decisions

| Decision | Why needed |
|---|---|
| [DEC-005](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Kafka read assumptions |
| [DEC-006](../../decisions/decision006-raw-parquet-and-timeseries-metrics.md) | Storage split |
| [DEC-009](../../decisions/decision009-session-analytics-event-time-watermark.md) | Event-time aggregation |

---

## 4. Planned Modules

| Module | Responsibility |
|---|---|
| `stream-processing/src/jobs/telemetry_stream.py` | Main Spark streaming job |
| `stream-processing/src/schemas/telemetry_schema.py` | Spark schema |
| `stream-processing/src/sinks/minio_sink.py` | Raw Parquet output config |
| `stream-processing/src/sinks/influx_sink.py` | Metrics write config |
| `stream-processing/tests/` | Parser and aggregation tests |

---

## 5. Work Breakdown

### Step 1: Parse Kafka value

- Read topic selected by DEC-005.
- Parse JSON into Spark schema.
- Preserve `sessionId`, `eventId`, `eventType`, `eventTime`, `sequence`.

### Step 2: Write raw Parquet

- Write raw events to MinIO.
- Partition by date/hour and possibly event type.
- Store malformed records separately if dead-letter flow is implemented.

### Step 3: Compute session metrics

- Compute total events per session.
- Compute click count, hit count, miss count and accuracy.
- Compute average reaction time for hit clicks.
- Compute distance/speed from ordered mousemove samples where feasible.

### Step 4: Compute throughput metrics

- Compute events per second/window.
- Compute click throughput/window.
- Record processing latency approximation.

### Step 5: Write aggregate metrics

- Write time-series metrics to InfluxDB.
- Use tags such as `sessionId`, `eventType` only when cardinality is acceptable for demo.

---

## 6. Performance Notes

- Use event-time windows with watermark; do not rely only on processing time for session analytics.
- Avoid collecting large raw datasets to driver.
- Keep InfluxDB writes aggregate-level.
- Checkpoint path must be stable and outside Git.
- Micro-batch interval should balance demo responsiveness and local CPU overhead.

---

## 7. Acceptance Criteria

- [ ] Spark reads telemetry events from Kafka.
- [ ] Raw events are written as Parquet in MinIO.
- [ ] Aggregate metrics are written to InfluxDB.
- [ ] Late event handling policy follows DEC-009.
- [ ] One demo session can be traced through raw and aggregate outputs.
- [ ] Tests cover schema parsing and at least one aggregation.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Spark local test with fixture JSON | PASS |
| End-to-end smoke session | Raw Parquet and Influx metrics created |
| Checkpoint restart smoke test | Streaming job resumes without duplicate crash |

---

## 9. Handoff

This plan feeds [phase4-plan001](../phase4/plan001-dashboard-session-analytics.md) and final performance validation in [phase5-plan001](../phase5/plan001-performance-validation-and-observability.md).

