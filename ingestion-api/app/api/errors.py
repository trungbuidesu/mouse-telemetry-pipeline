from __future__ import annotations

from fastapi.responses import JSONResponse


def validation_error_response() -> JSONResponse:
    """Schema/validation failures are non-retryable for frontend (DEC-007)."""

    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "code": "validation_error",
                "message": "Request validation failed",
                "retryable": False,
            }
        },
    )
