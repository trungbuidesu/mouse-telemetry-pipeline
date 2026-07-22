# Task: Shared telemetry schema contracts

## 1. Thông tin task

* **Task ID:** `phase0-task003`
* **Task Name:** `Shared telemetry schema contracts`
* **Phase:** `phase0`
* **Status:** `DONE`
* **Started At:** `2026-07-22 08:08`
* **Last Updated:** `2026-07-22 08:20`
* **Completed At:** `2026-07-22 08:20`
* **Branch:** `main`
* **Base Commit:** `1be82a3`
* **Task File:** `documents/phases/phase0/task003-shared-telemetry-schema-contracts.md`

---

## 2. Yêu cầu gốc

> Implement G0 Gate First plan Task A (T0.7): create shared telemetry schema contract files under `contracts/telemetry/`, document invariants and API status-code expectations, update TRACKING. Prefer Done G0 before phase1 gameplay. No parallel-start of phase1.

---

## 3. Mục tiêu

### Mục tiêu chính

```text
Publish shared JSON Schema contracts for MVP telemetry events and batch envelope so frontend, API, and Spark share one semantics source before implementation tasks proceed.
```

### Motivation

```text
G0 requires shared schema contract files. Without them, phase1/2/3 risk schema drift (R-03).
```

### Tiêu chí nghiệm thu

* [x] `session_start`, `mousemove`, `click`, `session_end`, and batch schemas exist
* [x] Invariants and API status codes documented
* [x] Schemas align with DEC-001 and architecture §11
* [x] Không có thay đổi ngoài phạm vi
* [x] Validation recorded

### Ngoài scope

* FastAPI endpoint implementation
* Frontend gameplay / telemetry sender
* Fixture JSON samples (T0.8)
* Docker Compose runtime foundation (P3/T3.0)

---

## 4. Bối cảnh phase

### Task đã có trong phase

| Task | Status | Relationship |
|---|---|---|
| `task001-doc-governance-test-config.md` | `DONE` | `RELATED` |
| `task002-clean-vite-uv-stack-foundation.md` | `DONE` | `DEPENDENCY` |

### Decisions inherited

* DEC-001 canvas-relative coordinates and required event fields
* DEC-002 batch size 100 / flush 250 ms / mousemove sample 16 ms
* DEC-004 HTTP ingestion before Kafka
* DEC-005 topic/key assumptions for downstream

### Kiểm tra trùng lặp

* **Equivalent task already exists:** `NO`
* **Quyết định:** `CREATE NEW`

---

## 5. Trạng thái project ban đầu

* **Current branch:** `main`
* **Current commit:** `1be82a3`
* **Working tree:** `DIRTY` (TRACKING/phase0 README edits from prior doc work)

---

## 6. Related files

| File | Action |
|---|---|
| `contracts/telemetry/*.schema.json` | `CREATE` |
| `contracts/telemetry/README.md` | `CREATE` |
| `contracts/telemetry/api-contract.md` | `CREATE` |
| `documents/TRACKING.md` | `MODIFY` |
| `documents/plans/phase0/plan002-contract-first-schema-and-api.md` | `MODIFY` |

---

## 7. Implementation plan

* [x] Create JSON Schema files for four event types + batch
* [x] Document invariants and API contract expectations
* [x] Manual review against architecture examples
* [x] Update TRACKING T0.7

---

## 8. Work Log

| Time | Status | Action | Result |
|---|---|---|---|
| `08:08` | `IN_PROGRESS` | Read DEC-001/002/plan002/architecture §11 | Field set confirmed |
| `08:15` | `IN_PROGRESS` | Added `contracts/telemetry/` schemas + docs | Files created |
| `08:20` | `DONE` | Manual schema review + TRACKING update | T0.7 complete |

---

## 9. Changes

### Added

* `contracts/telemetry/defs.schema.json`
* `contracts/telemetry/session_start.schema.json`
* `contracts/telemetry/mousemove.schema.json`
* `contracts/telemetry/click.schema.json`
* `contracts/telemetry/session_end.schema.json`
* `contracts/telemetry/telemetry_batch.schema.json`
* `contracts/telemetry/README.md`
* `contracts/telemetry/api-contract.md`

### Modified

* `documents/TRACKING.md`
* `documents/plans/phase0/plan002-contract-first-schema-and-api.md`

---

## 10. Symbol Delta

* No runtime code symbols. Contract artifacts only.

---

## 11. Validation

| Check | Result | Notes |
|---|---|---|
| Manual compare architecture §11.2–11.5 examples to schemas | `PASS` | Required fields match; `normalizedX/Y` optional per DEC-001 |
| Batch required fields vs architecture §13.3 | `PASS` | `sessionId`, `sentAt`, `batchSequence`, `events` |
| API status codes vs plan002 | `PASS` | `202`/`400`/`413`/`429`/`503` documented |
| Path listing `contracts/telemetry` | `PASS` | 8 files |

---

## 12. Final Summary

* **Final Status:** `DONE`
* **Next Verified Action:** T0.8 API contract fixtures (`task004`)
* **Known limitations:** Schemas are JSON Schema files only; runtime Pydantic/TS models come in later phases. Batch `maxItems` set to 100 to match DEC-002 flush size.
