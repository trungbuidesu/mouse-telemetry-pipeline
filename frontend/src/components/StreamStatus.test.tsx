import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { StreamStatus as StreamStatusValue } from "@/api/telemetryApi";
import { StreamStatus } from "./StreamStatus";

const baseProps = {
  eventCount: 42,
  sentBatchCount: 3,
  lastBatchEventCount: 100,
  droppedEventCount: 0,
};

const statuses: Array<{ status: StreamStatusValue; label: string }> = [
  { status: "idle", label: "Idle" },
  { status: "connected", label: "Connected" },
  { status: "buffering", label: "Buffering" },
  { status: "offline", label: "Offline" },
  { status: "error", label: "Error" },
];

describe("StreamStatus", () => {
  it.each(statuses)("renders $label label for status $status", ({ status, label }) => {
    render(<StreamStatus status={status} {...baseProps} />);

    expect(screen.getByText(`Stream: ${label}`)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Pipeline:\\s*${label}`))).toBeInTheDocument();
  });

  it("shows pipeline summary with last batch and counters", () => {
    render(<StreamStatus status="connected" {...baseProps} />);

    expect(screen.getByText(/Last batch:\s*100 events/)).toBeInTheDocument();
    expect(screen.getByText(/Events:\s*42/)).toBeInTheDocument();
    expect(screen.getByText(/Batches:\s*3/)).toBeInTheDocument();
    expect(screen.queryByText(/Dropped:/)).not.toBeInTheDocument();
  });

  it("shows dropped count only when greater than zero", () => {
    render(<StreamStatus status="offline" {...baseProps} droppedEventCount={7} />);

    expect(screen.getByText(/Dropped:\s*7/)).toBeInTheDocument();
  });
});
