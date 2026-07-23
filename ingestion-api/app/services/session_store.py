from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum
from typing import Literal, Protocol

from app.schemas.sessions import CreateSessionRequest


class SessionLifecycleStatus(StrEnum):
    OPEN = "open"
    COMPLETED = "completed"


@dataclass(frozen=True, slots=True)
class SessionRecord:
    session_id: str
    started_at: int
    duration_seconds: Literal[30, 60]
    canvas_width: float
    canvas_height: float
    viewport_width: float
    viewport_height: float
    status: SessionLifecycleStatus


class SessionStore(Protocol):
    """Process-local session lifecycle store used by session routes."""

    def create(self, request: CreateSessionRequest) -> SessionRecord:
        """Register or acknowledge a session (idempotent for same sessionId)."""

    def get(self, session_id: str) -> SessionRecord | None:
        """Return the session if it was created; otherwise None."""

    def complete(self, session_id: str) -> SessionRecord | None:
        """Mark open→completed. Returns None if session was never created."""


class InMemorySessionStore:
    """Dict-backed store; state is local to the process lifetime."""

    def __init__(self) -> None:
        self._sessions: dict[str, SessionRecord] = {}

    def create(self, request: CreateSessionRequest) -> SessionRecord:
        existing = self._sessions.get(request.sessionId)
        if existing is not None:
            # Acknowledge: giữ metadata/status đăng ký lần đầu cho cùng sessionId.
            return existing

        record = SessionRecord(
            session_id=request.sessionId,
            started_at=request.startedAt,
            duration_seconds=request.durationSeconds,
            canvas_width=request.canvasWidth,
            canvas_height=request.canvasHeight,
            viewport_width=request.viewportWidth,
            viewport_height=request.viewportHeight,
            status=SessionLifecycleStatus.OPEN,
        )
        self._sessions[request.sessionId] = record
        return record

    def get(self, session_id: str) -> SessionRecord | None:
        return self._sessions.get(session_id)

    def complete(self, session_id: str) -> SessionRecord | None:
        existing = self._sessions.get(session_id)
        if existing is None:
            return None

        if existing.status is SessionLifecycleStatus.COMPLETED:
            return existing

        completed = SessionRecord(
            session_id=existing.session_id,
            started_at=existing.started_at,
            duration_seconds=existing.duration_seconds,
            canvas_width=existing.canvas_width,
            canvas_height=existing.canvas_height,
            viewport_width=existing.viewport_width,
            viewport_height=existing.viewport_height,
            status=SessionLifecycleStatus.COMPLETED,
        )
        self._sessions[session_id] = completed
        return completed
