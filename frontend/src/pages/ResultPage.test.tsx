import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ClientSessionResult } from "@/utils/clientSessionResult";
import { saveClientSessionResult } from "@/utils/clientSessionResult";
import { ResultPage } from "./ResultPage";

vi.mock("@/hooks/useSessionMetrics", () => ({
  useSessionMetrics: () => ({
    metrics: { status: "processing" as const },
    isFetching: false,
    isError: false,
  }),
}));

const sample: ClientSessionResult = {
  sessionId: "session-xyz",
  score: 8,
  hitCount: 8,
  missCount: 2,
  totalClickCount: 10,
  accuracyPercent: 80,
  eventCount: 200,
  sentBatchCount: 3,
  droppedEventCount: 1,
  lastBatchEventCount: 40,
  durationSeconds: 30,
  completedAt: 1_700_000_000_000,
};

describe("ResultPage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders client provisional metrics and backend processing badge", () => {
    saveClientSessionResult(sample);

    render(
      <MemoryRouter initialEntries={["/result/session-xyz"]}>
        <Routes>
          <Route path="/result/:sessionId" element={<ResultPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Session completed")).toBeInTheDocument();
    expect(screen.getByText("Client (provisional)")).toBeInTheDocument();
    expect(screen.getByText("Backend metrics")).toBeInTheDocument();
    expect(screen.getByText("Processing")).toBeInTheDocument();
    expect(screen.getAllByText("8").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("Dropped")).toBeInTheDocument();
  });

  it("shows empty state when snapshot is missing", () => {
    render(
      <MemoryRouter initialEntries={["/result/missing-id"]}>
        <Routes>
          <Route path="/result/:sessionId" element={<ResultPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/No client result found/i)).toBeInTheDocument();
  });
});
