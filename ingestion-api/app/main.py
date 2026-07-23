from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send

from app import __version__
from app.api.errors import payload_too_large_response, validation_error_response
from app.api.router import build_api_router
from app.core.config import Settings, get_settings
from app.services.idempotency import IdempotencyCache
from app.services.session_store import InMemorySessionStore, SessionStore
from app.services.telemetry_producer import (
    KafkaTelemetryProducer,
    TelemetryProducer,
)

# Hard-locked in-flight limit for T2.6 backpressure (plan002 / user lock).
IN_FLIGHT_LIMIT = 32


class LimitRequestBodyMiddleware:
    """Reject requests whose Content-Length exceeds max_request_body_bytes."""

    def __init__(self, app: ASGIApp, max_body_bytes: int) -> None:
        self.app = app
        self._max_body_bytes = max_body_bytes

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = {
            key.decode("latin-1").lower(): value.decode("latin-1")
            for key, value in scope.get("headers", [])
        }
        content_length = headers.get("content-length")
        if content_length is not None:
            try:
                length = int(content_length)
            except ValueError:
                length = -1
            if length > self._max_body_bytes:
                response = payload_too_large_response(self._max_body_bytes)
                await response(scope, receive, send)
                return

        await self.app(scope, receive, send)


def create_app(
    settings: Settings | None = None,
    session_store: SessionStore | None = None,
    telemetry_producer: TelemetryProducer | None = None,
    in_flight_semaphore: asyncio.Semaphore | None = None,
    idempotency_cache: IdempotencyCache | None = None,
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
    app.state.in_flight_semaphore = in_flight_semaphore or asyncio.Semaphore(
        IN_FLIGHT_LIMIT
    )
    app.state.idempotency_cache = idempotency_cache or IdempotencyCache(
        max_entries=resolved_settings.idempotency_cache_max_entries,
    )
    app.add_middleware(
        LimitRequestBodyMiddleware,
        max_body_bytes=resolved_settings.max_request_body_bytes,
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
