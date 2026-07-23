from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import create_app
from app.services.telemetry_producer import RecordingTelemetryProducer

FIXTURES_DIR = Path(__file__).resolve().parents[2] / "contracts" / "fixtures"


def load_fixture(*parts: str) -> Any:
    path = FIXTURES_DIR.joinpath(*parts)
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


@pytest.fixture
def producer() -> RecordingTelemetryProducer:
    return RecordingTelemetryProducer()


@pytest.fixture
async def client(producer: RecordingTelemetryProducer) -> AsyncClient:
    app = create_app(telemetry_producer=producer)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as http:
        yield http


@pytest.mark.asyncio
async def test_batch_accepts_valid_fixture(
    client: AsyncClient,
    producer: RecordingTelemetryProducer,
) -> None:
    payload = load_fixture("valid", "telemetry_batch.json")

    response = await client.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 202
    assert response.json() == {
        "accepted": True,
        "batchSequence": payload["batchSequence"],
        "eventCount": len(payload["events"]),
    }
    assert len(producer.batches) == 1
    assert producer.batches[0].sessionId == payload["sessionId"]
    assert producer.batches[0].batchSequence == payload["batchSequence"]


@pytest.mark.asyncio
async def test_batch_does_not_require_prior_session(
    client: AsyncClient,
    producer: RecordingTelemetryProducer,
) -> None:
    payload = load_fixture("valid", "telemetry_batch.json")

    response = await client.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 202
    assert len(producer.batches) == 1


@pytest.mark.asyncio
async def test_batch_rejects_empty_events_with_400(
    client: AsyncClient,
    producer: RecordingTelemetryProducer,
) -> None:
    payload = load_fixture("invalid", "batch_empty_events.json")

    response = await client.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 400
    assert producer.batches == []


@pytest.mark.asyncio
async def test_batch_rejects_missing_required_field_with_400(
    client: AsyncClient,
    producer: RecordingTelemetryProducer,
) -> None:
    payload = load_fixture("valid", "telemetry_batch.json")
    del payload["sessionId"]

    response = await client.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 400
    assert producer.batches == []


@pytest.mark.asyncio
async def test_events_routes_do_not_import_kafka() -> None:
    import app.api.routes.events as events_module

    assert "kafka" not in events_module.__dict__
    module_source = Path(events_module.__file__).read_text(encoding="utf-8")
    assert "kafka" not in module_source.lower()
