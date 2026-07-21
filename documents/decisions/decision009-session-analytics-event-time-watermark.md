# Decision DEC-009: Session Analytics Event-Time Watermark

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

Telemetry events carry client-side `eventTime`. Events may arrive late because of batching, retry, backend delay or Spark micro-batch timing. Session analytics should use event time so metrics reflect when the user acted, not only when the backend processed the data.

---

## 3. Decision

Spark session analytics will use event-time processing based on `eventTime`.

For MVP local demo:

- Use a default watermark tolerance of `10 seconds`.
- Treat metrics as `processing` until `session_end` is observed and the watermark has allowed late batches to arrive.
- Events arriving later than the watermark may be counted as late/dropped in observability metrics.

---

## 4. Rationale

- Event-time aggregation produces more accurate session metrics under batching and retry.
- A 10 second watermark is easy to explain and practical for 30/60 second sessions.
- Processing status helps frontend/dashboard explain asynchronous Spark delay.

---

## 5. Consequences

### Positive

- Session metrics are resilient to small transport delays.
- Result page can show provisional frontend result while backend is processing.
- Late data behavior is explicit.

### Trade-offs

- Backend official metrics can lag session completion.
- Very late events beyond watermark may not affect final aggregates.

---

## 6. Implementation Constraints

- Spark schema must parse `eventTime` into timestamp type.
- Aggregations should use watermark before finalizing session metrics.
- Dashboard and result page must handle `processing` status.
- Observability should count late events if feasible.

---

## 7. Linked Documents

- [phase3](../phases/phase3/README.md)
- [phase4](../phases/phase4/README.md)
- [phase1-plan003](../plans/phase1/plan003-session-result-and-client-analytics.md)
- [phase3-plan002](../plans/phase3/plan002-spark-streaming-to-minio-influxdb.md)
- [phase4-plan001](../plans/phase4/plan001-dashboard-session-analytics.md)

