import type { Target } from "./types";

export function isHit(clickX: number, clickY: number, target: Target): boolean {
  const dx = clickX - target.x;
  const dy = clickY - target.y;
  return Math.hypot(dx, dy) <= target.radius;
}
