import { describe, expect, it } from "vitest";

import { createEventCollector } from "./eventCollector";
import { TELEMETRY_CONFIG } from "./telemetryConfig";
import { isTelemetryEvent } from "./telemetryTypes";

function makeHarness() {
  let clock = 1_000;
  let id = 0;
  const collector = createEventCollector({
    now: () => clock,
    createEventId: () => {
      id += 1;
      return `event-${id}`;
    },
  });

  return {
    collector,
    advance: (ms: number) => {
      clock += ms;
    },
    setTime: (ms: number) => {
      clock = ms;
    },
  };
}

const canvas = {
  canvasWidth: 100,
  canvasHeight: 100,
};

describe("createEventCollector", () => {
  it("assigns monotonic sequences starting at 0", () => {
    const { collector } = makeHarness();
    collector.reset("session-1");

    const start = collector.createSessionStart({
      durationSeconds: 60,
      canvasWidth: 100,
      canvasHeight: 100,
      viewportWidth: 1920,
      viewportHeight: 1080,
      devicePixelRatio: 1,
    });
    const click = collector.createClick({
      x: 10,
      y: 20,
      ...canvas,
      targetId: "target-1",
      targetHit: true,
      targetCreatedAt: 900,
    });

    expect(start.sequence).toBe(0);
    expect(click.sequence).toBe(1);
    expect(collector.nextSequence()).toBe(1);
    expect(isTelemetryEvent(start)).toBe(true);
    expect(isTelemetryEvent(click)).toBe(true);
  });

  it("keeps contiguous sequences across start, move, click, and end", () => {
    const { collector, advance } = makeHarness();
    collector.reset("session-1");

    const start = collector.createSessionStart({
      durationSeconds: 30,
      canvasWidth: 100,
      canvasHeight: 100,
      viewportWidth: 1920,
      viewportHeight: 1080,
      devicePixelRatio: 1,
    });
    advance(TELEMETRY_CONFIG.sampleIntervalMs);
    const move = collector.tryCreateMouseMove({ x: 10, y: 10, ...canvas });
    const click = collector.createClick({
      x: 10,
      y: 10,
      ...canvas,
      targetId: "target-1",
      targetHit: true,
      targetCreatedAt: 1_000,
    });
    const end = collector.createSessionEnd({
      score: 1,
      hitCount: 1,
      missCount: 0,
      totalEvents: 4,
    });

    expect(move).not.toBeNull();
    expect([start.sequence, move?.sequence, click.sequence, end.sequence]).toEqual([
      0, 1, 2, 3,
    ]);
    expect(collector.nextSequence()).toBe(3);
  });

  it("samples mousemove within the sample interval", () => {
    const { collector, advance } = makeHarness();
    collector.reset("session-1");

    const first = collector.tryCreateMouseMove({ x: 1, y: 1, ...canvas });
    advance(TELEMETRY_CONFIG.sampleIntervalMs - 1);
    const skipped = collector.tryCreateMouseMove({ x: 2, y: 2, ...canvas });
    advance(1);
    const second = collector.tryCreateMouseMove({ x: 3, y: 3, ...canvas });

    expect(first).not.toBeNull();
    expect(skipped).toBeNull();
    expect(second).not.toBeNull();
    expect(collector.skippedMouseMoveCount()).toBe(1);
    expect(first?.sequence).toBe(0);
    expect(second?.sequence).toBe(1);
  });

  it("never samples away click or session_end inside the sample window", () => {
    const { collector, advance } = makeHarness();
    collector.reset("session-1");

    collector.tryCreateMouseMove({ x: 1, y: 1, ...canvas });
    advance(1);

    const click = collector.createClick({
      x: 5,
      y: 5,
      ...canvas,
      targetId: "target-1",
      targetHit: false,
      targetCreatedAt: 1_000,
    });
    const end = collector.createSessionEnd({
      score: 0,
      hitCount: 0,
      missCount: 1,
      totalEvents: 3,
    });

    expect(click.eventType).toBe("click");
    expect(end.eventType).toBe("session_end");
    expect(isTelemetryEvent(click)).toBe(true);
    expect(isTelemetryEvent(end)).toBe(true);
  });

  it("computes reactionTimeMs from targetCreatedAt", () => {
    const { collector, setTime } = makeHarness();
    collector.reset("session-1");
    setTime(1_328);

    const click = collector.createClick({
      x: 10,
      y: 10,
      ...canvas,
      targetId: "target-18",
      targetHit: true,
      targetCreatedAt: 1_000,
    });

    expect(click.reactionTimeMs).toBe(328);
  });

  it("attaches normalized coordinates in [0, 1]", () => {
    const { collector } = makeHarness();
    collector.reset("session-1");

    const move = collector.tryCreateMouseMove({
      x: 50,
      y: 25,
      canvasWidth: 100,
      canvasHeight: 100,
    });

    expect(move?.normalizedX).toBe(0.5);
    expect(move?.normalizedY).toBe(0.25);
    expect(isTelemetryEvent(move)).toBe(true);
  });
});
