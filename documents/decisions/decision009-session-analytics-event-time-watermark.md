# Decision DEC-009: Event-time watermark cho session analytics

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Telemetry events mang `eventTime` từ client. Events có thể đến muộn vì batching, retry, backend delay hoặc Spark micro-batch timing. Session analytics nên dùng event time để metrics phản ánh thời điểm người dùng thật sự hành động, không chỉ thời điểm backend xử lý dữ liệu.

`watermark` là ngưỡng chờ dữ liệu muộn trong stream processing. Sau khi vượt watermark, hệ thống có thể finalize aggregate và xem event đến muộn hơn là late/dropped tùy policy.

---

## 3. Quyết định

Spark session analytics sẽ dùng event-time processing dựa trên `eventTime`.

Với MVP local demo:

* Dùng default watermark tolerance `10 seconds`.
* Xem metrics là `processing` cho đến khi thấy `session_end` và watermark đã cho phép late batches đến.
* Events đến muộn hơn watermark có thể được tính là late/dropped trong observability metrics.

---

## 4. Lý do

* Event-time aggregation tạo session metrics chính xác hơn khi có batching và retry.
* Watermark 10 giây dễ giải thích và thực tế với session 30/60 giây.
* Processing status giúp frontend/dashboard giải thích độ trễ bất đồng bộ của Spark.

---

## 5. Hệ quả

### Tích cực

* Session metrics chống chịu tốt hơn với transport delay nhỏ.
* Result page có thể hiển thị provisional frontend result trong khi backend đang xử lý.
* Late data behavior được nói rõ.

### Đánh đổi

* Official backend metrics có thể trễ hơn thời điểm session kết thúc.
* Events quá muộn so với watermark có thể không ảnh hưởng final aggregates.

---

## 6. Ràng buộc triển khai

* Spark schema phải parse `eventTime` thành timestamp type.
* Aggregations nên dùng watermark trước khi finalize session metrics.
* Dashboard và result page phải xử lý `processing` status.
* Observability nên đếm late events nếu khả thi.

---

## 7. Tài liệu liên quan

* [phase3](../phases/phase3/README.md)
* [phase4](../phases/phase4/README.md)
* [phase1-plan003](../plans/phase1/plan003-session-result-and-client-analytics.md)
* [phase3-plan002](../plans/phase3/plan002-spark-streaming-to-minio-influxdb.md)
* [phase4-plan001](../plans/phase4/plan001-dashboard-session-analytics.md)
