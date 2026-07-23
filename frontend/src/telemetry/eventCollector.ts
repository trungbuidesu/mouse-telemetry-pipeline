import {
  hasNormalizedCoordinates,
  withNormalizedCoordinates,
} from "./coordinates";
import { TELEMETRY_CONFIG } from "./telemetryConfig";
import type {
  ClickEvent,
  MouseMoveEvent,
  SessionEndEvent,
  SessionStartEvent,
} from "./telemetryTypes";

export type SessionStartInput = {
  durationSeconds: 30 | 60;
  canvasWidth: number;
  canvasHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  eventTime?: number;
};

export type MouseMoveInput = {
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  eventTime?: number;
};

export type ClickInput = {
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  targetId: string;
  targetHit: boolean;
  targetCreatedAt: number;
  eventTime?: number;
};

export type SessionEndInput = {
  score: number;
  hitCount: number;
  missCount: number;
  totalEvents: number;
  eventTime?: number;
};

export type EventCollector = {
  reset: (sessionId: string) => void;
  createSessionStart: (input: SessionStartInput) => SessionStartEvent;
  tryCreateMouseMove: (input: MouseMoveInput) => MouseMoveEvent | null;
  createClick: (input: ClickInput) => ClickEvent;
  createSessionEnd: (input: SessionEndInput) => SessionEndEvent;
  nextSequence: () => number;
  skippedMouseMoveCount: () => number;
};

export type EventCollectorDeps = {
  createEventId?: () => string;
  now?: () => number;
  sampleIntervalMs?: number;
};

function defaultCreateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `event-${Date.now()}`;
}

export function createEventCollector(deps: EventCollectorDeps = {}): EventCollector {
  const createEventId = deps.createEventId ?? defaultCreateEventId;
  const now = deps.now ?? (() => Date.now());
  const sampleIntervalMs = deps.sampleIntervalMs ?? TELEMETRY_CONFIG.sampleIntervalMs;

  let sessionId: string | null = null;
  let sequence = -1;
  let lastSampledAt: number | null = null;
  let skippedMouseMoves = 0;

  function requireSessionId(): string {
    if (sessionId === null) {
      throw new Error("event collector must be reset with a sessionId before creating events");
    }
    return sessionId;
  }

  function nextEventSequence(): number {
    sequence += 1;
    return sequence;
  }

  function attachPointerFields(
    x: number,
    y: number,
    canvasWidth: number,
    canvasHeight: number,
  ): { x: number; y: number; normalizedX?: number; normalizedY?: number } {
    const point = withNormalizedCoordinates({ x, y }, canvasWidth, canvasHeight);
    if (hasNormalizedCoordinates(point)) {
      return {
        x: point.x,
        y: point.y,
        normalizedX: point.normalizedX,
        normalizedY: point.normalizedY,
      };
    }
    return { x: point.x, y: point.y };
  }

  return {
    reset(nextSessionId: string): void {
      sessionId = nextSessionId;
      sequence = -1;
      lastSampledAt = null;
      skippedMouseMoves = 0;
    },

    createSessionStart(input: SessionStartInput): SessionStartEvent {
      const activeSessionId = requireSessionId();
      const eventTime = input.eventTime ?? now();

      return {
        eventId: createEventId(),
        sessionId: activeSessionId,
        eventType: "session_start",
        eventTime,
        sequence: nextEventSequence(),
        durationSeconds: input.durationSeconds,
        canvasWidth: input.canvasWidth,
        canvasHeight: input.canvasHeight,
        viewportWidth: input.viewportWidth,
        viewportHeight: input.viewportHeight,
        devicePixelRatio: input.devicePixelRatio,
      };
    },

    tryCreateMouseMove(input: MouseMoveInput): MouseMoveEvent | null {
      const activeSessionId = requireSessionId();
      const eventTime = input.eventTime ?? now();

      if (lastSampledAt !== null && eventTime - lastSampledAt < sampleIntervalMs) {
        skippedMouseMoves += 1;
        return null;
      }

      lastSampledAt = eventTime;
      const pointer = attachPointerFields(
        input.x,
        input.y,
        input.canvasWidth,
        input.canvasHeight,
      );

      return {
        eventId: createEventId(),
        sessionId: activeSessionId,
        eventType: "mousemove",
        eventTime,
        sequence: nextEventSequence(),
        ...pointer,
      };
    },

    createClick(input: ClickInput): ClickEvent {
      const activeSessionId = requireSessionId();
      const eventTime = input.eventTime ?? now();
      const pointer = attachPointerFields(
        input.x,
        input.y,
        input.canvasWidth,
        input.canvasHeight,
      );

      return {
        eventId: createEventId(),
        sessionId: activeSessionId,
        eventType: "click",
        eventTime,
        sequence: nextEventSequence(),
        ...pointer,
        targetId: input.targetId,
        targetHit: input.targetHit,
        reactionTimeMs: Math.max(0, Math.floor(eventTime - input.targetCreatedAt)),
      };
    },

    createSessionEnd(input: SessionEndInput): SessionEndEvent {
      const activeSessionId = requireSessionId();
      const eventTime = input.eventTime ?? now();

      return {
        eventId: createEventId(),
        sessionId: activeSessionId,
        eventType: "session_end",
        eventTime,
        sequence: nextEventSequence(),
        score: input.score,
        hitCount: input.hitCount,
        missCount: input.missCount,
        totalEvents: input.totalEvents,
      };
    },

    nextSequence(): number {
      return sequence;
    },

    skippedMouseMoveCount(): number {
      return skippedMouseMoves;
    },
  };
}
