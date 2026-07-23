from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class CreateSessionRequest(BaseModel):
    """Body for POST /api/v1/sessions (api-contract)."""

    model_config = ConfigDict(extra="forbid")

    sessionId: str = Field(min_length=1)
    startedAt: int = Field(ge=0)
    durationSeconds: Literal[30, 60]
    canvasWidth: float = Field(gt=0)
    canvasHeight: float = Field(gt=0)
    viewportWidth: float = Field(gt=0)
    viewportHeight: float = Field(gt=0)


class CreateSessionResponse(BaseModel):
    """Success body for session create (HTTP 200)."""

    model_config = ConfigDict(extra="forbid")

    accepted: bool
    sessionId: str = Field(min_length=1)


class SessionCompleteResponse(BaseModel):
    """Success body for POST .../complete (HTTP 200)."""

    model_config = ConfigDict(extra="forbid")

    accepted: bool
    sessionId: str = Field(min_length=1)
    status: Literal["completed"]


class SessionMetricsResponse(BaseModel):
    """Metrics stub until Spark/P4 computes completed analytics."""

    model_config = ConfigDict(extra="forbid")

    status: Literal["processing"]
