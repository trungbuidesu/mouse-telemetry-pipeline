# Plan: Performance validation và observability

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase5-plan001` |
| Phase | [phase5](../../phases/phase5/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Kiểm tra pipeline đáp ứng kỳ vọng performance cần cho local demo đáng tin cậy, đồng thời thêm observability signals để giải thích dữ liệu đang chảy hoặc đang kẹt ở đâu.

---

## 3. Decisions liên quan

| Decision | Vì sao cần |
|---|---|
| [DEC-002](../../decisions/decision002-client-side-batching-and-sampling.md) | Frontend event rate và batch policy |
| [DEC-007](../../decisions/decision007-memory-bounded-retry-policy.md) | Failure behavior |
| [DEC-010](../../decisions/decision010-local-first-docker-compose-stack.md) | Local performance target |

---

## 4. Khu vực validation

| Area | Cần đo gì |
|---|---|
| Frontend | Render stability, batch counts, dropped event count |
| API | Request latency, accepted/rejected batches, producer failures |
| Kafka | Topic lag, message throughput |
| Spark | Micro-batch duration, input rows per second, processing latency |
| Storage | Raw Parquet writes, Influx metrics writes |
| Dashboard | Refresh behavior và query load |

---

## 5. Work breakdown

### Step 1: Định nghĩa performance budgets

* Frontend vẫn responsive trong session 60 giây.
* Batch interval và size khớp defaults trừ khi override.
* API xử lý load generator defaults mà không có request errors.
* Spark theo kịp demo throughput trên máy local.

### Step 2: Thêm observability counters

* Frontend: generated events, sent batches, failed batches, dropped events.
* API: accepted batches, rejected batches, Kafka produce errors.
* Spark: parsed events, malformed events, written rows.

### Step 3: Chạy focused benchmarks

* Manual single session.
* Multiple synthetic sessions.
* Backend unavailable rồi restored.
* Spark restart với checkpoint.

### Step 4: Ghi lại kết quả

* Ghi commands.
* Ghi environment assumptions.
* Ghi pass/fail và limitations.
* Thêm follow-up tasks cho bottlenecks.

---

## 6. Ghi chú performance

* Không optimize mù; gắn optimization với bottleneck đã đo.
* Giữ benchmark defaults thực tế cho laptop đồ án/demo.
* Ưu tiên aggregate metrics hơn verbose logs trong hot paths.
* Xem dropped events là telemetry health data nhìn thấy được, không phải silent failure.

---

## 7. Acceptance criteria

* [ ] Frontend session chạy không có UI degradation rõ rệt.
* [ ] Request count ở mức batch, không phải event.
* [ ] API expose accepted/rejected counters hoặc logs có ý nghĩa.
* [ ] Spark processing latency nhìn thấy được.
* [ ] Failure-mode behavior được document.
* [ ] Validation results được ghi trong docs hoặc task files.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Manual session 60 giây | Không mất final flush |
| Load generator default run | Pipeline vẫn responsive |
| Backend outage test | Frontend chuyển sang offline/buffering và recover theo policy |
| Spark restart test | Checkpoint resume stream |

---

## 9. Bàn giao

Plan này feed [phase5-plan002](plan002-packaging-runbooks-and-final-report.md) với measured results và known limitations.
