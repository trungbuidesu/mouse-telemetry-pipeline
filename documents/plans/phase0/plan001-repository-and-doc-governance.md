# Plan: Repository and Documentation Governance

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase0-plan001` |
| Phase | [phase0](../../phases/phase0/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md), [Agent Development Protocol](../../agents/AGENTS.md) |

---

## 2. Objective

Thiết lập cấu trúc repository và cấu trúc tài liệu để các phase sau triển khai nhất quán, truy vết được decision và không tạo task trùng responsibility.

---

## 3. Dependencies

| Dependency | Type | Required before implementation |
|---|---|---|
| [documents/aim_trainer_app_architecture.md](../../aim_trainer_app_architecture.md) | Architecture source | Yes |
| [documents/agents/AGENTS.md](../../agents/AGENTS.md) | Process rule | Yes |
| [documents/agents/commit_rules.md](../../agents/commit_rules.md) | Commit rule | Before commit |

---

## 4. Planned Outputs

- Monorepo folder skeleton aligned with architecture:
  - `frontend/`
  - `ingestion-api/`
  - `stream-processing/`
  - `infrastructure/`
  - `schemas/`
  - `dashboards/`
  - `scripts/`
  - `documents/`
- `.env.example` strategy for services.
- Documentation indexes for phases, plans and decisions.
- Rule that runtime data, checkpoints and secrets stay out of Git.
- First task files for implementation work when code begins.
- Clean Vite React shadcn frontend stack decision.
- uv-managed Python API environment decision.

---

## 5. Work Breakdown

### Step 1: Verify current repository state

- Inspect `README.md`, `LICENSE`, `documents/` and Git status.
- Record existing untracked documentation before creating code structure.
- Confirm whether the repository is still documentation-only.

### Step 2: Create skeleton directories

- Create only stable top-level directories required by the architecture.
- Do not add placeholder source code until a task needs it.
- Add `.gitkeep` only if an empty directory must be preserved by Git.

### Step 3: Normalize documentation links

- Ensure phase docs point to relevant plans.
- Ensure plans point to relevant decisions.
- Ensure decisions point back to phases/plans that depend on them.

### Step 4: Define repository hygiene

- Add `.gitignore` entries for:
  - `node_modules/`
  - Python virtual environments.
  - Docker volumes or local data directories.
  - Spark checkpoints.
  - MinIO, Kafka and InfluxDB runtime data.
  - `.env`.
- Keep `.env.example` committed.

### Step 5: Lock frontend and API foundation stacks

- Initialize frontend from clean Vite React TypeScript scaffold.
- Add shadcn/ui and Tailwind CSS only for UI shell/HUD/control surfaces.
- Pin API Python through uv-managed `.python-version`.
- Keep frontend/API lockfiles committed for reproducible foundation setup.

---

## 6. Architecture Notes

The architecture document proposes a monorepo because the demo value depends on full-pipeline integration. Splitting components into separate repositories would make local demo setup and contract updates heavier than needed for the project scope.

The documentation structure must make architecture decisions explicit. Performance decisions such as batching, sampling and storage split affect several components, so they should not live only inside implementation notes.

---

## 7. Acceptance Criteria

- [ ] Top-level repository skeleton matches the architecture.
- [ ] `documents/phases/`, `documents/plans/` and `documents/decisions/` all have indexes.
- [ ] Every plan belongs to exactly one phase.
- [ ] Every architecture decision referenced by a plan has a decision record.
- [ ] `.gitignore` prevents runtime data and secrets from entering Git.
- [ ] No generated runtime data is committed.

---

## 8. Validation

| Check | Expected result |
|---|---|
| `rg --files documents` | Shows phase, plan and decision docs |
| `git status --short` | Only intended documentation/skeleton files changed |
| Manual link review | Relative links resolve from current file locations |

---

## 9. Handoff

This plan unlocks [phase0-plan002](plan002-contract-first-schema-and-api.md), [phase1](../../phases/phase1/README.md), [phase2](../../phases/phase2/README.md) and [phase3](../../phases/phase3/README.md) by giving them shared repository and documentation conventions.
