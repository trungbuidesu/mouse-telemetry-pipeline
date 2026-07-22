# Plan: Spark Streaming tới MinIO và InfluxDB

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase3-plan002` |
| Phase | [phase3](../../phases/phase3/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Triển khai Spark Structured Streaming job đọc Kafka telemetry, parse events, ghi raw records vào MinIO dạng Parquet và ghi aggregate metrics vào InfluxDB.

---

## 3. Decisions liên quan

| Decision | Vì sao cần |
|---|---|
| [DEC-005](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Giả định khi đọc Kafka |
| [DEC-006](../../decisions/decision006-raw-parquet-and-timeseries-metrics.md) | Storage split |
| [DEC-009](../../decisions/decision009-session-analytics-event-time-watermark.md) | Event-time aggregation |

---

## 4. Module dự kiến

| Module | Responsibility |
|---|---|
| `stream-processing/src/jobs/telemetry_stream.py` | Main Spark streaming job |
| `stream-processing/src/schemas/telemetry_schema.py` | Spark schema |
| `stream-processing/src/sinks/minio_sink.py` | Raw Parquet output config |
| `stream-processing/src/sinks/influx_sink.py` | Metrics write config |
| `stream-processing/tests/` | Parser và aggregation tests |

---

## 5. Work breakdown

### Step 1: Parse Kafka value

* Đọc topic được chọn trong DEC-005.
* Parse JSON vào Spark schema.
* Giữ `sessionId`, `eventId`, `eventType`, `eventTime`, `sequence`.

### Step 2: Ghi raw Parquet

* Ghi raw events vào MinIO.
* Partition theo date/hour và có thể theo event type.
* Lưu malformed records riêng nếu triển khai dead-letter flow.

### Step 3: Tính session metrics

* Tính total events theo session.
* Tính click count, hit count, miss count và accuracy.
* Tính average reaction time cho hit clicks.
* Tính distance/speed từ ordered mousemove samples nếu khả thi.

### Step 4: Tính throughput metrics

* Tính events per second/window.
* Tính click throughput/window.
* Ghi processing latency xấp xỉ.

### Step 5: Ghi aggregate metrics

* Ghi time-series metrics vào InfluxDB.
* Chỉ dùng tags như `sessionId`, `eventType` khi cardinality chấp nhận được cho demo.

`tag cardinality` là số lượng giá trị khác nhau của một tag trong time-series database. Cardinality quá cao có thể làm InfluxDB query và lưu trữ kém hiệu quả.

---

## 6. Ghi chú performance

* Dùng event-time windows với watermark; không chỉ dựa vào processing time cho session analytics.
* Tránh collect raw dataset lớn về Spark driver.
* Giữ InfluxDB writes ở mức aggregate.
* Checkpoint path phải ổn định và nằm ngoài Git.
* Micro-batch interval nên cân bằng giữa demo responsiveness và CPU overhead trên máy local.

---

## 7. Acceptance criteria

* [ ] Spark đọc telemetry events từ Kafka.
* [ ] Raw events được ghi dạng Parquet trong MinIO.
* [ ] Aggregate metrics được ghi vào InfluxDB.
* [ ] Late event handling policy theo DEC-009.
* [ ] Một demo session có thể truy vết qua raw và aggregate outputs.
* [ ] Tests cover schema parsing và ít nhất một aggregation.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Spark local test với fixture JSON | PASS |
| End-to-end smoke session | Raw Parquet và Influx metrics được tạo |
| Checkpoint restart smoke test | Streaming job resume không crash vì duplicate |

---

## 9. Bàn giao

Plan này feed [phase4-plan001](../phase4/plan001-dashboard-session-analytics.md) và final performance validation trong [phase5-plan001](../phase5/plan001-performance-validation-and-observability.md).
