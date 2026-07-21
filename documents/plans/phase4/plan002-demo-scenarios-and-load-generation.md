# Plan: Demo Scenarios and Load Generation

## 1. Metadata

| Field | Value |
|---|---|
| Plan ID | `phase4-plan002` |
| Phase | [phase4](../../phases/phase4/README.md) |
| Status | `PLANNED` |
| Last Updated | `2026-07-22` |
| Source | [Aim Trainer App Architecture](../../aim_trainer_app_architecture.md) |

---

## 2. Objective

Create repeatable demo scenarios and a separate load generator so the pipeline can be shown under controlled load without compromising the real player app's telemetry model.

---

## 3. Related Decisions

| Decision | Why needed |
|---|---|
| [DEC-002](../../decisions/decision002-client-side-batching-and-sampling.md) | Player app has bounded event rate |
| [DEC-008](../../decisions/decision008-load-generator-separated-from-player-app.md) | Synthetic load must be separate |
| [DEC-010](../../decisions/decision010-local-first-docker-compose-stack.md) | Demo must run locally |

---

## 4. Planned Outputs

- `scripts/load-generator/` or equivalent.
- Scenario docs for:
  - Single player session.
  - Backend temporarily unavailable.
  - Multiple synthetic sessions.
  - Spark/Grafana processing evidence.
- Expected evidence checklist for presenters.

---

## 5. Work Breakdown

### Step 1: Define demo script

- List startup commands.
- List browser actions.
- List dashboard panels to watch.
- List expected Kafka/Spark/storage evidence.

### Step 2: Build load generator

- Generate realistic session lifecycle events.
- Generate mousemove at controlled sample rate.
- Generate click events with hit/miss distribution.
- Send HTTP batches through the same ingestion API.

### Step 3: Add scenario controls

- Configure session count.
- Configure duration.
- Configure events per second.
- Configure batch size.
- Configure failure simulation if useful.

### Step 4: Document limits

- State that load generator is not a bot detector.
- State that generated data is synthetic.
- State safe local defaults to avoid exhausting the laptop.

---

## 6. Performance Notes

- Load generator must respect configured maximum concurrency.
- It should send batches, not per-event requests.
- It should expose summary counts so demo can compare sent vs accepted.
- It should not share code paths that make the player app heavier.

---

## 7. Acceptance Criteria

- [ ] Demo script can be followed from clean local setup.
- [ ] Load generator creates valid sessions and telemetry batches.
- [ ] Synthetic load changes dashboard throughput.
- [ ] Generated session data can be distinguished from manual player data if needed.
- [ ] Defaults are safe for local development.

---

## 8. Validation

| Check | Expected result |
|---|---|
| Single synthetic session | Accepted by API and appears downstream |
| Multiple synthetic sessions | Throughput increases without request storm |
| Manual demo run | Presenter can show full pipeline evidence |

---

## 9. Handoff

This plan feeds performance validation and final demo documentation in [phase5](../../phases/phase5/README.md).

