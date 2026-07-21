from __future__ import annotations

from app import __version__
from app.main import create_app


def test_package_imports() -> None:
    assert __version__ == "0.1.0"


def test_create_app_uses_project_metadata() -> None:
    app = create_app()

    assert app.title == "Mouse Telemetry Ingestion API"
    assert app.version == __version__

