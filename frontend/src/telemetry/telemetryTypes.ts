export type TelemetryEventType =
  | "session_start"
  | "mousemove"
  | "click"
  | "session_end";

export type TelemetryBaseEvent = {
  eventId: string;
  sessionId: string;
  eventType: TelemetryEventType;
  eventTime: number;
  sequence: number;
};

export type SessionStartEvent = TelemetryBaseEvent & {
  eventType: "session_start";
  durationSeconds: 30 | 60;
  canvasWidth: number;
  canvasHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
};

export type MouseMoveEvent = TelemetryBaseEvent & {
  eventType: "mousemove";
  x: number;
  y: number;
  normalizedX?: number;
  normalizedY?: number;
};

export type ClickEvent = TelemetryBaseEvent & {
  eventType: "click";
  x: number;
  y: number;
  normalizedX?: number;
  normalizedY?: number;
  targetId: string;
  targetHit: boolean;
  reactionTimeMs: number;
};

export type SessionEndEvent = TelemetryBaseEvent & {
  eventType: "session_end";
  score: number;
  hitCount: number;
  missCount: number;
  totalEvents: number;
};

export type TelemetryEvent =
  | SessionStartEvent
  | MouseMoveEvent
  | ClickEvent
  | SessionEndEvent;

export type TelemetryBatch = {
  sessionId: string;
  sentAt: number;
  batchSequence: number;
  events: TelemetryEvent[];
};

const MAX_BATCH_EVENTS = 100;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNonNegativeInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isPositiveNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value > 0;
}

function isNormalizedCoordinate(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0 && value <= 1;
}

function hasBaseEventFields(value: Record<string, unknown>): boolean {
  return (
    isNonEmptyString(value.eventId) &&
    isNonEmptyString(value.sessionId) &&
    isNonNegativeInt(value.eventTime) &&
    isNonNegativeInt(value.sequence)
  );
}

function hasOptionalNormalizedCoords(value: Record<string, unknown>): boolean {
  if ("normalizedX" in value && !isNormalizedCoordinate(value.normalizedX)) {
    return false;
  }
  if ("normalizedY" in value && !isNormalizedCoordinate(value.normalizedY)) {
    return false;
  }
  return true;
}

export function isSessionStartEvent(value: unknown): value is SessionStartEvent {
  if (!isRecord(value) || !hasBaseEventFields(value)) {
    return false;
  }
  if (value.eventType !== "session_start") {
    return false;
  }
  return (
    (value.durationSeconds === 30 || value.durationSeconds === 60) &&
    isPositiveNumber(value.canvasWidth) &&
    isPositiveNumber(value.canvasHeight) &&
    isPositiveNumber(value.viewportWidth) &&
    isPositiveNumber(value.viewportHeight) &&
    isPositiveNumber(value.devicePixelRatio)
  );
}

export function isMouseMoveEvent(value: unknown): value is MouseMoveEvent {
  if (!isRecord(value) || !hasBaseEventFields(value)) {
    return false;
  }
  if (value.eventType !== "mousemove") {
    return false;
  }
  return (
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    hasOptionalNormalizedCoords(value)
  );
}

export function isClickEvent(value: unknown): value is ClickEvent {
  if (!isRecord(value) || !hasBaseEventFields(value)) {
    return false;
  }
  if (value.eventType !== "click") {
    return false;
  }
  return (
    isFiniteNumber(value.x) &&
    isFiniteNumber(value.y) &&
    hasOptionalNormalizedCoords(value) &&
    isNonEmptyString(value.targetId) &&
    typeof value.targetHit === "boolean" &&
    isNonNegativeInt(value.reactionTimeMs)
  );
}

export function isSessionEndEvent(value: unknown): value is SessionEndEvent {
  if (!isRecord(value) || !hasBaseEventFields(value)) {
    return false;
  }
  if (value.eventType !== "session_end") {
    return false;
  }
  return (
    isNonNegativeInt(value.score) &&
    isNonNegativeInt(value.hitCount) &&
    isNonNegativeInt(value.missCount) &&
    isNonNegativeInt(value.totalEvents)
  );
}

export function isTelemetryEvent(value: unknown): value is TelemetryEvent {
  return (
    isSessionStartEvent(value) ||
    isMouseMoveEvent(value) ||
    isClickEvent(value) ||
    isSessionEndEvent(value)
  );
}

export function isTelemetryBatch(value: unknown): value is TelemetryBatch {
  if (!isRecord(value)) {
    return false;
  }
  if (!isNonEmptyString(value.sessionId)) {
    return false;
  }
  if (!isNonNegativeInt(value.sentAt) || !isNonNegativeInt(value.batchSequence)) {
    return false;
  }
  if (!Array.isArray(value.events)) {
    return false;
  }
  if (value.events.length < 1 || value.events.length > MAX_BATCH_EVENTS) {
    return false;
  }

  for (const event of value.events) {
    if (!isTelemetryEvent(event)) {
      return false;
    }
    if (event.sessionId !== value.sessionId) {
      return false;
    }
  }

  return true;
}
