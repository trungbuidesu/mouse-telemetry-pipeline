# Decision DEC-011: Vite React shadcn Frontend Stack

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Frontend phải vừa là Aim Trainer chơi được, vừa là nguồn telemetry đáng tin cậy. App cần UI stack hiện đại cho app shell, HUD, controls, result page và dashboard placeholder; đồng thời canvas và telemetry path tần suất cao phải được giữ performance-safe.

---

## 3. Quyết định

Dùng frontend stack sau:

* Vite React TypeScript khởi tạo từ clean Vite scaffold.
* npm và commit `package-lock.json`.
* shadcn/ui conventions với Tailwind CSS v4, CSS variables, `new-york` style và `neutral` base color.
* Alias `@/*` map tới `frontend/src/*`.
* React Router cho `/`, `/play`, `/result/:sessionId` và `/dashboard`.
* TanStack Query chỉ dùng cho API/server state và metrics polling.
* Không thêm Redux/Zustand trong foundation phase.

shadcn components được dùng cho page layout, HUD, controls, cards, tabs, tooltips và badges. Không dùng shadcn làm cơ chế render cho canvas drawing hoặc telemetry buffers tần suất cao.

---

## 4. Lý do

* Vite giúp frontend build nhanh và chạy local đơn giản.
* shadcn cung cấp UI primitives dạng source-owned, dễ chỉnh mà không kéo một component runtime nặng.
* Tailwind CSS variables phù hợp style dashboard/HUD mà chưa cần design system riêng.
* React Router đủ cho route set nhỏ.
* TanStack Query tách server state khỏi gameplay/telemetry state rõ ràng.

---

## 5. Hệ quả

### Tích cực

* Frontend implementation có clean, validated app foundation.
* UI primitives sẵn sàng trước khi bắt đầu gameplay.
* Server-state polling có vị trí rõ ràng.
* Ràng buộc telemetry hot path được ghi rõ.

### Đánh đổi

* shadcn components là source files thuộc repo và phải được maintain.
* UI nhiều Tailwind class cần lint/review discipline để tránh component khó đọc.
* Query state không được rò sang telemetry buffering hoặc gameplay loops.

---

## 6. Ràng buộc triển khai

* Chỉ dùng shadcn UI components ngoài canvas hot path.
* Không lưu raw telemetry arrays trong React state.
* Gameplay và telemetry hot-path state nên nằm trong plain TypeScript modules, refs hoặc local hook internals.
* Giữ `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e` và `npm run build` pass.

---

## 7. Tài liệu liên quan

* [phase1](../phases/phase1/README.md)
* [phase1-plan001](../plans/phase1/plan001-frontend-gameplay-shell.md)
* [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)
* [coding rules frontend](../agents/coding_rules_frontend.md)
