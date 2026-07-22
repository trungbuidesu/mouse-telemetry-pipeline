# Plan: Governance cho repository và tài liệu

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase0-plan001` |
| Phase | [phase0](../../phases/phase0/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md), [Agent Development Protocol](../../agents/AGENTS.md) |

---

## 2. Mục tiêu

Thiết lập cấu trúc repository và cấu trúc tài liệu để các phase sau triển khai nhất quán, truy vết được decision và không tạo task trùng responsibility.

---

## 3. Phụ thuộc

| Dependency | Loại | Cần trước implementation |
|---|---|---|
| [documents/aim_trainer_app_architecture.md](../../aim_trainer_app_architecture.md) | Architecture source | Có |
| [documents/agents/AGENTS.md](../../agents/AGENTS.md) | Process rule | Có |
| [documents/agents/commit_rules.md](../../agents/commit_rules.md) | Commit rule | Trước khi commit |

---

## 4. Output dự kiến

* Monorepo folder skeleton bám kiến trúc:
  * `frontend/`
  * `ingestion-api/`
  * `stream-processing/`
  * `infrastructure/`
  * `schemas/`
  * `dashboards/`
  * `scripts/`
  * `documents/`
* Chiến lược `.env.example` cho các service.
* Documentation indexes cho phases, plans và decisions.
* Rule để runtime data, checkpoints và secrets không vào Git.
* Task files đầu tiên cho implementation work khi bắt đầu code.
* Decision cho clean Vite React shadcn frontend stack.
* Decision cho uv-managed Python API environment.

---

## 5. Work breakdown

### Step 1: Kiểm tra trạng thái repository

* Inspect `README.md`, `LICENSE`, `documents/` và Git status.
* Ghi nhận documentation chưa track trước khi tạo code structure.
* Xác nhận repository còn documentation-only hay đã có baseline code.

### Step 2: Tạo skeleton directories

* Chỉ tạo top-level directories ổn định mà kiến trúc cần.
* Không thêm placeholder source code cho đến khi task cần.
* Chỉ thêm `.gitkeep` nếu empty directory thật sự cần được giữ trong Git.

### Step 3: Chuẩn hóa documentation links

* Đảm bảo phase docs trỏ đến plan liên quan.
* Đảm bảo plans trỏ đến decisions liên quan.
* Đảm bảo decisions trỏ ngược về phases/plans phụ thuộc chúng.

### Step 4: Định nghĩa repository hygiene

Thêm `.gitignore` cho:

* `node_modules/`
* Python virtual environments.
* Docker volumes hoặc local data directories.
* Spark checkpoints.
* MinIO, Kafka và InfluxDB runtime data.
* `.env`.

Giữ `.env.example` trong Git.

### Step 5: Khóa frontend và API foundation stacks

* Khởi tạo frontend từ clean Vite React TypeScript scaffold.
* Thêm shadcn/ui và Tailwind CSS chỉ cho UI shell/HUD/control surfaces.
* Pin API Python qua uv-managed `.python-version`.
* Commit frontend/API lockfiles để foundation setup tái lập được.

---

## 6. Ghi chú kiến trúc

Tài liệu kiến trúc đề xuất monorepo vì giá trị demo phụ thuộc vào tích hợp full-pipeline. Tách component thành nhiều repository sẽ làm local demo setup và contract updates nặng hơn mức cần thiết cho phạm vi project.

Cấu trúc tài liệu phải làm rõ các architecture decisions. Những quyết định về performance như batching, sampling và storage split ảnh hưởng nhiều component, nên không được chỉ nằm trong implementation notes.

---

## 7. Acceptance criteria

* [ ] Top-level repository skeleton khớp kiến trúc.
* [ ] `documents/phases/`, `documents/plans/` và `documents/decisions/` đều có index.
* [ ] Mỗi plan chỉ thuộc đúng một phase.
* [ ] Mọi architecture decision được plan tham chiếu đều có decision record.
* [ ] `.gitignore` chặn runtime data và secrets vào Git.
* [ ] Không commit generated runtime data.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| `rg --files documents` | Hiển thị phase, plan và decision docs |
| `git status --short` | Chỉ có documentation/skeleton files đúng phạm vi thay đổi |
| Manual link review | Relative links resolve đúng từ vị trí hiện tại |

---

## 9. Bàn giao

Plan này mở khóa [phase0-plan002](plan002-contract-first-schema-and-api.md), [phase1](../../phases/phase1/README.md), [phase2](../../phases/phase2/README.md) và [phase3](../../phases/phase3/README.md) bằng cách cung cấp quy ước chung cho repository và documentation.
