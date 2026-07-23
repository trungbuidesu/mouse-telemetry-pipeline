import { useCallback, useEffect, useRef, useState } from "react";

import { sendTelemetryBatch, type StreamStatus } from "@/api/telemetryApi";
import { createBatchSender, type BatchSender } from "@/telemetry/batchSender";
import { createEventCollector } from "@/telemetry/eventCollector";
import { createEventBuffer } from "@/telemetry/eventBuffer";
import { TELEMETRY_CONFIG } from "@/telemetry/telemetryConfig";

export type TelemetrySessionMetrics = {
  score: number;
  hitCount: number;
  missCount: number;
};

export type BeginSessionInput = {
  sessionId: string;
  durationSeconds: 30 | 60;
  canvasWidth: number;
  canvasHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
};

export type RecordClickInput = {
  x: number;
  y: number;
  canvasWidth: number;
  canvasHeight: number;
  targetId: string;
  targetHit: boolean;
  targetCreatedAt: number;
};

export type UseTelemetryApi = {
  streamStatus: StreamStatus;
  eventCount: number;
  sentBatchCount: number;
  lastBatchEventCount: number;
  droppedEventCount: number;
  beginSession: (input: BeginSessionInput) => void;
  recordPointerMove: (input: {
    x: number;
    y: number;
    canvasWidth: number;
    canvasHeight: number;
  }) => void;
  recordClick: (input: RecordClickInput) => void;
  endSession: (metrics: TelemetrySessionMetrics) => Promise<{
    eventCount: number;
    sentBatchCount: number;
    lastBatchEventCount: number;
    droppedEventCount: number;
  }>;
  resetTelemetry: () => void;
};

type SenderBox = {
  onStatus: (status: StreamStatus) => void;
  onDropped: (count: number) => void;
  sender: BatchSender;
};

function createSenderBox(): SenderBox {
  const box: SenderBox = {
    onStatus: () => undefined,
    onDropped: () => undefined,
    sender: null as unknown as BatchSender,
  };
  box.sender = createBatchSender({
    send: (batch) => sendTelemetryBatch(batch),
    onStatus: (status) => {
      box.onStatus(status);
    },
    onDropped: (count) => {
      box.onDropped(count);
    },
  });
  return box;
}

export function useTelemetry(): UseTelemetryApi {
  const [streamStatus, setStreamStatus] = useState<StreamStatus>("idle");
  const [eventCount, setEventCount] = useState(0);
  const [sentBatchCount, setSentBatchCount] = useState(0);
  const [lastBatchEventCount, setLastBatchEventCount] = useState(0);
  const [droppedEventCount, setDroppedEventCount] = useState(0);

  const collectorRef = useRef(createEventCollector());
  const bufferRef = useRef(
    createEventBuffer({
      maxBufferedEvents: TELEMETRY_CONFIG.maxBufferedEvents,
      batchSize: TELEMETRY_CONFIG.batchSize,
    }),
  );
  const droppedExtraRef = useRef(0);
  const sessionIdRef = useRef<string | null>(null);
  const emittedCountRef = useRef(0);
  const flushTimerRef = useRef<number | null>(null);
  const senderBoxRef = useRef(createSenderBox());

  useEffect(() => {
    const box = senderBoxRef.current;
    box.onStatus = (status) => {
      setStreamStatus(status);
    };
    box.onDropped = (count) => {
      droppedExtraRef.current += count;
      setDroppedEventCount(bufferRef.current.droppedEventCount() + droppedExtraRef.current);
    };
  }, []);

  const syncCounters = useCallback(() => {
    setEventCount(emittedCountRef.current);
    setSentBatchCount(senderBoxRef.current.sender.sentBatchCount());
    setLastBatchEventCount(senderBoxRef.current.sender.lastBatchEventCount());
    setDroppedEventCount(bufferRef.current.droppedEventCount() + droppedExtraRef.current);
  }, []);

  const flushDueBatches = useCallback(async () => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      return;
    }

    let batch = bufferRef.current.takeBatch();
    while (batch !== null) {
      await senderBoxRef.current.sender.enqueue(sessionId, batch);
      batch = bufferRef.current.takeBatch();
    }
    syncCounters();
  }, [syncCounters]);

  const flushIntervalDrain = useCallback(async () => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      return;
    }

    const drained = bufferRef.current.drainUpTo(TELEMETRY_CONFIG.batchSize);
    if (drained.length > 0) {
      await senderBoxRef.current.sender.enqueue(sessionId, drained);
    }
    syncCounters();
  }, [syncCounters]);

  const stopFlushInterval = useCallback(() => {
    if (flushTimerRef.current !== null) {
      window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
    }
  }, []);

  const startFlushInterval = useCallback(() => {
    stopFlushInterval();
    flushTimerRef.current = window.setInterval(() => {
      void flushIntervalDrain();
    }, TELEMETRY_CONFIG.flushIntervalMs);
  }, [flushIntervalDrain, stopFlushInterval]);

  useEffect(() => {
    return () => {
      stopFlushInterval();
    };
  }, [stopFlushInterval]);

  const appendEvent = useCallback(
    (event: Parameters<typeof bufferRef.current.append>[0], updateUi: boolean) => {
      bufferRef.current.append(event);
      emittedCountRef.current += 1;
      if (updateUi) {
        syncCounters();
      }
      if (bufferRef.current.size() >= TELEMETRY_CONFIG.batchSize) {
        void flushDueBatches();
      }
    },
    [flushDueBatches, syncCounters],
  );

  const beginSession = useCallback(
    (input: BeginSessionInput) => {
      stopFlushInterval();
      sessionIdRef.current = input.sessionId;
      emittedCountRef.current = 0;
      droppedExtraRef.current = 0;
      bufferRef.current = createEventBuffer({
        maxBufferedEvents: TELEMETRY_CONFIG.maxBufferedEvents,
        batchSize: TELEMETRY_CONFIG.batchSize,
      });
      collectorRef.current = createEventCollector();
      senderBoxRef.current.sender.reset();
      collectorRef.current.reset(input.sessionId);

      const startEvent = collectorRef.current.createSessionStart({
        durationSeconds: input.durationSeconds,
        canvasWidth: input.canvasWidth,
        canvasHeight: input.canvasHeight,
        viewportWidth: input.viewportWidth,
        viewportHeight: input.viewportHeight,
        devicePixelRatio: input.devicePixelRatio,
      });
      appendEvent(startEvent, true);
      setStreamStatus("connected");
      startFlushInterval();
    },
    [appendEvent, startFlushInterval, stopFlushInterval],
  );

  const recordPointerMove = useCallback(
    (input: { x: number; y: number; canvasWidth: number; canvasHeight: number }) => {
      if (sessionIdRef.current === null) {
        return;
      }
      const event = collectorRef.current.tryCreateMouseMove(input);
      if (event) {
        appendEvent(event, false);
      }
    },
    [appendEvent],
  );

  const recordClick = useCallback(
    (input: RecordClickInput) => {
      if (sessionIdRef.current === null) {
        return;
      }
      const event = collectorRef.current.createClick(input);
      appendEvent(event, true);
    },
    [appendEvent],
  );

  const endSession = useCallback(
    async (metrics: TelemetrySessionMetrics) => {
      stopFlushInterval();
      const sessionId = sessionIdRef.current;
      if (sessionId === null) {
        return {
          eventCount: 0,
          sentBatchCount: 0,
          lastBatchEventCount: 0,
          droppedEventCount: 0,
        };
      }

      const endEvent = collectorRef.current.createSessionEnd({
        score: metrics.score,
        hitCount: metrics.hitCount,
        missCount: metrics.missCount,
        totalEvents: emittedCountRef.current + 1,
      });
      appendEvent(endEvent, true);

      await flushDueBatches();
      const remaining = bufferRef.current.takeAll();
      if (remaining.length > 0) {
        await senderBoxRef.current.sender.enqueue(sessionId, remaining);
      }

      const counters = {
        eventCount: emittedCountRef.current,
        sentBatchCount: senderBoxRef.current.sender.sentBatchCount(),
        lastBatchEventCount: senderBoxRef.current.sender.lastBatchEventCount(),
        droppedEventCount: bufferRef.current.droppedEventCount() + droppedExtraRef.current,
      };
      setEventCount(counters.eventCount);
      setSentBatchCount(counters.sentBatchCount);
      setLastBatchEventCount(counters.lastBatchEventCount);
      setDroppedEventCount(counters.droppedEventCount);
      return counters;
    },
    [appendEvent, flushDueBatches, stopFlushInterval],
  );

  const resetTelemetry = useCallback(() => {
    stopFlushInterval();
    sessionIdRef.current = null;
    emittedCountRef.current = 0;
    droppedExtraRef.current = 0;
    bufferRef.current = createEventBuffer({
      maxBufferedEvents: TELEMETRY_CONFIG.maxBufferedEvents,
      batchSize: TELEMETRY_CONFIG.batchSize,
    });
    collectorRef.current = createEventCollector();
    senderBoxRef.current.sender.reset();
    setStreamStatus("idle");
    setEventCount(0);
    setSentBatchCount(0);
    setLastBatchEventCount(0);
    setDroppedEventCount(0);
  }, [stopFlushInterval]);

  return {
    streamStatus,
    eventCount,
    sentBatchCount,
    lastBatchEventCount,
    droppedEventCount,
    beginSession,
    recordPointerMove,
    recordClick,
    endSession,
    resetTelemetry,
  };
}
