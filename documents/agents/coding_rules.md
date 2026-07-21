# Coding Rules Index

## 1. Mục đích

File này là điểm vào bắt buộc trước khi tạo hoặc sửa mã nguồn trong repository.

Agent và developer phải đọc file này trước, sau đó đọc rule chuyên biệt theo subsystem đang thay đổi.

| Subsystem | Rule file | Phạm vi |
|---|---|---|
| Aim Trainer frontend | [coding_rules_frontend.md](coding_rules_frontend.md) | `frontend/src/**`, frontend tests và frontend config |
| Ingestion API | [coding_rules_api.md](coding_rules_api.md) | `ingestion-api/app/**`, API tests và API config |
| Stream processing | Future rule file | `stream-processing/**`, chưa nằm trong scope hiện tại |
| Infrastructure | Future rule file | `infrastructure/**`, `dashboards/**`, chưa nằm trong scope hiện tại |

---

## 2. Quy tắc chung cho mọi subsystem

- Mỗi thay đổi phải thuộc một task file trong `documents/phases/<phase>/`.
- Ưu tiên thay đổi nhỏ, dễ review, bám đúng plan/decision hiện có.
- Không refactor ngoài phạm vi task.
- Không tạo file có hậu tố `v2`, `new`, `final`, `copy`, `advanced`.
- Không tạo circular dependency hoặc barrel export nội bộ khi chưa có rule cho phép.
- Không để debug code, console/log tạm hoặc code comment-out.
- Không khai báo validation pass nếu command chưa chạy thật.
- Nếu thay đổi public contract, schema, endpoint hoặc persisted data, cập nhật plan/decision liên quan.

---

## 3. Cách chọn rule file

| Khi sửa | Phải đọc |
|---|---|
| `frontend/src/**`, `frontend/*.config.*`, frontend tests | File này và [coding_rules_frontend.md](coding_rules_frontend.md) |
| `ingestion-api/app/**`, `ingestion-api/pyproject.toml`, API tests | File này và [coding_rules_api.md](coding_rules_api.md) |
| Tài liệu trong `documents/**` | File này, [AGENTS.md](AGENTS.md), [commit_rules.md](commit_rules.md) |
| Spark/Kafka/Grafana/infrastructure | File này và decision/plan liên quan; rule chuyên biệt sẽ được tạo ở phase sau |

---

## 4. Validation tối thiểu theo subsystem

| Subsystem | Commands |
|---|---|
| Frontend | `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e` |
| API | `uv run ruff check .`, `uv run mypy app`, `uv run pytest` |
| Documentation | Markdown link check, `rg --files documents`, manual path review |

Chạy validation theo phạm vi thay đổi. Nếu command không thể chạy vì dependency hoặc môi trường thiếu, ghi rõ lý do trong task file và final response.

---

## 5. Luật ưu tiên

Nếu có mâu thuẫn:

1. System/developer instructions của Codex.
2. `documents/agents/AGENTS.md`.
3. Decision records trong `documents/decisions/`.
4. Rule chuyên biệt của subsystem.
5. File index này.
