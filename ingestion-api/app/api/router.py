from __future__ import annotations

from fastapi import APIRouter

from app.api.routes import events, sessions
from app.api.routes.health import build_health_router
from app.core.config import Settings


def build_api_router(settings: Settings) -> APIRouter:
    """Aggregate health, session lifecycle, and /api/v1 events batch routers."""

    api_router = APIRouter()
    api_router.include_router(build_health_router(settings))

    v1_router = APIRouter(prefix="/api/v1")
    v1_router.include_router(sessions.router)
    v1_router.include_router(events.router)
    api_router.include_router(v1_router)

    return api_router
