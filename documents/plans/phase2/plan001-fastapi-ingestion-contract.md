# Plan: FastAPI Ingestion Contract

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase2-plan001` |
| Phase | [phase2](../../phases/phase2/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Triển khai FastAPI làm HTTP ingestion boundary ổn định cho browser clients. API validate session và telemetry payloads, accept valid batches thật nhanh rồi forward events sang Kafka.

---

## 3. Decisions liên quan

| Decision | Vì sao cần |
|---|---|
| [DEC-001](../../decisions/decision001-canvas-relative-telemetry-schema.md) | Shared payload semantics |
| [DEC-004](../../decisions/decision004-http-ingestion-before-kafka.md) | Browser gửi HTTP, backend sở hữu Kafka |
| [DEC-005](../../decisions/decision005-kafka-topic-layout-and-event-keys.md) | Producer topic và key behavior |
| [DEC-012](../../decisions/decision012-uv-managed-python-api-environment.md) | Khả năng tái lập uv-managed Python |
| [DEC-013](../../decisions/decision013-fastapi-performance-oriented-api-stack.md) | FastAPI stack và request-path performance constraints |

---

## 4. Module dự kiến

| Module | Responsibility |
|---|---|
| `ingestion-api/app/main.py` | FastAPI application factory |
| `ingestion-api/app/core/config.py` | pydantic-settings configuration |
| `ingestion-api/app/api/routes/sessions.py` | Endpoints vòng đời session |
| `ingestion-api/app/api/routes/events.py` | Telemetry batch endpoint |
| `ingestion-api/app/schemas/telemetry.py` | Pydantic event và batch models |
| `ingestion-api/app/services/kafka_producer.py` | Kafka producer boundary |
| `schemas/telemetry/` | Shared schema fixtures/docs |

---

## 5. Work breakdown

### Step 1: Khởi tạo API project

* [x] Tạo FastAPI app có health endpoint. (T0.6 baseline; T2.1 moved to `app/api/routes/health.py`)
* [x] Chạy bằng uv-managed Python 3.12.13.
* [x] Thêm config cho Kafka bootstrap servers và topic names. (T2.1 typed Settings; producer ở T2.5)
* [x] Thêm entries trong `.env.example`.
* [x] Scaffold `app/api/routes` package with empty sessions/events routers (T2.1).

### Step 2: Triển khai schema models

* Định nghĩa base telemetry event model.
* Định nghĩa event models cho `session_start`, `mousemove`, `click`, `session_end`.
* Định nghĩa batch model và request size constraints.
* Validate khoảng normalized coordinate khi được cung cấp.

### Step 3: Triển khai endpoints

* `POST /api/v1/sessions`
* `POST /api/v1/events/batch`
* `POST /api/v1/sessions/{sessionId}/complete`
* `GET /api/v1/sessions/{sessionId}/metrics`

### Step 4: Produce Kafka messages

* Key telemetry messages theo `sessionId`.
* Giữ event payload và chỉ thêm ingestion metadata khi cần.
* Trả `202 Accepted` sau khi valid batch được accept để produce.

---

## 6. Ghi chú performance

* Request path không được tính session analytics.
* Validation nên reject bad payload trước Kafka.
* Logging nên summarize batch counts và identifiers, không dump từng event.
* Kafka producer nên được reuse, không tạo lại theo mỗi request.
* API nên expose payload size và batch count limits trong config.
* Giữ `orjson` sẵn cho custom response paths có profiling, nhưng không ép deprecated response defaults lên `response_model` routes hoặc dùng tốc độ JSON làm lý do nhét analytics vào request path.

---

## 7. Acceptance criteria

* [ ] Session endpoint accept valid session metadata.
* [ ] Batch endpoint accept valid mixed event batches.
* [ ] Invalid event type hoặc thiếu required field trả structured `400`.
* [ ] Batch được API accept sẽ produce vào Kafka topic.
* [ ] Health endpoint báo API liveness.
* [ ] Tests cover accepted batch, invalid payload và producer failure.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| FastAPI unit tests | PASS |
| Contract fixture tests | PASS |
| Local API smoke test | `POST /api/v1/events/batch` trả expected status |

---

## 9. Bàn giao

Plan này mở khóa [phase2-plan002](plan002-backpressure-and-idempotent-ingestion.md) và [phase3-plan001](../phase3/plan001-kafka-topics-and-local-infrastructure.md).
