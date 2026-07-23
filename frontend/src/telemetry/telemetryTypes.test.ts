import { describe, expect, expectTypeOf, it } from "vitest";

import batchEmptyEvents from "../../../contracts/fixtures/invalid/batch_empty_events.json";
import clickMissingSessionId from "../../../contracts/fixtures/invalid/click_missing_session_id.json";
import mousemoveNormalizedOutOfRange from "../../../contracts/fixtures/invalid/mousemove_normalized_out_of_range.json";
import sessionStartBadDuration from "../../../contracts/fixtures/invalid/session_start_bad_duration.json";
import validClick from "../../../contracts/fixtures/valid/click.json";
import validMousemove from "../../../contracts/fixtures/valid/mousemove.json";
import validSessionEnd from "../../../contracts/fixtures/valid/session_end.json";
import validSessionStart from "../../../contracts/fixtures/valid/session_start.json";
import validTelemetryBatch from "../../../contracts/fixtures/valid/telemetry_batch.json";

import {
  isClickEvent,
  isTelemetryBatch,
  isTelemetryEvent,
  type ClickEvent,
  type TelemetryEvent,
} from "./telemetryTypes";

describe("isTelemetryEvent against shared fixtures", () => {
  it("accepts valid session_start, mousemove, click, and session_end", () => {
    expect(isTelemetryEvent(validSessionStart)).toBe(true);
    expect(isTelemetryEvent(validMousemove)).toBe(true);
    expect(isTelemetryEvent(validClick)).toBe(true);
    expect(isTelemetryEvent(validSessionEnd)).toBe(true);
  });

  it("rejects invalid click, mousemove, and session_start fixtures", () => {
    expect(isTelemetryEvent(clickMissingSessionId)).toBe(false);
    expect(isTelemetryEvent(mousemoveNormalizedOutOfRange)).toBe(false);
    expect(isTelemetryEvent(sessionStartBadDuration)).toBe(false);
  });
});

describe("isTelemetryBatch against shared fixtures", () => {
  it("accepts valid/telemetry_batch.json", () => {
    expect(isTelemetryBatch(validTelemetryBatch)).toBe(true);
  });

  it("rejects invalid/batch_empty_events.json", () => {
    expect(isTelemetryBatch(batchEmptyEvents)).toBe(false);
  });
});

describe("TelemetryEvent discriminated union", () => {
  it("narrows click events to expose targetHit", () => {
    expect(isClickEvent(validClick)).toBe(true);
    if (!isClickEvent(validClick)) {
      return;
    }

    expectTypeOf(validClick.targetHit).toEqualTypeOf<boolean>();
    expect(validClick.targetHit).toBe(true);
  });

  it("exposes targetHit after eventType narrowing", () => {
    const event = validClick as TelemetryEvent;

    if (event.eventType === "click") {
      expectTypeOf(event).toMatchTypeOf<ClickEvent>();
      expectTypeOf(event.targetHit).toEqualTypeOf<boolean>();
      expect(event.targetHit).toBe(true);
    } else {
      expect.fail("expected click event");
    }
  });
});
