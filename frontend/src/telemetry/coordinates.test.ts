import { describe, expect, it } from "vitest";

import {
  hasNormalizedCoordinates,
  toCanvasPoint,
  withNormalizedCoordinates,
} from "./coordinates";

describe("toCanvasPoint", () => {
  it("converts client coordinates to canvas-relative space", () => {
    expect(toCanvasPoint(150, 80, { left: 50, top: 20 })).toEqual({ x: 100, y: 60 });
  });
});

describe("withNormalizedCoordinates", () => {
  it("normalizes a mid-canvas point", () => {
    const result = withNormalizedCoordinates({ x: 600, y: 350 }, 1200, 700);

    expect(hasNormalizedCoordinates(result)).toBe(true);
    if (!hasNormalizedCoordinates(result)) {
      return;
    }

    expect(result.normalizedX).toBeCloseTo(0.5);
    expect(result.normalizedY).toBeCloseTo(0.5);
  });

  it("normalizes edge points to 0 and 1", () => {
    const origin = withNormalizedCoordinates({ x: 0, y: 0 }, 100, 50);
    const corner = withNormalizedCoordinates({ x: 100, y: 50 }, 100, 50);

    expect(hasNormalizedCoordinates(origin)).toBe(true);
    expect(hasNormalizedCoordinates(corner)).toBe(true);
    if (!hasNormalizedCoordinates(origin) || !hasNormalizedCoordinates(corner)) {
      return;
    }

    expect(origin.normalizedX).toBe(0);
    expect(origin.normalizedY).toBe(0);
    expect(corner.normalizedX).toBe(1);
    expect(corner.normalizedY).toBe(1);
  });

  it("clamps out-of-range coordinates into [0, 1]", () => {
    const result = withNormalizedCoordinates({ x: -10, y: 200 }, 100, 100);

    expect(hasNormalizedCoordinates(result)).toBe(true);
    if (!hasNormalizedCoordinates(result)) {
      return;
    }

    expect(result.normalizedX).toBe(0);
    expect(result.normalizedY).toBe(1);
  });

  it("omits normalized fields when canvas size is invalid", () => {
    const result = withNormalizedCoordinates({ x: 10, y: 20 }, 0, 100);

    expect(result).toEqual({ x: 10, y: 20 });
    expect(hasNormalizedCoordinates(result)).toBe(false);
  });
});
