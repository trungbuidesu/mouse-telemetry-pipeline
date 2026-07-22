# Decision DEC-010: Docker Compose stack ưu tiên local

## 1. Trạng thái

`DECIDED`

Ngày: `2026-07-22`

---

## 2. Bối cảnh

Project là Big Data demo cho đồ án. Hệ thống cần chạy và inspect được trên máy development local, không phụ thuộc cloud infrastructure.

---

## 3. Quyết định

Dùng Docker Compose stack theo hướng local-first cho các pipeline services:

* FastAPI ingestion API khi containerize.
* Kafka.
* Spark runtime hoặc Spark-compatible local execution.
* MinIO.
* InfluxDB.
* Grafana.

Frontend có thể chạy bằng Vite dev server trong development và containerize sau nếu hữu ích cho demo.

---

## 4. Lý do

* Local Compose tái lập được và dễ demo.
* Các service có thể start, stop và reset cùng nhau.
* Bám kiến trúc mà không kéo thêm độ phức tạp cloud deployment.
* Giữ trọng tâm vào data flow và performance thay vì infrastructure provisioning.

---

## 5. Hệ quả

### Tích cực

* Demo có thể chạy offline sau khi đã có dependencies/images.
* Runbook có thể rất cụ thể.
* Runtime volumes có thể reset cho các lần demo lặp lại.

### Đánh đổi

* Tài nguyên laptop local giới hạn throughput.
* Compose setup không phải production deployment model.

---

## 6. Ràng buộc triển khai

* `.env.example` phải có các biến local cần thiết nhưng không chứa secrets.
* Runtime data directories và Docker volumes không được commit.
* Ports phải được document.
* Reset commands phải rõ ràng và tránh ambiguity có thể gây xóa nhầm.
* Health checks nên được thêm khi thực tế.

---

## 7. Tài liệu liên quan

* [phase0](../phases/phase0/README.md)
* [phase3](../phases/phase3/README.md)
* [phase5](../phases/phase5/README.md)
* [phase0-plan001](../plans/phase0/plan001-repository-and-doc-governance.md)
* [phase3-plan001](../plans/phase3/plan001-kafka-topics-and-local-infrastructure.md)
* [phase5-plan002](../plans/phase5/plan002-packaging-runbooks-and-final-report.md)
