# Quy tắc commit

## 1. Mục đích

Mỗi commit phải là một checkpoint nhỏ, rõ ràng và có thể kiểm tra độc lập.

Commit phải giúp người đọc trả lời được:

* Thay đổi này thuộc task nào?
* Hành vi nào đã được thêm, sửa hoặc loại bỏ?
* Những file nào bị ảnh hưởng?
* Kiểm tra nào đã được chạy?
* Có thể revert commit này độc lập hay không?

Không dùng commit như nơi chứa nhiều thay đổi không liên quan.

---

## 2. Điều kiện trước khi commit

Trước khi tạo commit, agent phải:

1. Đọc lại task file hiện tại.
2. Chạy `git status`.
3. Đọc toàn bộ `git diff`.
4. Kiểm tra staged diff bằng:

```bash
git diff --staged
```

5. Xác nhận các file được stage đều thuộc phạm vi task.
6. Cập nhật `Work Log`, `Changes`, `Symbol Delta` và `Validation` trong task file.
7. Chạy validation phù hợp với phần vừa sửa.
8. Loại bỏ debug code, log tạm và file sinh ngoài chủ đích.
9. Xác nhận không stage secret, credential hoặc dữ liệu nhạy cảm.
10. Xác nhận commit chỉ chứa một thay đổi logic chính.

Không được commit nếu chưa đọc staged diff.

---

## 3. Phạm vi của một commit

Một commit nên tương ứng với một thay đổi nhỏ có ý nghĩa, ví dụ:

* Thêm một domain model.
* Thêm một validation rule.
* Sửa một lỗi cụ thể.
* Thêm tests cho một hành vi.
* Refactor nội bộ không thay đổi hành vi.
* Cập nhật tài liệu cho thay đổi vừa hoàn thành.

Thông thường một commit không nên:

* Trộn feature và refactor.
* Trộn sửa lỗi với format toàn repository.
* Trộn dependency update với thay đổi business logic.
* Trộn nhiều task khác nhau.
* Chứa nhiều hành vi độc lập.
* Chứa code chưa hoàn thiện nhưng không được ghi rõ.

Nếu thay đổi có thể được mô tả bằng hai câu hoàn toàn độc lập, nên cân nhắc tách thành hai commit.

---

## 4. Commit theo task

Mỗi commit phải thuộc một task file cụ thể:

```text
documents/phases/<phase>/task<sequence>-<short-name>.md
```

Task file phải được stage cùng commit nếu commit làm thay đổi:

* Work Log.
* Changes.
* Symbol Delta.
* Validation.
* Acceptance Criteria.
* Task status.
* Next Verified Action.

Không tạo commit code mà task file vẫn mô tả trạng thái cũ.

### Tham chiếu task

Commit body phải chứa đường dẫn task file:

```text
Task: documents/phases/phase0/task003-add-password-verification.md
```

Không chỉ ghi `task3` hoặc tên rút gọn không thể truy vết.

---

## 5. Commit message format

Sử dụng định dạng:

```text
<type>(<scope>): <summary>
```

Ví dụ:

```text
feat(auth): add password verification
fix(parser): handle empty configuration
test(auth): cover invalid password cases
refactor(rules): extract condition evaluation
docs(phase0): finalize task003 change log
```

### Quy tắc summary

Summary phải:

* Viết bằng tiếng Anh.
* Dùng động từ dạng mệnh lệnh.
* Bắt đầu bằng chữ thường.
* Không kết thúc bằng dấu chấm.
* Tối đa khoảng 72 ký tự.
* Mô tả thay đổi thực tế, không mô tả hoạt động chung chung.

Ví dụ tốt:

```text
feat(auth): reject inactive users during login
```

Ví dụ không tốt:

```text
update auth
changes
fix stuff
final update
working version
task completed
```

---

## 6. Commit types

### `feat`

Thêm hành vi hoặc khả năng mới.

```text
feat(api): add user registration endpoint
```

### `fix`

Sửa hành vi sai hoặc lỗi.

```text
fix(auth): prevent login for disabled accounts
```

### `test`

Chỉ thêm hoặc sửa tests, không thay đổi production behavior.

```text
test(auth): cover expired session handling
```

### `refactor`

Thay đổi cấu trúc nội bộ nhưng không thay đổi hành vi quan sát được.

```text
refactor(parser): extract token normalization
```

### `docs`

Chỉ thay đổi tài liệu.

```text
docs(phase0): document authentication decisions
```

### `chore`

Công việc bảo trì không thuộc production behavior.

```text
chore(tooling): configure ruff checks
```

### `build`

Thay đổi build system hoặc dependencies.

```text
build(api): add pydantic dependency
```

### `ci`

Thay đổi pipeline hoặc automation.

```text
ci(test): run unit tests on pull requests
```

### `perf`

Cải thiện hiệu năng mà không thay đổi semantics.

```text
perf(query): reduce duplicate database lookups
```

### `style`

Chỉ thay đổi format, whitespace hoặc style không ảnh hưởng logic.

```text
style(auth): apply formatter
```

### `revert`

Revert một commit trước đó.

```text
revert: feat(auth): add session caching
```

---

## 7. Phạm vi

Scope phải phản ánh module hoặc responsibility chính:

```text
auth
api
database
parser
rules
ui
docs
phase0
tooling
```

Không dùng scope quá chung chung:

```text
app
project
code
misc
changes
```

Nếu commit chỉ cập nhật task documentation, có thể dùng phase làm scope:

```text
docs(phase1): update task004 validation results
```

---

## 8. Commit body

Commit body được yêu cầu khi:

* Thay đổi không hiển nhiên.
* Có quyết định kiến trúc.
* Có compatibility impact.
* Có migration.
* Có limitation.
* Có test chưa chạy.
* Task chỉ hoàn thành một phần.
* Commit sửa lỗi có nguyên nhân đáng chú ý.

Format khuyến nghị:

```text
<type>(<scope>): <summary>

What:
- <thay đổi chính>

Why:
- <lý do>

Validation:
- <command> -> PASS
- <command> -> PASS

Task: <task file path>
```

Ví dụ:

```text
feat(auth): add password verification

What:
- Add password hash comparison in AuthenticationService
- Return invalid-credentials error for mismatched passwords
- Add focused unit tests

Why:
- Login previously validated only user existence

Validation:
- pytest tests/auth/test_authentication.py -q -> PASS
- ruff check src/auth tests/auth -> PASS

Task: documents/phases/phase0/task004-add-password-verification.md
```

---

## 9. Breaking changes

Nếu commit thay đổi public API, schema, contract hoặc persisted data, phải ghi:

```text
BREAKING CHANGE: <mô tả thay đổi và migration cần thiết>
```

Ví dụ:

```text
refactor(api): rename user status field

BREAKING CHANGE: API responses now use `is_active` instead of `active`.
Consumers must update response parsing.

Task: documents/phases/phase1/task006-normalize-user-status.md
```

Không được che giấu breaking change dưới `refactor` hoặc `fix`.

---

## 10. Validation trước commit

Validation phải tỷ lệ thuận với phạm vi thay đổi.

### Thay đổi nhỏ trong một module

Chạy tối thiểu:

* Focused tests.
* Lint trên file hoặc module liên quan.
* Type-check liên quan nếu có.

### Thay đổi public API hoặc shared module

Chạy:

* Focused tests.
* Tests của callers.
* Type-check.
* Build hoặc integration tests nếu phù hợp.

### Refactor

Phải chứng minh behavior không đổi bằng tests hiện có.

### Documentation-only commit

Không bắt buộc chạy test code, nhưng phải kiểm tra:

* Link.
* Path.
* Markdown structure.
* Nội dung khớp repository hiện tại.

Các command và kết quả phải được ghi vào task file trước khi commit.

Không ghi `PASS` nếu command chưa được chạy.

---

## 11. Staging rules

Ưu tiên stage có chủ đích:

```bash
git add path/to/file
git add -p
```

Hạn chế:

```bash
git add .
git add -A
```

Chỉ dùng stage toàn bộ khi đã xác nhận mọi thay đổi đều thuộc cùng task và cùng commit.

Sau khi stage, luôn chạy:

```bash
git diff --staged --stat
git diff --staged
```

Không commit:

* File môi trường cá nhân.
* Secret.
* Credential.
* Token.
* `.env` thật.
* Database dump ngoài chủ đích.
* Build output.
* Cache.
* IDE state.
* File log tạm.
* Dataset lớn không được phê duyệt.
* File thay đổi ngoài task.

---

## 12. Partial commit

Có thể commit một phần task nếu commit tạo ra checkpoint ổn định.

Điều kiện:

* Code không bị hỏng.
* Build hoặc focused tests phù hợp pass.
* Task file vẫn giữ status `IN_PROGRESS` hoặc `PARTIAL`.
* `Next Verified Action` được cập nhật.
* Commit message phản ánh đúng phần đã hoàn thành.

Ví dụ:

```text
feat(auth): add password hashing utility
```

Không dùng:

```text
wip
temp
half done
checkpoint
```

Nếu buộc phải tạo commit chưa hoàn thiện vì lý do đặc biệt, phải dùng:

```text
chore(wip): preserve authentication investigation state
```

và commit body phải mô tả rõ:

* Phần nào chưa hoàn thành.
* Vì sao cần commit.
* Repository hiện có chạy được hay không.
* Bước tiếp theo.

WIP commit không được merge vào branch chính nếu chưa được squash hoặc hoàn thiện.

---

## 13. Commit cuối task

Commit cuối của task phải:

* Cập nhật status thành `DONE`, `PARTIAL` hoặc `BLOCKED`.
* Hoàn thành `Final Summary`.
* Cập nhật Acceptance Criteria.
* Ghi validation cuối.
* Ghi remaining work và known limitations.
* Không khẳng định `DONE` nếu còn acceptance criterion chưa hoàn thành.

Commit cuối có thể bao gồm code và task file nếu chúng thuộc cùng thay đổi.

Không cần tạo commit tài liệu riêng chỉ để đổi task thành `DONE`, trừ khi code đã được commit trước đó.

---

## 14. Prohibited commit behavior

Agent không được:

* Tự động commit nếu người dùng chưa cho phép.
* Push lên remote nếu chưa được yêu cầu rõ ràng.
* Force push.
* Amend commit của người dùng.
* Rebase hoặc reset lịch sử mà chưa được yêu cầu.
* Dùng `git reset --hard`.
* Dùng `git clean -fd`.
* Bỏ qua pre-commit hook bằng `--no-verify`.
* Commit thay đổi chưa đọc.
* Commit secret rồi xóa ở commit sau.
* Gộp thay đổi của nhiều task vào một commit.
* Sửa author hoặc timestamp để làm sai lịch sử.
* Tuyên bố commit thành công nếu command thất bại.

---

## 15. Quy tắc commit của agent

Mặc định agent chỉ được:

1. Chuẩn bị thay đổi.
2. Cập nhật task file.
3. Chạy validation.
4. Đề xuất commit message.
5. Báo các file nên được stage.

Agent chỉ chạy `git commit` khi người dùng yêu cầu rõ ràng hoặc repository đã quy định quyền tự commit.

Trước khi chạy commit, agent phải báo:

```text
Proposed commit:
<commit message>

Files:
- <file>
- <file>

Validation:
- <command> -> <result>
```

Sau khi commit, agent phải báo:

* Commit hash ngắn.
* Commit message.
* Files committed.
* Validation result.
* Task status.
* Working tree còn thay đổi hay không.

---

## 16. Commit checklist

Trước mỗi commit:

* [ ] Task file hiện tại đã được xác định.
* [ ] Task file đã được cập nhật.
* [ ] `git status` đã được kiểm tra.
* [ ] Unstaged diff đã được đọc.
* [ ] Staged diff đã được đọc.
* [ ] Chỉ file thuộc phạm vi được stage.
* [ ] Commit chỉ chứa một thay đổi logic chính.
* [ ] Không có debug code hoặc file tạm.
* [ ] Không có secret hoặc credential.
* [ ] Validation phù hợp đã được chạy.
* [ ] Kết quả validation được ghi vào task file.
* [ ] Commit message tuân thủ format.
* [ ] Commit body chứa đường dẫn task.
* [ ] Breaking change được khai báo nếu có.
* [ ] Agent có quyền thực hiện commit.

---

## 17. Mẫu commit đầy đủ

```text
feat(<scope>): <imperative summary>

What:
- <change 1>
- <change 2>

Why:
- <reason>

Validation:
- <command> -> PASS
- <command> -> PASS

Task: documents/phases/<phase>/task<sequence>-<short-name>.md
```
