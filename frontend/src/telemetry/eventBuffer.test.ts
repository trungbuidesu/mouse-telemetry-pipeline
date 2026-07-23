import { describe, expect, it } from "vitest";

import { createEventBuffer } from "./eventBuffer";
import type { TelemetryEvent } from "./telemetryTypes";

function mouseMove(sequence: number): TelemetryEvent {
  return {
    eventId: `move-${sequence}`,
    sessionId: "session-1",
    eventType: "mousemove",
    eventTime: sequence,
    sequence,
    x: 1,
    y: 1,
  };
}

function click(sequence: number): TelemetryEvent {
  return {
    eventId: `click-${sequence}`,
    sessionId: "session-1",
    eventType: "click",
    eventTime: sequence,
    sequence,
    x: 1,
    y: 1,
    targetId: "t1",
    targetHit: true,
    reactionTimeMs: 10,
  };
}

function sessionEnd(sequence: number): TelemetryEvent {
  return {
    eventId: `end-${sequence}`,
    sessionId: "session-1",
    eventType: "session_end",
    eventTime: sequence,
    sequence,
    score: 1,
    hitCount: 1,
    missCount: 0,
    totalEvents: sequence + 1,
  };
}

describe("createEventBuffer", () => {
  it("appends events and reports size", () => {
    const buffer = createEventBuffer({ maxBufferedEvents: 10, batchSize: 3 });
    buffer.append(mouseMove(0));
    buffer.append(click(1));
    expect(buffer.size()).toBe(2);
  });

  it("takeBatch returns null until batchSize is reached", () => {
    const buffer = createEventBuffer({ maxBufferedEvents: 10, batchSize: 3 });
    buffer.append(mouseMove(0));
    buffer.append(mouseMove(1));
    expect(buffer.takeBatch()).toBeNull();

    buffer.append(mouseMove(2));
    const batch = buffer.takeBatch();
    expect(batch).toHaveLength(3);
    expect(buffer.size()).toBe(0);
  });

  it("leaves remainder below batchSize for the next takeBatch", () => {
    const buffer = createEventBuffer({ maxBufferedEvents: 10, batchSize: 3 });
    for (let i = 0; i < 5; i += 1) {
      buffer.append(mouseMove(i));
    }

    expect(buffer.takeBatch()).toHaveLength(3);
    expect(buffer.size()).toBe(2);
    expect(buffer.takeBatch()).toBeNull();

    buffer.append(mouseMove(5));
    const second = buffer.takeBatch();
    expect(second?.map((event) => event.sequence)).toEqual([3, 4, 5]);
  });

  it("takeBatch preserves append order by sequence", () => {
    const buffer = createEventBuffer({ maxBufferedEvents: 10, batchSize: 3 });
    buffer.append(mouseMove(0));
    buffer.append(click(1));
    buffer.append(mouseMove(2));

    expect(buffer.takeBatch()?.map((event) => event.sequence)).toEqual([0, 1, 2]);
  });

  it("drainUpTo takes at most n events when any are present", () => {
    const buffer = createEventBuffer({ maxBufferedEvents: 10, batchSize: 100 });
    buffer.append(mouseMove(0));
    buffer.append(mouseMove(1));
    buffer.append(mouseMove(2));

    expect(buffer.drainUpTo(2)).toHaveLength(2);
    expect(buffer.size()).toBe(1);
  });

  it("drops oldest mousemove first on overflow and keeps session_end", () => {
    const buffer = createEventBuffer({ maxBufferedEvents: 3, batchSize: 100 });
    buffer.append(mouseMove(0));
    buffer.append(click(1));
    buffer.append(sessionEnd(2));
    const result = buffer.append(mouseMove(3));

    expect(result.dropped).toBe(1);
    expect(buffer.droppedEventCount()).toBe(1);
    expect(buffer.peek().map((event) => event.eventType)).toEqual([
      "click",
      "session_end",
      "mousemove",
    ]);
  });

  it("takeAll drains remaining events for finishing flush", () => {
    const buffer = createEventBuffer({ maxBufferedEvents: 10, batchSize: 100 });
    buffer.append(mouseMove(0));
    buffer.append(click(1));
    expect(buffer.takeAll()).toHaveLength(2);
    expect(buffer.size()).toBe(0);
  });
});
