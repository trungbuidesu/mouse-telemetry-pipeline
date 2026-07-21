# Decision DEC-006: Raw Parquet and Time-Series Metrics

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

The architecture requires raw telemetry and aggregated metrics to be stored in different places. Raw mouse telemetry can be large and is better suited to object storage. Dashboard metrics are time-series aggregates and are better suited to InfluxDB/Grafana.

---

## 3. Decision

Store raw telemetry events in MinIO as Parquet.

Store aggregated metrics in InfluxDB.

Do not write every raw `mousemove` event to InfluxDB.

Recommended raw path shape:

```text
s3a://mouse-telemetry/raw/events/date=YYYY-MM-DD/hour=HH/
```

Recommended metric categories:

- event throughput
- click throughput
- processing latency
- session summary metrics
- ingestion accepted/rejected counters

---

## 4. Rationale

- Parquet reduces raw storage size and supports later analytics.
- MinIO demonstrates object storage pattern for data lake-style raw data.
- InfluxDB supports Grafana-friendly time-series queries.
- Separating raw and aggregate data keeps dashboard queries fast.

---

## 5. Consequences

### Positive

- Clear raw vs processed data story for Big Data demo.
- Dashboard does not scan raw telemetry.
- Raw data remains available for later analysis.

### Trade-offs

- Two storage systems must be configured.
- Spark job owns two write paths with different failure modes.

---

## 6. Implementation Constraints

- Spark writes raw event records to MinIO, not FastAPI.
- InfluxDB writes should be aggregate-level.
- Runtime buckets, local volumes and checkpoints must not be committed.
- Session detail that needs raw trajectory should load bounded/sampled data.

---

## 7. Linked Documents

- [phase3](../phases/phase3/README.md)
- [phase4](../phases/phase4/README.md)
- [phase3-plan002](../plans/phase3/plan002-spark-streaming-to-minio-influxdb.md)
- [phase4-plan001](../plans/phase4/plan001-dashboard-session-analytics.md)

