# Plan: Session result và client analytics

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase1-plan003` |
| Phase | [phase1](../../phases/phase1/README.md) |
| Status | `PLANNED` |
| Cập nhật lần cuối | `2026-07-22` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

---

## 2. Mục tiêu

Hiển thị kết quả session ngay từ frontend state trong khi backend metrics vẫn đang processing. Cách này giữ user experience responsive và minh họa hành vi pipeline bất đồng bộ.

---

## 3. Phụ thuộc

| Dependency | Loại | Ghi chú |
|---|---|---|
| [phase1-plan001](plan001-frontend-gameplay-shell.md) | Frontend gameplay | Cung cấp score, hit/miss và session lifecycle |
| [phase1-plan002](plan002-telemetry-collector-buffer-sender.md) | Telemetry | Cung cấp event và batch counters |
| [phase2-plan001](../phase2/plan001-fastapi-ingestion-contract.md) | API | Metrics polling contract |
| [DEC-009](../../decisions/decision009-session-analytics-event-time-watermark.md) | Analytics | Processing status có thể trễ hơn final event |

---

## 4. Module dự kiến

| Module | Responsibility |
|---|---|
| `frontend/src/pages/ResultPage.tsx` | Hiển thị result theo `sessionId` |
| `frontend/src/api/analyticsApi.ts` | Fetch backend metrics |
| `frontend/src/hooks/useSessionMetrics.ts` | Poll và expose processing status |
| `frontend/src/utils/calculations.ts` | Client-side accuracy, distance và basic stats |
| `frontend/src/components/MouseTrajectory.tsx` | Render trajectory cơ bản nếu có local samples |
| `frontend/src/components/ClickHeatmap.tsx` | Hiển thị click density cơ bản nếu có local samples |

---

## 5. Work breakdown

### Step 1: Định nghĩa client result model

* Capture score, hit count, miss count, total click count.
* Capture generated event count và sent batch count.
* Capture dropped event count nếu buffer limit bị chạm.

### Step 2: Xây result page

* Hiển thị immediate client-calculated result sau finishing.
* Hiển thị backend status: `processing`, `completed` hoặc `error`.
* Cho phép user chơi lại hoặc xem analytics/dashboard.

### Step 3: Poll backend metrics

* Gọi `GET /api/v1/sessions/{sessionId}/metrics`.
* Dùng polling interval có giới hạn.
* Dừng polling khi status là `completed` hoặc terminal error.

### Step 4: Thêm visual analytics cơ bản

* Hiển thị heatmap hoặc trajectory cho session hiện tại ở mức MVP.
* Ưu tiên derived hoặc sampled data, không đưa mọi raw mousemove vào React state.

---

## 6. Ghi chú data correctness

* Client result là immediate và provisional.
* Backend result là authoritative cho Spark-derived metrics như total distance và average speed.
* UI phải label processing state rõ để delayed Spark metrics không bị hiểu nhầm là mất dữ liệu.

---

## 7. Acceptance criteria

* [ ] Result page hiển thị score, accuracy, hits, misses, total events và batches.
* [ ] Result page phân biệt client result và backend processed metrics.
* [ ] Metrics polling xử lý `processing` và `completed`.
* [ ] Play Again bắt đầu session sạch với `sessionId` mới.
* [ ] Không lưu raw telemetry array lớn trong React state sống lâu.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Unit tests cho calculations | PASS |
| Mock metrics polling test | Xử lý processing rồi completed |
| Manual session test | Result xuất hiện sau khi flush hoàn tất |

---

## 9. Bàn giao

Plan này cung cấp result surface cho user, được [phase4-plan001](../phase4/plan001-dashboard-session-analytics.md) dùng tiếp.
