# Decision DEC-005: Kafka topic layout và event keys

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Kafka cần vận chuyển telemetry từ FastAPI sang Spark. Pipeline cần ordering theo từng session để phân tích trajectory, speed và session completion. MVP nên giữ topic layout đủ đơn giản cho local demo.

---

## 3. Quyết định

Dùng một telemetry topic chính cho MVP:

```text
mouse.telemetry.events.v1
```

Dùng message key:

```text
sessionId
```

Message value là JSON event payload tương thích với DEC-001. Payload giữ `eventType`, nhờ đó Spark có thể rẽ nhánh logic mà không cần tách topic theo từng event type.

Optional dead-letter topic:

```text
mouse.telemetry.deadletter.v1
```

---

## 4. Lý do

* Key theo `sessionId` giúp event của cùng một session vào cùng partition, giữ relative order.
* Một telemetry topic giúp local setup và Spark consumption đơn giản.
* Để event type trong payload tránh việc tạo quá nhiều topic trong MVP.
* Suffix version cho phép thay đổi topic/schema không tương thích trong tương lai.

---

## 5. Hệ quả

### Tích cực

* Producer configuration đơn giản.
* Spark có thể đọc một stream cho mọi event type.
* Per-session analytics dễ hơn vì event liên quan được key cùng nhau.

### Đánh đổi

* Một session quá nóng có thể tập trung load vào một partition; chấp nhận được cho MVP.
* Consumer phải filter theo `eventType` bên trong payload.

---

## 6. Ràng buộc triển khai

* FastAPI producer phải set Kafka key là `sessionId`.
* Spark không được giả định có global ordering giữa các session.
* Topic creation phải được script hóa để local setup tái lập được.
* Mọi đổi tên topic phải cập nhật phase2 và phase3 plans.

---

## 7. Tài liệu liên quan

* [phase2](../phases/phase2/README.md)
* [phase3](../phases/phase3/README.md)
* [phase2-plan001](../plans/phase2/plan001-fastapi-ingestion-contract.md)
* [phase3-plan001](../plans/phase3/plan001-kafka-topics-and-local-infrastructure.md)
* [phase3-plan002](../plans/phase3/plan002-spark-streaming-to-minio-influxdb.md)
