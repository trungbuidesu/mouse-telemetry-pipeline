from __future__ import annotations

from fastapi import APIRouter

# Empty router: T2.4 adds batch ingestion under /api/v1/events.
router = APIRouter(prefix="/events", tags=["events"])
