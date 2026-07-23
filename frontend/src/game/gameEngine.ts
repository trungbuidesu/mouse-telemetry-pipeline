import {
  DEFAULT_SESSION_SETTINGS,
  EMPTY_SCORE,
  type DurationSeconds,
  type GameSessionState,
  type ScoreState,
  type Target,
} from "./types";

export function createInitialSession(
  durationSeconds: DurationSeconds = DEFAULT_SESSION_SETTINGS.durationSeconds,
): GameSessionState {
  return {
    status: "idle",
    durationSeconds,
    sessionId: null,
    currentTarget: null,
    ...EMPTY_SCORE,
  };
}

export function setDurationSeconds(
  state: GameSessionState,
  durationSeconds: DurationSeconds,
): GameSessionState {
  if (state.status !== "idle" && state.status !== "completed") {
    return state;
  }

  return {
    ...state,
    durationSeconds,
  };
}

export function startCountdown(
  state: GameSessionState,
  createSessionId: () => string,
): GameSessionState {
  if (state.status !== "idle" && state.status !== "completed") {
    return state;
  }

  return {
    ...state,
    status: "countdown",
    sessionId: createSessionId(),
    currentTarget: null,
    ...EMPTY_SCORE,
  };
}

export function enterRunning(state: GameSessionState): GameSessionState {
  if (state.status !== "countdown") {
    return state;
  }

  return {
    ...state,
    status: "running",
  };
}

export function beginFinishing(state: GameSessionState): GameSessionState {
  if (state.status !== "running") {
    return state;
  }

  return {
    ...state,
    status: "finishing",
    currentTarget: null,
  };
}

export function complete(state: GameSessionState): GameSessionState {
  if (state.status !== "finishing") {
    return state;
  }

  return {
    ...state,
    status: "completed",
    currentTarget: null,
  };
}

export function reset(state: GameSessionState): GameSessionState {
  if (state.status !== "completed") {
    return state;
  }

  return createInitialSession(state.durationSeconds);
}

export function applyTarget(
  state: GameSessionState,
  target: Target,
): GameSessionState {
  if (state.status !== "running") {
    return state;
  }

  return {
    ...state,
    currentTarget: target,
  };
}

export function clearTarget(state: GameSessionState): GameSessionState {
  return {
    ...state,
    currentTarget: null,
  };
}

export function registerClick(
  state: GameSessionState,
  hit: boolean,
): GameSessionState {
  if (state.status !== "running") {
    return state;
  }

  const hitCount = state.hitCount + (hit ? 1 : 0);
  const missCount = state.missCount + (hit ? 0 : 1);
  const totalClickCount = state.totalClickCount + 1;

  return {
    ...state,
    hitCount,
    missCount,
    totalClickCount,
    score: hitCount,
  };
}

export function accuracyPercent(score: ScoreState): number | null {
  if (score.totalClickCount === 0) {
    return null;
  }

  return Math.round((score.hitCount / score.totalClickCount) * 100);
}
