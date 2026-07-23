from __future__ import annotations

from fastapi import APIRouter

# Empty router: T2.3 adds session lifecycle handlers under /api/v1/sessions.
router = APIRouter(prefix="/sessions", tags=["sessions"])
