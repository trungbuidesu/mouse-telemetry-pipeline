import {
  DEFAULT_SESSION_SETTINGS,
  type DurationSeconds,
  type GameSessionState,
} from "./types";

export function createInitialSession(
  durationSeconds: DurationSeconds = DEFAULT_SESSION_SETTINGS.durationSeconds,
): GameSessionState {
  return {
    status: "idle",
    durationSeconds,
    sessionId: null,
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
  };
}

export function complete(state: GameSessionState): GameSessionState {
  if (state.status !== "finishing") {
    return state;
  }

  return {
    ...state,
    status: "completed",
  };
}

export function reset(state: GameSessionState): GameSessionState {
  if (state.status !== "completed") {
    return state;
  }

  return createInitialSession(state.durationSeconds);
}
