from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app import __version__
from app.api.errors import validation_error_response
from app.api.router import build_api_router
from app.core.config import Settings, get_settings
from app.services.session_store import InMemorySessionStore, SessionStore
from app.services.telemetry_producer import (
    KafkaTelemetryProducer,
    TelemetryProducer,
)


def create_app(
    settings: Settings | None = None,
    session_store: SessionStore | None = None,
    telemetry_producer: TelemetryProducer | None = None,
) -> FastAPI:
    """Create the FastAPI app with health, sessions, and batch ingestion.

    When ``telemetry_producer`` is omitted, lifespan owns a singleton
    ``KafkaTelemetryProducer`` (start/stop). Tests inject NoOp/Recording.
    """

    resolved_settings = settings or get_settings()
    resolved_store = session_store or InMemorySessionStore()
    explicit_producer = telemetry_producer is not None
    kafka_producer: KafkaTelemetryProducer | None = None
    if not explicit_producer:
        kafka_producer = KafkaTelemetryProducer(
            bootstrap_servers=resolved_settings.kafka_bootstrap_servers,
            topic=resolved_settings.kafka_topic,
        )

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        if kafka_producer is None:
            yield
            return

        await kafka_producer.start()
        try:
            yield
        finally:
            await kafka_producer.stop()

    app = FastAPI(
        title=resolved_settings.app_name,
        version=__version__,
        lifespan=lifespan,
    )
    app.state.settings = resolved_settings
    app.state.session_store = resolved_store
    app.state.telemetry_producer = (
        telemetry_producer if explicit_producer else kafka_producer
    )
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
