# Plan: Dashboard và session analytics

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase4-plan001` |
| Phase | [phase4](../../phases/phase4/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Cung cấp analytics nhìn thấy được cho demo: throughput/latency cấp hệ thống trong Grafana và session-level metrics hoặc visualizations cho từng Aim Trainer session.

---

## 3. Phụ thuộc

| Dependency | Loại | Ghi chú |
|---|---|---|
| [phase3-plan002](../phase3/plan002-spark-streaming-to-minio-influxdb.md) | Data source | InfluxDB metrics và raw Parquet |
| [DEC-006](../../decisions/decision006-raw-parquet-and-timeseries-metrics.md) | Storage | Dashboard đọc aggregate store |
| [DEC-009](../../decisions/decision009-session-analytics-event-time-watermark.md) | Processing state | Dashboard phải xử lý metrics delay |

---

## 4. Output dự kiến

* Grafana dashboard JSON dưới `dashboards/grafana/`.
* Dashboard panels:
  * Events per second.
  * Click throughput.
  * Total events.
  * Average processing latency.
  * Recent sessions table.
* Session detail endpoint hoặc frontend view nếu cần.
* Heatmap hoặc trajectory view cơ bản cho MVP.

---

## 5. Work breakdown

### Step 1: Định nghĩa dashboard queries

* Map từng KPI vào InfluxDB measurement/field.
* Giữ tag cardinality thấp.
* Xử lý empty data nhẹ nhàng.

### Step 2: Xây Grafana dashboard

* Thêm panels cho throughput và latency.
* Thêm recent session table.
* Chỉ thêm variables nếu giúp demo rõ hơn.

### Step 3: Thêm session analytics surface

* Dùng backend metrics endpoint cho session summary.
* Dùng raw hoặc derived data cho heatmap/trajectory chỉ ở quy mô MVP.
* Tránh load full raw session lớn vào browser nếu chưa sampling.

### Step 4: Document evidence path

Với mỗi panel, document dữ liệu đến từ đâu:

* Frontend event.
* API batch.
* Kafka topic.
* Spark metric.
* InfluxDB query.

---

## 6. Ghi chú performance

* Dashboard nên query aggregate data, không query raw telemetry.
* Heatmap/trajectory nên dùng sampled hoặc bounded data.
* Grafana refresh interval nên phù hợp demo nhưng không overload InfluxDB.
* Session list phải limit recent rows.

---

## 7. Acceptance criteria

* [ ] Dashboard hiển thị events per second từ real pipeline data.
* [ ] Dashboard hiển thị ít nhất một session-level metric.
* [ ] Session detail hoặc result page hiển thị processed metrics khi có.
* [ ] Empty/processing states rõ ràng.
* [ ] Dashboard JSON được commit, runtime Grafana data thì không.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Chạy một session | Dashboard cập nhật |
| Chạy load generator | Throughput panel tăng |
| Query review | Panels dùng aggregate measurements |

---

## 9. Bàn giao

Plan này hỗ trợ [phase4-plan002](plan002-demo-scenarios-and-load-generation.md) và final runbooks trong [phase5-plan002](../phase5/plan002-packaging-runbooks-and-final-report.md).
