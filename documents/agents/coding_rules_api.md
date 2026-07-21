# Coding Rules — Ingestion API

## 1. Mục đích và phạm vi

File này quy định style và validation cho FastAPI ingestion API.

Áp dụng cho:

- `ingestion-api/app/**`
- `ingestion-api/tests/**`
- `ingestion-api/pyproject.toml`
- API config liên quan

Không áp dụng cho frontend, Spark hoặc infrastructure ngoài API.

---

## 2. Stack mặc định

- Python 3.12.
- uv-managed CPython pinned by `.python-version`.
- FastAPI.
- Pydantic v2.
- `pydantic-settings` cho cấu hình typed.
- `orjson` cho JSON response path khi phù hợp.
- uv làm package manager.
- pytest + pytest-asyncio cho tests.
- httpx cho ASGI/API tests.
- ruff cho lint.
- mypy strict cho type-check.

---

## 3. Nguyên tắc kiến trúc API

- FastAPI là HTTP ingestion boundary giữa browser và Kafka.
- Validation phải chạy qua `uv run`; không dùng trực tiếp Python hoặc pytest của hệ thống.
- Request path chỉ validate, accept và chuyển tiếp batch; không tính analytics nặng.
- Schema validation nằm trong Pydantic models hoặc validators rõ ràng.
- Kafka producer nằm sau service boundary, không trộn trực tiếp vào route handler.
- Route handler không biết chi tiết Spark, MinIO hoặc InfluxDB.
- Error response phải phân biệt lỗi không retry được và lỗi retry được.

---

## 4. Python typing rules

- Mọi function/method public phải annotate tham số và kiểu trả về.
- Module Python mới phải bắt đầu bằng `from __future__ import annotations`, trừ `__init__.py` rỗng hoặc metadata-only.
- Ưu tiên `list[str]`, `dict[str, T]`, `X | None`.
- Dùng `collections.abc` cho `Mapping`, `Sequence`, `Iterable`, `Callable` khi chỉ cần protocol.
- Tránh `Any`; nếu bắt buộc ở JSON boundary, thu hẹp kiểu sớm và comment lý do.
- Không dùng `# type: ignore` rộng. Nếu bắt buộc, ghi lý do ngay cạnh dòng.

---

## 5. FastAPI và Pydantic rules

- Request/response models phải explicit.
- Không dùng dict trần trong route public nếu có schema ổn định.
- Payload lỗi schema trả `400` hoặc lỗi validation framework đã được chuẩn hóa.
- Payload quá lớn nên trả `413` khi giới hạn được triển khai.
- Kafka/dependency quá tải nên trả lỗi retryable như `429` hoặc `503`.
- Không log toàn bộ raw event payload ở mức info trong hot path.
- Không ghi raw telemetry đồng bộ xuống disk trong request path.

---

## 6. Comments và naming

- Tên module, biến, function, class dùng tiếng Anh.
- Comment/docstring dùng tiếng Việt khi giải thích invariant, edge case hoặc quyết định không hiển nhiên.
- Exception message có thể dùng tiếng Anh để ổn định cho tests/API clients.
- Không để `print` debug hoặc code comment-out.

---

## 7. Testing rules

Tối thiểu API tests cần có:

- Health/smoke test.
- Valid batch accepted.
- Invalid payload rejected.
- Producer failure maps to retryable response.
- Oversized batch behavior khi limit được triển khai.

Khi chưa có route thật, smoke test chỉ kiểm tra package import hoặc app factory tối thiểu.

---

## 8. Validation commands

Chạy trong `ingestion-api/`:

```text
uv run ruff check .
uv run mypy app
uv run pytest
```

Nếu thay đổi dependency:

```text
uv sync --all-groups
```

Không ghi `PASS` nếu command chưa chạy thật.

---

## 9. Checklist

- [ ] Ruff pass hoặc lỗi được giải thích.
- [ ] Mypy pass hoặc lỗi được giải thích.
- [ ] Pytest liên quan pass hoặc lỗi được giải thích.
- [ ] Route handler không xử lý analytics nặng.
- [ ] Kafka/dependency boundary rõ ràng.
- [ ] Public API/schema thay đổi đã cập nhật decision/plan liên quan.
