from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import create_app
from app.services.session_store import InMemorySessionStore

FIXTURES_DIR = Path(__file__).resolve().parents[2] / "contracts" / "fixtures"


def load_fixture(*parts: str) -> Any:
    path = FIXTURES_DIR.joinpath(*parts)
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


@pytest.fixture
def session_store() -> InMemorySessionStore:
    return InMemorySessionStore()


@pytest.fixture
async def client(session_store: InMemorySessionStore) -> AsyncClient:
    app = create_app(session_store=session_store)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as http:
        yield http


@pytest.mark.asyncio
async def test_create_session_accepts_valid_fixture(client: AsyncClient) -> None:
    payload = load_fixture("valid", "create_session_request.json")

    response = await client.post("/api/v1/sessions", json=payload)

    assert response.status_code == 200
    assert response.json() == {
        "accepted": True,
        "sessionId": payload["sessionId"],
    }


@pytest.mark.asyncio
async def test_create_session_rejects_invalid_duration(client: AsyncClient) -> None:
    payload = load_fixture("valid", "create_session_request.json")
    payload["durationSeconds"] = 45

    response = await client.post("/api/v1/sessions", json=payload)

    # FastAPI default validation status until T2.4 maps to 400.
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_session_rejects_non_positive_dimensions(client: AsyncClient) -> None:
    payload = load_fixture("valid", "create_session_request.json")
    payload["canvasWidth"] = 0

    response = await client.post("/api/v1/sessions", json=payload)

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_complete_unknown_session_returns_404(client: AsyncClient) -> None:
    response = await client.post("/api/v1/sessions/missing-session/complete")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_complete_open_session_returns_200(client: AsyncClient) -> None:
    payload = load_fixture("valid", "create_session_request.json")
    await client.post("/api/v1/sessions", json=payload)

    response = await client.post(f"/api/v1/sessions/{payload['sessionId']}/complete")

    assert response.status_code == 200
    assert response.json() == {
        "accepted": True,
        "sessionId": payload["sessionId"],
        "status": "completed",
    }


@pytest.mark.asyncio
async def test_complete_is_idempotent_for_completed_session(client: AsyncClient) -> None:
    payload = load_fixture("valid", "create_session_request.json")
    session_id = payload["sessionId"]
    await client.post("/api/v1/sessions", json=payload)
    await client.post(f"/api/v1/sessions/{session_id}/complete")

    response = await client.post(f"/api/v1/sessions/{session_id}/complete")

    assert response.status_code == 200
    assert response.json()["status"] == "completed"


@pytest.mark.asyncio
async def test_metrics_unknown_session_returns_404(client: AsyncClient) -> None:
    response = await client.get("/api/v1/sessions/missing-session/metrics")

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_metrics_returns_processing_stub(client: AsyncClient) -> None:
    payload = load_fixture("valid", "create_session_request.json")
    await client.post("/api/v1/sessions", json=payload)

    response = await client.get(f"/api/v1/sessions/{payload['sessionId']}/metrics")

    assert response.status_code == 200
    assert response.json() == {"status": "processing"}


@pytest.mark.asyncio
async def test_metrics_still_processing_after_complete(client: AsyncClient) -> None:
    payload = load_fixture("valid", "create_session_request.json")
    session_id = payload["sessionId"]
    await client.post("/api/v1/sessions", json=payload)
    await client.post(f"/api/v1/sessions/{session_id}/complete")

    response = await client.get(f"/api/v1/sessions/{session_id}/metrics")

    assert response.status_code == 200
    assert response.json() == {"status": "processing"}
