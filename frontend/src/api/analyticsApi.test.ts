import { describe, expect, it, vi } from "vitest";

import { fetchSessionMetrics } from "./analyticsApi";

describe("fetchSessionMetrics", () => {
  it("parses processing status", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: "processing" }),
    });

    const result = await fetchSessionMetrics("session-1", { fetchFn });
    expect(result).toEqual({ status: "processing" });
    expect(fetchFn).toHaveBeenCalledWith(
      "http://127.0.0.1:8001/api/v1/sessions/session-1/metrics",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("parses completed metrics", async () => {
    const body = {
      status: "completed",
      sessionId: "session-1",
      score: 10,
      accuracy: 80,
      totalDistancePx: 1000,
      averageSpeedPxPerSecond: 500,
    };
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => body,
    });

    const result = await fetchSessionMetrics("session-1", { fetchFn });
    expect(result).toEqual(body);
  });

  it("returns error on network failure", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new Error("network down"));
    const result = await fetchSessionMetrics("session-1", { fetchFn });
    expect(result).toEqual({ status: "error", reason: "network down" });
  });

  it("returns error on non-OK HTTP", async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    const result = await fetchSessionMetrics("session-1", { fetchFn });
    expect(result).toEqual({ status: "error", reason: "HTTP 404" });
  });
});
