from __future__ import annotations

import asyncio
import json
from pathlib import Path
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import Settings
from app.main import create_app
from app.services.telemetry_producer import (
    ProducerUnavailableError,
    RecordingTelemetryProducer,
)

FIXTURES_DIR = Path(__file__).resolve().parents[2] / "contracts" / "fixtures"


def load_fixture(*parts: str) -> Any:
    path = FIXTURES_DIR.joinpath(*parts)
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


def assert_error_envelope(
    body: dict[str, Any],
    *,
    code: str,
    retryable: bool,
) -> None:
    assert "error" in body
    error = body["error"]
    assert error["code"] == code
    assert error["retryable"] is retryable
    assert isinstance(error["message"], str)
    assert len(error["message"]) > 0


@pytest.mark.asyncio
async def test_validation_error_returns_400_envelope() -> None:
    producer = RecordingTelemetryProducer()
    app = create_app(telemetry_producer=producer)
    transport = ASGITransport(app=app)
    payload = load_fixture("invalid", "batch_empty_events.json")

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 400
    assert_error_envelope(
        response.json(),
        code="VALIDATION_ERROR",
        retryable=False,
    )
    assert producer.batches == []


@pytest.mark.asyncio
async def test_oversized_body_returns_413_envelope() -> None:
    producer = RecordingTelemetryProducer()
    settings = Settings(max_request_body_bytes=64)
    app = create_app(settings=settings, telemetry_producer=producer)
    transport = ASGITransport(app=app)
    # Body lớn hơn giới hạn Settings (không cần gửi đủ 1 MiB trong unit test).
    oversized = b'{"sessionId":"' + (b"x" * 80) + b'"}'

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post(
            "/api/v1/events/batch",
            content=oversized,
            headers={"Content-Type": "application/json"},
        )

    assert response.status_code == 413
    assert_error_envelope(
        response.json(),
        code="PAYLOAD_TOO_LARGE",
        retryable=False,
    )
    assert producer.batches == []


@pytest.mark.asyncio
async def test_backpressure_returns_429_when_semaphore_unavailable() -> None:
    producer = RecordingTelemetryProducer()
    # Semaphore(0) không bao giờ acquire được → backpressure ngay.
    semaphore = asyncio.Semaphore(0)
    app = create_app(
        telemetry_producer=producer,
        in_flight_semaphore=semaphore,
    )
    transport = ASGITransport(app=app)
    payload = load_fixture("valid", "telemetry_batch.json")

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 429
    assert_error_envelope(
        response.json(),
        code="TOO_MANY_REQUESTS",
        retryable=True,
    )
    assert producer.batches == []


class _UnavailableProducer:
    async def produce_batch(self, batch: object) -> None:
        raise ProducerUnavailableError("Kafka producer is not started")


@pytest.mark.asyncio
async def test_producer_unavailable_returns_503_envelope() -> None:
    app = create_app(telemetry_producer=_UnavailableProducer())
    transport = ASGITransport(app=app)
    payload = load_fixture("valid", "telemetry_batch.json")

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/api/v1/events/batch", json=payload)

    assert response.status_code == 503
    assert_error_envelope(
        response.json(),
        code="PRODUCER_UNAVAILABLE",
        retryable=True,
    )


def test_settings_backpressure_defaults() -> None:
    settings = Settings()

    assert settings.max_request_body_bytes == 1_048_576
    assert settings.max_events_per_batch == 100
    assert settings.idempotency_cache_max_entries == 10_000
