# Shared telemetry contracts

Source of truth for MVP event and batch payloads used by frontend, ingestion API, and Spark.

## Event types

| `eventType` | Schema file | Notes |
|---|---|---|
| `session_start` | [session_start.schema.json](session_start.schema.json) | Session metadata and canvas/viewport context |
| `mousemove` | [mousemove.schema.json](mousemove.schema.json) | Canvas-relative pointer samples |
| `click` | [click.schema.json](click.schema.json) | Hit/miss click with optional target fields |
| `session_end` | [session_end.schema.json](session_end.schema.json) | Client score summary |

Batch envelope: [telemetry_batch.schema.json](telemetry_batch.schema.json)

HTTP API expectations: [api-contract.md](api-contract.md)

Shared field definitions: [defs.schema.json](defs.schema.json)

## Invariants

* `eventId` is unique per event.
* `sessionId` groups all events for one game session.
* `sequence` is monotonic non-decreasing within a session (prefer strictly increasing by 1).
* `batchSequence` is monotonic within a session sender.
* `eventTime` is client event time in epoch milliseconds (not server ingestion time).
* `x` / `y` are canvas-relative pixels.
* `normalizedX` / `normalizedY` are optional and must be in `[0, 1]` when present.
* `click`, `session_start`, and `session_end` must never be dropped by mousemove sampling (DEC-002).

## Batch defaults (DEC-002)

* Flush at `100` events or every `250 ms` while running.
* Sample `mousemove` at most once per `16 ms`.
* Max batch payload size for API rejection: `1 MiB` (documented for `413`).

## Compatibility

Renaming or removing a required field requires updating DEC-001 (or a replacement decision) and bumping contract consumers together.
