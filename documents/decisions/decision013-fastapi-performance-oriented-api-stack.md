# Decision DEC-013: FastAPI stack định hướng performance

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Ingestion API nằm trên hot path giữa browser và Kafka. API phải validate và accept telemetry batches nhanh, rồi chuyển việc sang downstream systems. API không được biến thành analytics processor.

---

## 3. Quyết định

Dùng API stack sau:

* FastAPI.
* Pydantic v2 cho request/response models.
* `pydantic-settings` cho environment config.
* Uvicorn standard extras cho local ASGI serving.
* `orjson` có sẵn cho custom response paths khi profiling cho thấy có lợi; routes có response model nên dùng serialization trực tiếp của FastAPI/Pydantic.
* pytest, pytest-asyncio, httpx, ruff và mypy cho validation.

Foundation scope chỉ gồm app factory và `GET /health`. Session và batch ingestion endpoints nằm ở phase2.

---

## 4. Lý do

* FastAPI và Pydantic phù hợp HTTP ingestion nặng về schema.
* `pydantic-settings` giữ config có type rõ và dễ test.
* `orjson` giữ một lựa chọn JSON nhanh cho response volume cao trong tương lai mà không ép deprecated response defaults lên typed routes.
* Không đưa analytics vào request path giúp bảo vệ frontend retry và API latency.

---

## 5. Hệ quả

### Tích cực

* API routes có thể được thêm sau app factory có type rõ.
* Health check có sẵn trước khi thêm ingestion endpoints.
* Performance constraints xuất hiện trước khi API lớn dần.

### Đánh đổi

* `orjson` thêm native dependency và nên được dùng có chủ đích, không làm blanket default.
* Cần giữ kỷ luật schema khi thêm endpoints.

---

## 6. Ràng buộc triển khai

* Request handlers không được tính Spark-style analytics.
* Không ghi raw telemetry đồng bộ xuống disk trong request path.
* Kafka producer integration phải nằm sau service boundary.
* Khi thêm ingestion endpoints, error response phải nói rõ retryability.

---

## 7. Tài liệu liên quan

* [phase2](../phases/phase2/README.md)
* [phase2-plan001](../plans/phase2/plan001-fastapi-ingestion-contract.md)
* [phase2-plan002](../plans/phase2/plan002-backpressure-and-idempotent-ingestion.md)
* [coding rules api](../agents/coding_rules_api.md)
