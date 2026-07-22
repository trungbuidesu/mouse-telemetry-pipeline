# Plan: Demo scenarios và load generation

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase4-plan002` |
| Phase | [phase4](../../phases/phase4/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Tạo demo scenarios có thể lặp lại và một load generator riêng để trình bày pipeline dưới tải có kiểm soát mà không làm sai telemetry model của player app thật.

`load generator` là tool sinh dữ liệu giả lập có kiểm soát. Nó phục vụ stress/demo pipeline, không phải logic của game người chơi.

---

## 3. Decisions liên quan

| Decision | Vì sao cần |
|---|---|
| [DEC-002](../../decisions/decision002-client-side-batching-and-sampling.md) | Player app có event rate bounded |
| [DEC-008](../../decisions/decision008-load-generator-separated-from-player-app.md) | Synthetic load phải tách riêng |
| [DEC-010](../../decisions/decision010-local-first-docker-compose-stack.md) | Demo phải chạy local |

---

## 4. Output dự kiến

* `scripts/load-generator/` hoặc tương đương.
* Scenario docs cho:
  * Single player session.
  * Backend temporarily unavailable.
  * Multiple synthetic sessions.
  * Spark/Grafana processing evidence.
* Checklist bằng chứng kỳ vọng cho người trình bày.

---

## 5. Work breakdown

### Step 1: Định nghĩa demo script

* Liệt kê startup commands.
* Liệt kê browser actions.
* Liệt kê dashboard panels cần quan sát.
* Liệt kê expected Kafka/Spark/storage evidence.

### Step 2: Xây load generator

* Sinh realistic session lifecycle events.
* Sinh mousemove theo controlled sample rate.
* Sinh click events có phân phối hit/miss.
* Gửi HTTP batches qua cùng ingestion API.

### Step 3: Thêm scenario controls

* Configure session count.
* Configure duration.
* Configure events per second.
* Configure batch size.
* Configure failure simulation nếu hữu ích.

### Step 4: Document limits

* Nói rõ load generator không phải bot detector.
* Nói rõ generated data là synthetic.
* Nói rõ safe local defaults để tránh làm cạn tài nguyên laptop.

---

## 6. Ghi chú performance

* Load generator phải tôn trọng configured maximum concurrency.
* Nên gửi batches, không gửi per-event requests.
* Nên expose summary counts để demo so sánh sent vs accepted.
* Không share code paths làm player app nặng hơn.

---

## 7. Acceptance criteria

* [ ] Demo script có thể đi theo từ clean local setup.
* [ ] Load generator tạo valid sessions và telemetry batches.
* [ ] Synthetic load làm dashboard throughput thay đổi.
* [ ] Generated session data có thể phân biệt với manual player data nếu cần.
* [ ] Defaults an toàn cho local development.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Single synthetic session | API accept và downstream xuất hiện dữ liệu |
| Multiple synthetic sessions | Throughput tăng mà không tạo request storm |
| Manual demo run | Người trình bày show được full pipeline evidence |

---

## 9. Bàn giao

Plan này feed performance validation và final demo documentation trong [phase5](../../phases/phase5/README.md).
