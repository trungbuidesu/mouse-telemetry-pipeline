import type { Target } from "./types";

export const TARGET_RADIUS = 24;

export type CreateTargetOptions = {
  width: number;
  height: number;
  radius: number;
  now: number;
  random: () => number;
  createId: () => string;
};

export function createTarget(options: CreateTargetOptions): Target {
  const { width, height, radius, now, random, createId } = options;
  const minX = radius;
  const maxX = width - radius;
  const minY = radius;
  const maxY = height - radius;

  if (maxX < minX || maxY < minY) {
    throw new Error("canvas too small for target radius");
  }

  const x = minX + random() * (maxX - minX);
  const y = minY + random() * (maxY - minY);

  return {
    id: createId(),
    x,
    y,
    radius,
    createdAt: now,
  };
}
