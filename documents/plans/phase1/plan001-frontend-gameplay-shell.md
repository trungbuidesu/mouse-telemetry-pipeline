# Plan: Gameplay shell cho frontend

## 1. Thông tin

| Trường | Giá trị |
|---|---|
| Plan ID | `phase1-plan001` |
| Phase | [phase1](../../phases/phase1/README.md) |
| Status | `IN_PROGRESS` |
| Cập nhật lần cuối | `2026-07-23` |
| Nguồn | [Kiến trúc Aim Trainer](../../aim_trainer_app_architecture.md) |

> T1.1 shell (routes/HUD/canvas/lifecycle) hoàn thành trong `documents/phases/phase1/task001-frontend-gameplay-shell.md`. Acceptance criteria về target/hit/score/timer còn lại thuộc T1.2.

---

## 2. Mục tiêu

Xây playable Aim Trainer shell: routing, canvas play area, game state machine, target generation, hit detection, timer, score và accuracy.

---

## 3. Phụ thuộc

| Dependency | Loại | Ghi chú |
|---|---|---|
| [phase0-plan001](../phase0/plan001-repository-and-doc-governance.md) | Repo setup | Frontend folder và tooling conventions |
| [phase0-plan002](../phase0/plan002-contract-first-schema-and-api.md) | Contract | Session và event semantics |
| [DEC-003](../../decisions/decision003-react-state-vs-ref-boundary.md) | Architecture | Tránh render storm từ `mousemove` |
| [DEC-011](../../decisions/decision011-vite-react-shadcn-frontend-stack.md) | Frontend stack | Định nghĩa Vite, shadcn, router và query boundaries |

---

## 4. Module dự kiến

| Module | Responsibility |
|---|---|
| `frontend/src/app/router.tsx` | Routes cho `/`, `/play`, `/result/:sessionId`, `/dashboard` |
| `frontend/src/app/providers.tsx` | TanStack Query provider chỉ cho server state |
| `frontend/src/pages/TrainerPage.tsx` | Page composition cho game screen |
| `frontend/src/components/AimCanvas.tsx` | Canvas rendering và pointer event boundary |
| `frontend/src/components/SessionHUD.tsx` | Timer, score, accuracy, stream status |
| `frontend/src/game/gameEngine.ts` | Game lifecycle và score transitions |
| `frontend/src/game/targetGenerator.ts` | Đặt target hợp lệ |
| `frontend/src/game/hitDetection.ts` | Hit/miss math |
| `frontend/src/hooks/useAimTrainer.ts` | Hook game cho UI |

---

## 5. Work breakdown

### Step 1: Khởi tạo frontend app

* Dùng clean Vite React TypeScript shadcn foundation hiện có.
* Thêm routing và basic pages.
* Giữ first screen usable, không làm marketing-only page.

### Step 2: Triển khai game model

* Định nghĩa `Target`, `GameStatus`, session settings và score state.
* Triển khai target generation trong canvas bounds.
* Triển khai hit detection bằng Euclidean distance.

### Step 3: Triển khai canvas boundary

* Render target trên canvas.
* Convert pointer client coordinates sang canvas coordinates.
* Không lưu mọi pointer coordinate trong React state.

### Step 4: Triển khai session lifecycle

* Bắt đầu từ idle.
* Chạy countdown.
* Start timer.
* Stop khi timer hết hoặc user stop thủ công.
* Chuyển sang finishing để telemetry có thể flush trong phase1-plan002.

---

## 6. Ghi chú performance

* Canvas drawing nên imperative và bounded.
* shadcn components được dùng cho HUD/layout controls, không dùng cho canvas drawing.
* HUD state updates chỉ nên giới hạn ở giá trị UI có nghĩa như timer, score và accuracy.
* Pointer move handling phải tương thích với telemetry sampling trong [phase1-plan002](plan002-telemetry-collector-buffer-sender.md).

---

## 7. Acceptance criteria

* [ ] Người dùng chơi được session 30 hoặc 60 giây.
* [ ] Target luôn nằm hoàn toàn trong canvas.
* [ ] Score chỉ tăng khi hit.
* [ ] Miss count tăng khi click ngoài target.
* [ ] Accuracy dùng `hitCount / totalClickCount`.
* [ ] Timer hết sẽ chuyển sang finishing/completed flow.
* [ ] Unit tests cover hit detection, accuracy và target bounds.

---

## 8. Validation

| Check | Kết quả kỳ vọng |
|---|---|
| Unit tests cho game utilities | PASS |
| Manual browser test | Target click được và score thay đổi |
| Kiểm tra render behavior | Pointer move không làm UI xuống cấp rõ rệt |

---

## 9. Bàn giao

Plan này mở khóa [phase1-plan002](plan002-telemetry-collector-buffer-sender.md), nơi telemetry collection được gắn vào gameplay shell.
