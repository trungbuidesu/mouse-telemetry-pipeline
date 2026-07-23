import { describe, expect, it, vi } from "vitest";

import { classifyBatchHttpStatus, sendTelemetryBatch } from "./telemetryApi";
import type { TelemetryBatch } from "@/telemetry/telemetryTypes";

const sampleBatch: TelemetryBatch = {
  sessionId: "session-1",
  sentAt: 1_000,
  batchSequence: 1,
  events: [
    {
      eventId: "e1",
      sessionId: "session-1",
      eventType: "mousemove",
      eventTime: 1_000,
      sequence: 0,
      x: 1,
      y: 2,
    },
  ],
};

describe("classifyBatchHttpStatus", () => {
  it("marks 429 and 503 as retryable", () => {
    expect(classifyBatchHttpStatus(429).retryable).toBe(true);
    expect(classifyBatchHttpStatus(503).retryable).toBe(true);
  });

  it("marks 400 and 413 as non-retryable", () => {
    expect(classifyBatchHttpStatus(400).retryable).toBe(false);
    expect(classifyBatchHttpStatus(413).retryable).toBe(false);
  });
});

describe("sendTelemetryBatch", () => {
  it("returns ok for 202 Accepted", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      status: 202,
      json: async () => ({ accepted: true, batchSequence: 1, eventCount: 1 }),
    });

    const result = await sendTelemetryBatch(sampleBatch, {
      baseUrl: "http://example.test",
      fetchFn: fetchFn as unknown as typeof fetch,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.eventCount).toBe(1);
    }
    expect(fetchFn).toHaveBeenCalledWith(
      "http://example.test/api/v1/events/batch",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("marks 503 as retryable failure", async () => {
    const fetchFn = vi.fn().mockResolvedValue({ status: 503, json: async () => ({}) });
    const result = await sendTelemetryBatch(sampleBatch, {
      baseUrl: "http://example.test",
      fetchFn: fetchFn as unknown as typeof fetch,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.retryable).toBe(true);
      expect(result.status).toBe(503);
    }
  });

  it("marks 400 as non-retryable failure", async () => {
    const fetchFn = vi.fn().mockResolvedValue({ status: 400, json: async () => ({}) });
    const result = await sendTelemetryBatch(sampleBatch, {
      baseUrl: "http://example.test",
      fetchFn: fetchFn as unknown as typeof fetch,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.retryable).toBe(false);
      expect(result.status).toBe(400);
    }
  });

  it("marks network errors as retryable", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    const result = await sendTelemetryBatch(sampleBatch, {
      baseUrl: "http://example.test",
      fetchFn: fetchFn as unknown as typeof fetch,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.retryable).toBe(true);
    }
  });
});
