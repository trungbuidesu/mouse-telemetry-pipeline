# MOUSE TELEMETRY PIPELINE — TRACKING TIẾN ĐỘ

> **Cập nhật lần cuối:** 23/07/2026
> **Tổng tiến độ:** P0 complete (11/11); G0 PASSED; P1 in progress (2/10)
> **Mục tiêu:** Real-time Mouse Tracking Pipeline dùng Aim Trainer làm nguồn sinh dữ liệu

---

## Tóm tắt tiến độ theo Phase

| Phase | Tên | Trạng thái | Tiến độ | Ngày bắt đầu | Ngày hoàn thành | Ghi chú |
|---|---|---|---:|---|---|---|
| P0 | Foundation and Contracts | `DONE` | 11/11 tasks | 22/07/2026 | 22/07/2026 | G0 PASSED; Docker Compose chuyển sang P3/T3.0 |
| P1 | Frontend Telemetry MVP | `IN_PROGRESS` | 2/10 tasks | 23/07/2026 | — | T1.1–T1.2 DONE; next T1.3 telemetry types |
| P2 | Ingestion API | `NOT_STARTED` | 0/8 tasks | — | — | FastAPI nhận batch và produce Kafka |
| P3 | Stream Processing and Storage | `NOT_STARTED` | 0/9 tasks | — | — | Docker Compose, Kafka, Spark, MinIO, InfluxDB |
| P4 | Analytics and Demo | `NOT_STARTED` | 0/7 tasks | — | — | Dashboard, session analytics, load generator |
| P5 | Hardening and Delivery | `NOT_STARTED` | 0/7 tasks | — | — | Performance validation, runbook, final report |

**Tổng:** 13/52 tasks hoàn thành

---

## Chi tiết task theo phase

### P0 — Foundation and Contracts

| ID | Task | Trạng thái | Ngày hoàn thành | Blocked by | Notes |
|---|---|---|---|---|---|
| T0.1 | Architecture and phase planning docs | `DONE` | 22/07/2026 | — | Architecture, phase, plan và decision records đã được tạo |
| T0.2 | Root tracking document | `DONE` | 22/07/2026 | T0.1 | task: `documents/phases/phase0/task001-doc-governance-test-config.md` |
| T0.3 | Split coding rules for frontend and API | `DONE` | 22/07/2026 | T0.1 | `coding_rules.md` làm index; frontend/API có file riêng |
| T0.4 | Frontend test config baseline | `DONE` | 22/07/2026 | T0.3 | npm + Vite + Vitest + Playwright + ESLint + TypeScript |
| T0.5 | Ingestion API test config baseline | `DONE` | 22/07/2026 | T0.3 | uv + pytest + ruff + mypy |
| T0.6 | Clean Vite/shadcn frontend and uv API stack foundation | `DONE` | 22/07/2026 | T0.4, T0.5 | task: `documents/phases/phase0/task002-clean-vite-uv-stack-foundation.md`; DEC-011/012/013 |
| T0.7 | Shared telemetry schema contract files | `DONE` | 22/07/2026 | T0.1 | task: `documents/phases/phase0/task003-shared-telemetry-schema-contracts.md`; `contracts/telemetry/` |
| T0.8 | API contract fixtures | `DONE` | 22/07/2026 | T0.7 | task: `documents/phases/phase0/task004-api-contract-fixtures.md`; `contracts/fixtures/` |
| T0.9 | Local environment example files | `DONE` | 22/07/2026 | T0.6 | task: `documents/phases/phase0/task005-local-env-examples.md`; `frontend/.env.example`, `ingestion-api/.env.example` |
| T0.11 | Frontend/API stack review package | `DONE` | 22/07/2026 | T0.6 | task: `documents/phases/phase0/task006-frontend-api-stack-review.md` |
| T0.12 | P0 gate review package | `DONE` | 22/07/2026 | T0.7, T0.8, T0.9, T0.11 | task: `documents/phases/phase0/task007-p0-gate-review.md`; G0 PASSED |

> T0.10 Docker Compose foundation đã được chuyển sang P3 thành T3.0 vì đó là runtime foundation của pipeline/streaming, không phải blocker của G0. T0.11/T0.12 giữ nguyên ID lịch sử để không phá link tới task006/task007.

### P1 — Frontend Telemetry MVP

| ID | Task | Trạng thái | Ngày hoàn thành | Blocked by | Notes |
|---|---|---|---|---|---|
| T1.1 | Gameplay shell task and playable route integration | `DONE` | 23/07/2026 | T0.6 | task: `documents/phases/phase1/task001-frontend-gameplay-shell.md` |
| T1.2 | Aim Trainer canvas gameplay | `DONE` | 23/07/2026 | T1.1 | task: `documents/phases/phase1/task002-aim-trainer-canvas-gameplay.md` |
| T1.3 | Telemetry type definitions | `TODO` | — | T0.7 | Match DEC-001 và shared schema contract |
| T1.4 | Telemetry collector and coordinate normalization | `TODO` | — | T1.2, T1.3 | Canvas-relative coordinates |
| T1.5 | Event buffer and batch sender | `TODO` | — | T1.4 | DEC-002, DEC-007 |
| T1.6 | Stream status UI | `TODO` | — | T1.5 | Connected, buffering, offline, error |
| T1.7 | Result page và client metrics | `TODO` | — | T1.5 | Kết quả tạm thời trong lúc Spark xử lý |
| T1.8 | Frontend unit tests | `TODO` | — | T1.2, T1.5 | Hit detection, batch, sequence, coordinates |
| T1.9 | Frontend e2e smoke test | `TODO` | — | T1.7 | Play one short session |
| T1.10 | P1 gate review package | `TODO` | — | T1.8, T1.9 | G1 pass/fail package |

### P2 — Ingestion API

| ID | Task | Trạng thái | Ngày hoàn thành | Blocked by | Notes |
|---|---|---|---|---|---|
| T2.1 | FastAPI ingestion route package and health baseline review | `TODO` | — | T0.7, T0.8 | App factory/health đã có từ T0.6; phase2 vẫn cần route package và ingestion contract task |
| T2.2 | Pydantic telemetry models | `TODO` | — | T0.6 | Match DEC-001 |
| T2.3 | Endpoints vòng đời session | `TODO` | — | T2.1, T2.2 | Tạo và complete session |
| T2.4 | Batch ingestion endpoint | `TODO` | — | T2.2 | `POST /api/v1/events/batch` |
| T2.5 | Kafka producer service boundary | `TODO` | — | T2.4, P3 topic decision | DEC-004, DEC-005 |
| T2.6 | Backpressure and error response model | `TODO` | — | T2.4 | Retryable vs non-retryable |
| T2.7 | API contract tests | `TODO` | — | T2.2, T2.4 | Valid/invalid batch fixtures |
| T2.8 | P2 gate review package | `TODO` | — | T2.7 | G2 pass/fail package |

### P3 — Stream Processing and Storage

| ID | Task | Trạng thái | Ngày hoàn thành | Blocked by | Notes |
|---|---|---|---|---|---|
| T3.0 | Docker Compose runtime foundation | `TODO` | — | T0.9 | Moved from P0/T0.10; local services cho Kafka/MinIO/InfluxDB/Grafana khi P3 bắt đầu |
| T3.1 | Kafka local topic bootstrap | `TODO` | — | T3.0 | `mouse.telemetry.events.v1` |
| T3.2 | MinIO and InfluxDB local setup | `TODO` | — | T3.0 | Runtime data ignored by Git |
| T3.3 | Spark project test config | `TODO` | — | T3.1 | Deliberately deferred from current task |
| T3.4 | Spark telemetry parser | `TODO` | — | T2.2, T3.1 | Parse Kafka JSON |
| T3.5 | Raw Parquet writer | `TODO` | — | T3.4 | MinIO storage |
| T3.6 | Aggregate metrics writer | `TODO` | — | T3.4 | InfluxDB storage |
| T3.7 | Streaming integration smoke test | `TODO` | — | T3.5, T3.6 | One session through storage |
| T3.8 | P3 gate review package | `TODO` | — | T3.7 | G3 pass/fail package |

### P4 — Analytics and Demo

| ID | Task | Trạng thái | Ngày hoàn thành | Blocked by | Notes |
|---|---|---|---|---|---|
| T4.1 | Grafana dashboard JSON | `TODO` | — | P3 | Throughput, latency, sessions |
| T4.2 | API/read model cho session analytics | `TODO` | — | P3 | Result/detail metrics |
| T4.3 | Heatmap or trajectory visualization | `TODO` | — | T4.2 | MVP-level bounded data |
| T4.4 | Load generator | `TODO` | — | P2 | Separate from player app, DEC-008 |
| T4.5 | Demo script | `TODO` | — | T4.1, T4.4 | Evidence checklist |
| T4.6 | Dashboard smoke test | `TODO` | — | T4.1 | Metrics visible after session/load |
| T4.7 | P4 gate review package | `TODO` | — | T4.6 | G4 pass/fail package |

### P5 — Hardening and Delivery

| ID | Task | Trạng thái | Ngày hoàn thành | Blocked by | Notes |
|---|---|---|---|---|---|
| T5.1 | Frontend performance validation | `TODO` | — | P1 | Render stability and telemetry hot path |
| T5.2 | API ingestion performance validation | `TODO` | — | P2 | Batch request latency and error rates |
| T5.3 | Stream processing performance validation | `TODO` | — | P3 | Spark micro-batch and lag |
| T5.4 | Observability counters and logs | `TODO` | — | P1, P2, P3 | Accepted/rejected/dropped/late counts |
| T5.5 | Local demo runbook | `TODO` | — | P4 | Setup, run, reset |
| T5.6 | Troubleshooting and final report outline | `TODO` | — | T5.5 | Delivery docs |
| T5.7 | P5 gate review package | `TODO` | — | T5.6 | G5 pass/fail package |

---

## Gate System

Mỗi gate là binary pass/fail. Gate fail thì ưu tiên sửa foundation hoặc phase hiện tại trước khi chuyển phase sau. Nếu chạy task phase sau song song, phải ghi rõ theo quy định bắt đầu phase bên dưới.

| Gate | Phase | Tiêu chí Pass | Trạng thái |
|---|---|---|---|
| G0 | P0 | Tracking exists, coding rules split, clean Vite/shadcn frontend validates, uv-managed API validates, shared schema contract files exist, API contract fixtures exist, env examples/review package are recorded | `PASSED` |
| G1 | P1 | Aim Trainer playable, no mousemove render storm, telemetry batches valid, final flush reliable | `NOT_PASSED` |
| G2 | P2 | FastAPI accepts valid batches, rejects invalid payloads, produces Kafka messages, retryable failures explicit | `NOT_PASSED` |
| G3 | P3 | Docker Compose services start, Kafka -> Spark -> MinIO/InfluxDB works for one session, raw and aggregate storage separated | `NOT_PASSED` |
| G4 | P4 | Dashboard/session analytics show real pipeline data and load generator affects throughput | `NOT_PASSED` |
| G5 | P5 | Local runbook reproducible, performance validation recorded, no runtime data/secrets tracked | `NOT_PASSED` |

**Gate review package**:

- Short demo/reproduction command.
- Test/lint/type-check/build results.
- Example artifacts or screenshots when relevant.
- Updated risk register.
- Known limitations.
- Go/no-go decision.

---

## Quy định bắt đầu phase

- Mặc định không đánh dấu phase sau là `IN_PROGRESS` trước khi gate của phase hiện tại pass.
- Task ở phase sau chỉ được tạo/chạy sớm nếu toàn bộ blocker trực tiếp trong tracking đã `DONE` và task đó không phụ thuộc vào phần P0 còn thiếu.
- Với gameplay shell: task đúng chỗ là `documents/phases/phase1/task001-frontend-gameplay-shell.md`. Không đặt task này trong `documents/phases/phase0/`. Nếu làm sớm trước G0, ghi rõ đó là parallel-start có chủ đích, không có nghĩa P0 đã hoàn thành.

---

## Milestones

| Milestone | Target | Trạng thái | Deliverable | Gate |
|---|---|---|---|---|
| M1: Foundation ready | Phase 0 complete | `REACHED` | Tracking, rules, stack foundation, schema/contracts, env examples, gate package | G0 |
| M2: Frontend data source ready | Phase 1 complete | `NOT_REACHED` | Playable Aim Trainer emits valid batches | G1 |
| M3: Ingestion ready | Phase 2 complete | `NOT_REACHED` | FastAPI validates and produces telemetry | G2 |
| M4: Streaming storage ready | Phase 3 complete | `NOT_REACHED` | Kafka/Spark writes raw and metrics | G3 |
| M5: Demo analytics ready | Phase 4 complete | `NOT_REACHED` | Dashboard, session analytics, load generator | G4 |
| M6: Delivery ready | Phase 5 complete | `NOT_REACHED` | Runbook, validation, final report outline | G5 |

---

## Rủi ro đang theo dõi

| ID | Rủi ro | P×I | Trạng thái | Mitigation | Contingency |
|---|---|---:|---|---|---|
| R-01 | Frontend telemetry gây re-render quá nhiều | 5×5 | WATCHING | DEC-003, frontend coding rules, performance validation | Giảm UI counters, chuyển hot state sang refs |
| R-02 | Batch policy tạo request storm hoặc mất event cuối phiên | 4×5 | WATCHING | DEC-002, DEC-007, final flush tests | Tăng batch size/interval, thêm sender queue guard |
| R-03 | Schema drift giữa frontend/API/Spark | 4×5 | WATCHING | Shared fixtures, DEC-001, contract tests | Freeze schema v1, add migration decision |
| R-04 | API xử lý analytics nặng trong request path | 3×5 | WATCHING | API coding rules, service boundary | Move work to Spark/async pipeline |
| R-05 | Kafka topic/key sai làm mất ordering theo session | 3×4 | WATCHING | DEC-005, topic bootstrap tests | Re-key by sessionId and replay local data |
| R-06 | Raw telemetry bị ghi vào InfluxDB quá nhiều | 4×4 | WATCHING | DEC-006, aggregate-only metrics | Move raw writes to MinIO only |
| R-07 | Local Docker/runtime data bị commit nhầm | 3×5 | WATCHING | `.gitignore`, git status review | Remove from index before commit |
| R-08 | Scope creep sang Spark/dashboard quá sớm | 4×3 | WATCHING | Tracking marks Spark config as future work | Defer to P3/P4 tasks |
| R-09 | Playwright browser dependencies không có sẵn | 3×3 | WATCHING | Document lệnh cài đặt và giới hạn validation | Chạy unit/lint/typecheck trước; cài browsers sau |
| R-10 | Test tooling baseline quá rỗng, không bắt được regression | 3×4 | WATCHING | Thêm smoke tests hiện tại, domain tests tập trung ở P1/P2 | Mở rộng tests cùng gameplay/API tasks |
| R-11 | shadcn UI bị dùng sai cho canvas/telemetry hot path | 4×4 | WATCHING | DEC-011, frontend coding rules | Giữ canvas renderer dạng imperative và telemetry trong refs/plain TS |
| R-12 | API vô tình dùng Python hệ thống thay vì uv-managed Python | 3×5 | WATCHING | DEC-012, `.python-version`, validation through `uv run` | Fail gate until uv-managed command evidence exists |

**Score >= 15** cần review khi cập nhật tracking.

---

## Quy ước cập nhật

- **Trạng thái task:** `TODO` -> `IN_PROGRESS` -> `DONE` hoặc `BLOCKED`, `SKIPPED`.
- **Ngày bắt đầu:** ghi khi task chuyển sang `IN_PROGRESS`.
- **Ngày hoàn thành:** ghi khi task chuyển sang `DONE`.
- **Notes:** luôn ghi task file khi có file thực thi trong `documents/phases/<phase>/`.
- **Gate:** chỉ đổi sang `PASSED` khi gate review package có đủ command/evidence.
- **Risk register:** cập nhật khi phát hiện rủi ro mới hoặc mitigation đã thay đổi.
- **Scope control:** Spark/Kafka/Grafana chỉ triển khai khi phase/task tương ứng bắt đầu.
