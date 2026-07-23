from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from unittest.mock import AsyncMock, MagicMock

import orjson
import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import Settings
from app.main import create_app
from app.schemas.telemetry import TelemetryBatch
from app.services.telemetry_producer import (
    KafkaTelemetryProducer,
    NoOpTelemetryProducer,
    ProducerUnavailableError,
)

FIXTURES_DIR = Path(__file__).resolve().parents[2] / "contracts" / "fixtures"


def load_fixture(*parts: str) -> Any:
    path = FIXTURES_DIR.joinpath(*parts)
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def _batch_from_fixture() -> TelemetryBatch:
    return TelemetryBatch.model_validate(load_fixture("valid", "telemetry_batch.json"))


def _mock_aiokafka_producer() -> MagicMock:
    mock = MagicMock()
    mock.start = AsyncMock()
    mock.stop = AsyncMock()
    mock.send_and_wait = AsyncMock()
    return mock


@pytest.mark.asyncio
async def test_produce_batch_sends_one_message_per_event() -> None:
    batch = _batch_from_fixture()
    mock_inner = _mock_aiokafka_producer()
    producer = KafkaTelemetryProducer(
        bootstrap_servers="localhost:9092",
        topic="mouse.telemetry.events.v1",
        producer_factory=lambda **_kwargs: mock_inner,
    )

    await producer.start()
    await producer.produce_batch(batch)

    assert mock_inner.send_and_wait.await_count == len(batch.events)
    expected_key = batch.sessionId.encode("utf-8")
    for call, event in zip(mock_inner.send_and_wait.await_args_list, batch.events, strict=True):
        assert call.args[0] == "mouse.telemetry.events.v1"
        assert call.kwargs["key"] == expected_key
        assert orjson.loads(call.kwargs["value"]) == event.model_dump(mode="json")


@pytest.mark.asyncio
async def test_producer_start_is_idempotent_and_stop_closes() -> None:
    mock_inner = _mock_aiokafka_producer()
    factory = MagicMock(return_value=mock_inner)
    producer = KafkaTelemetryProducer(
        bootstrap_servers="localhost:9092",
        topic="mouse.telemetry.events.v1",
        producer_factory=factory,
    )

    await producer.start()
    await producer.start()
    assert factory.call_count == 1
    assert producer.is_started is True

    await producer.stop()
    mock_inner.stop.assert_awaited_once()
    assert producer.is_started is False


@pytest.mark.asyncio
async def test_produce_batch_before_start_raises_unavailable() -> None:
    producer = KafkaTelemetryProducer(
        bootstrap_servers="localhost:9092",
        topic="mouse.telemetry.events.v1",
        producer_factory=lambda **_kwargs: _mock_aiokafka_producer(),
    )

    with pytest.raises(ProducerUnavailableError, match="not started"):
        await producer.produce_batch(_batch_from_fixture())


@pytest.mark.asyncio
async def test_produce_batch_wraps_send_failures() -> None:
    mock_inner = _mock_aiokafka_producer()
    mock_inner.send_and_wait = AsyncMock(side_effect=RuntimeError("broker down"))
    producer = KafkaTelemetryProducer(
        bootstrap_servers="localhost:9092",
        topic="mouse.telemetry.events.v1",
        producer_factory=lambda **_kwargs: mock_inner,
    )

    await producer.start()
    with pytest.raises(ProducerUnavailableError, match="Failed to produce"):
        await producer.produce_batch(_batch_from_fixture())


@pytest.mark.asyncio
async def test_start_wraps_connection_failures() -> None:
    mock_inner = _mock_aiokafka_producer()
    mock_inner.start = AsyncMock(side_effect=OSError("connection refused"))
    producer = KafkaTelemetryProducer(
        bootstrap_servers="localhost:9092",
        topic="mouse.telemetry.events.v1",
        producer_factory=lambda **_kwargs: mock_inner,
    )

    with pytest.raises(ProducerUnavailableError, match="failed to start"):
        await producer.start()
    assert producer.is_started is False


@pytest.mark.asyncio
async def test_lifespan_starts_and_stops_kafka_producer(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    mock_inner = _mock_aiokafka_producer()
    monkeypatch.setattr(
        "app.services.telemetry_producer.AIOKafkaProducer",
        lambda **_kwargs: mock_inner,
    )

    settings = Settings(
        kafka_bootstrap_servers="broker:9092",
        kafka_topic="mouse.telemetry.events.v1",
    )
    app = create_app(settings=settings)
    producer = app.state.telemetry_producer
    assert isinstance(producer, KafkaTelemetryProducer)
    assert producer.is_started is False

    # httpx ASGITransport in this stack does not expose lifespan=; drive FastAPI lifespan.
    async with app.router.lifespan_context(app):
        assert producer.is_started is True
        assert producer.topic == "mouse.telemetry.events.v1"
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            response = await client.get("/health")
            assert response.status_code == 200

    mock_inner.start.assert_awaited_once()
    mock_inner.stop.assert_awaited_once()
    assert producer.is_started is False


@pytest.mark.asyncio
async def test_explicit_producer_override_skips_kafka_lifespan(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setattr(
        "app.main.KafkaTelemetryProducer",
        MagicMock(side_effect=AssertionError("Kafka must not start when overridden")),
    )

    app = create_app(telemetry_producer=NoOpTelemetryProducer())
    async with app.router.lifespan_context(app):
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            response = await client.get("/health")
            assert response.status_code == 200
