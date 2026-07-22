# Decision DEC-004: HTTP ingestion trước Kafka

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Browser không nên kết nối trực tiếp đến Kafka. Direct Kafka access sẽ kéo theo độ phức tạp về security, networking và protocol nằm ngoài MVP. Kiến trúc đã xác định FastAPI Ingestion là component đứng giữa Aim Trainer và Kafka.

---

## 3. Quyết định

Browser gửi session và telemetry data đến FastAPI qua HTTP. FastAPI validate payload và produce các event đã accept vào Kafka.

Endpoints chính:

* `POST /api/v1/sessions`
* `POST /api/v1/events/batch`
* `POST /api/v1/sessions/{sessionId}/complete`
* `GET /api/v1/sessions/{sessionId}/metrics`

Frontend không được biết Kafka broker addresses, topic names hoặc producer configuration.

---

## 4. Lý do

* HTTP là browser-native và dễ debug.
* FastAPI tập trung schema validation và error handling.
* Kafka credentials và networking nằm phía server.
* Backend có thể thay đổi topic layout mà không cần sửa frontend code.

---

## 5. Hệ quả

### Tích cực

* Boundary giữa client và pipeline rõ ràng.
* Local demo dễ chạy bằng browser + API.
* API có thể áp dụng backpressure và idempotency rules.

### Đánh đổi

* FastAPI trở thành component bắt buộc cho end-to-end ingestion.
* API availability ảnh hưởng đến telemetry delivery, nên frontend cần retry và buffer limits.

---

## 6. Ràng buộc triển khai

* FastAPI request path phải trả về nhanh sau khi validate và accept batch.
* API phải phân biệt invalid payload error với lỗi retryable do Kafka/API overload.
* API phải reuse Kafka producer resources, không tạo producer mới cho mỗi request.
* Frontend phải dùng batch endpoint, không dùng per-event endpoint.

---

## 7. Tài liệu liên quan

* [phase0](../phases/phase0/README.md)
* [phase2](../phases/phase2/README.md)
* [phase0-plan002](../plans/phase0/plan002-contract-first-schema-and-api.md)
* [phase2-plan001](../plans/phase2/plan001-fastapi-ingestion-contract.md)
