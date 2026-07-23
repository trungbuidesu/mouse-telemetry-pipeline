from __future__ import annotations

from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from app import __version__
from app.core.config import Settings
from app.main import create_app
from app.services.telemetry_producer import (
    ProducerUnavailableError,
    RecordingTelemetryProducer,
)
from tests.support.contracts import (
    assert_error_envelope,
    load_fixture,
    wrap_event_in_batch,
)

# Single-event fixtures exercised via /events/batch wrappers.
VALID_EVENT_FIXTURES = (
    "session_start.json",
    "mousemove.json",
    "click.json",
    "session_end.json",
)
INVALID_EVENT_FIXTURES = (
    "mousemove_normalized_out_of_range.json",
    "click_missing_session_id.json",
    "session_start_bad_duration.json",
)


class _UnavailableProducer:
    async def produce_batch(self, batch: object) -> None:
        raise ProducerUnavailableError("Kafka producer is not started")


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
async def test_contract_valid_telemetry_batch_returns_202(
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


@pytest.mark.asyncio
@pytest.mark.parametrize("fixture_name", VALID_EVENT_FIXTURES)
async def test_contract_valid_event_fixtures_accept_as_batch(
    client: AsyncClient,
    producer: RecordingTelemetryProducer,
    fixture_name: str,
) -> None:
    event = load_fixture("valid", fixture_name)
    # Distinct batchSequence per fixture name avoids idempotency cache hits.
    batch_sequence = VALID_EVENT_FIXTURES.index(fixture_name) + 100
    payload = wrap_event_in_batch(event, batch_sequence=batch_sequence)

    response = await client.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 202
    assert response.json() == {
        "accepted": True,
        "batchSequence": batch_sequence,
        "eventCount": 1,
    }


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "fixture_name",
    [
        "batch_empty_events.json",
        *INVALID_EVENT_FIXTURES,
    ],
)
async def test_contract_invalid_fixtures_return_400_envelope(
    client: AsyncClient,
    producer: RecordingTelemetryProducer,
    fixture_name: str,
) -> None:
    raw = load_fixture("invalid", fixture_name)
    payload: dict[str, Any] = (
        raw if fixture_name == "batch_empty_events.json" else wrap_event_in_batch(raw)
    )

    response = await client.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 400
    assert_error_envelope(response.json(), retryable=False, code="VALIDATION_ERROR")
    assert producer.batches == []


@pytest.mark.asyncio
async def test_contract_oversized_body_returns_413(
    producer: RecordingTelemetryProducer,
) -> None:
    settings = Settings(max_request_body_bytes=64)
    app = create_app(settings=settings, telemetry_producer=producer)
    transport = ASGITransport(app=app)
    oversized = b'{"sessionId":"' + (b"x" * 80) + b'"}'

    async with AsyncClient(transport=transport, base_url="http://testserver") as http:
        response = await http.post(
            "/api/v1/events/batch",
            content=oversized,
            headers={"Content-Type": "application/json"},
        )

    assert response.status_code == 413
    assert_error_envelope(response.json(), retryable=False, code="PAYLOAD_TOO_LARGE")
    assert producer.batches == []


@pytest.mark.asyncio
async def test_contract_producer_failure_returns_503_retryable() -> None:
    app = create_app(telemetry_producer=_UnavailableProducer())
    transport = ASGITransport(app=app)
    payload = load_fixture("valid", "telemetry_batch.json")

    async with AsyncClient(transport=transport, base_url="http://testserver") as http:
        response = await http.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 503
    assert_error_envelope(
        response.json(),
        retryable=True,
        code="PRODUCER_UNAVAILABLE",
    )


@pytest.mark.asyncio
async def test_contract_create_session_fixture_returns_200(client: AsyncClient) -> None:
    payload = load_fixture("valid", "create_session_request.json")

    response = await client.post("/api/v1/sessions", json=payload)

    assert response.status_code == 200
    assert response.json() == {
        "accepted": True,
        "sessionId": payload["sessionId"],
    }


@pytest.mark.asyncio
async def test_contract_health_still_returns_200(client: AsyncClient) -> None:
    response = await client.get("/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "Mouse Telemetry Ingestion API"
    assert body["version"] == __version__


@pytest.mark.integration
@pytest.mark.skip(reason="Requires live Kafka broker; skipped by default")
@pytest.mark.asyncio
async def test_optional_live_kafka_produce_integration() -> None:
    """Placeholder for opt-in live Kafka smoke; not part of default suite."""
    raise AssertionError("Live Kafka integration is intentionally skipped")
