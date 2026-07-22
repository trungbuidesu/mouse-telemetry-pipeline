# Phase 1: Frontend Telemetry MVP

## 1. Mục tiêu

Phase 1 tạo ứng dụng Aim Trainer chạy được trên trình duyệt và sinh telemetry đúng contract. Trọng tâm không phải làm game phức tạp, mà là tạo nguồn dữ liệu đáng tin cậy, có thể quan sát và không làm nghẽn UI.

---

## 2. Phạm vi

### Trong scope

* Trang `/play` với canvas, target tròn, score, accuracy và timer.
* App shell dùng Vite React TypeScript, shadcn/ui, Tailwind CSS và React Router từ DEC-011.
* Session lifecycle: `idle`, `countdown`, `running`, `finishing`, `completed`.
* Thu thập `mousemove`, `click`, `session_start`, `session_end`.
* Chuẩn hóa tọa độ theo canvas và optional normalized coordinate.
* Buffer trong memory, flush theo batch size hoặc interval.
* Retry có giới hạn khi backend lỗi.
* Kết quả tạm thời phía client và trang result cơ bản.

### Ngoài scope

* Authentication.
* Multiplayer.
* Replay video đầy đủ.
* IndexedDB offline persistence.
* Mobile-first gameplay.
* Dashboard hệ thống hoàn chỉnh.

---

## 3. Phụ thuộc

| Dependency | Từ phase | Ghi chú |
|---|---|---|
| Event schema | phase0 | Không tự đổi public field khi chưa cập nhật decision |
| API contract | phase0 | Frontend gọi qua API layer, không biết Kafka |
| Batch policy | phase0 | Dựa vào DEC-002 và DEC-007 |

---

## 4. Plans

| Plan | Vai trò | Output chính |
|---|---|---|
| [plan001-frontend-gameplay-shell](../../plans/phase1/plan001-frontend-gameplay-shell.md) | Tạo app shell và gameplay MVP | Canvas, game state, hit/miss, timer |
| [plan002-telemetry-collector-buffer-sender](../../plans/phase1/plan002-telemetry-collector-buffer-sender.md) | Thu thập và gửi telemetry hiệu quả | Collector, buffer, batch sender, retry |
| [plan003-session-result-and-client-analytics](../../plans/phase1/plan003-session-result-and-client-analytics.md) | Hiển thị kết quả tạm thời | Result page, client metrics, trạng thái processing |

---

## 5. Decisions

| Decision | Áp dụng trong phase |
|---|---|
| [DEC-001: Canvas-relative telemetry schema](../../decisions/decision001-canvas-relative-telemetry-schema.md) | Event creation, coordinate utils |
| [DEC-002: Client-side batching and sampling](../../decisions/decision002-client-side-batching-and-sampling.md) | Buffer flush, sample mousemove |
| [DEC-003: React state vs ref boundary](../../decisions/decision003-react-state-vs-ref-boundary.md) | Hook và component design |
| [DEC-007: Memory-bounded retry policy](../../decisions/decision007-memory-bounded-retry-policy.md) | Offline/slow backend behavior |
| [DEC-011: Vite React shadcn frontend stack](../../decisions/decision011-vite-react-shadcn-frontend-stack.md) | UI stack, route shell, shadcn usage boundary |

---

## 6. Performance requirements

Frontend phase này phải được kiểm tra theo các điểm sau:

* Di chuột liên tục không làm tăng render count theo số event raw.
* Canvas render không phụ thuộc React state cho từng tọa độ chuột.
* shadcn components không nằm trong canvas drawing loop hoặc telemetry event hot path.
* Flush interval mặc định là 250 ms, batch size mặc định là 100 event.
* `mousemove` được sample tối thiểu theo khoảng 16 ms.
* Khi backend tắt, UI vẫn playable trong giới hạn buffer.
* Khi kết thúc session, buffer còn lại được flush trước khi chuyển result chính thức.

---

## 7. Completion gate

Phase 1 hoàn thành khi:

1. Người dùng chơi được phiên 30 hoặc 60 giây.
2. Event sinh ra có `sessionId`, `eventId`, `eventTime`, `sequence` và tọa độ canvas.
3. Batch sender gửi đúng endpoint ingestion API hoặc mock API tương thích contract.
4. Kết thúc session không làm mất event còn trong buffer.
5. Result page hiển thị được metrics tạm thời và trạng thái metrics backend.
6. Validation frontend liên quan đến hit detection, coordinate normalization, batch splitting và sequence đã được chạy.
