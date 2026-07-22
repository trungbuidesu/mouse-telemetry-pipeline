# Decision DEC-008: Load generator tách khỏi player app

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Pipeline có thể cần nhiều event hơn một người chơi thật có thể tạo ra thoải mái. Tăng raw mousemove frequency trong player app sẽ làm hại UX và làm yếu thiết kế performance. Kiến trúc vì vậy đề xuất load generator tách riêng cho tải lớn hơn.

---

## 3. Quyết định

Synthetic load phải được sinh bởi một script/tool riêng, gửi valid session và telemetry batches qua cùng FastAPI ingestion API.

Player app giữ sampling và batching defaults của MVP từ DEC-002.

---

## 4. Lý do

* Player UX vẫn đại diện cho người dùng thật và giữ được độ mượt.
* Load testing trở nên configurable và repeatable.
* Synthetic data vẫn đi qua FastAPI, Kafka, Spark và storage.
* Demo tách rõ manual session behavior và stress/load behavior.

---

## 5. Hệ quả

### Tích cực

* Throughput cho dashboard demo được kiểm soát.
* Defaults an toàn cho local machine.
* Không cần bóp méo frontend telemetry hot path.

### Đánh đổi

* Cần maintain thêm script/tool.
* Synthetic data nên được đánh dấu hoặc document rõ để không nhầm với manual play.

---

## 6. Ràng buộc triển khai

* Load generator phải gửi HTTP batches, không gửi Kafka messages trực tiếp.
* Nên sinh `session_start`, `mousemove`, `click` và `session_end` events.
* Nên expose controls cho session count, duration, event rate và batch size.
* Defaults không được làm quá tải local Docker Compose services.

---

## 7. Tài liệu liên quan

* [phase4](../phases/phase4/README.md)
* [phase5](../phases/phase5/README.md)
* [phase4-plan002](../plans/phase4/plan002-demo-scenarios-and-load-generation.md)
* [phase5-plan001](../plans/phase5/plan001-performance-validation-and-observability.md)
