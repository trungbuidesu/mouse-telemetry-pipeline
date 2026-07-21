# Phase 3: Stream Processing and Storage

## 1. Mục tiêu

Phase 3 biến telemetry stream thành dữ liệu có thể lưu trữ và phân tích. Kafka đóng vai trò buffer sự kiện, Spark Structured Streaming đọc event theo event-time, ghi raw telemetry vào MinIO dạng Parquet và ghi metrics tổng hợp vào InfluxDB.

---

## 2. Scope

### In scope

- Kafka topics cho telemetry và session lifecycle.
- Local infrastructure cho Kafka, MinIO, InfluxDB và Spark.
- Spark job đọc event từ Kafka.
- Parse và validate schema ở streaming layer.
- Ghi raw event partitioned vào MinIO.
- Tính metrics session/time-window cơ bản.
- Ghi metrics time-series vào InfluxDB.
- Checkpoint Spark trong volume riêng, không commit vào Git.

### Out of scope

- Dashboard Grafana hoàn chỉnh.
- Machine learning hoặc bot detection.
- Exactly-once end-to-end tuyệt đối.
- Distributed production deployment.

---

## 3. Dependencies

| Dependency | Từ phase | Ghi chú |
|---|---|---|
| Kafka producer payload | phase2 | Spark consumer phải khớp topic/value format |
| Event schema | phase0 | Schema drift phải được ghi decision/follow-up |
| Storage decision | phase0, phase3 | Raw và aggregate không ghi chung một nơi |

---

## 4. Plans

| Plan | Vai trò | Output chính |
|---|---|---|
| [plan001-kafka-topics-and-local-infrastructure](../../plans/phase3/plan001-kafka-topics-and-local-infrastructure.md) | Chuẩn bị hạ tầng stream local | Docker Compose service, topic bootstrap |
| [plan002-spark-streaming-to-minio-influxdb](../../plans/phase3/plan002-spark-streaming-to-minio-influxdb.md) | Xử lý và lưu stream | Spark job, Parquet raw, Influx metrics |

---

## 5. Decisions

| Decision | Áp dụng trong phase |
|---|---|
| [DEC-005: Kafka topic layout and event keys](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Topic, key, partition strategy |
| [DEC-006: Raw Parquet and time-series metrics](../../decisions/decision006-raw-parquet-and-timeseries-metrics.md) | MinIO/InfluxDB storage split |
| [DEC-009: Session analytics event-time watermark](../../decisions/decision009-session-analytics-event-time-watermark.md) | Window aggregation, late data handling |

---

## 6. Performance Requirements

- Kafka partitioning phải giữ được ordering tương đối theo `sessionId`.
- Spark dùng micro-batch hợp lý cho demo local, tránh batch quá nhỏ gây overhead.
- Raw writes dùng Parquet để giảm dung lượng và hỗ trợ phân tích sau demo.
- Metrics writes vào InfluxDB phải aggregate trước, không ghi mọi `mousemove` vào Influx.
- Checkpoint và data volume không được commit vào Git.

---

## 7. Completion Gate

Phase 3 hoàn thành khi:

1. Event từ API xuất hiện trong Kafka.
2. Spark đọc được stream và parse event theo schema.
3. Raw event được ghi vào MinIO theo partition dễ truy vết.
4. Metrics session hoặc throughput được ghi vào InfluxDB.
5. Có validation cho ít nhất một session demo end-to-end từ API đến storage.

