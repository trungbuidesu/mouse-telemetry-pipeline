import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";

import {
  accuracyPercent,
  applyTarget,
  beginFinishing,
  complete,
  createInitialSession,
  enterRunning,
  registerClick,
  reset,
  setDurationSeconds,
  startCountdown,
} from "@/game/gameEngine";
import { isHit } from "@/game/hitDetection";
import { TARGET_RADIUS, createTarget } from "@/game/targetGenerator";
import {
  DEFAULT_SESSION_SETTINGS,
  type DurationSeconds,
  type GameStatus,
  type Target,
} from "@/game/types";
import { useTelemetry } from "@/hooks/useTelemetry";
import type { StreamStatus } from "@/api/telemetryApi";

export type AimTrainerApi = {
  status: GameStatus;
  durationSeconds: DurationSeconds;
  countdownRemaining: number;
  timeRemaining: number;
  score: number;
  accuracyLabel: string;
  sessionId: string | null;
  streamStatus: StreamStatus;
  eventCount: number;
  sentBatchCount: number;
  lastBatchEventCount: number;
  droppedEventCount: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  setDuration: (durationSeconds: DurationSeconds) => void;
  start: () => void;
  stop: () => void;
  playAgain: () => void;
  resetSession: () => void;
  onPointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
  onPointerDown: (event: PointerEvent<HTMLCanvasElement>) => void;
};

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}`;
}

function createTargetId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `target-${Date.now()}`;
}

function paintPlayfield(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  status: GameStatus,
  target: Target | null,
  pointer: { x: number; y: number } | null,
): void {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) {
    return;
  }

  const ratio = window.devicePixelRatio || 1;
  if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) {
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  if (target) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(248, 113, 113, 0.95)";
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (status === "idle" || status === "completed") {
    ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      status === "idle" ? "Ready — press Start" : "Session completed",
      width / 2,
      height / 2,
    );
  }

  if (pointer && status === "running") {
    ctx.beginPath();
    ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
    ctx.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function readCanvasPoint(
  canvas: HTMLCanvasElement,
  event: PointerEvent<HTMLCanvasElement>,
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

export function useAimTrainer(): AimTrainerApi {
  const telemetry = useTelemetry();
  const telemetryRef = useRef(telemetry);
  useEffect(() => {
    telemetryRef.current = telemetry;
  }, [telemetry]);

  const [session, setSession] = useState(() => createInitialSession());
  const [countdownRemaining, setCountdownRemaining] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const sessionTimerRef = useRef<number | null>(null);
  const statusRef = useRef<GameStatus>(session.status);
  const targetRef = useRef<Target | null>(session.currentTarget);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    statusRef.current = session.status;
    targetRef.current = session.currentTarget;
  }, [session.status, session.currentTarget]);

  const clearTimers = useCallback(() => {
    if (countdownTimerRef.current !== null) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (sessionTimerRef.current !== null) {
      window.clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    paintPlayfield(canvas, ctx, statusRef.current, targetRef.current, pointerRef.current);
  }, []);

  const spawnTargetForCanvas = useCallback((): Target | null => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width < TARGET_RADIUS * 2 || height < TARGET_RADIUS * 2) {
      return null;
    }

    return createTarget({
      width,
      height,
      radius: TARGET_RADIUS,
      now: Date.now(),
      random: Math.random,
      createId: createTargetId,
    });
  }, []);

  const beginTelemetryForRunning = useCallback((runningSession: typeof session) => {
    const canvas = canvasRef.current;
    if (!runningSession.sessionId) {
      return;
    }
    telemetryRef.current.beginSession({
      sessionId: runningSession.sessionId,
      durationSeconds: runningSession.durationSeconds,
      canvasWidth: canvas?.clientWidth || 1,
      canvasHeight: canvas?.clientHeight || 1,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
    });
  }, []);

  const finishWithTelemetryFlush = useCallback((current: typeof session) => {
    const finishing = beginFinishing(current);
    if (finishing.status !== "finishing") {
      return current;
    }

    void telemetryRef.current
      .endSession({
        score: current.score,
        hitCount: current.hitCount,
        missCount: current.missCount,
      })
      .finally(() => {
        setSession((finishingState) => complete(finishingState));
      });

    return finishing;
  }, []);

  const beginSessionTimer = useCallback(
    (durationSeconds: DurationSeconds) => {
      if (sessionTimerRef.current !== null) {
        window.clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }

      let remaining = durationSeconds;
      setTimeRemaining(remaining);

      sessionTimerRef.current = window.setInterval(() => {
        remaining -= 1;
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          if (sessionTimerRef.current !== null) {
            window.clearInterval(sessionTimerRef.current);
            sessionTimerRef.current = null;
          }
          setSession((current) => finishWithTelemetryFlush(current));
        }
      }, 1000);
    },
    [finishWithTelemetryFlush],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctxRef.current = ctx;
    paintPlayfield(canvas, ctx, statusRef.current, targetRef.current, pointerRef.current);

    const onResize = () => {
      paintPlayfield(canvas, ctx, statusRef.current, targetRef.current, pointerRef.current);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const setDuration = useCallback((durationSeconds: DurationSeconds) => {
    setSession((current) => setDurationSeconds(current, durationSeconds));
  }, []);

  const start = useCallback(() => {
    clearTimers();
    setTimeRemaining(0);
    pointerRef.current = null;
    setSession((current) => {
      const next = startCountdown(current, createSessionId);
      if (next.status !== "countdown") {
        return current;
      }

      let remaining = DEFAULT_SESSION_SETTINGS.countdownSeconds;
      setCountdownRemaining(remaining);

      countdownTimerRef.current = window.setInterval(() => {
        remaining -= 1;
        setCountdownRemaining(remaining);
        if (remaining <= 0) {
          if (countdownTimerRef.current !== null) {
            window.clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }

          setSession((countdownState) => {
            const running = enterRunning(countdownState);
            if (running.status !== "running") {
              return countdownState;
            }

            const target = spawnTargetForCanvas();
            const withTarget = target ? applyTarget(running, target) : running;
            targetRef.current = withTarget.currentTarget;
            beginTelemetryForRunning(withTarget);
            beginSessionTimer(withTarget.durationSeconds);
            return withTarget;
          });
        }
      }, 1000);

      return next;
    });
  }, [beginSessionTimer, beginTelemetryForRunning, clearTimers, spawnTargetForCanvas]);

  const stop = useCallback(() => {
    clearTimers();
    setCountdownRemaining(0);
    setTimeRemaining(0);
    pointerRef.current = null;
    setSession((current) => {
      // Cancel before running: return to idle without entering finishing/flush.
      if (current.status === "countdown") {
        telemetryRef.current.resetTelemetry();
        return createInitialSession(current.durationSeconds);
      }

      return finishWithTelemetryFlush(current);
    });
  }, [clearTimers, finishWithTelemetryFlush]);

  const playAgain = useCallback(() => {
    start();
  }, [start]);

  const resetSession = useCallback(() => {
    clearTimers();
    setCountdownRemaining(0);
    setTimeRemaining(0);
    pointerRef.current = null;
    telemetryRef.current.resetTelemetry();
    setSession((current) => reset(current));
  }, [clearTimers]);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) {
        return;
      }

      // Convert client coordinates without storing them in React state (DEC-003).
      const point = readCanvasPoint(canvas, event);
      pointerRef.current = statusRef.current === "running" ? point : null;
      paintPlayfield(canvas, ctx, statusRef.current, targetRef.current, pointerRef.current);

      if (statusRef.current === "running") {
        telemetryRef.current.recordPointerMove({
          x: point.x,
          y: point.y,
          canvasWidth: canvas.clientWidth,
          canvasHeight: canvas.clientHeight,
        });
      }
    },
    [],
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      if (statusRef.current !== "running") {
        return;
      }

      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) {
        return;
      }

      const point = readCanvasPoint(canvas, event);
      pointerRef.current = point;

      setSession((current) => {
        if (current.status !== "running" || !current.currentTarget) {
          return current;
        }

        const target = current.currentTarget;
        const hit = isHit(point.x, point.y, target);
        telemetryRef.current.recordClick({
          x: point.x,
          y: point.y,
          canvasWidth: canvas.clientWidth,
          canvasHeight: canvas.clientHeight,
          targetId: target.id,
          targetHit: hit,
          targetCreatedAt: target.createdAt,
        });

        let next = registerClick(current, hit);

        if (hit) {
          const spawned = spawnTargetForCanvas();
          next = spawned ? applyTarget(next, spawned) : next;
        }

        targetRef.current = next.currentTarget;
        return next;
      });
    },
    [spawnTargetForCanvas],
  );

  useEffect(() => {
    redraw();
  }, [redraw, session.status, session.currentTarget, session.score, session.totalClickCount]);

  const accuracy = accuracyPercent(session);

  return {
    status: session.status,
    durationSeconds: session.durationSeconds,
    countdownRemaining,
    timeRemaining,
    score: session.score,
    accuracyLabel: accuracy === null ? "—" : `${accuracy}%`,
    sessionId: session.sessionId,
    streamStatus: telemetry.streamStatus,
    eventCount: telemetry.eventCount,
    sentBatchCount: telemetry.sentBatchCount,
    lastBatchEventCount: telemetry.lastBatchEventCount,
    droppedEventCount: telemetry.droppedEventCount,
    canvasRef,
    setDuration,
    start,
    stop,
    playAgain,
    resetSession,
    onPointerMove,
    onPointerDown,
  };
}
