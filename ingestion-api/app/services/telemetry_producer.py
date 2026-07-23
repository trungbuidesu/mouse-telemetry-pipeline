from __future__ import annotations

from collections.abc import Callable
from typing import Protocol

import orjson
from aiokafka import AIOKafkaProducer  # type: ignore[import-untyped]

from app.schemas.telemetry import TelemetryBatch


class ProducerUnavailableError(Exception):
    """Kafka producer is down or cannot accept work (T2.6 maps to 503)."""


class TelemetryProducer(Protocol):
    """Service boundary for forwarding accepted batches to Kafka (or test doubles)."""

    async def produce_batch(self, batch: TelemetryBatch) -> None:
        """Accept a validated batch for downstream produce."""


class NoOpTelemetryProducer:
    """Test/default stand-in that drops batches without side effects."""

    async def produce_batch(self, batch: TelemetryBatch) -> None:
        return None


class RecordingTelemetryProducer:
    """Test double that records each accepted batch."""

    def __init__(self) -> None:
        self.batches: list[TelemetryBatch] = []

    async def produce_batch(self, batch: TelemetryBatch) -> None:
        self.batches.append(batch)


class KafkaTelemetryProducer:
    """Lifespan-managed aiokafka producer: one JSON message per event, key=sessionId."""

    def __init__(
        self,
        *,
        bootstrap_servers: str,
        topic: str,
        producer_factory: Callable[..., AIOKafkaProducer] | None = None,
    ) -> None:
        self._bootstrap_servers = bootstrap_servers
        self._topic = topic
        self._producer_factory = producer_factory or AIOKafkaProducer
        self._producer: AIOKafkaProducer | None = None

    @property
    def topic(self) -> str:
        return self._topic

    @property
    def is_started(self) -> bool:
        return self._producer is not None

    async def start(self) -> None:
        # Singleton reuse: start once per app lifespan, not per request.
        if self._producer is not None:
            return
        producer = self._producer_factory(bootstrap_servers=self._bootstrap_servers)
        try:
            await producer.start()
        except Exception as exc:
            raise ProducerUnavailableError(
                "Kafka producer failed to start",
            ) from exc
        self._producer = producer

    async def stop(self) -> None:
        if self._producer is None:
            return
        producer = self._producer
        self._producer = None
        await producer.stop()

    async def produce_batch(self, batch: TelemetryBatch) -> None:
        if self._producer is None:
            raise ProducerUnavailableError("Kafka producer is not started")

        key = batch.sessionId.encode("utf-8")
        try:
            for event in batch.events:
                value = orjson.dumps(event.model_dump(mode="json"))
                await self._producer.send_and_wait(
                    self._topic,
                    value=value,
                    key=key,
                )
        except ProducerUnavailableError:
            raise
        except Exception as exc:
            raise ProducerUnavailableError(
                "Failed to produce telemetry batch to Kafka",
            ) from exc
