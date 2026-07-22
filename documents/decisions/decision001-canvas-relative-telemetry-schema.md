# Decision DEC-001: Telemetry schema theo canvas

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Aim Trainer là nguồn sinh dữ liệu cho pipeline. Nếu chỉ lưu tọa độ chuột theo viewport hoặc màn hình, dữ liệu sẽ khó so sánh giữa các session có kích thước canvas, viewport và device pixel ratio khác nhau.

Telemetry cũng phải đi qua nhiều lớp: frontend, FastAPI, Kafka, Spark, MinIO, InfluxDB và dashboard. Vì vậy schema phải ổn định, đơn giản và dễ parse.

---

## 3. Quyết định

Mọi input event từ game phải dùng tọa độ tương đối theo canvas:

* `x`: vị trí theo pixel trong canvas.
* `y`: vị trí theo pixel trong canvas.
* `normalizedX`: optional, `x / canvasWidth`.
* `normalizedY`: optional, `y / canvasHeight`.

Mọi telemetry event MVP phải có:

* `eventId`
* `sessionId`
* `eventType`
* `eventTime`
* `sequence`

Click event bổ sung:

* `targetId`
* `targetHit`
* `reactionTimeMs`

Session start bổ sung:

* `durationSeconds`
* `canvasWidth`
* `canvasHeight`
* `viewportWidth`
* `viewportHeight`
* `devicePixelRatio`

Session end bổ sung:

* `score`
* `hitCount`
* `missCount`
* `totalEvents`

---

## 4. Lý do

* Canvas-relative coordinates khớp với ngữ nghĩa của game.
* Normalized coordinates hỗ trợ so sánh giữa nhiều device.
* Các field định danh bắt buộc giúp deduplication và ordering.
* `eventType` dạng discriminated union giúp Kafka và Spark dùng một telemetry stream đơn giản.

---

## 5. Hệ quả

### Tích cực

* Frontend và Spark có cùng cách hiểu về tọa độ.
* Heatmap và trajectory analytics dễ xây dựng hơn.
* Dữ liệu vẫn hữu ích khi viewport size khác nhau.

### Đánh đổi

* Frontend phải tính canvas bounds chính xác.
* Nếu canvas resize trong một session, event stream phải giữ đủ context để diễn giải các điểm đã ghi.

---

## 6. Ràng buộc triển khai

* Coordinate conversion nằm gần boundary canvas/input.
* API phải reject tọa độ nằm ngoài canvas bounds, trừ khi có edge case được document rõ.
* Spark schema phải giữ `eventTime` là event time, không phải ingestion time.
* Mọi schema change đổi tên required field phải cập nhật decision này hoặc tạo decision thay thế.

---

## 7. Tài liệu liên quan

* [phase0](../phases/phase0/README.md)
* [phase1](../phases/phase1/README.md)
* [phase2](../phases/phase2/README.md)
* [phase3](../phases/phase3/README.md)
* [phase0-plan002](../plans/phase0/plan002-contract-first-schema-and-api.md)
* [phase1-plan002](../plans/phase1/plan002-telemetry-collector-buffer-sender.md)
