import { TELEMETRY_CONFIG } from "./telemetryConfig";
import type { TelemetryBatch, TelemetryEvent } from "./telemetryTypes";
import type { BatchSendResult, StreamStatus } from "@/api/telemetryApi";

export type BatchSenderDeps = {
  send: (batch: TelemetryBatch) => Promise<BatchSendResult>;
  now?: () => number;
  sleep?: (ms: number) => Promise<void>;
  maxRetries?: number;
  retryBackoffMs?: readonly number[];
  onStatus?: (status: StreamStatus) => void;
  onDropped?: (count: number) => void;
};

export type BatchSender = {
  enqueue: (sessionId: string, events: TelemetryEvent[]) => Promise<void>;
  isInFlight: () => boolean;
  batchSequence: () => number;
  sentBatchCount: () => number;
  reset: () => void;
};

async function defaultSleep(ms: number): Promise<void> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function createBatchSender(deps: BatchSenderDeps): BatchSender {
  const send = deps.send;
  const now = deps.now ?? (() => Date.now());
  const sleep = deps.sleep ?? defaultSleep;
  const maxRetries = deps.maxRetries ?? TELEMETRY_CONFIG.maxRetries;
  const retryBackoffMs = deps.retryBackoffMs ?? TELEMETRY_CONFIG.retryBackoffMs;
  const onStatus = deps.onStatus;
  const onDropped = deps.onDropped;

  let sequence = 0;
  let sent = 0;
  let inFlight = false;
  let chain: Promise<void> = Promise.resolve();

  async function sendWithRetry(sessionId: string, events: TelemetryEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    inFlight = true;

    sequence += 1;
    const batchSequence = sequence;
    const batch: TelemetryBatch = {
      sessionId,
      sentAt: now(),
      batchSequence,
      events,
    };

    let attempt = 0;
    while (true) {
      const result = await send(batch);
      if (result.ok) {
        sent += 1;
        onStatus?.("connected");
        inFlight = false;
        return;
      }

      if (!result.retryable) {
        onDropped?.(events.length);
        onStatus?.("error");
        inFlight = false;
        return;
      }

      if (attempt >= maxRetries) {
        onDropped?.(events.length);
        onStatus?.("offline");
        inFlight = false;
        return;
      }

      const delay = retryBackoffMs[Math.min(attempt, retryBackoffMs.length - 1)] ?? 500;
      attempt += 1;
      await sleep(delay);
    }
  }

  return {
    enqueue(sessionId: string, events: TelemetryEvent[]): Promise<void> {
      if (events.length === 0) {
        return Promise.resolve();
      }

      inFlight = true;
      onStatus?.("buffering");

      const job = chain.then(() => sendWithRetry(sessionId, events));
      chain = job.then(
        () => undefined,
        () => undefined,
      );
      return job;
    },

    isInFlight(): boolean {
      return inFlight;
    },

    batchSequence(): number {
      return sequence;
    },

    sentBatchCount(): number {
      return sent;
    },

    reset(): void {
      sequence = 0;
      sent = 0;
      inFlight = false;
      chain = Promise.resolve();
      onStatus?.("idle");
    },
  };
}
