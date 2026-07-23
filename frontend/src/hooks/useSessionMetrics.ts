import { useQuery } from "@tanstack/react-query";

import {
  fetchSessionMetrics,
  isTerminalMetricsStatus,
  type SessionMetricsResponse,
} from "@/api/analyticsApi";

export type UseSessionMetricsApi = {
  metrics: SessionMetricsResponse | undefined;
  isFetching: boolean;
  isError: boolean;
};

const POLL_INTERVAL_MS = 2_000;

export function useSessionMetrics(sessionId: string | undefined): UseSessionMetricsApi {
  const query = useQuery({
    queryKey: ["session-metrics", sessionId],
    enabled: typeof sessionId === "string" && sessionId.length > 0,
    queryFn: async (): Promise<SessionMetricsResponse> => {
      if (!sessionId) {
        return { status: "error", reason: "missing sessionId" };
      }
      return fetchSessionMetrics(sessionId);
    },
    refetchInterval: (queryState) => {
      const data = queryState.state.data;
      if (data && isTerminalMetricsStatus(data.status)) {
        return false;
      }
      return POLL_INTERVAL_MS;
    },
  });

  return {
    metrics: query.data,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}
