# Decision DEC-012: Môi trường Python API do uv quản lý

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Ingestion API phải tái lập được ở mức môi trường. Người dùng yêu cầu rõ là không phụ thuộc Python cài sẵn trên máy. Mục tiêu là môi trường Python tái lập được cho API development, không phải tái lập toàn bộ app/data.

---

## 3. Quyết định

Dùng uv-managed Python cho `ingestion-api`.

API environment defaults:

* `.python-version = 3.12.13`
* `requires-python = ">=3.12,<3.13"`
* commit `uv.lock`
* validation đi qua `uv run`, không dùng trực tiếp system `python`

Setup commands:

```text
uv python install 3.12.13
uv python pin 3.12.13
uv sync --all-groups --python 3.12.13
```

---

## 4. Lý do

* uv có thể cài và chọn managed Python interpreter.
* Pin Python tránh drift sang system Python hoặc Python 3.13.
* `uv.lock` giúp dependency resolution của API foundation có thể lặp lại.
* API được cô lập khỏi frontend và các Big Data services tương lai.

---

## 5. Hệ quả

### Tích cực

* API validation commands tái lập được trên các máy có uv.
* Python version được ghi rõ trong source.
* Các task API sau có thể thêm routes mà không phải quyết lại environment setup.

### Đánh đổi

* Contributor cần cài uv.
* Môi trường tái lập được; external services và data vẫn phụ thuộc từng phase.

---

## 6. Ràng buộc triển khai

* Không chạy API validation bằng `python`, `pip` hoặc global pytest trực tiếp.
* Giữ `.venv/` ignored.
* Nếu đổi Python version, cập nhật `.python-version`, `requires-python` và `uv.lock` cùng nhau.
* Ghi mọi thay đổi Python version vào decision này hoặc decision thay thế.

---

## 7. Tài liệu liên quan

* [phase0](../phases/phase0/README.md)
* [phase2](../phases/phase2/README.md)
* [phase2-plan001](../plans/phase2/plan001-fastapi-ingestion-contract.md)
* [coding rules api](../agents/coding_rules_api.md)
