# Quy trình phát triển cho Agent

## 1. Task file là nguồn sự thật

Mọi công việc phải được thực hiện thông qua một task file riêng.

Task template gốc nằm tại:

```text
documents/templates/task.md
```

Task thực tế phải được lưu tại:

```text
documents/phases/<phase>/task<sequence>-<short-name>.md
```

Ví dụ:

```text
documents/phases/phase0/task001-project-setup.md
documents/phases/phase0/task002-user-model.md
documents/phases/phase1/task001-login-api.md
```

Không được sửa trực tiếp file template để ghi trạng thái của task đang làm.

Không được tái sử dụng hoặc ghi đè task file cũ.

---

## 2. Quy trình bắt buộc khi nhận task

Trước khi lập kế hoạch hoặc sửa code, phải thực hiện theo đúng thứ tự sau.

### Bước 1: Xác định phase

Xác định task thuộc phase nào dựa trên:

1. Yêu cầu hiện tại của người dùng.
2. Các task đã có trong `documents/phases/`.
3. Nội dung và mục tiêu của từng phase.
4. Dependency giữa task hiện tại và các task trước.

Nếu phase đã được người dùng chỉ định, sử dụng phase đó.

Không tự tạo phase mới nếu task có thể thuộc một phase hiện có.

### Bước 2: Kiểm tra các task trong phase

Đọc toàn bộ tên file trong:

```text
documents/phases/<current-phase>/
```

Sau đó đọc tối thiểu:

* Các task có status `IN_PROGRESS`.
* Task hoàn thành gần nhất.
* Các task có liên quan trực tiếp đến yêu cầu hiện tại.
* Các task mà task hiện tại phụ thuộc vào.
* Các task có khả năng trùng responsibility.

Phải xác định:

* Task hiện tại đã tồn tại hay chưa.
* Có task đang thực hiện dở hay không.
* Task mới có trùng hoặc chồng lấn task cũ hay không.
* Sequence number tiếp theo là bao nhiêu.
* Những quyết định và thay đổi trước đó cần được giữ nguyên.

Nếu task đã tồn tại và chưa hoàn thành, tiếp tục cập nhật task file đó thay vì tạo file mới.

Nếu task đã hoàn thành nhưng người dùng yêu cầu mở rộng hành vi mới, tạo task mới và tham chiếu task cũ trong mục `Related Tasks`.

### Bước 3: Tạo task file

Copy nguyên vẹn:

```text
documents/templates/task.md
```

thành:

```text
documents/phases/<phase>/task<sequence>-<short-name>.md
```

Quy tắc đặt tên:

* Dùng chữ thường.
* Dùng dấu gạch ngang.
* Không dùng tên chung chung như `update`, `fix`, `new-feature`.
* Tên phải phản ánh hành vi chính.
* Không ghi đè file đã tồn tại.

Ví dụ hợp lệ:

```text
task004-add-password-verification.md
task005-validate-user-session.md
```

Ví dụ không hợp lệ:

```text
task4-update.md
task-new.md
task-final.md
task-v2.md
```

### Bước 4: Khởi tạo task file

Trước khi lập implementation plan, phải điền:

* Task metadata.
* Original request.
* Mục tiêu.
* Initial project state.
* Existing task context.
* Related tasks.
* Related source files.
* Existing-code search.
* Scope và out-of-scope.

Copy nguyên văn yêu cầu của người dùng vào `Original Request`.

Không được tóm tắt làm mất constraint hoặc điều kiện quan trọng.

### Bước 5: Kiểm tra project

Phải kiểm tra tối thiểu:

1. Branch và commit hiện tại.
2. `git status`.
3. `git diff`.
4. Các file chưa commit.
5. Cấu trúc module liên quan.
6. README và tài liệu kiến trúc liên quan.
7. Build, test, lint và type-check commands.
8. Code và tests liên quan đến task.
9. Import/export và dependency liên quan.
10. Baseline pass/fail hiện tại nếu có thể kiểm tra hợp lý.

Ghi kết quả vào task file.

Chỉ sau khi hoàn tất các bước trên mới được lập kế hoạch và sửa code.

---

## 3. Quy trình tiếp tục task hiện có

Nếu có task file với status:

```text
IN_PROGRESS
BLOCKED
PARTIAL
```

và nội dung phù hợp với yêu cầu hiện tại, phải tiếp tục task đó.

Trước khi tiếp tục:

1. Đọc toàn bộ task file.
2. Chạy `git status`.
3. Đọc `git diff`.
4. Kiểm tra các file trong `Related Files`.
5. Đối chiếu repository với `Work Log`, `Changes` và `Next Action`.
6. Cập nhật mục `Resume Check`.
7. Chỉ tiếp tục khi đã xác định trạng thái thực tế.

Repository và Git diff là nguồn sự thật ưu tiên nếu task file bị lỗi thời.

---

## 4. Cập nhật task file trong quá trình làm

Task file phải được cập nhật sau mỗi bước có ý nghĩa.

Một bước có ý nghĩa bao gồm:

* Hoàn thành một thay đổi hành vi.
* Tạo hoặc sửa symbol quan trọng.
* Phát hiện dependency hoặc constraint mới.
* Chạy test, lint, type-check hoặc build.
* Thay đổi implementation plan.
* Phát hiện lỗi hoặc blocker.
* Thay đổi phạm vi.
* Chuẩn bị dừng do context sắp compact.

Mỗi lần cập nhật phải ghi:

* Timestamp.
* Action vừa thực hiện.
* Files inspected.
* Files changed.
* Symbols changed.
* Kết quả thực tế.
* Validation đã chạy.
* Quyết định hoặc phát hiện mới.
* Bước tiếp theo.

Không cần log từng dòng code hoặc thao tác vụn vặt.

---

## 5. Quy tắc thực hiện code

* Chi tiết style cho source code: đọc `documents/agents/coding_rules.md` trước, sau đó đọc rule chuyên biệt theo subsystem đang sửa.
  * Frontend Aim Trainer: `documents/agents/coding_rules_frontend.md`.
  * FastAPI ingestion API: `documents/agents/coding_rules_api.md`.
  * Spark/infrastructure: đọc plan/decision liên quan; rule chuyên biệt sẽ được tạo khi phase đó bắt đầu.
* Comment/docstring trong source code mới hoặc phần được sửa dùng tiếng Việt khi giải thích invariant, edge case hoặc quyết định không hiển nhiên; typing theo rule của subsystem.
* Mỗi lần chỉ xử lý một thay đổi nhỏ.
* Ưu tiên sửa từ 1–3 file trong một bước.
* Không refactor ngoài phạm vi.
* Không tạo file mới trước khi tìm implementation tương tự.
* Phải chọn rõ `REUSE`, `EXTEND` hoặc `CREATE`.
* Chỉ chọn `CREATE` khi đã giải thích vì sao không thể reuse hoặc extend.
* Không tạo abstraction cho nhu cầu chưa tồn tại.
* Không tạo file có hậu tố `v2`, `new`, `final`, `copy`, `advanced`.
* Không sửa thay đổi chưa commit của người dùng nếu không thuộc task.
* Không dùng internal barrel import.
* Không tạo circular dependency.
* Không khai báo pass nếu chưa thực sự chạy command.

Chu trình mặc định:

```text
Inspect
→ Update task file
→ Make minimal change
→ Review diff
→ Chạy focused validation
→ Update task file
```

---

## 6. Kết thúc task

Chỉ chuyển task thành `DONE` khi:

* Acceptance criteria đã hoàn thành.
* Diff nằm trong phạm vi.
* Không còn placeholder do task tạo ra.
* Tests liên quan đã được chạy.
* Lint hoặc type-check đã được chạy nếu project sử dụng.
* Changes và Symbol Delta đã được cập nhật.
* Các phần chưa kiểm tra được khai báo rõ.
* Final Summary đã hoàn thành.

Nếu chưa hoàn thành toàn bộ, sử dụng:

```text
PARTIAL
BLOCKED
```

Không được tạo task mới chỉ để che giấu task hiện tại chưa hoàn thành.

---

## 7. Context compact hoặc phiên làm việc mới

Trước khi dừng hoặc khi context có nguy cơ bị compact:

1. Cập nhật task file hiện tại.
2. Ghi chính xác bước vừa hoàn thành.
3. Ghi các file đang sửa.
4. Ghi validation gần nhất.
5. Ghi vấn đề còn tồn tại.
6. Ghi `Next Verified Action`.

Khi bắt đầu phiên mới:

1. Đọc file này.
2. Xác định phase hiện tại.
3. Kiểm tra task files trong phase.
4. Tìm task `IN_PROGRESS`, `PARTIAL` hoặc `BLOCKED`.
5. Đọc task phù hợp.
6. Đối chiếu với Git.
7. Tiếp tục từ `Next Verified Action`.

Không được tiếp tục chỉ dựa trên conversation summary hoặc trí nhớ của model.
