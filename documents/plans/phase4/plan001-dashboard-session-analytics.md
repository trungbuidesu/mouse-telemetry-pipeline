# Plan: Dashboard and Session Analytics

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase4-plan001` |
| Phase | [phase4](../../phases/phase4/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Provide visible analytics for the demo: system-level throughput/latency in Grafana and session-level metrics or visualizations for individual Aim Trainer sessions.

---

## 3. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| [phase3-plan002](../phase3/plan002-spark-streaming-to-minio-influxdb.md) | Data source | InfluxDB metrics and raw Parquet |
| [DEC-006](../../decisions/decision006-raw-parquet-and-timeseries-metrics.md) | Storage | Dashboard reads aggregate store |
| [DEC-009](../../decisions/decision009-session-analytics-event-time-watermark.md) | Processing state | Dashboard must handle metrics delay |

---

## 4. Planned Outputs

- Grafana dashboard JSON under `dashboards/grafana/`.
- Dashboard panels:
  - Events per second.
  - Click throughput.
  - Total events.
  - Average processing latency.
  - Recent sessions table.
- Session detail endpoint or frontend view if needed.
- Basic heatmap or trajectory view for MVP.

---

## 5. Work Breakdown

### Step 1: Define dashboard queries

- Map each KPI to InfluxDB measurement/field.
- Keep tag cardinality low.
- Handle empty data gracefully.

### Step 2: Build Grafana dashboard

- Add panels for throughput and latency.
- Add recent session table.
- Add variables only if they improve demo clarity.

### Step 3: Add session analytics surface

- Use backend metrics endpoint for session summary.
- Use raw or derived data for heatmap/trajectory only at MVP scale.
- Avoid loading a full large raw session into the browser without sampling.

### Step 4: Document evidence path

- For each panel, document where the data came from:
  - Frontend event.
  - API batch.
  - Kafka topic.
  - Spark metric.
  - InfluxDB query.

---

## 6. Performance Notes

- Dashboard should query aggregate data, not raw telemetry.
- Heatmap/trajectory should use sampled or bounded data.
- Grafana refresh interval should be demo-friendly but not overload InfluxDB.
- Session list should limit recent rows.

---

## 7. Acceptance Criteria

- [ ] Dashboard shows events per second from real pipeline data.
- [ ] Dashboard shows at least one session-level metric.
- [ ] Session detail or result page can show processed metrics when available.
- [ ] Empty/processing states are clear.
- [ ] Dashboard JSON is committed, runtime Grafana data is not.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Run one session | Dashboard updates |
| Run load generator | Throughput panel increases |
| Query review | Panels use aggregate measurements |

---

## 9. Handoff

This plan supports [phase4-plan002](plan002-demo-scenarios-and-load-generation.md) and final runbooks in [phase5-plan002](../phase5/plan002-packaging-runbooks-and-final-report.md).

