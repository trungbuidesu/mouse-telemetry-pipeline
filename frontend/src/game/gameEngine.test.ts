import { describe, expect, it } from "vitest";

import {
  accuracyPercent,
  applyTarget,
  beginFinishing,
  complete,
  createInitialSession,
  enterRunning,
  registerClick,
  reset,
  setDurationSeconds,
  startCountdown,
} from "./gameEngine";
import type { Target } from "./types";

const sampleTarget: Target = {
  id: "target-1",
  x: 50,
  y: 50,
  radius: 24,
  createdAt: 1,
};

describe("gameEngine lifecycle", () => {
  it("starts in idle with default duration and no sessionId", () => {
    const state = createInitialSession();

    expect(state.status).toBe("idle");
    expect(state.durationSeconds).toBe(60);
    expect(state.sessionId).toBeNull();
    expect(state.currentTarget).toBeNull();
    expect(state.score).toBe(0);
    expect(state.totalClickCount).toBe(0);
  });

  it("allows duration changes only while idle or completed", () => {
    const idle = createInitialSession();
    expect(setDurationSeconds(idle, 30).durationSeconds).toBe(30);

    const countdown = startCountdown(idle, () => "session-1");
    expect(setDurationSeconds(countdown, 30)).toEqual(countdown);

    const completed = complete(beginFinishing(enterRunning(countdown)));
    expect(setDurationSeconds(completed, 30).durationSeconds).toBe(30);
  });

  it("transitions idle -> countdown with a new sessionId and cleared score", () => {
    const scored = {
      ...createInitialSession(),
      hitCount: 2,
      missCount: 1,
      totalClickCount: 3,
      score: 2,
      currentTarget: sampleTarget,
    };
    const next = startCountdown(scored, () => "session-abc");

    expect(next.status).toBe("countdown");
    expect(next.sessionId).toBe("session-abc");
    expect(next.score).toBe(0);
    expect(next.totalClickCount).toBe(0);
    expect(next.currentTarget).toBeNull();
  });

  it("rejects startCountdown unless idle or completed", () => {
    const running = enterRunning(
      startCountdown(createInitialSession(), () => "session-1"),
    );

    expect(startCountdown(running, () => "session-2")).toEqual(running);
  });

  it("transitions countdown -> running -> finishing -> completed -> idle", () => {
    const countdown = startCountdown(createInitialSession(), () => "session-1");
    const running = enterRunning(countdown);
    const finishing = beginFinishing(running);
    const completed = complete(finishing);
    const idle = reset(completed);

    expect(running.status).toBe("running");
    expect(finishing.status).toBe("finishing");
    expect(finishing.currentTarget).toBeNull();
    expect(completed.status).toBe("completed");
    expect(idle.status).toBe("idle");
    expect(idle.sessionId).toBeNull();
  });

  it("supports play-again from completed into countdown", () => {
    const completed = complete(
      beginFinishing(
        enterRunning(startCountdown(createInitialSession(), () => "session-1")),
      ),
    );
    const again = startCountdown(completed, () => "session-2");

    expect(again.status).toBe("countdown");
    expect(again.sessionId).toBe("session-2");
  });
});

describe("gameEngine scoring", () => {
  it("registers hit and miss only while running", () => {
    const running = applyTarget(
      enterRunning(startCountdown(createInitialSession(), () => "session-1")),
      sampleTarget,
    );

    const afterHit = registerClick(running, true);
    expect(afterHit.hitCount).toBe(1);
    expect(afterHit.missCount).toBe(0);
    expect(afterHit.totalClickCount).toBe(1);
    expect(afterHit.score).toBe(1);

    const afterMiss = registerClick(afterHit, false);
    expect(afterMiss.hitCount).toBe(1);
    expect(afterMiss.missCount).toBe(1);
    expect(afterMiss.totalClickCount).toBe(2);
    expect(afterMiss.score).toBe(1);

    const idle = createInitialSession();
    expect(registerClick(idle, true)).toEqual(idle);
  });

  it("computes accuracy percent from hit and total clicks", () => {
    expect(accuracyPercent({ hitCount: 0, missCount: 0, totalClickCount: 0, score: 0 })).toBeNull();
    expect(
      accuracyPercent({ hitCount: 2, missCount: 1, totalClickCount: 3, score: 2 }),
    ).toBe(67);
  });
});
