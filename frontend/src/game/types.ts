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

export type Target = {
  id: string;
  x: number;
  y: number;
  radius: number;
  createdAt: number;
};

export type ScoreState = {
  hitCount: number;
  missCount: number;
  totalClickCount: number;
  score: number;
};

export type GameSessionState = {
  status: GameStatus;
  durationSeconds: DurationSeconds;
  sessionId: string | null;
  currentTarget: Target | null;
  hitCount: number;
  missCount: number;
  totalClickCount: number;
  score: number;
};

export const DEFAULT_SESSION_SETTINGS: SessionSettings = {
  durationSeconds: 60,
  countdownSeconds: 3,
};

export const EMPTY_SCORE: ScoreState = {
  hitCount: 0,
  missCount: 0,
  totalClickCount: 0,
  score: 0,
};
