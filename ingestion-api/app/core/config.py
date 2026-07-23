from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Cấu hình runtime tối thiểu cho API ở phase foundation."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="MOUSE_TELEMETRY_",
        extra="ignore",
    )

    app_name: str = "Mouse Telemetry Ingestion API"
    environment: str = "local"
    allowed_origins: tuple[str, ...] = Field(
        default=("http://localhost:5173", "http://127.0.0.1:5173")
    )
    # Typed for T2.5 producer wiring; unused on the request path in T2.1.
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_topic: str = "mouse.telemetry.events.v1"


@lru_cache
def get_settings() -> Settings:
    """Cache settings để request path không đọc lại môi trường nhiều lần."""

    return Settings()

