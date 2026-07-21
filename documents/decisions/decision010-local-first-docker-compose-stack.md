# Decision DEC-010: Local-First Docker Compose Stack

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

The project is a student Big Data demo. The system needs to be runnable and inspectable on a local development machine without requiring cloud infrastructure.

---

## 3. Decision

Use a local-first Docker Compose stack for the pipeline services:

- FastAPI ingestion API when containerized.
- Kafka.
- Spark runtime or Spark-compatible local execution.
- MinIO.
- InfluxDB.
- Grafana.

Frontend may run via Vite development server during development and can be containerized later if useful for demo.

---

## 4. Rationale

- Local Compose is repeatable and easy to demonstrate.
- Services can be started, stopped and reset together.
- It matches the architecture without introducing cloud deployment complexity.
- It keeps focus on data flow and performance rather than infrastructure provisioning.

---

## 5. Consequences

### Positive

- Demo can run offline after dependencies/images are available.
- Runbook can be concrete.
- Runtime volumes can be reset for repeated demos.

### Trade-offs

- Local laptop resources limit throughput.
- Compose setup is not a production deployment model.

---

## 6. Implementation Constraints

- `.env.example` must include required local variables without secrets.
- Runtime data directories and Docker volumes must not be committed.
- Ports should be documented.
- Reset commands must be explicit and avoid destructive ambiguity.
- Health checks should be added where practical.

---

## 7. Linked Documents

- [phase0](../phases/phase0/README.md)
- [phase3](../phases/phase3/README.md)
- [phase5](../phases/phase5/README.md)
- [phase0-plan001](../plans/phase0/plan001-repository-and-doc-governance.md)
- [phase3-plan001](../plans/phase3/plan001-kafka-topics-and-local-infrastructure.md)
- [phase5-plan002](../plans/phase5/plan002-packaging-runbooks-and-final-report.md)

