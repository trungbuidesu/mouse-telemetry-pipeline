# Decision DEC-007: Retry policy có giới hạn memory

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Frontend phải tiếp tục thu telemetry khi backend chậm, nhưng không được giữ dữ liệu vô hạn trong memory. MVP chưa cần IndexedDB persistence, nên retry behavior phải bounded và minh bạch.

`bounded` nghĩa là có giới hạn rõ ràng; khi vượt giới hạn, hệ thống phải drop có kiểm soát và ghi nhận số lượng bị drop thay vì phình memory không giới hạn.

---

## 3. Quyết định

Frontend retry policy:

* Retry một failed batch tối đa 3 lần.
* Dùng backoff delays: 500 ms, 1 s, 2 s.
* Giữ failed batch cho đến khi thành công hoặc đạt retry limit.
* Giữ maximum buffered event count là `20000`.
* Khi áp lực memory buộc phải drop, ưu tiên giữ click/session lifecycle events hơn sampled mousemove events.
* Ghi nhận `droppedEventCount`.
* MVP dùng một in-flight batch cho mỗi session sender.
* Không triển khai IndexedDB persistence trong MVP.

---

## 4. Lý do

* Bounded memory giúp backend lỗi không làm browser crash.
* Retry giới hạn tránh request storm.
* Giữ click bảo vệ scoring và accuracy analytics.
* Dropped event count giúp nhìn thấy data loss.

---

## 5. Hệ quả

### Tích cực

* Failure behavior có thể dự đoán.
* UI có thể hiển thị `buffering`, `offline` hoặc `error`.
* API overload không tạo tăng trưởng memory vô hạn trong browser.

### Đánh đổi

* Nếu outage kéo dài, một phần sampled movement data có thể bị drop.
* Trong MVP, browser refresh làm mất unsent data đang nằm trong memory.

---

## 6. Ràng buộc triển khai

* Batch sender không được xóa batch trước khi nhận accepted response thành công.
* Error classification phải khớp với API responses từ phase2.
* Buffer limit enforcement không được drop `session_end` âm thầm.
* Result page nên hiển thị dropped event count nếu khác 0.

---

## 7. Tài liệu liên quan

* [phase1](../phases/phase1/README.md)
* [phase2](../phases/phase2/README.md)
* [phase5](../phases/phase5/README.md)
* [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)
* [phase2-plan002](../plans/phase2/plan002-backpressure-and-idempotent-ingestion.md)
* [phase5-plan001](../plans/phase5/plan001-performance-validation-and-observability.md)
