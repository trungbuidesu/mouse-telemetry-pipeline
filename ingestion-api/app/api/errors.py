from __future__ import annotations

from fastapi import status
from fastapi.responses import JSONResponse

from app.schemas.errors import ErrorDetail, ErrorEnvelope


def error_envelope(
    *,
    code: str,
    message: str,
    retryable: bool,
) -> dict[str, object]:
    """Build the locked `{ error: { code, message, retryable } }` payload."""

    return ErrorEnvelope(
        error=ErrorDetail(code=code, message=message, retryable=retryable),
    ).model_dump()


def error_response(
    *,
    status_code: int,
    code: str,
    message: str,
    retryable: bool,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content=error_envelope(code=code, message=message, retryable=retryable),
    )


def validation_error_response(message: str = "Request validation failed") -> JSONResponse:
    return error_response(
        status_code=status.HTTP_400_BAD_REQUEST,
        code="VALIDATION_ERROR",
        message=message,
        retryable=False,
    )


def payload_too_large_response(max_bytes: int) -> JSONResponse:
    return error_response(
        status_code=status.HTTP_413_CONTENT_TOO_LARGE,
        code="PAYLOAD_TOO_LARGE",
        message=f"Request body exceeds {max_bytes} bytes",
        retryable=False,
    )


def too_many_requests_response() -> JSONResponse:
    return error_response(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        code="TOO_MANY_REQUESTS",
        message="Too many in-flight ingestion requests",
        retryable=True,
    )


def producer_unavailable_response(message: str) -> JSONResponse:
    return error_response(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        code="PRODUCER_UNAVAILABLE",
        message=message,
        retryable=True,
    )
