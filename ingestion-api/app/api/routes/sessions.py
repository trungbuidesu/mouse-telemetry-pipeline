from __future__ import annotations

from typing import Annotated, cast

from fastapi import APIRouter, Depends, HTTPException, Request, status

from app.schemas.sessions import (
    CreateSessionRequest,
    CreateSessionResponse,
    SessionCompleteResponse,
    SessionMetricsResponse,
)
from app.services.session_store import SessionStore

router = APIRouter(prefix="/sessions", tags=["sessions"])


def get_session_store(request: Request) -> SessionStore:
    # FastAPI app.state không typed; cast về Protocol đã gắn trong create_app.
    return cast(SessionStore, request.app.state.session_store)


SessionStoreDep = Annotated[SessionStore, Depends(get_session_store)]


@router.post(
    "",
    response_model=CreateSessionResponse,
    status_code=status.HTTP_200_OK,
)
def create_session(
    body: CreateSessionRequest,
    store: SessionStoreDep,
) -> CreateSessionResponse:
    record = store.create(body)
    return CreateSessionResponse(accepted=True, sessionId=record.session_id)


@router.post(
    "/{sessionId}/complete",
    response_model=SessionCompleteResponse,
    status_code=status.HTTP_200_OK,
)
def complete_session(
    sessionId: str,
    store: SessionStoreDep,
) -> SessionCompleteResponse:
    record = store.complete(sessionId)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"session not found: {sessionId}",
        )
    return SessionCompleteResponse(
        accepted=True,
        sessionId=record.session_id,
        status="completed",
    )


@router.get(
    "/{sessionId}/metrics",
    response_model=SessionMetricsResponse,
    status_code=status.HTTP_200_OK,
)
def get_session_metrics(
    sessionId: str,
    store: SessionStoreDep,
) -> SessionMetricsResponse:
    # Metrics thật (Spark/P4) chưa có; session đã biết luôn trả processing stub.
    record = store.get(sessionId)
    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"session not found: {sessionId}",
        )
    return SessionMetricsResponse(status="processing")
