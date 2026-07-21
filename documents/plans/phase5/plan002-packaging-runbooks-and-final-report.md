# Plan: Packaging, Runbooks and Final Report

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase5-plan002` |
| Phase | [phase5](../../phases/phase5/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Prepare the project for delivery: a repeatable local runbook, troubleshooting guide, final architecture narrative and demo evidence checklist.

---

## 3. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| [phase5-plan001](plan001-performance-validation-and-observability.md) | Validation | Provides measured results |
| [phase4-plan002](../phase4/plan002-demo-scenarios-and-load-generation.md) | Demo | Provides scenario flow |
| [DEC-010](../../decisions/decision010-local-first-docker-compose-stack.md) | Packaging | Local-first delivery |

---

## 4. Planned Outputs

- Root `README.md` expanded with:
  - Project overview.
  - Architecture diagram.
  - Local setup.
  - Run commands.
  - Demo flow.
- `documents/runbooks/local-demo.md`.
- `documents/runbooks/troubleshooting.md`.
- `documents/report/final-report-outline.md`.
- Validation summary with known limitations.

---

## 5. Work Breakdown

### Step 1: Write local runbook

- Prerequisites.
- Environment variables.
- Docker Compose startup.
- Frontend startup.
- API startup if separate.
- Spark job startup.
- Dashboard URL.

### Step 2: Write troubleshooting guide

- Kafka not reachable.
- API returns `503`.
- Spark cannot parse events.
- MinIO bucket missing.
- InfluxDB query empty.
- Frontend shows offline.

### Step 3: Write demo checklist

- Start services.
- Run one manual session.
- Show API/Kafka/Spark evidence.
- Show dashboard metrics.
- Run synthetic load.
- Explain raw vs aggregate storage.

### Step 4: Prepare final report outline

- Problem statement.
- Architecture.
- Data model.
- Ingestion strategy.
- Stream processing.
- Storage strategy.
- Dashboard.
- Performance discussion.
- Limitations and future work.

---

## 6. Delivery Notes

- Do not include secrets or runtime data in final package.
- Keep commands copy/paste friendly.
- Include exact paths for generated dashboard JSON and scripts.
- Link back to decisions so architecture design is defensible.

---

## 7. Acceptance Criteria

- [ ] A new developer can run the local demo from documentation.
- [ ] Troubleshooting guide covers the most likely local failures.
- [ ] Final report outline references architecture and decisions.
- [ ] Demo evidence checklist is concrete and ordered.
- [ ] Git status does not include runtime data or secrets.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Follow runbook from clean environment | Demo starts |
| Link review | Docs link to phase/plan/decision records |
| Git status review | No runtime data or secret files |

---

## 9. Handoff

This is the final delivery plan. Remaining work after this plan should be explicit follow-up tasks, not hidden TODOs.

