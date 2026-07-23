from __future__ import annotations

from fastapi import FastAPI

from app import __version__
from app.api.router import build_api_router
from app.core.config import Settings, get_settings


def create_app(settings: Settings | None = None) -> FastAPI:
    """Create the FastAPI app with health baseline and empty ingestion routers."""

    resolved_settings = settings or get_settings()
    app = FastAPI(
        title=resolved_settings.app_name,
        version=__version__,
    )
    app.include_router(build_api_router(resolved_settings))
    return app


app = create_app()
