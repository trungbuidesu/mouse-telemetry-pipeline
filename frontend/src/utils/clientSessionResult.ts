const STORAGE_PREFIX = "aim-trainer:client-result:";

export type ClientSessionResult = {
  sessionId: string;
  score: number;
  hitCount: number;
  missCount: number;
  totalClickCount: number;
  accuracyPercent: number | null;
  eventCount: number;
  sentBatchCount: number;
  droppedEventCount: number;
  lastBatchEventCount: number;
  durationSeconds: 30 | 60;
  completedAt: number;
};

function storageKey(sessionId: string): string {
  return `${STORAGE_PREFIX}${sessionId}`;
}

function isClientSessionResult(value: unknown): value is ClientSessionResult {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.sessionId === "string" &&
    typeof record.score === "number" &&
    typeof record.hitCount === "number" &&
    typeof record.missCount === "number" &&
    typeof record.totalClickCount === "number" &&
    (record.accuracyPercent === null || typeof record.accuracyPercent === "number") &&
    typeof record.eventCount === "number" &&
    typeof record.sentBatchCount === "number" &&
    typeof record.droppedEventCount === "number" &&
    typeof record.lastBatchEventCount === "number" &&
    (record.durationSeconds === 30 || record.durationSeconds === 60) &&
    typeof record.completedAt === "number"
  );
}

export function saveClientSessionResult(result: ClientSessionResult): void {
  sessionStorage.setItem(storageKey(result.sessionId), JSON.stringify(result));
}

export function loadClientSessionResult(sessionId: string): ClientSessionResult | null {
  const raw = sessionStorage.getItem(storageKey(sessionId));
  if (raw === null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isClientSessionResult(parsed) || parsed.sessionId !== sessionId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearClientSessionResult(sessionId: string): void {
  sessionStorage.removeItem(storageKey(sessionId));
}
