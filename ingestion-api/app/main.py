from __future__ import annotations

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app import __version__
from app.api.errors import validation_error_response
from app.api.router import build_api_router
from app.core.config import Settings, get_settings
from app.services.session_store import InMemorySessionStore, SessionStore
from app.services.telemetry_producer import NoOpTelemetryProducer, TelemetryProducer


def create_app(
    settings: Settings | None = None,
    session_store: SessionStore | None = None,
    telemetry_producer: TelemetryProducer | None = None,
) -> FastAPI:
    """Create the FastAPI app with health, sessions, and batch ingestion."""

    resolved_settings = settings or get_settings()
    resolved_store = session_store or InMemorySessionStore()
    resolved_producer = telemetry_producer or NoOpTelemetryProducer()
    app = FastAPI(
        title=resolved_settings.app_name,
        version=__version__,
    )
    app.state.settings = resolved_settings
    app.state.session_store = resolved_store
    app.state.telemetry_producer = resolved_producer
    app.include_router(build_api_router(resolved_settings))

    @app.exception_handler(RequestValidationError)
    async def request_validation_exception_handler(
        _request: Request,
        _exc: RequestValidationError,
    ) -> JSONResponse:
        # DEC-007 / frontend: schema errors are non-retryable 400 (not FastAPI 422).
        return validation_error_response()

    return app


app = create_app()
