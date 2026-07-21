# Plan: Kafka Topics and Local Infrastructure

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase3-plan001` |
| Phase | [phase3](../../phases/phase3/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Create the local streaming infrastructure required for the end-to-end demo: Kafka, topic bootstrap, MinIO, InfluxDB and Spark runtime wiring.

---

## 3. Related Decisions

| Decision | Why needed |
|---|---|
| [DEC-005](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Topic naming, partitioning and keys |
| [DEC-006](../../decisions/decision006-raw-parquet-and-timeseries-metrics.md) | Storage destinations |
| [DEC-010](../../decisions/decision010-local-first-docker-compose-stack.md) | Local demo strategy |

---

## 4. Planned Files

| File | Responsibility |
|---|---|
| `infrastructure/docker-compose.yml` or root `docker-compose.yml` | Local services |
| `infrastructure/kafka/create-topics.sh` | Topic bootstrap |
| `infrastructure/minio/` | Bucket init if needed |
| `infrastructure/influxdb/` | Bucket/org/token init docs or scripts |
| `.env.example` | Local service ports and credentials placeholders |

---

## 5. Work Breakdown

### Step 1: Define service topology

- Kafka broker and controller setup appropriate for local development.
- MinIO object storage with explicit bucket for raw telemetry.
- InfluxDB for aggregate metrics.
- Spark service or documented local Spark command.

### Step 2: Define topics

- Create telemetry topic for raw events.
- Optionally create dead-letter topic for invalid/unparseable events.
- Use retention appropriate for demo local data volume.

### Step 3: Define local data paths

- Store runtime volumes outside committed source files.
- Add `.gitignore` rules for local data.
- Document reset commands.

### Step 4: Smoke test infrastructure

- Start services.
- Create topics.
- Produce and consume one test message.
- Verify MinIO and InfluxDB are reachable.

---

## 6. Performance Notes

- Local Kafka partition count should be enough to demonstrate partitioning but not overcomplicate the demo.
- Topic key by `sessionId` preserves per-session ordering within a partition.
- Retention can be short for demo to keep disk usage bounded.
- Do not write every mousemove to InfluxDB; raw event storage belongs in MinIO.

---

## 7. Acceptance Criteria

- [ ] Docker Compose starts Kafka, MinIO and InfluxDB locally.
- [ ] Kafka topics are created repeatably.
- [ ] API can connect to Kafka using `.env.example` values.
- [ ] Runtime data directories are ignored by Git.
- [ ] Reset instructions are documented.

---

## 8. Validation

| Check | Expected result |
|---|---|
| `docker compose up` | Services become healthy |
| Kafka produce/consume smoke test | Message round-trip succeeds |
| MinIO smoke test | Bucket exists and accepts object |
| InfluxDB smoke test | Bucket is queryable |

---

## 9. Handoff

This plan unlocks [phase3-plan002](plan002-spark-streaming-to-minio-influxdb.md).

