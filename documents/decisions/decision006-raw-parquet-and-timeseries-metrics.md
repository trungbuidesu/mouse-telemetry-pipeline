# Decision DEC-006: Raw Parquet và time-series metrics

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Kiến trúc yêu cầu raw telemetry và aggregated metrics được lưu ở các nơi khác nhau. Raw mouse telemetry có thể lớn và phù hợp hơn với object storage. Dashboard metrics là time-series aggregates nên phù hợp hơn với InfluxDB/Grafana.

---

## 3. Quyết định

Lưu raw telemetry events vào MinIO ở định dạng Parquet.

Lưu aggregated metrics vào InfluxDB.

Không ghi mọi raw `mousemove` event vào InfluxDB.

Raw path khuyến nghị:

```text
s3a://mouse-telemetry/raw/events/date=YYYY-MM-DD/hour=HH/
```

Nhóm metric khuyến nghị:

* event throughput
* click throughput
* processing latency
* session summary metrics
* ingestion accepted/rejected counters

---

## 4. Lý do

* Parquet giảm dung lượng raw storage và hỗ trợ analytics sau này.
* MinIO minh họa object storage pattern cho raw data kiểu data lake.
* InfluxDB hỗ trợ time-series queries thân thiện với Grafana.
* Tách raw data và aggregate data giúp dashboard query nhanh hơn.

---

## 5. Hệ quả

### Tích cực

* Câu chuyện raw vs processed data rõ ràng cho Big Data demo.
* Dashboard không phải scan raw telemetry.
* Raw data vẫn có sẵn cho phân tích sau này.

### Đánh đổi

* Cần cấu hình hai storage systems.
* Spark job sở hữu hai write paths với failure mode khác nhau.

---

## 6. Ràng buộc triển khai

* Spark ghi raw event records vào MinIO, không phải FastAPI.
* InfluxDB writes nên ở mức aggregate.
* Runtime buckets, local volumes và checkpoints không được commit.
* Session detail cần raw trajectory phải load dữ liệu bounded/sampled.

---

## 7. Tài liệu liên quan

* [phase3](../phases/phase3/README.md)
* [phase4](../phases/phase4/README.md)
* [phase3-plan002](../plans/phase3/plan002-spark-streaming-to-minio-influxdb.md)
* [phase4-plan001](../plans/phase4/plan001-dashboard-session-analytics.md)
