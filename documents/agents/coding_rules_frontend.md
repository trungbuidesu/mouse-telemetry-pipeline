# Coding Rules — Aim Trainer Frontend

## 1. Mục đích và phạm vi

File này quy định style và validation cho frontend Aim Trainer.

Áp dụng cho:

- `frontend/src/**`
- `frontend/tests/**` nếu có
- `frontend/*.config.*`
- `frontend/package.json`

Không áp dụng cho FastAPI, Spark, infrastructure hoặc tài liệu ngoài frontend.

---

## 2. Stack mặc định

- React.
- TypeScript strict.
- Vite.
- shadcn/ui conventions with Tailwind CSS v4, CSS variables, `new-york` style and neutral base color.
- React Router for page routing.
- TanStack Query for API/server state only.
- Vitest + Testing Library cho unit/component tests.
- Playwright cho e2e smoke tests.
- ESLint cho lint.
- npm làm package manager.

---

## 3. Nguyên tắc kiến trúc frontend

- UI, gameplay, telemetry và API client phải tách responsibility.
- shadcn components chỉ dùng cho app shell, HUD, controls, cards, tabs, tooltip, badge và layout.
- Không dùng shadcn component để render canvas hoặc quản lý telemetry hot path.
- TanStack Query chỉ dùng cho API/server state như metrics polling; không dùng cho gameplay loop hoặc telemetry buffer.
- Không thêm Zustand/Redux trong foundation phase nếu chưa có decision mới.
- `frontend/src/game/**` chứa logic gameplay thuần như target generation, hit detection, score/accuracy.
- `frontend/src/telemetry/**` chứa collector, buffer, sender, config và telemetry types.
- `frontend/src/api/**` là boundary HTTP, không chứa gameplay.
- Component React không nên biết Kafka, Spark, MinIO hoặc InfluxDB.
- Không tạo internal barrel export nếu không có nhu cầu thật.

---

## 4. Telemetry performance rules

- Không lưu raw telemetry buffer trong React state.
- Không cập nhật React state cho từng `mousemove`.
- Dùng `useRef`, class nhỏ hoặc object ngoài render state cho buffer, sequence, retry state và last sampled timestamp.
- `mousemove` phải được sample theo config trước khi append vào buffer.
- `click`, `session_start` và `session_end` không được bị sampling bỏ.
- Batch sender không được tạo request song song vô hạn; MVP ưu tiên một in-flight batch cho một session sender.
- Khi buffer vượt giới hạn, phải ghi nhận dropped count thay vì mất dữ liệu âm thầm.

---

## 5. TypeScript rules

- Bật strict TypeScript.
- Public function, hook và exported type phải có kiểu rõ ràng.
- Tránh `any`. Nếu bắt buộc dùng `unknown` hoặc `any` ở boundary, thu hẹp kiểu ngay sau đó và ghi comment ngắn.
- Ưu tiên discriminated unions cho telemetry events.
- Không dùng magic numbers cho batch size, flush interval, sample interval hoặc max buffer; đặt trong telemetry config.
- Không dùng mutation khó kiểm soát trong React state; mutation nội bộ buffer phải được cô lập.

---

## 6. React rules

- Hook có interval, timeout, event listener hoặc request phải cleanup khi unmount.
- Component chỉ giữ state cần render.
- Canvas drawing có thể imperative, nhưng lifecycle phải rõ.
- Props phải typed bằng `type` hoặc `interface` nhất quán trong file.
- Không dùng visible debug text/log trong UI trừ khi đó là trạng thái telemetry có chủ đích.

---

## 7. Comments và naming

- Tên biến, function, type, component dùng tiếng Anh.
- Comment/docstring dùng tiếng Việt khi giải thích invariant, edge case hoặc quyết định không hiển nhiên.
- Không comment lại điều hiển nhiên.
- File name phản ánh responsibility, ví dụ `eventBuffer.ts`, `hitDetection.ts`, `telemetryConfig.ts`.

---

## 8. Testing rules

Ưu tiên test logic thuần trước UI:

- Hit detection.
- Accuracy calculation.
- Target bounds.
- Coordinate normalization.
- Batch splitting.
- Sequence increment.
- Retry classification.
- Final flush behavior.

E2E smoke test tối thiểu phải kiểm tra app render được và route chính không crash. Gameplay e2e chi tiết thêm ở phase1.

---

## 9. Validation commands

Chạy trong `frontend/`:

```text
npm run lint
npm run typecheck
npm run test
npm run test:e2e
```

Nếu thay đổi build/runtime config, chạy thêm:

```text
npm run build
```

Không ghi `PASS` nếu command chưa chạy thật.

---

## 10. Checklist

- [ ] Không có telemetry hot path trong React state.
- [ ] TypeScript strict không lỗi.
- [ ] Lint pass hoặc lỗi được giải thích.
- [ ] Unit/e2e liên quan pass hoặc lỗi được giải thích.
- [ ] Config mới không sinh output được track bởi Git.
- [ ] Public telemetry/API contract thay đổi đã cập nhật decision/plan liên quan.
