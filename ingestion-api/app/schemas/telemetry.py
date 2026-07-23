from __future__ import annotations

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

# Khớp telemetry_batch.schema.json maxItems và frontend MAX_BATCH_EVENTS.
MAX_EVENTS_PER_BATCH = 100


class TelemetryBaseEvent(BaseModel):
    """Shared identity and ordering fields for every telemetry event."""

    model_config = ConfigDict(extra="forbid")

    eventId: str = Field(min_length=1)
    sessionId: str = Field(min_length=1)
    eventTime: int = Field(ge=0)
    sequence: int = Field(ge=0)


class SessionStartEvent(TelemetryBaseEvent):
    eventType: Literal["session_start"]
    durationSeconds: Literal[30, 60]
    canvasWidth: float = Field(gt=0)
    canvasHeight: float = Field(gt=0)
    viewportWidth: float = Field(gt=0)
    viewportHeight: float = Field(gt=0)
    devicePixelRatio: float = Field(gt=0)


class MouseMoveEvent(TelemetryBaseEvent):
    eventType: Literal["mousemove"]
    x: float
    y: float
    normalizedX: float | None = Field(default=None, ge=0, le=1)
    normalizedY: float | None = Field(default=None, ge=0, le=1)


class ClickEvent(TelemetryBaseEvent):
    eventType: Literal["click"]
    x: float
    y: float
    normalizedX: float | None = Field(default=None, ge=0, le=1)
    normalizedY: float | None = Field(default=None, ge=0, le=1)
    targetId: str = Field(min_length=1)
    targetHit: bool
    reactionTimeMs: int = Field(ge=0)


class SessionEndEvent(TelemetryBaseEvent):
    eventType: Literal["session_end"]
    score: int = Field(ge=0)
    hitCount: int = Field(ge=0)
    missCount: int = Field(ge=0)
    totalEvents: int = Field(ge=0)


TelemetryEvent = Annotated[
    SessionStartEvent | MouseMoveEvent | ClickEvent | SessionEndEvent,
    Field(discriminator="eventType"),
]


class TelemetryBatch(BaseModel):
    """HTTP batch payload for POST /api/v1/events/batch."""

    model_config = ConfigDict(extra="forbid")

    sessionId: str = Field(min_length=1)
    sentAt: int = Field(ge=0)
    batchSequence: int = Field(ge=0)
    events: list[TelemetryEvent] = Field(
        min_length=1,
        max_length=MAX_EVENTS_PER_BATCH,
    )

    @model_validator(mode="after")
    def events_must_match_batch_session(self) -> TelemetryBatch:
        # Giống frontend isTelemetryBatch: mọi event phải cùng sessionId với batch.
        mismatched = [event.eventId for event in self.events if event.sessionId != self.sessionId]
        if mismatched:
            raise ValueError(
                "every event.sessionId must equal batch.sessionId; "
                f"mismatched eventIds={mismatched}"
            )
        return self


class BatchAcceptedResponse(BaseModel):
    """Success body for accepted telemetry batches (api-contract)."""

    model_config = ConfigDict(extra="forbid")

    accepted: bool
    batchSequence: int
    eventCount: int = Field(ge=0)
