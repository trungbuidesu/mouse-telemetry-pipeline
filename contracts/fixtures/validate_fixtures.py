#!/usr/bin/env python3
"""Minimal fixture checker against local telemetry JSON Schema files.

Uses only the Python standard library. Supports the subset of Draft 2020-12
features used by contracts/telemetry/*.schema.json (required, type, const,
enum, minimum/maximum/exclusiveMinimum, minLength, minItems/maxItems,
additionalProperties, oneOf with local $ref files).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
SCHEMA_DIR = ROOT / "contracts" / "telemetry"
FIXTURE_DIR = Path(__file__).resolve().parent

VALID_CASES = [
    ("valid/session_start.json", "session_start.schema.json", True),
    ("valid/mousemove.json", "mousemove.schema.json", True),
    ("valid/click.json", "click.schema.json", True),
    ("valid/session_end.json", "session_end.schema.json", True),
    ("valid/telemetry_batch.json", "telemetry_batch.schema.json", True),
    ("invalid/mousemove_normalized_out_of_range.json", "mousemove.schema.json", False),
    ("invalid/click_missing_session_id.json", "click.schema.json", False),
    ("invalid/batch_empty_events.json", "telemetry_batch.schema.json", False),
    ("invalid/session_start_bad_duration.json", "session_start.schema.json", False),
]


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def resolve_ref(ref: str, schema_path: Path) -> dict[str, Any]:
    if ref.startswith("#"):
        raise ValueError(f"Unsupported internal ref: {ref}")
    target = (schema_path.parent / ref).resolve()
    return load_json(target)


def validate(instance: Any, schema: dict[str, Any], schema_path: Path) -> list[str]:
    errors: list[str] = []

    if "oneOf" in schema:
        matched = 0
        nested_errors: list[str] = []
        for option in schema["oneOf"]:
            option_schema = option
            if "$ref" in option:
                option_schema = resolve_ref(option["$ref"], schema_path)
            option_errors = validate(instance, option_schema, schema_path)
            if not option_errors:
                matched += 1
            else:
                nested_errors.extend(option_errors)
        if matched != 1:
            errors.append(f"oneOf matched {matched} options")
            errors.extend(nested_errors[:3])
        return errors

    expected_type = schema.get("type")
    if expected_type == "object":
        if not isinstance(instance, dict):
            return [f"expected object, got {type(instance).__name__}"]
        for key in schema.get("required", []):
            if key not in instance:
                errors.append(f"missing required property: {key}")
        properties = schema.get("properties", {})
        if schema.get("additionalProperties") is False:
            for key in instance:
                if key not in properties:
                    errors.append(f"unexpected property: {key}")
        for key, value in instance.items():
            if key in properties:
                errors.extend(
                    [f"{key}: {msg}" for msg in validate(value, properties[key], schema_path)]
                )
        return errors

    if expected_type == "array":
        if not isinstance(instance, list):
            return [f"expected array, got {type(instance).__name__}"]
        min_items = schema.get("minItems")
        max_items = schema.get("maxItems")
        if min_items is not None and len(instance) < min_items:
            errors.append(f"minItems {min_items}, got {len(instance)}")
        if max_items is not None and len(instance) > max_items:
            errors.append(f"maxItems {max_items}, got {len(instance)}")
        item_schema = schema.get("items")
        if item_schema is not None:
            for index, item in enumerate(instance):
                errors.extend(
                    [f"[{index}]: {msg}" for msg in validate(item, item_schema, schema_path)]
                )
        return errors

    if expected_type == "string":
        if not isinstance(instance, str):
            return [f"expected string, got {type(instance).__name__}"]
        min_length = schema.get("minLength")
        if min_length is not None and len(instance) < min_length:
            errors.append(f"minLength {min_length}")
    elif expected_type == "integer":
        if type(instance) is not int:
            return [f"expected integer, got {type(instance).__name__}"]
    elif expected_type == "number":
        if not isinstance(instance, (int, float)) or isinstance(instance, bool):
            return [f"expected number, got {type(instance).__name__}"]
    elif expected_type == "boolean":
        if not isinstance(instance, bool):
            return [f"expected boolean, got {type(instance).__name__}"]

    if "const" in schema and instance != schema["const"]:
        errors.append(f"const {schema['const']!r}, got {instance!r}")
    if "enum" in schema and instance not in schema["enum"]:
        errors.append(f"enum {schema['enum']!r}, got {instance!r}")
    if "minimum" in schema and isinstance(instance, (int, float)) and instance < schema["minimum"]:
        errors.append(f"minimum {schema['minimum']}")
    if "maximum" in schema and isinstance(instance, (int, float)) and instance > schema["maximum"]:
        errors.append(f"maximum {schema['maximum']}")
    if (
        "exclusiveMinimum" in schema
        and isinstance(instance, (int, float))
        and instance <= schema["exclusiveMinimum"]
    ):
        errors.append(f"exclusiveMinimum {schema['exclusiveMinimum']}")

    return errors


def main() -> int:
    failures = 0
    for relative, schema_name, should_pass in VALID_CASES:
        fixture_path = FIXTURE_DIR / relative
        schema_path = SCHEMA_DIR / schema_name
        instance = load_json(fixture_path)
        schema = load_json(schema_path)
        errors = validate(instance, schema, schema_path)
        passed = len(errors) == 0
        ok = passed if should_pass else not passed
        status = "PASS" if ok else "FAIL"
        expectation = "valid" if should_pass else "invalid"
        print(f"[{status}] {relative} (expect {expectation})")
        if not ok:
            failures += 1
            for error in errors[:5]:
                print(f"  - {error}")
            if should_pass is False and passed:
                print("  - expected validation errors but fixture passed")
    if failures:
        print(f"\n{failures} case(s) failed")
        return 1
    print("\nAll fixture cases matched expectations")
    return 0


if __name__ == "__main__":
    sys.exit(main())
