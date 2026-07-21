# Decision DEC-012: uv-Managed Python API Environment

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

The ingestion API must be reproducible at the environment level. The user explicitly requested not to rely on the machine's Python. The goal is a reproducible Python environment for API development, not full app/data reproducibility.

---

## 3. Decision

Use uv-managed Python for `ingestion-api`.

API environment defaults:

- `.python-version = 3.12.13`
- `requires-python = ">=3.12,<3.13"`
- committed `uv.lock`
- validation through `uv run`, never direct system `python`

Setup commands:

```text
uv python install 3.12.13
uv python pin 3.12.13
uv sync --all-groups --python 3.12.13
```

---

## 4. Rationale

- uv can install and select a managed Python interpreter.
- Pinning Python avoids accidental drift to system Python or Python 3.13.
- `uv.lock` makes dependency resolution repeatable for the API foundation.
- The API remains isolated from frontend and future Big Data services.

---

## 5. Consequences

### Positive

- API validation commands are reproducible across machines that have uv.
- Python version is explicit in source.
- Future API tasks can add routes without revisiting environment setup.

### Trade-offs

- Contributors need uv installed.
- The environment is reproducible; external services and data are still phase-specific.

---

## 6. Implementation Constraints

- Do not run API validation with direct `python`, `pip` or global pytest.
- Keep `.venv/` ignored.
- Update `.python-version`, `requires-python` and `uv.lock` together if Python version changes.
- Record any Python version change in this decision or a superseding decision.

---

## 7. Linked Documents

- [phase0](../phases/phase0/README.md)
- [phase2](../phases/phase2/README.md)
- [phase2-plan001](../plans/phase2/plan001-fastapi-ingestion-contract.md)
- [coding rules api](../agents/coding_rules_api.md)

