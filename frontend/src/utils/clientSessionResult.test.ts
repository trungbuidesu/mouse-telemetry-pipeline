import { beforeEach, describe, expect, it } from "vitest";

import {
  clearClientSessionResult,
  loadClientSessionResult,
  saveClientSessionResult,
  type ClientSessionResult,
} from "./clientSessionResult";

const sample: ClientSessionResult = {
  sessionId: "session-abc",
  score: 5,
  hitCount: 5,
  missCount: 2,
  totalClickCount: 7,
  accuracyPercent: 71,
  eventCount: 120,
  sentBatchCount: 2,
  droppedEventCount: 0,
  lastBatchEventCount: 50,
  durationSeconds: 30,
  completedAt: 1_700_000_000_000,
};

describe("clientSessionResult", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("round-trips a valid snapshot", () => {
    saveClientSessionResult(sample);
    expect(loadClientSessionResult("session-abc")).toEqual(sample);
  });

  it("returns null for missing or invalid JSON", () => {
    expect(loadClientSessionResult("missing")).toBeNull();
    sessionStorage.setItem("aim-trainer:client-result:bad", "{not-json");
    expect(loadClientSessionResult("bad")).toBeNull();
  });

  it("clears a stored snapshot", () => {
    saveClientSessionResult(sample);
    clearClientSessionResult("session-abc");
    expect(loadClientSessionResult("session-abc")).toBeNull();
  });
});
