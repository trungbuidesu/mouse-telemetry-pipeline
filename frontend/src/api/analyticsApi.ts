export type SessionMetricsProcessing = {
  status: "processing";
};

export type SessionMetricsCompleted = {
  status: "completed";
  sessionId: string;
  score: number;
  accuracy: number;
  averageReactionTimeMs?: number;
  averageSpeedPxPerSecond?: number;
  totalDistancePx?: number;
  totalEvents?: number;
};

export type SessionMetricsError = {
  status: "error";
  reason: string;
};

export type SessionMetricsResponse =
  | SessionMetricsProcessing
  | SessionMetricsCompleted
  | SessionMetricsError;

export type FetchSessionMetricsOptions = {
  baseUrl?: string;
  fetchFn?: typeof fetch;
};

function resolveBaseUrl(explicit?: string): string {
  if (explicit !== undefined && explicit.length > 0) {
    return explicit.replace(/\/$/, "");
  }
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  if (typeof fromEnv === "string" && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, "");
  }
  return "http://127.0.0.1:8001";
}

function parseMetricsBody(body: unknown): SessionMetricsResponse {
  if (body === null || typeof body !== "object") {
    return { status: "error", reason: "invalid metrics payload" };
  }

  const record = body as Record<string, unknown>;
  if (record.status === "processing") {
    return { status: "processing" };
  }

  if (record.status === "completed") {
    if (
      typeof record.sessionId !== "string" ||
      typeof record.score !== "number" ||
      typeof record.accuracy !== "number"
    ) {
      return { status: "error", reason: "invalid completed metrics payload" };
    }

    const completed: SessionMetricsCompleted = {
      status: "completed",
      sessionId: record.sessionId,
      score: record.score,
      accuracy: record.accuracy,
    };

    if (typeof record.averageReactionTimeMs === "number") {
      completed.averageReactionTimeMs = record.averageReactionTimeMs;
    }
    if (typeof record.averageSpeedPxPerSecond === "number") {
      completed.averageSpeedPxPerSecond = record.averageSpeedPxPerSecond;
    }
    if (typeof record.totalDistancePx === "number") {
      completed.totalDistancePx = record.totalDistancePx;
    }
    if (typeof record.totalEvents === "number") {
      completed.totalEvents = record.totalEvents;
    }

    return completed;
  }

  if (record.status === "error" && typeof record.reason === "string") {
    return { status: "error", reason: record.reason };
  }

  return { status: "error", reason: "unknown metrics status" };
}

export async function fetchSessionMetrics(
  sessionId: string,
  options: FetchSessionMetricsOptions = {},
): Promise<SessionMetricsResponse> {
  const fetchFn = options.fetchFn ?? fetch;
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const url = `${baseUrl}/api/v1/sessions/${encodeURIComponent(sessionId)}/metrics`;

  try {
    const response = await fetchFn(url, { method: "GET" });
    if (!response.ok) {
      return { status: "error", reason: `HTTP ${response.status}` };
    }

    const body: unknown = await response.json();
    return parseMetricsBody(body);
  } catch (error) {
    return {
      status: "error",
      reason: error instanceof Error ? error.message : "network error",
    };
  }
}

export function isTerminalMetricsStatus(status: SessionMetricsResponse["status"]): boolean {
  return status === "completed" || status === "error";
}
