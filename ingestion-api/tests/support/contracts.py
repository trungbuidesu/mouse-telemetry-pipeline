from __future__ import annotations

import json
from pathlib import Path
from typing import Any

FIXTURES_DIR = Path(__file__).resolve().parents[3] / "contracts" / "fixtures"

DEFAULT_SESSION_ID = "9243f3b4-0000-4000-8000-0000000000aa"


def load_fixture(*parts: str) -> Any:
    """Load a JSON fixture from contracts/fixtures."""
    path = FIXTURES_DIR.joinpath(*parts)
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def wrap_event_in_batch(
    event: dict[str, Any],
    *,
    batch_sequence: int = 1,
    session_id: str | None = None,
) -> dict[str, Any]:
    """Wrap a single-event fixture into a TelemetryBatch request body."""
    resolved_session = session_id or event.get("sessionId") or DEFAULT_SESSION_ID
    return {
        "sessionId": resolved_session,
        "sentAt": 1784498400500,
        "batchSequence": batch_sequence,
        "events": [event],
    }


def assert_error_envelope(
    body: dict[str, Any],
    *,
    retryable: bool,
    code: str | None = None,
) -> None:
    """Assert shared API error envelope shape used by G2 / DEC-007 clients."""
    assert "error" in body
    error = body["error"]
    assert isinstance(error.get("message"), str)
    assert len(error["message"]) > 0
    assert error["retryable"] is retryable
    if code is not None:
        assert error["code"] == code
