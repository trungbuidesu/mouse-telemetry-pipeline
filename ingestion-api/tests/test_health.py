from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient

from app import __version__
from app.main import create_app


@pytest.mark.asyncio
async def test_health_endpoint_returns_api_status() -> None:
    app = create_app()
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "Mouse Telemetry Ingestion API",
        "version": __version__,
        "environment": "local",
    }


def test_create_app_mounts_health_and_empty_v1_routers() -> None:
    app = create_app()
    openapi_paths = set(app.openapi().get("paths", {}))

    assert "/health" in openapi_paths
    # Empty sessions/events routers are mounted under /api/v1 but expose no paths yet.
    assert "/api/v1/sessions" not in openapi_paths
    assert "/api/v1/events/batch" not in openapi_paths
