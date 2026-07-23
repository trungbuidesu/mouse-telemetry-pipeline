from __future__ import annotations

from typing import Protocol

from app.schemas.telemetry import TelemetryBatch


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
