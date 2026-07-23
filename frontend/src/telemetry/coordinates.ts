export type CanvasPoint = {
  x: number;
  y: number;
};

export type NormalizedPoint = CanvasPoint & {
  normalizedX: number;
  normalizedY: number;
};

export type RectLike = {
  left: number;
  top: number;
};

export function toCanvasPoint(
  clientX: number,
  clientY: number,
  rect: RectLike,
): CanvasPoint {
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function withNormalizedCoordinates(
  point: CanvasPoint,
  canvasWidth: number,
  canvasHeight: number,
): CanvasPoint | NormalizedPoint {
  if (canvasWidth <= 0 || canvasHeight <= 0) {
    return { x: point.x, y: point.y };
  }

  return {
    x: point.x,
    y: point.y,
    normalizedX: clamp01(point.x / canvasWidth),
    normalizedY: clamp01(point.y / canvasHeight),
  };
}

export function hasNormalizedCoordinates(
  point: CanvasPoint | NormalizedPoint,
): point is NormalizedPoint {
  return "normalizedX" in point && "normalizedY" in point;
}
