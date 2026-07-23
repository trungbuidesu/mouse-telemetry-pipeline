import { describe, expect, it } from "vitest";

import {
  beginFinishing,
  complete,
  createInitialSession,
  enterRunning,
  reset,
  setDurationSeconds,
  startCountdown,
} from "./gameEngine";

describe("gameEngine lifecycle", () => {
  it("starts in idle with default duration and no sessionId", () => {
    const state = createInitialSession();

    expect(state.status).toBe("idle");
    expect(state.durationSeconds).toBe(60);
    expect(state.sessionId).toBeNull();
  });

  it("allows duration changes only while idle or completed", () => {
    const idle = createInitialSession();
    expect(setDurationSeconds(idle, 30).durationSeconds).toBe(30);

    const countdown = startCountdown(idle, () => "session-1");
    expect(setDurationSeconds(countdown, 30)).toEqual(countdown);

    const completed = complete(beginFinishing(enterRunning(countdown)));
    expect(setDurationSeconds(completed, 30).durationSeconds).toBe(30);
  });

  it("transitions idle -> countdown with a new sessionId", () => {
    const next = startCountdown(createInitialSession(), () => "session-abc");

    expect(next.status).toBe("countdown");
    expect(next.sessionId).toBe("session-abc");
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
