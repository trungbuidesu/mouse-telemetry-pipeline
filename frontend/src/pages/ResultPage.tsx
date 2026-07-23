import type { ReactElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionMetrics } from "@/hooks/useSessionMetrics";
import { loadClientSessionResult } from "@/utils/clientSessionResult";

function truncateSessionId(sessionId: string): string {
  if (sessionId.length <= 12) {
    return sessionId;
  }
  return `${sessionId.slice(0, 8)}…${sessionId.slice(-4)}`;
}

function MetricRow({ label, value }: { label: string; value: string }): ReactElement {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

export function ResultPage(): ReactElement {
  const { sessionId = "" } = useParams();
  const navigate = useNavigate();
  const clientResult = sessionId ? loadClientSessionResult(sessionId) : null;
  const { metrics } = useSessionMetrics(sessionId || undefined);

  const onPlayAgain = () => {
    navigate("/play", { state: { autoStart: true } });
  };

  if (!clientResult) {
    return (
      <main className="min-h-screen bg-background p-6 text-foreground">
        <section className="mx-auto max-w-4xl space-y-6">
          <header>
            <p className="text-sm text-muted-foreground">Session result</p>
            <h1 className="text-2xl font-semibold tracking-tight">Session completed</h1>
          </header>
          <Card>
            <CardHeader>
              <CardTitle>No client result found</CardTitle>
              <CardDescription>
                Play a session first so provisional metrics can be saved for{" "}
                {sessionId ? truncateSessionId(sessionId) : "this session"}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/play">Play</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  const backendBadge =
    metrics?.status === "completed" ? (
      <Badge variant="secondary">Completed</Badge>
    ) : metrics?.status === "error" ? (
      <Badge variant="destructive">Error</Badge>
    ) : (
      <Badge variant="outline">Processing</Badge>
    );

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Session result</p>
            <h1 className="text-2xl font-semibold tracking-tight">Session completed</h1>
            <p className="text-xs text-muted-foreground">
              Session ID: {truncateSessionId(clientResult.sessionId)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onPlayAgain}>
              Play again
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">View analytics</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/play">Play</Link>
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Client (provisional)</CardTitle>
              <CardDescription>Immediate results from this browser session</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <MetricRow label="Score" value={String(clientResult.score)} />
              <MetricRow
                label="Accuracy"
                value={
                  clientResult.accuracyPercent === null
                    ? "—"
                    : `${clientResult.accuracyPercent}%`
                }
              />
              <MetricRow label="Hits" value={String(clientResult.hitCount)} />
              <MetricRow label="Misses" value={String(clientResult.missCount)} />
              <MetricRow label="Events" value={String(clientResult.eventCount)} />
              <MetricRow label="Batches" value={String(clientResult.sentBatchCount)} />
              {clientResult.droppedEventCount > 0 ? (
                <MetricRow label="Dropped" value={String(clientResult.droppedEventCount)} />
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>Backend metrics</CardTitle>
                {backendBadge}
              </div>
              <CardDescription>
                Spark-processed metrics may arrive after the session ends
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {metrics?.status === "completed" ? (
                <>
                  <MetricRow label="Score" value={String(metrics.score)} />
                  <MetricRow label="Accuracy" value={`${metrics.accuracy}%`} />
                  {metrics.totalDistancePx !== undefined ? (
                    <MetricRow
                      label="Mouse distance"
                      value={`${metrics.totalDistancePx.toLocaleString()} px`}
                    />
                  ) : null}
                  {metrics.averageSpeedPxPerSecond !== undefined ? (
                    <MetricRow
                      label="Average speed"
                      value={`${metrics.averageSpeedPxPerSecond.toLocaleString()} px/s`}
                    />
                  ) : null}
                  {metrics.averageReactionTimeMs !== undefined ? (
                    <MetricRow
                      label="Average reaction"
                      value={`${metrics.averageReactionTimeMs} ms`}
                    />
                  ) : null}
                  {metrics.totalEvents !== undefined ? (
                    <MetricRow label="Total events" value={String(metrics.totalEvents)} />
                  ) : null}
                </>
              ) : null}
              {metrics?.status === "processing" || metrics === undefined ? (
                <p className="text-sm text-muted-foreground">Waiting for pipeline metrics…</p>
              ) : null}
              {metrics?.status === "error" ? (
                <p className="text-sm text-muted-foreground">{metrics.reason}</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
