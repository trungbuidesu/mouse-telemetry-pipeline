from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from app import __version__
from app.core.config import Settings, get_settings


class HealthResponse(BaseModel):
    """Stable health check response for smoke tests and runbooks."""

    status: str
    service: str
    version: str
    environment: str


def create_app(settings: Settings | None = None) -> FastAPI:
    """Create the FastAPI app without phase-specific ingestion endpoints."""

    resolved_settings = settings or get_settings()
    app = FastAPI(
        title=resolved_settings.app_name,
        version=__version__,
    )

    @app.get("/health", response_model=HealthResponse)
    async def health() -> HealthResponse:
        return HealthResponse(
            status="ok",
            service=resolved_settings.app_name,
            version=__version__,
            environment=resolved_settings.environment,
        )

    return app


app = create_app()
