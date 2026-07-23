from __future__ import annotations

import pytest

from app.core.config import Settings


def test_settings_kafka_defaults_match_dec005() -> None:
    settings = Settings()

    assert settings.kafka_bootstrap_servers == "localhost:9092"
    assert settings.kafka_topic == "mouse.telemetry.events.v1"


def test_settings_kafka_fields_accept_env_override(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("MOUSE_TELEMETRY_KAFKA_BOOTSTRAP_SERVERS", "kafka:29092")
    monkeypatch.setenv("MOUSE_TELEMETRY_KAFKA_TOPIC", "mouse.telemetry.events.test")

    settings = Settings()

    assert settings.kafka_bootstrap_servers == "kafka:29092"
    assert settings.kafka_topic == "mouse.telemetry.events.test"
