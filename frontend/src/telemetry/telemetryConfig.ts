export const TELEMETRY_CONFIG = {
  sampleIntervalMs: 16,
  batchSize: 100,
  flushIntervalMs: 250,
  maxBufferedEvents: 20_000,
  maxRetries: 3,
  retryBackoffMs: [500, 1_000, 2_000],
} as const;
