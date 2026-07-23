export type AccuracyInput = {
  hitCount: number;
  totalClickCount: number;
};

export function accuracyPercent(input: AccuracyInput): number | null {
  if (input.totalClickCount === 0) {
    return null;
  }

  return Math.round((input.hitCount / input.totalClickCount) * 100);
}
