# Plan: Packaging, runbooks và final report

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase5-plan002` |
| Phase | [phase5](../../phases/phase5/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Chuẩn bị project để bàn giao: local runbook có thể lặp lại, troubleshooting guide, narrative kiến trúc cuối và demo evidence checklist.

---

## 3. Phụ thuộc

| Dependency | Loại | Ghi chú |
|---|---|---|
| [phase5-plan001](plan001-performance-validation-and-observability.md) | Validation | Cung cấp measured results |
| [phase4-plan002](../phase4/plan002-demo-scenarios-and-load-generation.md) | Demo | Cung cấp scenario flow |
| [DEC-010](../../decisions/decision010-local-first-docker-compose-stack.md) | Packaging | Local-first delivery |

---

## 4. Output dự kiến

* Root `README.md` mở rộng với:
  * Project overview.
  * Architecture diagram.
  * Local setup.
  * Lệnh chạy.
  * Demo flow.
* `documents/runbooks/local-demo.md`.
* `documents/runbooks/troubleshooting.md`.
* `documents/report/final-report-outline.md`.
* Validation summary kèm known limitations.

---

## 5. Work breakdown

### Step 1: Viết local runbook

* Prerequisites.
* Environment variables.
* Docker Compose startup.
* Frontend startup.
* API startup nếu tách riêng.
* Spark job startup.
* Dashboard URL.

### Step 2: Viết troubleshooting guide

* Kafka not reachable.
* API trả `503`.
* Spark không parse được events.
* MinIO bucket thiếu.
* InfluxDB query rỗng.
* Frontend hiển thị offline.

### Step 3: Viết demo checklist

* Start services.
* Chạy một manual session.
* Hiển thị bằng chứng API/Kafka/Spark.
* Hiển thị dashboard metrics.
* Chạy synthetic load.
* Giải thích raw vs aggregate storage.

### Step 4: Chuẩn bị final report outline

* Problem statement.
* Architecture.
* Data model.
* Ingestion strategy.
* Stream processing.
* Storage strategy.
* Dashboard.
* Performance discussion.
* Limitations and future work.

---

## 6. Ghi chú delivery

* Không đưa secrets hoặc runtime data vào final package.
* Giữ commands copy/paste friendly.
* Ghi exact paths cho generated dashboard JSON và scripts.
* Link ngược về decisions để architecture design có cơ sở bảo vệ.

---

## 7. Acceptance criteria

* [ ] Developer mới có thể chạy local demo từ documentation.
* [ ] Troubleshooting guide cover các local failures dễ gặp nhất.
* [ ] Final report outline tham chiếu architecture và decisions.
* [ ] Demo evidence checklist cụ thể và có thứ tự.
* [ ] Git status không chứa runtime data hoặc secret files.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Làm theo runbook từ clean environment | Demo start |
| Link review | Docs link tới phase/plan/decision records |
| Git status review | Không có runtime data hoặc secret files |

---

## 9. Bàn giao

Đây là final delivery plan. Work còn lại sau plan này phải là follow-up task rõ ràng, không phải hidden TODO.
