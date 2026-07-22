# Contract fixtures

Shared valid/invalid JSON fixtures for frontend tests, API contract tests, and future Spark parse smoke tests.

## Valid

| File | Matches |
|---|---|
| [valid/session_start.json](valid/session_start.json) | `session_start.schema.json` |
| [valid/mousemove.json](valid/mousemove.json) | `mousemove.schema.json` |
| [valid/click.json](valid/click.json) | `click.schema.json` |
| [valid/session_end.json](valid/session_end.json) | `session_end.schema.json` |
| [valid/telemetry_batch.json](valid/telemetry_batch.json) | `telemetry_batch.schema.json` |
| [valid/create_session_request.json](valid/create_session_request.json) | API `POST /api/v1/sessions` body |

## Invalid

| File | Expected rejection reason |
|---|---|
| [invalid/mousemove_normalized_out_of_range.json](invalid/mousemove_normalized_out_of_range.json) | `normalizedX > 1` |
| [invalid/click_missing_session_id.json](invalid/click_missing_session_id.json) | missing required `sessionId` |
| [invalid/batch_empty_events.json](invalid/batch_empty_events.json) | `events` minItems = 1 |
| [invalid/session_start_bad_duration.json](invalid/session_start_bad_duration.json) | `durationSeconds` not in `{30, 60}` |

## Validation helper

From repository root:

```powershell
uv run --project ingestion-api python contracts/fixtures/validate_fixtures.py
```

Uses only the Python standard library plus a minimal Draft-2020-12 subset checker for the local schemas.
