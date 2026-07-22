# Task: API contract fixtures

## 1. Thông tin task

* **Task ID:** `phase0-task004`
* **Task Name:** `API contract fixtures`
* **Phase:** `phase0`
* **Status:** `DONE`
* **Started At:** `2026-07-22 08:20`
* **Last Updated:** `2026-07-22 08:28`
* **Completed At:** `2026-07-22 08:28`
* **Branch:** `main`
* **Base Commit:** `1be82a3`
* **Task File:** `documents/phases/phase0/task004-api-contract-fixtures.md`

---

## 2. Yêu cầu gốc

> G0 Gate First Task B (T0.8): create shared valid/invalid fixtures under `contracts/fixtures/` consumable by frontend/API/Spark later; validate against T0.7 schemas.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Publish valid and invalid contract fixtures plus a stdlib validator so later phases can reuse one payload set.
```

### Tiêu chí nghiệm thu

* [x] Valid fixtures for each MVP event type and one batch
* [x] Invalid fixtures for key rejection cases
* [x] Validator confirms valid pass and invalid fail
* [x] TRACKING T0.8 updated

### Ngoài scope

* Wiring fixtures into frontend/API automated CI suites beyond the helper script
* Spark parse runtime

---

## 4. Work Log

| Time | Status | Action | Result |
|---|---|---|---|
| `08:20` | `IN_PROGRESS` | Added valid/invalid fixtures | Files created |
| `08:25` | `IN_PROGRESS` | Added `validate_fixtures.py` | Script ready |
| `08:28` | `DONE` | Ran validator via uv Python | All 9 cases PASS |

---

## 5. Changes

### Added

* `contracts/fixtures/valid/*`
* `contracts/fixtures/invalid/*`
* `contracts/fixtures/README.md`
* `contracts/fixtures/validate_fixtures.py`

### Modified

* `documents/TRACKING.md`

---

## 6. Validation

| Command | Result |
|---|---|
| `uv run --project ingestion-api python contracts/fixtures/validate_fixtures.py` | `PASS` (9/9) |
| `uv run --project ingestion-api ruff check contracts/fixtures/validate_fixtures.py` | `PASS` |

---

## 7. Final Summary

* **Final Status:** `DONE`
* **Next Verified Action:** T0.9 local env examples (`task005`)
