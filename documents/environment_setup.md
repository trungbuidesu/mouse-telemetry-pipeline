# Thiết lập và khởi chạy môi trường

> Phạm vi: chỉ `frontend/` và `ingestion-api/`. Các runtime service của Big Data stack chưa nằm trong tài liệu này.

## 1. Mục đích

Tài liệu này hướng dẫn cách khởi chạy và tái lập môi trường local cho:

* [frontend](../frontend/)
* [ingestion-api](../ingestion-api/)

Môi trường frontend được tái lập từ `package-lock.json` bằng npm. Môi trường API được tái lập bằng uv-managed CPython và `uv.lock`; không dùng trực tiếp Python hệ thống của máy cho các lệnh API.

`uv-managed` nghĩa là uv chịu trách nhiệm cài và chọn đúng phiên bản Python cho project. Điều này giúp môi trường ổn định hơn giữa các máy, miễn là cùng dùng `.python-version` và `uv.lock`.

## 2. Công cụ cần có

### Frontend

| Tool | Dùng cho | Baseline hiện tại |
|---|---|---|
| Node.js | Vite 8.1.5 | `^20.19.0 || >=22.12.0` |
| npm | cài package và chạy script | đã validate với npm `11.12.1` |

Kiểm tra trên máy:

```powershell
node --version
npm --version
```

### API

| Tool | Dùng cho | Baseline hiện tại |
|---|---|---|
| uv | quản lý Python runtime và dependencies | đã validate với uv `0.11.29` |
| CPython | runtime của API | uv-managed `3.12.13` |

Kiểm tra trên máy:

```powershell
uv --version
```

## 3. Tái lập môi trường frontend

Chạy từ root của repository:

```powershell
cd frontend
npm ci
```

Dùng `npm ci` khi cần môi trường tái lập được, vì lệnh này bám sát `package-lock.json`. Chỉ dùng `npm install` khi chủ động thay đổi dependency và cập nhật lockfile.

### Lệnh frontend

```powershell
cd frontend
npm run dev
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

Vite dev server mặc định chạy tại:

```text
http://127.0.0.1:5173/
```

Nếu port đang bận:

```powershell
npm run dev -- --host 127.0.0.1 --port 5174
```

### Reset frontend

Khi môi trường frontend bị stale hoặc dependency lỗi:

```powershell
cd frontend
Remove-Item -LiteralPath node_modules -Recurse -Force
Remove-Item -LiteralPath dist -Recurse -Force -ErrorAction SilentlyContinue
npm ci
```

Các thư mục sinh ra trong quá trình chạy như `node_modules/`, `dist/`, `coverage/`, `playwright-report/` và `test-results/` phải không được track bởi Git.

## 4. Tái lập môi trường API

Chạy từ root của repository:

```powershell
cd ingestion-api
uv python install 3.12.13
uv python pin 3.12.13
uv sync --all-groups --python 3.12.13
```

Project phải dùng:

```text
ingestion-api/.python-version = 3.12.13
requires-python = >=3.12,<3.13
```

Kiểm tra interpreter đang được dùng:

```powershell
uv run python -c "import sys; print(sys.version); print(sys.executable)"
```

Executable nên nằm dưới:

```text
ingestion-api/.venv/
```

Nếu executable trỏ ra Python cài sẵn của hệ thống, môi trường chưa đạt yêu cầu tái lập.

### Lệnh API

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

Response kỳ vọng:

```json
{
  "status": "ok",
  "service": "Mouse Telemetry Ingestion API",
  "version": "0.1.0",
  "environment": "local"
}
```

Port `8000` có thể đang được một local service khác dùng. Tạm thời dùng `8001` cho project này, trừ khi một task sau quyết định port API khác.

### Reset API

Khi môi trường API bị stale:

```powershell
cd ingestion-api
Remove-Item -LiteralPath .venv -Recurse -Force
uv python install 3.12.13
uv sync --all-groups --python 3.12.13
```

Không chạy trực tiếp `python`, `pip`, `pytest`, `ruff` hoặc `mypy` cho project này. Dùng `uv run ...` để đảm bảo command chạy bên trong môi trường đã pin.

## 5. Khởi chạy cả hai service

Dùng hai terminal.

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

Sau đó mở:

* Frontend: `http://127.0.0.1:5173/`
* API health: `http://127.0.0.1:8001/health`

## 6. Ranh giới performance

### Frontend

* shadcn/ui chỉ dùng cho HUD, layout, controls và UI kiểu dashboard.
* Không đặt canvas drawing, hit detection hoặc xử lý telemetry hot path bên trong shadcn components.
* Không lưu raw telemetry event array trong React state.
* Không gửi một HTTP request cho từng pointer event.
* Dùng refs, plain TypeScript modules và bounded buffers cho các luồng telemetry tần suất cao.

`hot path` là đoạn code chạy rất thường xuyên hoặc ảnh hưởng trực tiếp đến độ mượt, ví dụ `mousemove`, canvas draw loop và buffer append. Code trong hot path cần ít allocation, ít re-render và không làm I/O đồng bộ.

### API

* Request handler chỉ nên validate và accept dữ liệu nhanh.
* Không chạy analytics trong request path.
* Không ghi disk đồng bộ trong hot path.
* Khi thêm Kafka producer, đặt logic đó sau service boundary.
* Giữ response model có type rõ ràng và tránh blanket JSON response default nếu nó xung đột với cơ chế serialize của FastAPI/Pydantic.

`service boundary` là lớp tách giữa route handler và hệ thống bên ngoài như Kafka. Route chỉ gọi service theo contract rõ ràng; chi tiết retry, timeout, producer client và mapping lỗi nằm trong service.

## 7. Checklist validation nhanh

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

Git hygiene:

```powershell
git status --short -uall
git check-ignore -v frontend/node_modules frontend/dist ingestion-api/.venv
```

## 8. Tài liệu liên quan

* [Tracking](TRACKING.md)
* [Kiến trúc Aim Trainer](aim_trainer_app_architecture.md)
* [Coding rules frontend](agents/coding_rules_frontend.md)
* [Coding rules API](agents/coding_rules_api.md)
* [DEC-011: Vite React shadcn frontend stack](decisions/decision011-vite-react-shadcn-frontend-stack.md)
* [DEC-012: uv-managed Python API environment](decisions/decision012-uv-managed-python-api-environment.md)
* [DEC-013: FastAPI performance-oriented API stack](decisions/decision013-fastapi-performance-oriented-api-stack.md)
