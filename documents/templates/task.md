# Template task: `<Task Name>`

## 1. Thông tin task

* **Task ID:** `<phase>-task<sequence>`
* **Task Name:** `<Tên mô tả đúng hành vi>`
* **Phase:** `<phase0 | phase1 | ...>`
* **Status:** `DISCOVERY | PLANNED | IN_PROGRESS | BLOCKED | PARTIAL | DONE`
* **Started At:** `YYYY-MM-DD HH:mm`
* **Last Updated:** `YYYY-MM-DD HH:mm`
* **Completed At:** `<YYYY-MM-DD HH:mm hoặc N/A>`
* **Branch:** `<branch>`
* **Base Commit:** `<commit hash>`
* **Task File:** `<documents/phases/...>`

---

## 2. Yêu cầu gốc

Copy nguyên văn yêu cầu của người dùng.

> `<Original user request>`

---

## 3. Mục tiêu

### Mục tiêu chính

```text
<Hành vi hoặc kết quả phải đạt được sau khi task hoàn thành>
```

### Motivation

```text
<Vì sao task này cần thiết và vấn đề nào đang được giải quyết>
```

### Tiêu chí nghiệm thu

* [ ] `<Điều kiện kiểm tra được 1>`
* [ ] `<Điều kiện kiểm tra được 2>`
* [ ] `<Điều kiện kiểm tra được 3>`
* [ ] Không có thay đổi ngoài phạm vi.
* [ ] Các validation liên quan pass hoặc lỗi còn lại được giải thích.

### Ngoài scope

* `<Không thực hiện trong task này>`
* `<Không refactor phần này>`
* `<Feature liên quan nhưng để task sau>`

---

## 4. Bối cảnh phase

### Task đã có trong phase

| Task          | Status     | Relationship                            |
| ------------- | ---------- | --------------------------------------- |
| `<task file>` | `<status>` | `DEPENDENCY / RELATED / OVERLAP / NONE` |

### Task liên quan trước đó

* **Task:** `<task file hoặc None>`
* **Outcome:** `<kết quả quan trọng>`
* **Decisions inherited:**

  * `<Quyết định phải giữ nguyên>`
  * `<Constraint từ task trước>`

### Phụ thuộc của task

* `<Task này phụ thuộc task nào>`
* `<Điều kiện nào phải tồn tại trước khi thực hiện>`

### Kiểm tra trùng lặp

* **Equivalent task already exists:** `YES | NO`
* **Overlapping task:** `<task file hoặc None>`
* **Quyết định:** `CONTINUE EXISTING | CREATE NEW`
* **Lý do:**

```text
<Giải thích tại sao tiếp tục task cũ hoặc tạo task mới>
```

---

## 5. Trạng thái project ban đầu

Phần này phải hoàn thành trước khi lập implementation plan.

### Trạng thái Git

* **Current branch:** `<branch>`
* **Current commit:** `<hash>`
* **Working tree:** `CLEAN | DIRTY`

### File đã sửa từ trước

* `<path hoặc None>`

### File chưa track từ trước

* `<path hoặc None>`

### Tóm tắt diff đã có

```text
<Tóm tắt những thay đổi đã tồn tại trước task>
```

### Stack project

* **Language/runtime:** `<runtime>`
* **Framework:** `<framework>`
* **Package manager:** `<package manager>`
* **Build command:** `<command hoặc unknown>`
* **Test command:** `<command hoặc unknown>`
* **Lint command:** `<command hoặc unknown>`
* **Type-check command:** `<command hoặc unknown>`

### Validation baseline

| Command     | Kết quả                 | Ghi chú   |
| ----------- | ----------------------- | --------- |
| `<command>` | `PASS / FAIL / NOT RUN` | `<notes>` |

### Kiến trúc quan sát được

* **Relevant module:** `<module>`
* **Current responsibility owner:** `<file/class/module>`
* **Entry point:** `<entry point>`

### Data flow hiện tại

```text
<Input> → <Component> → <Component> → <Output>
```

### Rủi ro hiện có

* `<Existing failing tests>`
* `<Uncommitted work>`
* `<Legacy or unclear behavior>`

---

## 6. Related Files

| File     | Current Responsibility | Why Relevant | Planned Action                    |
| -------- | ---------------------- | ------------ | --------------------------------- |
| `<path>` | `<responsibility>`     | `<reason>`   | `READ / MODIFY / CREATE / DELETE` |

---

## 7. Tìm kiếm code hiện có

### Searches Performed

| Search Term or Responsibility | Results                 |
| ----------------------------- | ----------------------- |
| `<exact name>`                | `<locations hoặc none>` |
| `<equivalent behavior>`       | `<locations hoặc none>` |
| `<related concept>`           | `<locations hoặc none>` |

### Implementation hiện có liên quan

* `<symbol>`
  Location: `<file>`
  Responsibility: `<responsibility>`

### Quyết định triển khai

* **Quyết định:** `REUSE | EXTEND | CREATE`
* **Target:** `<symbol/file>`
* **Lý do:**

```text
<Vì sao đây là thay đổi nhỏ và phù hợp nhất>
```

### Creation Justification

Chỉ điền nếu chọn `CREATE`.

* **REUSE không phù hợp vì:** `<reason>`
* **EXTEND không phù hợp vì:** `<reason>`
* **Responsibility mới là:** `<responsibility>`
* **Người dùng dự kiến:** `<consumers>`
* **Public or internal:** `<public/internal>`

---

## 8. Kế hoạch triển khai

Mỗi bước phải nhỏ và kiểm tra được riêng.

* [ ] **Step 1:** `<small action>`

  * Files: `<paths>`
  * Kết quả kỳ vọng: `<result>`
  * Validation: `<command/check>`

* [ ] **Step 2:** `<small action>`

  * Files: `<paths>`
  * Kết quả kỳ vọng: `<result>`
  * Validation: `<command/check>`

* [ ] **Step 3:** `<small action>`

  * Files: `<paths>`
  * Kết quả kỳ vọng: `<result>`
  * Validation: `<command/check>`

---

## 9. Work Log

### `[YYYY-MM-DD HH:mm]` — Khởi tạo task

* **Status:** `DISCOVERY`

* **Action:**

  * Copied task template.
  * Copied original request.
  * Inspected phase tasks.
  * Inspected project and Git state.

* **Files inspected:**

  * `<path>`

* **Kết quả:**

  * `<result>`

* **Next verified action:**

  * `<next action>`

---

### `[YYYY-MM-DD HH:mm]` — `<Step name>`

* **Status:** `<status>`

* **Action:**

  * `<what was done>`

* **Files inspected:**

  * `<path>`

* **Files changed:**

  * `<path hoặc None>`

* **Symbols changed:**

  * `<symbol hoặc None>`

* **Kết quả:**

  * `<actual result>`

* **Validation:**

  * `<command>` → `PASS / FAIL / NOT RUN`

* **Quyết định hoặc phát hiện:**

  * `<decision hoặc discovery>`

* **Next verified action:**

  * `<next action>`

---

## 10. Thay đổi

Phần này phải phản ánh diff thực tế, không phản ánh kế hoạch.

### Added Files

#### `<path>`

* **Mục đích:** `<responsibility>`
* **Why required:** `<reason>`
* **Used by:** `<consumers>`
* **Visibility:** `PUBLIC | INTERNAL`

### Modified Files

#### `<path>`

* **Previous responsibility:** `<responsibility>`
* **Changes made:** `<changes>`
* **Lý do:** `<reason>`
* **Behavioral impact:** `<impact>`
* **Compatibility impact:** `<none hoặc description>`

### Deleted Files

#### `<path>`

* **Lý do:** `<reason>`
* **Replacement:** `<replacement hoặc None>`

---

## 11. Thay đổi symbol

### Added Symbols

#### `<symbol>`

* **Location:** `<file:line>`
* **Type:** `CLASS | FUNCTION | METHOD | VARIABLE | CONSTANT | TYPE`
* **Responsibility:** `<responsibility>`
* **Inputs:** `<inputs>`
* **Outputs:** `<outputs>`
* **State mutation:** `<none hoặc description>`
* **Lifetime:** `<lifetime>`
* **Used by:** `<consumers>`
* **Visibility:** `PUBLIC | INTERNAL`

### Modified Symbols

#### `<symbol>`

* **Location:** `<file:line>`
* **Previous behavior:** `<behavior>`
* **New behavior:** `<behavior>`
* **Signature changed:** `YES | NO`
* **Callers affected:** `<callers hoặc None>`

### Removed Symbols

#### `<symbol>`

* **Lý do:** `<reason>`
* **Replacement:** `<replacement hoặc None>`

### Important Variables Added

#### `<variable>`

* **Meaning:** `<domain meaning>`
* **Created in:** `<scope>`
* **Read by:** `<consumer>`
* **Mutated by:** `<location hoặc None>`
* **Possible states:** `<states>`
* **Lifetime:** `<lifetime>`

---

## 12. Validation

### Validation tập trung

| Command     | Kết quả                 | Bằng chứng hoặc ghi chú |
| ----------- | ----------------------- | ----------------- |
| `<command>` | `PASS / FAIL / NOT RUN` | `<notes>`         |

### Validation cuối

| Check             | Kết quả                 | Ghi chú   |
| ----------------- | ----------------------- | --------- |
| Unit tests        | `PASS / FAIL / NOT RUN` | `<notes>` |
| Integration tests | `PASS / FAIL / NOT RUN` | `<notes>` |
| Lint              | `PASS / FAIL / NOT RUN` | `<notes>` |
| Type-check        | `PASS / FAIL / NOT RUN` | `<notes>` |
| Build             | `PASS / FAIL / NOT RUN` | `<ghi chú>` |

### Diff Review

* [ ] Chỉ các file thuộc phạm vi bị thay đổi.
* [ ] Không có debug code.
* [ ] Không có placeholder ngoài chủ đích.
* [ ] Không có implementation trùng rõ ràng.
* [ ] Không có abstraction không cần thiết.
* [ ] Không có circular import mới.
* [ ] Không có internal barrel import mới.
* [ ] Public API changes đã được ghi lại.
* [ ] Error paths đã được xem xét.

### Validation chưa thực hiện

```text
<Các kiểm tra chưa chạy và lý do>
```

---

## 13. Discovered Issues

Chỉ ghi nhận, không tự ý sửa nếu ngoài phạm vi.

### `<Issue title>`

* **Location:** `<path>`
* **Description:** `<description>`
* **Impact:** `<impact>`
* **Action in this task:** `NONE`
* **Suggested future task:** `<task name hoặc None>`

---

## 14. Resume Check

Điền khi tiếp tục sau context compact hoặc phiên mới.

* **Resumed At:** `YYYY-MM-DD HH:mm`
* **Current branch:** `<branch>`
* **Current commit:** `<commit>`
* **Task status before resume:** `<status>`
* **Working tree matches task log:** `YES | NO`
* **Plan remains valid:** `YES | NO`

### Differences Found

```text
<Khác biệt giữa task log và repository>
```

### Files Rechecked

* `<path>`

### Next Verified Action

```text
<Hành động nhỏ tiếp theo đã được xác minh>
```

---

## 15. Tổng kết cuối

Chỉ điền khi kết thúc task.

* **Final Status:** `DONE | PARTIAL | BLOCKED`
* **Completed At:** `YYYY-MM-DD HH:mm`

### Outcome

```text
<Hành vi thực tế đã hoàn thành>
```

### Kết quả tiêu chí nghiệm thu

* [ ] `<criterion 1>`
* [ ] `<criterion 2>`
* [ ] `<criterion 3>`

### File đã thay đổi

* `<path>` — `<main change>`

### Thay đổi hành vi chính

* `<behavior change>`

### Kết quả validation

* **Tests:** `PASS / FAIL / PARTIAL / NOT RUN`
* **Lint:** `PASS / FAIL / NOT RUN`
* **Type-check:** `PASS / FAIL / NOT RUN`
* **Build:** `PASS / FAIL / NOT RUN`

### Việc còn lại

* `<None hoặc remaining work>`

### Giới hạn đã biết

* `<None hoặc limitation>`

### Task tiếp theo

* `<Proposed task name hoặc None>`

### Commit message gợi ý

```text
<type(scope): concise description>
```
