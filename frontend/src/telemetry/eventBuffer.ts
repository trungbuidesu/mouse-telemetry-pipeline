import type { TelemetryEvent } from "./telemetryTypes";

export type EventBufferOptions = {
  maxBufferedEvents: number;
  batchSize: number;
};

export type EventBuffer = {
  append: (event: TelemetryEvent) => { dropped: number };
  size: () => number;
  takeBatch: () => TelemetryEvent[] | null;
  drainUpTo: (n: number) => TelemetryEvent[];
  takeAll: () => TelemetryEvent[];
  droppedEventCount: () => number;
  peek: () => readonly TelemetryEvent[];
};

function isLifecycleEvent(event: TelemetryEvent): boolean {
  return event.eventType === "session_start" || event.eventType === "session_end";
}

function findDropIndex(events: TelemetryEvent[]): number {
  const mouseMoveIndex = events.findIndex((event) => event.eventType === "mousemove");
  if (mouseMoveIndex >= 0) {
    return mouseMoveIndex;
  }

  const nonLifecycleIndex = events.findIndex((event) => !isLifecycleEvent(event));
  if (nonLifecycleIndex >= 0) {
    return nonLifecycleIndex;
  }

  // Last resort: drop oldest event (still counted) so memory stays bounded.
  return 0;
}

export function createEventBuffer(options: EventBufferOptions): EventBuffer {
  const events: TelemetryEvent[] = [];
  let dropped = 0;

  function enforceLimit(): number {
    let removed = 0;
    while (events.length > options.maxBufferedEvents) {
      const index = findDropIndex(events);
      events.splice(index, 1);
      removed += 1;
      dropped += 1;
    }
    return removed;
  }

  return {
    append(event: TelemetryEvent): { dropped: number } {
      events.push(event);
      const removed = enforceLimit();
      return { dropped: removed };
    },

    size(): number {
      return events.length;
    },

    takeBatch(): TelemetryEvent[] | null {
      if (events.length < options.batchSize) {
        return null;
      }
      return events.splice(0, options.batchSize);
    },

    drainUpTo(n: number): TelemetryEvent[] {
      if (n <= 0 || events.length === 0) {
        return [];
      }
      const count = Math.min(n, events.length);
      return events.splice(0, count);
    },

    takeAll(): TelemetryEvent[] {
      return events.splice(0, events.length);
    },

    droppedEventCount(): number {
      return dropped;
    },

    peek(): readonly TelemetryEvent[] {
      return events;
    },
  };
}
