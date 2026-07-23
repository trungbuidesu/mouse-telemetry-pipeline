import type { ReactElement } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StreamStatus } from "@/components/StreamStatus";
import type { StreamStatus as StreamStatusValue } from "@/api/telemetryApi";
import type { DurationSeconds, GameStatus } from "@/game/types";

type SessionHUDProps = {
  status: GameStatus;
  durationSeconds: DurationSeconds;
  countdownRemaining: number;
  timeRemaining: number;
  score: number;
  accuracyLabel: string;
  sessionId: string | null;
  streamStatus: StreamStatusValue;
  eventCount: number;
  sentBatchCount: number;
  lastBatchEventCount: number;
  droppedEventCount: number;
  onDurationChange: (durationSeconds: DurationSeconds) => void;
  onStart: () => void;
  onStop: () => void;
  onPlayAgain: () => void;
  onReset: () => void;
};

function statusLabel(status: GameStatus): string {
  switch (status) {
    case "idle":
      return "Idle";
    case "countdown":
      return "Countdown";
    case "running":
      return "Running";
    case "finishing":
      return "Finishing";
    case "completed":
      return "Completed";
  }
}

function formatTimeLeft(status: GameStatus, timeRemaining: number, durationSeconds: DurationSeconds): string {
  if (status === "idle") {
    return "—";
  }
  if (status === "countdown") {
    return `${durationSeconds}s`;
  }
  if (status === "completed" || status === "finishing") {
    return "0s";
  }
  return `${timeRemaining}s`;
}

export function SessionHUD({
  status,
  durationSeconds,
  countdownRemaining,
  timeRemaining,
  score,
  accuracyLabel,
  sessionId,
  streamStatus,
  eventCount,
  sentBatchCount,
  lastBatchEventCount,
  droppedEventCount,
  onDurationChange,
  onStart,
  onStop,
  onPlayAgain,
  onReset,
}: SessionHUDProps): ReactElement {
  const canEditDuration = status === "idle" || status === "completed";
  const canStart = status === "idle" || status === "completed";
  const canStop = status === "countdown" || status === "running";

  return (
    <section className="grid gap-4 rounded-md border bg-card p-4 text-card-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Session status</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{statusLabel(status)}</Badge>
            {status === "countdown" ? (
              <span className="text-sm font-medium">{countdownRemaining}s</span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={durationSeconds === 30 ? "default" : "outline"}
            size="sm"
            disabled={!canEditDuration}
            onClick={() => onDurationChange(30)}
          >
            30s
          </Button>
          <Button
            type="button"
            variant={durationSeconds === 60 ? "default" : "outline"}
            size="sm"
            disabled={!canEditDuration}
            onClick={() => onDurationChange(60)}
          >
            60s
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Score</p>
          <p className="text-lg font-semibold">{score}</p>
        </div>
        <div className="rounded-md border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Accuracy</p>
          <p className="text-lg font-semibold">{accuracyLabel}</p>
        </div>
        <div className="rounded-md border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Time left</p>
          <p className="text-lg font-semibold">
            {formatTimeLeft(status, timeRemaining, durationSeconds)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {canStart ? (
          <Button type="button" onClick={status === "completed" ? onPlayAgain : onStart}>
            {status === "completed" ? "Play again" : "Start"}
          </Button>
        ) : null}
        {canStop ? (
          <Button type="button" variant="destructive" onClick={onStop}>
            Stop
          </Button>
        ) : null}
        {status === "completed" ? (
          <Button type="button" variant="outline" onClick={onReset}>
            Reset
          </Button>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">Session ID: {sessionId ?? "—"}</p>

      <StreamStatus
        status={streamStatus}
        eventCount={eventCount}
        sentBatchCount={sentBatchCount}
        lastBatchEventCount={lastBatchEventCount}
        droppedEventCount={droppedEventCount}
      />
    </section>
  );
}
