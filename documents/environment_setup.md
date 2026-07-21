# Environment Setup and Runbook

> Scope: `frontend/` and `ingestion-api/` only. Big Data runtime services are intentionally out of scope for this document.

## 1. Purpose

This document explains how to start and reproduce the local development environments for:

* [frontend](../frontend/)
* [ingestion-api](../ingestion-api/)

The frontend environment is reproduced from `package-lock.json` with npm. The API environment is reproduced with uv-managed CPython and `uv.lock`; do not use the machine's system Python directly for API commands.

## 2. Prerequisites

### Frontend

| Tool | Required by | Current baseline |
|---|---|---|
| Node.js | Vite 8.1.5 | `^20.19.0 || >=22.12.0` |
| npm | package install and scripts | validated with npm `11.12.1` |

Check locally:

```powershell
node --version
npm --version
```

### API

| Tool | Required by | Current baseline |
|---|---|---|
| uv | Python runtime and dependency management | validated with uv `0.11.29` |
| CPython | API runtime | uv-managed `3.12.13` |

Check locally:

```powershell
uv --version
```

## 3. Frontend Reproduction

Run from the repository root:

```powershell
cd frontend
npm ci
```

Use `npm ci` for reproducible installs because it respects `package-lock.json`. Use `npm install` only when intentionally changing dependencies and updating the lockfile.

### Frontend Commands

```powershell
cd frontend
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

The default Vite dev server starts at:

```text
http://127.0.0.1:5173/
```

If the port is busy:

```powershell
npm run dev -- --host 127.0.0.1 --port 5174
```

### Frontend Reset

If the frontend environment becomes stale:

```powershell
cd frontend
Remove-Item -LiteralPath node_modules -Recurse -Force
Remove-Item -LiteralPath dist -Recurse -Force -ErrorAction SilentlyContinue
npm ci
```

Generated directories such as `node_modules/`, `dist/`, `coverage/`, `playwright-report/` and `test-results/` must stay untracked.

## 4. API Reproduction

Run from the repository root:

```powershell
cd ingestion-api
uv python install 3.12.13
uv python pin 3.12.13
uv sync --all-groups --python 3.12.13
```

The project must use:

```text
ingestion-api/.python-version = 3.12.13
requires-python = >=3.12,<3.13
```

Verify the active interpreter:

```powershell
uv run python -c "import sys; print(sys.version); print(sys.executable)"
```

The executable should resolve under:

```text
ingestion-api/.venv/
```

### API Commands

```powershell
cd ingestion-api
uv run uvicorn app.main:app --host 127.0.0.1 --port 8001
uv run ruff check .
uv run mypy app
uv run pytest
```

Health endpoint:

```text
http://127.0.0.1:8001/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "Mouse Telemetry Ingestion API",
  "version": "0.1.0",
  "environment": "local"
}
```

Port `8000` may be occupied by another local service. Use `8001` for this project unless a later task reserves a different API port.

### API Reset

If the API environment becomes stale:

```powershell
cd ingestion-api
Remove-Item -LiteralPath .venv -Recurse -Force
uv python install 3.12.13
uv sync --all-groups --python 3.12.13
```

Do not run `python`, `pip`, `pytest`, `ruff` or `mypy` directly for this project. Use `uv run ...` so commands execute inside the pinned environment.

## 5. Starting Both Services

Use two terminals.

Terminal 1:

```powershell
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

Terminal 2:

```powershell
cd ingestion-api
uv run uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Then open:

* Frontend: `http://127.0.0.1:5173/`
* API health: `http://127.0.0.1:8001/health`

## 6. Performance Boundaries

### Frontend

* shadcn/ui is for HUD, layout, controls and dashboard-style UI only.
* Do not put canvas drawing, hit detection or telemetry hot-path processing inside shadcn components.
* Do not store raw telemetry event arrays in React state.
* Do not send one HTTP request per pointer event.
* Use refs, plain TypeScript modules and bounded buffers for high-frequency telemetry paths.

### API

* Request handlers should validate and accept data quickly.
* Do not run analytics in the request path.
* Do not perform synchronous disk writes in the hot path.
* Keep Kafka producer logic behind a service boundary when it is introduced.
* Keep response models typed and avoid blanket JSON response defaults that conflict with FastAPI/Pydantic serialization.

## 7. Quick Validation Checklist

Frontend:

```powershell
cd frontend
npm ci
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

API:

```powershell
cd ingestion-api
uv sync --all-groups --python 3.12.13
uv run ruff check .
uv run mypy app
uv run pytest
```

Repository hygiene:

```powershell
git status --short -uall
git check-ignore -v frontend/node_modules frontend/dist ingestion-api/.venv
```

## 8. Related Documents

* [Tracking](TRACKING.md)
* [Aim Trainer Architecture](aim_trainer_app_architecture.md)
* [Frontend Coding Rules](agents/coding_rules_frontend.md)
* [API Coding Rules](agents/coding_rules_api.md)
* [DEC-011: Vite React shadcn frontend stack](decisions/decision011-vite-react-shadcn-frontend-stack.md)
* [DEC-012: uv-managed Python API environment](decisions/decision012-uv-managed-python-api-environment.md)
* [DEC-013: FastAPI performance-oriented API stack](decisions/decision013-fastapi-performance-oriented-api-stack.md)
