export type GameStatus =
  | "idle"
  | "countdown"
  | "running"
  | "finishing"
  | "completed";

export type DurationSeconds = 30 | 60;

export type SessionSettings = {
  durationSeconds: DurationSeconds;
  countdownSeconds: number;
};

export type GameSessionState = {
  status: GameStatus;
  durationSeconds: DurationSeconds;
  sessionId: string | null;
};

export const DEFAULT_SESSION_SETTINGS: SessionSettings = {
  durationSeconds: 60,
  countdownSeconds: 3,
};
