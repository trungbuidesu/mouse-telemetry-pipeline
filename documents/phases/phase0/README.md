# Phase 0: Foundation and Contracts

## 1. Mục tiêu

Phase 0 chốt nền tảng trước khi triển khai code: cấu trúc monorepo, quy ước tài liệu, telemetry schema, API contract, chiến lược local development và các decision record quan trọng.

Phase này bảo vệ dự án khỏi hai rủi ro lớn:

* Frontend, ingestion API và Spark hiểu khác nhau về cùng một event.
* Các thành phần được build riêng lẻ nhưng không ghép được thành pipeline demo.

---

## 2. Phạm vi

### Trong scope

* Cấu trúc thư mục cấp cao cho monorepo.
* Quy ước đặt task, plan và decision records.
* Clean frontend foundation bằng Vite React TypeScript, shadcn/ui và Tailwind CSS.
* uv-managed Python foundation cho FastAPI ingestion API.
* Schema logic cho `session_start`, `mousemove`, `click`, `session_end`.
* API contract sơ bộ cho session và telemetry batch.
* Chính sách local-first bằng Docker Compose.
* Tiêu chuẩn performance ban đầu cho frontend telemetry.

### Ngoài scope

* Viết code frontend playable.
* Viết FastAPI ingestion API đầy đủ.
* Tạo Kafka/Spark pipeline thật.
* Dashboard Grafana.
* Load test thực tế.

---

## 3. Phụ thuộc

| Dependency | Trạng thái | Ghi chú |
|---|---|---|
| [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) | Required | Nguồn yêu cầu chính |
| [Agent Development Protocol](../../agents/AGENTS.md) | Required | Quy trình task và ghi log |
| [Commit Rules](../../agents/commit_rules.md) | Required | Quy định commit nếu cần |

Phase 0 không phụ thuộc phase trước.

---

## 4. Plans

| Plan | Vai trò | Output chính |
|---|---|---|
| [plan001-repository-and-doc-governance](../../plans/phase0/plan001-repository-and-doc-governance.md) | Chuẩn hóa cấu trúc repo và tài liệu | Cây thư mục, quy ước task/plan/decision |
| [plan002-contract-first-schema-and-api](../../plans/phase0/plan002-contract-first-schema-and-api.md) | Chốt contract trước implementation | Schema và API contract làm nguồn chung |

---

## 5. Decisions

| Decision | Phase dùng | Lý do quan trọng |
|---|---|---|
| [DEC-001: Canvas-relative telemetry schema](../../decisions/decision001-canvas-relative-telemetry-schema.md) | phase0, phase1, phase2, phase3 | Tránh lệch tọa độ và giúp analytics so sánh session |
| [DEC-004: HTTP ingestion before Kafka](../../decisions/decision004-http-ingestion-before-kafka.md) | phase0, phase2 | Giữ browser đơn giản, backend kiểm soát Kafka |
| [DEC-010: Local-first Docker Compose stack](../../decisions/decision010-local-first-docker-compose-stack.md) | phase0, phase5 | Đảm bảo demo chạy được trên máy local |
| [DEC-011: Vite React shadcn frontend stack](../../decisions/decision011-vite-react-shadcn-frontend-stack.md) | phase0, phase1 | Chốt UI stack nhưng giữ hot path ngoài React/UI component layer |
| [DEC-012: uv-managed Python API environment](../../decisions/decision012-uv-managed-python-api-environment.md) | phase0, phase2 | Tránh phụ thuộc Python hệ thống |
| [DEC-013: FastAPI performance-oriented API stack](../../decisions/decision013-fastapi-performance-oriented-api-stack.md) | phase2 | Chốt API stack nhẹ và không làm analytics trong request path |

---

## 6. Architecture outputs

Phase 0 cần để lại các output sau cho phase sau:

* Danh sách endpoint public và payload chính.
* Danh sách event type và field bắt buộc.
* Quy tắc sequence trong một session.
* Quy tắc batch: flush theo số event hoặc thời gian.
* Quy tắc sampling `mousemove`.
* Quy tắc idempotency tối thiểu cho batch và event.
* Quy ước đặt tên Kafka topic và storage path.
* Quy tắc frontend stack: shadcn cho layout/HUD/controls, không dùng cho canvas/telemetry hot path.
* Quy tắc API environment: uv-managed Python 3.12.13 và validation qua `uv run`.

---

## 7. Performance guardrails

Các guardrail này phải được giữ trong các phase sau:

* `mousemove` được sample tối đa khoảng 60 event/giây/người dùng trong MVP.
* React state không giữ buffer hoặc mouse position cập nhật liên tục.
* Batch sender không tạo request song song vô hạn.
* Buffer có giới hạn bộ nhớ và ghi nhận số event bị drop.
* Load lớn cho pipeline phải đến từ load generator, không ép một người chơi thật phát event vô hạn.
* API request path không tính analytics nặng hoặc ghi raw telemetry đồng bộ xuống disk.

---

## 8. Completion gate

Phase 0 hoàn thành khi:

* Phase index và plan index đã có liên kết chéo.
* Tối thiểu các decision DEC-001 đến DEC-013 đã được tạo.
* Plan phase0 có thể dẫn trực tiếp đến task implementation.
* Không còn contract quan trọng nào chỉ nằm trong hội thoại.
