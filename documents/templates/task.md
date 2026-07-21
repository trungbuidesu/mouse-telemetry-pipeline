# Task: `<Task Name>`

## 1. Task Metadata

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

## 2. Original Request

Copy nguyên văn yêu cầu của người dùng.

> `<Original user request>`

---

## 3. Objective

### Primary Objective

```text
<Hành vi hoặc kết quả phải đạt được sau khi task hoàn thành>
```

### Motivation

```text
<Vì sao task này cần thiết và vấn đề nào đang được giải quyết>
```

### Acceptance Criteria

* [ ] `<Điều kiện kiểm tra được 1>`
* [ ] `<Điều kiện kiểm tra được 2>`
* [ ] `<Điều kiện kiểm tra được 3>`
* [ ] Không có thay đổi ngoài phạm vi.
* [ ] Các validation liên quan pass hoặc lỗi còn lại được giải thích.

### Out of Scope

* `<Không thực hiện trong task này>`
* `<Không refactor phần này>`
* `<Feature liên quan nhưng để task sau>`

---

## 4. Phase Context

### Existing Tasks in Phase

| Task          | Status     | Relationship                            |
| ------------- | ---------- | --------------------------------------- |
| `<task file>` | `<status>` | `DEPENDENCY / RELATED / OVERLAP / NONE` |

### Previous Relevant Task

* **Task:** `<task file hoặc None>`
* **Outcome:** `<kết quả quan trọng>`
* **Decisions inherited:**

  * `<Quyết định phải giữ nguyên>`
  * `<Constraint từ task trước>`

### Task Dependencies

* `<Task này phụ thuộc task nào>`
* `<Điều kiện nào phải tồn tại trước khi thực hiện>`

### Overlap Check

* **Equivalent task already exists:** `YES | NO`
* **Overlapping task:** `<task file hoặc None>`
* **Decision:** `CONTINUE EXISTING | CREATE NEW`
* **Reason:**

```text
<Giải thích tại sao tiếp tục task cũ hoặc tạo task mới>
```

---

## 5. Initial Project State

Phần này phải hoàn thành trước khi lập implementation plan.

### Git State

* **Current branch:** `<branch>`
* **Current commit:** `<hash>`
* **Working tree:** `CLEAN | DIRTY`

### Existing Modified Files

* `<path hoặc None>`

### Existing Untracked Files

* `<path hoặc None>`

### Existing Diff Summary

```text
<Tóm tắt những thay đổi đã tồn tại trước task>
```

### Project Stack

* **Language/runtime:** `<runtime>`
* **Framework:** `<framework>`
* **Package manager:** `<package manager>`
* **Build command:** `<command hoặc unknown>`
* **Test command:** `<command hoặc unknown>`
* **Lint command:** `<command hoặc unknown>`
* **Type-check command:** `<command hoặc unknown>`

### Baseline Validation

| Command     | Result                  | Notes     |
| ----------- | ----------------------- | --------- |
| `<command>` | `PASS / FAIL / NOT RUN` | `<notes>` |

### Architecture Observed

* **Relevant module:** `<module>`
* **Current responsibility owner:** `<file/class/module>`
* **Entry point:** `<entry point>`

### Current Data Flow

```text
<Input> → <Component> → <Component> → <Output>
```

### Existing Risks

* `<Existing failing tests>`
* `<Uncommitted work>`
* `<Legacy or unclear behavior>`

---

## 6. Related Files

| File     | Current Responsibility | Why Relevant | Planned Action                    |
| -------- | ---------------------- | ------------ | --------------------------------- |
| `<path>` | `<responsibility>`     | `<reason>`   | `READ / MODIFY / CREATE / DELETE` |

---

## 7. Existing-Code Search

### Searches Performed

| Search Term or Responsibility | Results                 |
| ----------------------------- | ----------------------- |
| `<exact name>`                | `<locations hoặc none>` |
| `<equivalent behavior>`       | `<locations hoặc none>` |
| `<related concept>`           | `<locations hoặc none>` |

### Relevant Existing Implementations

* `<symbol>`
  Location: `<file>`
  Responsibility: `<responsibility>`

### Implementation Decision

* **Decision:** `REUSE | EXTEND | CREATE`
* **Target:** `<symbol/file>`
* **Reason:**

```text
<Vì sao đây là thay đổi nhỏ và phù hợp nhất>
```

### Creation Justification

Chỉ điền nếu chọn `CREATE`.

* **REUSE không phù hợp vì:** `<reason>`
* **EXTEND không phù hợp vì:** `<reason>`
* **Responsibility mới là:** `<responsibility>`
* **Expected consumers:** `<consumers>`
* **Public or internal:** `<public/internal>`

---

## 8. Implementation Plan

Mỗi bước phải nhỏ và kiểm tra được riêng.

* [ ] **Step 1:** `<small action>`

  * Files: `<paths>`
  * Expected result: `<result>`
  * Validation: `<command/check>`

* [ ] **Step 2:** `<small action>`

  * Files: `<paths>`
  * Expected result: `<result>`
  * Validation: `<command/check>`

* [ ] **Step 3:** `<small action>`

  * Files: `<paths>`
  * Expected result: `<result>`
  * Validation: `<command/check>`

---

## 9. Work Log

### `[YYYY-MM-DD HH:mm]` — Task initialized

* **Status:** `DISCOVERY`

* **Action:**

  * Copied task template.
  * Copied original request.
  * Inspected phase tasks.
  * Inspected project and Git state.

* **Files inspected:**

  * `<path>`

* **Result:**

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

* **Result:**

  * `<actual result>`

* **Validation:**

  * `<command>` → `PASS / FAIL / NOT RUN`

* **Decision or discovery:**

  * `<decision hoặc discovery>`

* **Next verified action:**

  * `<next action>`

---

## 10. Changes

Phần này phải phản ánh diff thực tế, không phản ánh kế hoạch.

### Added Files

#### `<path>`

* **Purpose:** `<responsibility>`
* **Why required:** `<reason>`
* **Used by:** `<consumers>`
* **Visibility:** `PUBLIC | INTERNAL`

### Modified Files

#### `<path>`

* **Previous responsibility:** `<responsibility>`
* **Changes made:** `<changes>`
* **Reason:** `<reason>`
* **Behavioral impact:** `<impact>`
* **Compatibility impact:** `<none hoặc description>`

### Deleted Files

#### `<path>`

* **Reason:** `<reason>`
* **Replacement:** `<replacement hoặc None>`

---

## 11. Symbol Delta

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

* **Reason:** `<reason>`
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

### Focused Validation

| Command     | Result                  | Evidence or Notes |
| ----------- | ----------------------- | ----------------- |
| `<command>` | `PASS / FAIL / NOT RUN` | `<notes>`         |

### Final Validation

| Check             | Result                  | Notes     |
| ----------------- | ----------------------- | --------- |
| Unit tests        | `PASS / FAIL / NOT RUN` | `<notes>` |
| Integration tests | `PASS / FAIL / NOT RUN` | `<notes>` |
| Lint              | `PASS / FAIL / NOT RUN` | `<notes>` |
| Type-check        | `PASS / FAIL / NOT RUN` | `<notes>` |
| Build             | `PASS / FAIL / NOT RUN` | `<notes>` |

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

### Validation Not Performed

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

## 15. Final Summary

Chỉ điền khi kết thúc task.

* **Final Status:** `DONE | PARTIAL | BLOCKED`
* **Completed At:** `YYYY-MM-DD HH:mm`

### Outcome

```text
<Hành vi thực tế đã hoàn thành>
```

### Acceptance Criteria Result

* [ ] `<criterion 1>`
* [ ] `<criterion 2>`
* [ ] `<criterion 3>`

### Files Changed

* `<path>` — `<main change>`

### Main Behavioral Changes

* `<behavior change>`

### Validation Result

* **Tests:** `PASS / FAIL / PARTIAL / NOT RUN`
* **Lint:** `PASS / FAIL / NOT RUN`
* **Type-check:** `PASS / FAIL / NOT RUN`
* **Build:** `PASS / FAIL / NOT RUN`

### Remaining Work

* `<None hoặc remaining work>`

### Known Limitations

* `<None hoặc limitation>`

### Follow-up Tasks

* `<Proposed task name hoặc None>`

### Suggested Commit Message

```text
<type(scope): concise description>
```
