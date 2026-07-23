import { describe, expect, it, vi } from "vitest";

import type { BatchSendResult } from "@/api/telemetryApi";
import { createBatchSender } from "./batchSender";
import type { TelemetryEvent } from "./telemetryTypes";

const sampleEvent: TelemetryEvent = {
  eventId: "e1",
  sessionId: "session-1",
  eventType: "mousemove",
  eventTime: 1,
  sequence: 0,
  x: 1,
  y: 1,
};

describe("createBatchSender", () => {
  it("increments batch sequence and sent count on success", async () => {
    const send = vi.fn().mockResolvedValue({
      ok: true,
      accepted: true,
      batchSequence: 1,
      eventCount: 1,
    } satisfies BatchSendResult);

    const sender = createBatchSender({ send, sleep: async () => undefined });
    await sender.enqueue("session-1", [sampleEvent]);

    expect(sender.batchSequence()).toBe(1);
    expect(sender.sentBatchCount()).toBe(1);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("serializes in-flight batches", async () => {
    const order: string[] = [];
    let releaseFirst: (() => void) | undefined;
    const firstGate = new Promise<void>((resolve) => {
      releaseFirst = resolve;
    });

    const send = vi.fn().mockImplementation(async (batch) => {
      order.push(`start-${batch.batchSequence}`);
      if (batch.batchSequence === 1) {
        await firstGate;
      }
      order.push(`end-${batch.batchSequence}`);
      return { ok: true, accepted: true, batchSequence: batch.batchSequence, eventCount: 1 };
    });

    const sender = createBatchSender({ send, sleep: async () => undefined });
    const first = sender.enqueue("session-1", [sampleEvent]);
    const second = sender.enqueue("session-1", [{ ...sampleEvent, eventId: "e2", sequence: 1 }]);

    expect(sender.isInFlight()).toBe(true);
    releaseFirst?.();
    await Promise.all([first, second]);

    expect(order).toEqual(["start-1", "end-1", "start-2", "end-2"]);
  });

  it("retries retryable failures with backoff then marks offline", async () => {
    const sleeps: number[] = [];
    const statuses: string[] = [];
    let dropped = 0;

    const send = vi.fn().mockResolvedValue({
      ok: false,
      retryable: true,
      status: 503,
    } satisfies BatchSendResult);

    const sender = createBatchSender({
      send,
      maxRetries: 3,
      retryBackoffMs: [500, 1_000, 2_000],
      sleep: async (ms) => {
        sleeps.push(ms);
      },
      onStatus: (status) => {
        statuses.push(status);
      },
      onDropped: (count) => {
        dropped += count;
      },
    });

    await sender.enqueue("session-1", [sampleEvent]);

    expect(send).toHaveBeenCalledTimes(4);
    expect(sleeps).toEqual([500, 1_000, 2_000]);
    expect(dropped).toBe(1);
    expect(statuses).toContain("offline");
    expect(sender.sentBatchCount()).toBe(0);
  });

  it("does not retry non-retryable failures and marks error", async () => {
    const send = vi.fn().mockResolvedValue({
      ok: false,
      retryable: false,
      status: 400,
    } satisfies BatchSendResult);

    const statuses: string[] = [];
    let dropped = 0;
    const sender = createBatchSender({
      send,
      sleep: async () => undefined,
      onStatus: (status) => statuses.push(status),
      onDropped: (count) => {
        dropped += count;
      },
    });

    await sender.enqueue("session-1", [sampleEvent]);

    expect(send).toHaveBeenCalledTimes(1);
    expect(dropped).toBe(1);
    expect(statuses).toContain("error");
  });

  it("tracks lastBatchEventCount on success and clears on reset", async () => {
    const send = vi.fn().mockResolvedValue({
      ok: true,
      accepted: true,
      batchSequence: 1,
      eventCount: 2,
    } satisfies BatchSendResult);

    const sender = createBatchSender({ send, sleep: async () => undefined });
    expect(sender.lastBatchEventCount()).toBe(0);

    await sender.enqueue("session-1", [
      sampleEvent,
      { ...sampleEvent, eventId: "e2", sequence: 1 },
    ]);

    expect(sender.lastBatchEventCount()).toBe(2);

    sender.reset();
    expect(sender.lastBatchEventCount()).toBe(0);
  });
});
