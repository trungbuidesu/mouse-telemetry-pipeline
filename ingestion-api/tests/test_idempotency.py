from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import Settings
from app.main import create_app
from app.schemas.telemetry import BatchAcceptedResponse
from app.services.idempotency import IdempotencyCache
from app.services.telemetry_producer import RecordingTelemetryProducer

FIXTURES_DIR = Path(__file__).resolve().parents[2] / "contracts" / "fixtures"


def load_fixture(*parts: str) -> Any:
    path = FIXTURES_DIR.joinpath(*parts)
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


@pytest.mark.asyncio
async def test_duplicate_batch_returns_prior_202_without_reproduce() -> None:
    producer = RecordingTelemetryProducer()
    app = create_app(telemetry_producer=producer)
    transport = ASGITransport(app=app)
    payload = load_fixture("valid", "telemetry_batch.json")

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        first = await client.post("/api/v1/events/batch", json=payload)
        second = await client.post("/api/v1/events/batch", json=payload)

    assert first.status_code == 202
    assert second.status_code == 202
    assert first.json() == second.json()
    assert len(producer.batches) == 1


@pytest.mark.asyncio
async def test_different_batch_sequence_is_not_idempotent_hit() -> None:
    producer = RecordingTelemetryProducer()
    app = create_app(telemetry_producer=producer)
    transport = ASGITransport(app=app)
    payload = load_fixture("valid", "telemetry_batch.json")
    other = dict(payload)
    other["batchSequence"] = payload["batchSequence"] + 1

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        first = await client.post("/api/v1/events/batch", json=payload)
        second = await client.post("/api/v1/events/batch", json=other)

    assert first.status_code == 202
    assert second.status_code == 202
    assert len(producer.batches) == 2


def test_idempotency_cache_is_bounded() -> None:
    cache = IdempotencyCache(max_entries=2)
    response = BatchAcceptedResponse(accepted=True, batchSequence=0, eventCount=1)

    cache.put(("s", 1), response)
    cache.put(("s", 2), response)
    cache.put(("s", 3), response)

    assert cache.size <= 2
    assert cache.get(("s", 1)) is None
    assert cache.get(("s", 3)) is not None


@pytest.mark.asyncio
async def test_create_app_respects_idempotency_cache_max_from_settings() -> None:
    producer = RecordingTelemetryProducer()
    settings = Settings(idempotency_cache_max_entries=1)
    app = create_app(settings=settings, telemetry_producer=producer)
    cache = app.state.idempotency_cache
    assert isinstance(cache, IdempotencyCache)
    assert cache.max_entries == 1
