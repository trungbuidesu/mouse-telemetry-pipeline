export const TELEMETRY_CONFIG = {
  sampleIntervalMs: 16,
  batchSize: 100,
  flushIntervalMs: 250,
  maxBufferedEvents: 20_000,
} as const;
