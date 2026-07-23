import { describe, expect, it } from "vitest";

import { isHit } from "./hitDetection";
import type { Target } from "./types";

const target: Target = {
  id: "t1",
  x: 100,
  y: 100,
  radius: 24,
  createdAt: 0,
};

describe("isHit", () => {
  it("returns true for a click at the target center", () => {
    expect(isHit(100, 100, target)).toBe(true);
  });

  it("returns true for a click exactly on the edge", () => {
    expect(isHit(124, 100, target)).toBe(true);
  });

  it("returns false for a click outside the radius", () => {
    expect(isHit(125, 100, target)).toBe(false);
  });
});
