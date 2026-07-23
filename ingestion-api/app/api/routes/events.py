from __future__ import annotations

from typing import Annotated, cast

from fastapi import APIRouter, Depends, Request, status

from app.schemas.telemetry import BatchAcceptedResponse, TelemetryBatch
from app.services.telemetry_producer import TelemetryProducer

router = APIRouter(prefix="/events", tags=["events"])


def get_telemetry_producer(request: Request) -> TelemetryProducer:
    return cast(TelemetryProducer, request.app.state.telemetry_producer)


TelemetryProducerDep = Annotated[TelemetryProducer, Depends(get_telemetry_producer)]


@router.post(
    "/batch",
    response_model=BatchAcceptedResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def ingest_batch(
    body: TelemetryBatch,
    producer: TelemetryProducerDep,
) -> BatchAcceptedResponse:
    await producer.produce_batch(body)
    return BatchAcceptedResponse(
        accepted=True,
        batchSequence=body.batchSequence,
        eventCount=len(body.events),
    )
