# Decision DEC-003: Boundary giữa React state và ref

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Aim Trainer thu input tần suất cao. Nếu mỗi `mousemove` đều cập nhật React state, React có thể re-render nhiều hơn mức cần thiết và làm giảm độ mượt gameplay. Kiến trúc yêu cầu rõ: không gây React re-render cho từng chuyển động chuột.

---

## 3. Quyết định

Chỉ dùng React state cho các giá trị cần ảnh hưởng đến UI ở tần suất người dùng có thể thấy:

* `GameStatus`
* score
* hit count
* miss count
* time remaining
* stream status
* displayed counters như total events và sent batches

Dùng refs hoặc object không kích hoạt render cho dữ liệu mutable trong hot path:

* event buffer
* current mouse position
* sequence number
* canvas context
* flush interval handle
* retry state
* last sampled mousemove timestamp

---

## 4. Lý do

* React state phù hợp với UI state, nhưng đắt nếu dùng cho từng raw pointer event.
* Refs giữ mutable data xuyên qua render mà không kích hoạt render.
* Canvas drawing vốn mang tính imperative, không nên cần React reconciliation đầy đủ cho mỗi `mousemove`.

---

## 5. Hệ quả

### Tích cực

* Giảm render pressure trong gameplay.
* Tách rõ UI và telemetry.
* Dễ hiểu hơn update nào là user-visible.

### Đánh đổi

* State dựa trên ref phải được initialize và cleanup cẩn thận.
* Tests nên cover lifecycle cleanup vì refs không đi theo reducer-style state transition tự động.

---

## 6. Ràng buộc triển khai

* Không đặt telemetry event arrays trong React state.
* UI counters nên cập nhật theo nhịp batch/timer, không phải từng event.
* Hooks phải cleanup intervals và pending sender state khi unmount.
* Canvas coordinate conversion có thể nằm trong event handler nhưng append vào buffer không được ép render.

---

## 7. Tài liệu liên quan

* [phase1](../phases/phase1/README.md)
* [phase1-plan001](../plans/phase1/plan001-frontend-gameplay-shell.md)
* [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)
