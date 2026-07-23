# Plan: FastAPI Ingestion Contract

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase2-plan001` |
| Phase | [phase2](../../phases/phase2/README.md) |
| Status | `IN_PROGRESS` |
| Cập nhật lần cuối | `2026-07-24` |
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
| `ingestion-api/app/schemas/sessions.py` | Pydantic session create/complete/metrics models |
| `ingestion-api/app/services/telemetry_producer.py` | TelemetryProducer Protocol + NoOp/Recording + KafkaTelemetryProducer (aiokafka) |
| `ingestion-api/app/services/session_store.py` | In-memory session lifecycle store |
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

* [x] Định nghĩa base telemetry event model. (T2.2)
* [x] Định nghĩa event models cho `session_start`, `mousemove`, `click`, `session_end`. (T2.2)
* [x] Định nghĩa batch model và request size constraints. (T2.2; max 100 events)
* [x] Validate khoảng normalized coordinate khi được cung cấp. (T2.2)

### Step 3: Triển khai endpoints

* [x] `POST /api/v1/sessions` (T2.3)
* [x] `POST /api/v1/events/batch` (T2.4 accept; T2.5 Kafka default producer)
* [x] `POST /api/v1/sessions/{sessionId}/complete` (T2.3)
* [x] `GET /api/v1/sessions/{sessionId}/metrics` (T2.3; processing stub until P4)

### Step 4: Produce Kafka messages

* [x] Key telemetry messages theo `sessionId`. (T2.5; DEC-005)
* [x] Giữ event payload và chỉ thêm ingestion metadata khi cần. (T2.5: one JSON event message per event)
* [x] Trả `202 Accepted` sau khi valid batch được accept để produce. (T2.4 accept; T2.5 real produce)

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

* [x] Session endpoint accept valid session metadata.
* [x] Batch endpoint accept valid mixed event batches. (T2.4; Kafka produce deferred to T2.5)
* [x] Invalid event type hoặc thiếu required field trả structured `400`. (T2.4)
* [x] Batch được API accept sẽ produce vào Kafka topic. (T2.5; mocked aiokafka unit tests)
* [x] Health endpoint báo API liveness.
* [x] Tests cover accepted batch, invalid payload và producer failure. (accepted/invalid in T2.4; producer failure→503 in T2.6)

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
