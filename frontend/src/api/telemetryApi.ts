import type { TelemetryBatch } from "@/telemetry/telemetryTypes";

export type StreamStatus = "idle" | "connected" | "buffering" | "offline" | "error";

export type BatchSendSuccess = {
  ok: true;
  accepted: true;
  batchSequence: number;
  eventCount: number;
};

export type BatchSendFailure = {
  ok: false;
  retryable: boolean;
  status?: number;
  reason?: string;
};

export type BatchSendResult = BatchSendSuccess | BatchSendFailure;

export type SendTelemetryBatchOptions = {
  baseUrl?: string;
  fetchFn?: typeof fetch;
};

export function classifyBatchHttpStatus(status: number): { retryable: boolean } {
  if (status === 429 || status === 503) {
    return { retryable: true };
  }
  return { retryable: false };
}

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

export async function sendTelemetryBatch(
  batch: TelemetryBatch,
  options: SendTelemetryBatchOptions = {},
): Promise<BatchSendResult> {
  const fetchFn = options.fetchFn ?? fetch;
  const baseUrl = resolveBaseUrl(options.baseUrl);
  const url = `${baseUrl}/api/v1/events/batch`;

  try {
    const response = await fetchFn(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });

    if (response.status === 202) {
      const body = (await response.json()) as {
        accepted?: boolean;
        batchSequence?: number;
        eventCount?: number;
      };
      return {
        ok: true,
        accepted: true,
        batchSequence: body.batchSequence ?? batch.batchSequence,
        eventCount: body.eventCount ?? batch.events.length,
      };
    }

    const { retryable } = classifyBatchHttpStatus(response.status);
    return {
      ok: false,
      retryable,
      status: response.status,
      reason: `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      retryable: true,
      reason: error instanceof Error ? error.message : "network error",
    };
  }
}
