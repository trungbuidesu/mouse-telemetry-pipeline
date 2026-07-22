# Decision DEC-002: Batching và sampling phía client

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

`mousemove` có thể phát sinh với tần suất cao. Nếu gửi một HTTP request cho mỗi mouse event, browser, API và Kafka producer sẽ bị quá tải trong khi giá trị phân tích tăng không đáng kể cho MVP.

Kiến trúc cần demo được việc dữ liệu phát sinh liên tục và được gửi theo batch. UI cũng phải giữ được độ mượt trong lúc thu telemetry.

---

## 3. Quyết định

Frontend sẽ gom telemetry thành batch trước khi gửi đến FastAPI.

Policy mặc định:

* Flush khi buffer đạt `100` events.
* Flush mỗi `250 ms` khi session đang chạy.
* Sample `mousemove` tối đa một recorded event mỗi `16 ms`.
* Không bao giờ sample bỏ `click`, `session_start` hoặc `session_end`.
* Gửi batch qua HTTP API, không gửi trực tiếp vào Kafka.

---

## 4. Lý do

* Batch 100 events đủ nhỏ để local API parse nhanh và đủ lớn để tránh request storm.
* Interval 250 ms tạo cảm giác near-real-time cho demo.
* Sampling 16 ms cho `mousemove` xấp xỉ 60 samples/giây, đủ cho trajectory và speed metrics.
* Giữ nguyên click giúp accuracy và reaction metrics chính xác.

---

## 5. Hệ quả

### Tích cực

* Browser gửi request volume có thể dự đoán.
* API và Kafka nhận batch có kiểm soát.
* UI có ít side effect trong hot path hơn.
* Demo vẫn có thể sinh hàng nghìn events trong một session.

### Đánh đổi

* Raw browser mousemove event vượt quá sample rate sẽ chủ động không được giữ lại.
* Việc dựng lại chuyển động cực kỳ chi tiết nằm ngoài scope MVP.

---

## 6. Ràng buộc triển khai

* Sampling phải xảy ra trước khi append `mousemove` vào telemetry buffer.
* Batch flush vẫn phải chạy trong trạng thái session finishing.
* Config values nên đến từ environment variables hoặc telemetry config defaults.
* Load testing không được thực hiện bằng cách tắt sampling trong player app; dùng DEC-008.

---

## 7. Tài liệu liên quan

* [phase1](../phases/phase1/README.md)
* [phase5](../phases/phase5/README.md)
* [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)
* [phase4-plan002](../plans/phase4/plan002-demo-scenarios-and-load-generation.md)
* [DEC-008](decision008-load-generator-separated-from-player-app.md)
