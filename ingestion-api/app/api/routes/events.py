from __future__ import annotations

import asyncio
from typing import Annotated, cast

from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse

from app.api.errors import producer_unavailable_response, too_many_requests_response
from app.schemas.telemetry import BatchAcceptedResponse, TelemetryBatch
from app.services.idempotency import IdempotencyCache
from app.services.telemetry_producer import ProducerUnavailableError, TelemetryProducer

router = APIRouter(prefix="/events", tags=["events"])


def get_telemetry_producer(request: Request) -> TelemetryProducer:
    # FastAPI app.state không typed; cast về Protocol đã gắn trong create_app.
    return cast(TelemetryProducer, request.app.state.telemetry_producer)


def get_idempotency_cache(request: Request) -> IdempotencyCache:
    return cast(IdempotencyCache, request.app.state.idempotency_cache)


def get_in_flight_semaphore(request: Request) -> asyncio.Semaphore:
    return cast(asyncio.Semaphore, request.app.state.in_flight_semaphore)


TelemetryProducerDep = Annotated[TelemetryProducer, Depends(get_telemetry_producer)]
IdempotencyCacheDep = Annotated[IdempotencyCache, Depends(get_idempotency_cache)]
InFlightSemaphoreDep = Annotated[asyncio.Semaphore, Depends(get_in_flight_semaphore)]


@router.post(
    "/batch",
    response_model=BatchAcceptedResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def ingest_batch(
    body: TelemetryBatch,
    producer: TelemetryProducerDep,
    cache: IdempotencyCacheDep,
    in_flight: InFlightSemaphoreDep,
) -> BatchAcceptedResponse | JSONResponse:
    # Non-blocking: locked() means no permit left (DEC-007 — no queue-wait in request).
    if in_flight.locked():
        return too_many_requests_response()
    await in_flight.acquire()

    try:
        key = (body.sessionId, body.batchSequence)
        cached = cache.get(key)
        if cached is not None:
            # Duplicate batch: trả prior 202, không produce lại.
            return cached

        try:
            await producer.produce_batch(body)
        except ProducerUnavailableError as exc:
            return producer_unavailable_response(str(exc) or "Producer unavailable")

        response = BatchAcceptedResponse(
            accepted=True,
            batchSequence=body.batchSequence,
            eventCount=len(body.events),
        )
        cache.put(key, response)
        return response
    finally:
        in_flight.release()
