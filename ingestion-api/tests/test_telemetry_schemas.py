from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path
from typing import Any

import pytest
from pydantic import TypeAdapter, ValidationError

from app.schemas.telemetry import (
    MAX_EVENTS_PER_BATCH,
    ClickEvent,
    MouseMoveEvent,
    SessionEndEvent,
    SessionStartEvent,
    TelemetryBatch,
    TelemetryEvent,
)

FIXTURES_DIR = Path(__file__).resolve().parents[2] / "contracts" / "fixtures"
EVENT_ADAPTER: TypeAdapter[TelemetryEvent] = TypeAdapter(TelemetryEvent)


def load_fixture(*parts: str) -> Any:
    path = FIXTURES_DIR.joinpath(*parts)
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


@pytest.mark.parametrize(
    ("fixture_name", "expected_type"),
    [
        ("session_start.json", SessionStartEvent),
        ("mousemove.json", MouseMoveEvent),
        ("click.json", ClickEvent),
        ("session_end.json", SessionEndEvent),
    ],
)
def test_valid_event_fixtures_parse(
    fixture_name: str,
    expected_type: type[SessionStartEvent | MouseMoveEvent | ClickEvent | SessionEndEvent],
) -> None:
    payload = load_fixture("valid", fixture_name)
    event = EVENT_ADAPTER.validate_python(payload)
    assert isinstance(event, expected_type)


def test_valid_telemetry_batch_fixture_parses() -> None:
    payload = load_fixture("valid", "telemetry_batch.json")
    batch = TelemetryBatch.model_validate(payload)
    assert batch.sessionId == payload["sessionId"]
    assert len(batch.events) == 2


@pytest.mark.parametrize(
    "fixture_parts",
    [
        ("invalid", "mousemove_normalized_out_of_range.json"),
        ("invalid", "click_missing_session_id.json"),
        ("invalid", "session_start_bad_duration.json"),
    ],
)
def test_invalid_event_fixtures_raise(fixture_parts: tuple[str, ...]) -> None:
    payload = load_fixture(*fixture_parts)
    with pytest.raises(ValidationError):
        EVENT_ADAPTER.validate_python(payload)


def test_empty_batch_events_raise() -> None:
    payload = load_fixture("invalid", "batch_empty_events.json")
    with pytest.raises(ValidationError):
        TelemetryBatch.model_validate(payload)


def test_batch_rejects_mismatched_event_session_id() -> None:
    payload = load_fixture("valid", "telemetry_batch.json")
    mutated = deepcopy(payload)
    mutated["events"][0]["sessionId"] = "other-session-id"
    with pytest.raises(ValidationError):
        TelemetryBatch.model_validate(mutated)


def test_batch_rejects_more_than_max_events() -> None:
    template = load_fixture("valid", "mousemove.json")
    events = []
    for index in range(MAX_EVENTS_PER_BATCH + 1):
        event = deepcopy(template)
        event["eventId"] = f"mousemove-{index}"
        event["sequence"] = index
        events.append(event)

    payload = {
        "sessionId": template["sessionId"],
        "sentAt": 1,
        "batchSequence": 0,
        "events": events,
    }
    with pytest.raises(ValidationError):
        TelemetryBatch.model_validate(payload)
