from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class ErrorDetail(BaseModel):
    """Stable client-facing error body fields (DEC-007 retry semantics)."""

    model_config = ConfigDict(extra="forbid")

    code: str
    message: str
    retryable: bool


class ErrorEnvelope(BaseModel):
    """HTTP error envelope for ingestion failures."""

    model_config = ConfigDict(extra="forbid")

    error: ErrorDetail
