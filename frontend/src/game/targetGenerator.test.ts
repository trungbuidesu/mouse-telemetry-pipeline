import { describe, expect, it } from "vitest";

import { TARGET_RADIUS, createTarget } from "./targetGenerator";

describe("createTarget", () => {
  it("places the full circle inside the canvas bounds", () => {
    const target = createTarget({
      width: 400,
      height: 300,
      radius: TARGET_RADIUS,
      now: 1_000,
      random: () => 0,
      createId: () => "target-1",
    });

    expect(target.id).toBe("target-1");
    expect(target.radius).toBe(TARGET_RADIUS);
    expect(target.createdAt).toBe(1_000);
    expect(target.x).toBe(TARGET_RADIUS);
    expect(target.y).toBe(TARGET_RADIUS);
    expect(target.x - target.radius).toBeGreaterThanOrEqual(0);
    expect(target.y - target.radius).toBeGreaterThanOrEqual(0);
    expect(target.x + target.radius).toBeLessThanOrEqual(400);
    expect(target.y + target.radius).toBeLessThanOrEqual(300);
  });

  it("uses the upper bound when random returns 1", () => {
    const target = createTarget({
      width: 400,
      height: 300,
      radius: TARGET_RADIUS,
      now: 2_000,
      random: () => 1,
      createId: () => "target-2",
    });

    expect(target.x).toBe(400 - TARGET_RADIUS);
    expect(target.y).toBe(300 - TARGET_RADIUS);
  });

  it("throws when the canvas is smaller than two radii", () => {
    expect(() =>
      createTarget({
        width: 40,
        height: 300,
        radius: TARGET_RADIUS,
        now: 0,
        random: () => 0.5,
        createId: () => "too-small",
      }),
    ).toThrow(/canvas too small/i);
  });
});
