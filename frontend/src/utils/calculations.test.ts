import { describe, expect, it } from "vitest";

import { accuracyPercent } from "./calculations";

describe("accuracyPercent", () => {
  it("returns null when totalClickCount is zero", () => {
    expect(accuracyPercent({ hitCount: 0, totalClickCount: 0 })).toBeNull();
  });

  it("rounds hit ratio to a percentage", () => {
    expect(accuracyPercent({ hitCount: 2, totalClickCount: 3 })).toBe(67);
    expect(accuracyPercent({ hitCount: 4, totalClickCount: 4 })).toBe(100);
  });
});
