# Decision DEC-011: Vite React shadcn Frontend Stack

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

The frontend must be a playable Aim Trainer and a reliable telemetry source. It needs a modern UI stack for app shell, HUD, controls and result/dashboard placeholders, while the high-frequency canvas and telemetry path must stay performance-safe.

---

## 3. Decision

Use the following frontend stack:

- Vite React TypeScript initialized from a clean Vite scaffold.
- npm and committed `package-lock.json`.
- shadcn/ui conventions with Tailwind CSS v4, CSS variables, `new-york` style and `neutral` base color.
- `@/*` alias mapped to `frontend/src/*`.
- React Router for `/`, `/play`, `/result/:sessionId` and `/dashboard`.
- TanStack Query only for API/server state and metrics polling.
- No Redux/Zustand in the foundation phase.

shadcn components are allowed for page layout, HUD, controls, cards, tabs, tooltips and badges. They must not be used as the rendering mechanism for high-frequency canvas drawing or telemetry buffers.

---

## 4. Rationale

- Vite keeps the frontend fast to build and simple to run locally.
- shadcn provides copy-owned UI primitives that can be tuned without adopting a heavy component runtime.
- Tailwind CSS variables fit the dashboard/HUD style without requiring a separate design system.
- React Router is enough for the small route set.
- TanStack Query cleanly separates server state from local gameplay/telemetry state.

---

## 5. Consequences

### Positive

- Frontend implementation can start from a clean, validated app foundation.
- UI primitives are present before gameplay starts.
- Server-state polling has a clear home.
- Hot-path telemetry constraints remain explicit.

### Trade-offs

- shadcn components are source files owned by the repo and must be maintained.
- Tailwind class-heavy UI needs lint/review discipline to avoid unreadable components.
- Query state must not leak into telemetry buffering or gameplay loops.

---

## 6. Implementation Constraints

- Use shadcn UI components only outside the canvas hot path.
- Do not store raw telemetry arrays in React state.
- Gameplay and telemetry hot-path state should remain in plain TypeScript modules, refs or local hook internals.
- Keep `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e` and `npm run build` green.

---

## 7. Linked Documents

- [phase1](../phases/phase1/README.md)
- [phase1-plan001](../plans/phase1/plan001-frontend-gameplay-shell.md)
- [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)
- [coding rules frontend](../agents/coding_rules_frontend.md)

