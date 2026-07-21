# Phase 4: Analytics and Demo

## 1. Mục tiêu

Phase 4 biến dữ liệu đã xử lý thành câu chuyện demo rõ ràng: người dùng chơi Aim Trainer, telemetry đi qua pipeline, dashboard hiển thị throughput/latency/session metrics, và session detail thể hiện trajectory hoặc heatmap.

---

## 2. Scope

### In scope

- Dashboard KPI: active sessions, events per second, total events, processing latency.
- Biểu đồ throughput theo thời gian.
- Session list gần nhất.
- Session detail với metrics, trajectory hoặc heatmap cơ bản.
- Demo script cho luồng end-to-end.
- Load generator tách riêng khỏi app người chơi.

### Out of scope

- Dashboard production-grade.
- Alerting phức tạp.
- User account và lịch sử cá nhân.
- Replay video đầy đủ.
- So sánh bot/người thật bằng ML.

---

## 3. Dependencies

| Dependency | Từ phase | Ghi chú |
|---|---|---|
| Frontend session/result | phase1 | Demo cần app playable |
| Ingestion API | phase2 | Dashboard cần dữ liệu đi qua API thật |
| InfluxDB metrics | phase3 | Grafana/query metrics dựa vào dữ liệu đã aggregate |
| Raw Parquet | phase3 | Session detail có thể dùng raw sample/derived data |

---

## 4. Plans

| Plan | Vai trò | Output chính |
|---|---|---|
| [plan001-dashboard-session-analytics](../../plans/phase4/plan001-dashboard-session-analytics.md) | Hiển thị analytics | Grafana dashboard, session detail data |
| [plan002-demo-scenarios-and-load-generation](../../plans/phase4/plan002-demo-scenarios-and-load-generation.md) | Chuẩn bị demo và tải thử | Demo script, load generator, expected outputs |

---

## 5. Decisions

| Decision | Áp dụng trong phase |
|---|---|
| [DEC-006: Raw Parquet and time-series metrics](../../decisions/decision006-raw-parquet-and-timeseries-metrics.md) | Nguồn dữ liệu dashboard/detail |
| [DEC-008: Load generator separated from player app](../../decisions/decision008-load-generator-separated-from-player-app.md) | Tạo tải lớn không làm bẩn UX |
| [DEC-009: Session analytics event-time watermark](../../decisions/decision009-session-analytics-event-time-watermark.md) | Metrics processing status và late data |

---

## 6. Demo Requirements

Demo phải chứng minh được:

1. Session tạo event liên tục.
2. Event được gom batch trước khi gửi.
3. API nhận batch và Kafka có event.
4. Spark xử lý bất đồng bộ.
5. Raw data và aggregate metrics được lưu ở hai nơi khác nhau.
6. Dashboard thay đổi khi có session mới hoặc load generator chạy.

---

## 7. Completion Gate

Phase 4 hoàn thành khi:

- Có ít nhất một dashboard hoặc màn hình analytics đọc dữ liệu đã qua pipeline.
- Session demo có thể truy vết từ frontend đến storage.
- Load generator tạo tải có kiểm soát và không phụ thuộc UI người chơi.
- Demo script ghi rõ setup, thao tác, expected evidence và cách reset môi trường.

