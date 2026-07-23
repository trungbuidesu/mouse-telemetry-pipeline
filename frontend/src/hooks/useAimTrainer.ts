import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";

import {
  beginFinishing,
  complete,
  createInitialSession,
  enterRunning,
  reset,
  setDurationSeconds,
  startCountdown,
} from "@/game/gameEngine";
import {
  DEFAULT_SESSION_SETTINGS,
  type DurationSeconds,
  type GameStatus,
} from "@/game/types";

export type AimTrainerApi = {
  status: GameStatus;
  durationSeconds: DurationSeconds;
  countdownRemaining: number;
  sessionId: string | null;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  setDuration: (durationSeconds: DurationSeconds) => void;
  start: () => void;
  stop: () => void;
  playAgain: () => void;
  resetSession: () => void;
  onPointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
};

function createSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}`;
}

function paintPlayfield(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  status: GameStatus,
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
}

export function useAimTrainer(): AimTrainerApi {
  const [session, setSession] = useState(() => createInitialSession());
  const [countdownRemaining, setCountdownRemaining] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const finishingTimerRef = useRef<number | null>(null);
  const statusRef = useRef<GameStatus>(session.status);

  useEffect(() => {
    statusRef.current = session.status;
  }, [session.status]);

  const clearTimers = useCallback(() => {
    if (countdownTimerRef.current !== null) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (finishingTimerRef.current !== null) {
      window.clearTimeout(finishingTimerRef.current);
      finishingTimerRef.current = null;
    }
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) {
      return;
    }
    paintPlayfield(canvas, ctx, statusRef.current);
  }, []);

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
    paintPlayfield(canvas, ctx, statusRef.current);

    const onResize = () => {
      paintPlayfield(canvas, ctx, statusRef.current);
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
          clearTimers();
          setSession((runningState) => enterRunning(runningState));
        }
      }, 1000);

      return next;
    });
  }, [clearTimers]);

  const stop = useCallback(() => {
    clearTimers();
    setCountdownRemaining(0);
    setSession((current) => {
      const finishing = beginFinishing(current);
      if (finishing.status !== "finishing") {
        return current;
      }

      // Stub flush point for phase1-plan002 telemetry final flush.
      finishingTimerRef.current = window.setTimeout(() => {
        setSession((finishingState) => complete(finishingState));
      }, 150);

      return finishing;
    });
  }, [clearTimers]);

  const playAgain = useCallback(() => {
    start();
  }, [start]);

  const resetSession = useCallback(() => {
    clearTimers();
    setCountdownRemaining(0);
    setSession((current) => reset(current));
  }, [clearTimers]);

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) {
        return;
      }

      // Convert client coordinates to canvas space without storing them in React state (DEC-003).
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      paintPlayfield(canvas, ctx, statusRef.current);

      if (statusRef.current === "running") {
        ctx.beginPath();
        ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    [],
  );

  useEffect(() => {
    redraw();
  }, [redraw, session.status]);

  return {
    status: session.status,
    durationSeconds: session.durationSeconds,
    countdownRemaining,
    sessionId: session.sessionId,
    canvasRef,
    setDuration,
    start,
    stop,
    playAgain,
    resetSession,
    onPointerMove,
  };
}
