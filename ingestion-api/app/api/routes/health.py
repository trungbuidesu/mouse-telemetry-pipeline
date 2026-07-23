from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from app import __version__
from app.core.config import Settings

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    """Stable health check response for smoke tests and runbooks."""

    status: str
    service: str
    version: str
    environment: str


def build_health_router(settings: Settings) -> APIRouter:
    """Tạo health router đóng trên settings của create_app (hỗ trợ inject test)."""

    health_router = APIRouter(tags=["health"])

    @health_router.get("/health", response_model=HealthResponse)
    async def health() -> HealthResponse:
        return HealthResponse(
            status="ok",
            service=settings.app_name,
            version=__version__,
            environment=settings.environment,
        )

    return health_router
