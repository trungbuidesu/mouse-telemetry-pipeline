# Decision DEC-001: Canvas-Relative Telemetry Schema

## 1. Status

`DECIDED`

Date: `2026-07-22`

---

## 2. Context

Aim Trainer là nguồn sinh dữ liệu cho pipeline. Nếu chỉ lưu tọa độ chuột theo viewport hoặc màn hình, dữ liệu sẽ khó so sánh giữa session có kích thước canvas, viewport và device pixel ratio khác nhau.

Telemetry cũng phải đi qua nhiều lớp: frontend, FastAPI, Kafka, Spark, MinIO, InfluxDB và dashboard. Vì vậy schema phải ổn định, đơn giản và dễ parse.

---

## 3. Decision

Mọi event input từ game phải dùng tọa độ tương đối theo canvas:

- `x`: vị trí theo pixel trong canvas.
- `y`: vị trí theo pixel trong canvas.
- `normalizedX`: optional, `x / canvasWidth`.
- `normalizedY`: optional, `y / canvasHeight`.

Mọi telemetry event MVP phải có:

- `eventId`
- `sessionId`
- `eventType`
- `eventTime`
- `sequence`

Event click bổ sung:

- `targetId`
- `targetHit`
- `reactionTimeMs`

Session start bổ sung:

- `durationSeconds`
- `canvasWidth`
- `canvasHeight`
- `viewportWidth`
- `viewportHeight`
- `devicePixelRatio`

Session end bổ sung:

- `score`
- `hitCount`
- `missCount`
- `totalEvents`

---

## 4. Rationale

- Canvas-relative coordinates match game semantics.
- Normalized coordinates support cross-device comparison.
- Required identity fields make deduplication and ordering possible.
- A discriminated `eventType` keeps one telemetry stream simple for Kafka and Spark.

---

## 5. Consequences

### Positive

- Frontend and Spark can agree on coordinate meaning.
- Heatmap and trajectory analytics are easier to build.
- Data remains useful even when viewport sizes differ.

### Trade-offs

- Frontend must compute canvas bounds correctly.
- If canvas resizes during a session, the event stream must preserve enough context to interpret points.

---

## 6. Implementation Constraints

- Coordinate conversion belongs near the canvas/input boundary.
- API must reject coordinates outside canvas bounds unless a documented edge case exists.
- Spark schema must keep `eventTime` as event time, not ingestion time.
- Any schema change that renames required fields must update this decision or supersede it.

---

## 7. Linked Documents

- [phase0](../phases/phase0/README.md)
- [phase1](../phases/phase1/README.md)
- [phase2](../phases/phase2/README.md)
- [phase3](../phases/phase3/README.md)
- [phase0-plan002](../plans/phase0/plan002-contract-first-schema-and-api.md)
- [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)

