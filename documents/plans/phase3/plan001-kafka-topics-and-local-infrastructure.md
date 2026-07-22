# Plan: Kafka topics và local infrastructure

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase3-plan001` |
| Phase | [phase3](../../phases/phase3/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |
| Tracking tasks | `T3.0`, `T3.1`, `T3.2` |

---

## 2. Mục tiêu

Tạo local streaming infrastructure cần cho end-to-end demo: Docker Compose runtime foundation, Kafka, topic bootstrap, MinIO, InfluxDB và Spark runtime wiring.

---

## 3. Decisions liên quan

| Decision | Vì sao cần |
|---|---|
| [DEC-005](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Topic naming, partitioning và keys |
| [DEC-006](../../decisions/decision006-raw-parquet-and-timeseries-metrics.md) | Storage destinations |
| [DEC-010](../../decisions/decision010-local-first-docker-compose-stack.md) | Local demo strategy |

---

## 4. File dự kiến

| File | Responsibility |
|---|---|
| `infrastructure/docker-compose.yml` hoặc root `docker-compose.yml` | Local services |
| `infrastructure/kafka/create-topics.sh` | Topic bootstrap |
| `infrastructure/minio/` | Bucket init nếu cần |
| `infrastructure/influxdb/` | Bucket/org/token init docs hoặc scripts |
| `.env.example` | Local service ports và credentials placeholders |

---

## 5. Work breakdown

### Step 1: Định nghĩa service topology

* Kafka broker và controller setup phù hợp local development.
* MinIO object storage với bucket rõ ràng cho raw telemetry.
* InfluxDB cho aggregate metrics.
* Spark service hoặc documented local Spark command.

### Step 2: Định nghĩa topics

* Tạo telemetry topic cho raw events.
* Optional dead-letter topic cho invalid/unparseable events.
* Dùng retention phù hợp với demo local data volume.

### Step 3: Định nghĩa local data paths

* Lưu runtime volumes ngoài committed source files.
* Thêm `.gitignore` rules cho local data.
* Document reset commands.

### Step 4: Smoke test infrastructure

* Start services.
* Tạo topics.
* Produce và consume một test message.
* Verify MinIO và InfluxDB reachable.

---

## 6. Ghi chú performance

* Local Kafka partition count nên đủ để demo partitioning nhưng không làm demo quá phức tạp.
* Topic key theo `sessionId` giữ per-session ordering trong một partition.
* Retention có thể ngắn cho demo để giới hạn disk usage.
* Không ghi mọi mousemove vào InfluxDB; raw event storage thuộc về MinIO.

---

## 7. Acceptance criteria

* [ ] Docker Compose start được Kafka, MinIO và InfluxDB local.
* [ ] Kafka topics được tạo lặp lại được.
* [ ] API connect được Kafka bằng `.env.example` values.
* [ ] Runtime data directories được Git ignore.
* [ ] Reset instructions được document.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| `docker compose up` | Services healthy |
| Kafka produce/consume smoke test | Message round-trip thành công |
| MinIO smoke test | Bucket tồn tại và nhận object |
| InfluxDB smoke test | Bucket query được |

---

## 9. Bàn giao

Plan này mở khóa [phase3-plan002](plan002-spark-streaming-to-minio-influxdb.md).
