from __future__ import annotations

from fastapi import FastAPI

from app import __version__
from app.api.router import build_api_router
from app.core.config import Settings, get_settings
from app.services.session_store import InMemorySessionStore, SessionStore


def create_app(
    settings: Settings | None = None,
    session_store: SessionStore | None = None,
) -> FastAPI:
    """Create the FastAPI app with health and session lifecycle endpoints."""

    resolved_settings = settings or get_settings()
    resolved_store = session_store or InMemorySessionStore()
    app = FastAPI(
        title=resolved_settings.app_name,
        version=__version__,
    )
    app.state.settings = resolved_settings
    app.state.session_store = resolved_store
    app.include_router(build_api_router(resolved_settings))
    return app


app = create_app()
