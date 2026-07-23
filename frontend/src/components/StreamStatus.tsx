import type { ReactElement } from "react";

import type { StreamStatus as StreamStatusValue } from "@/api/telemetryApi";
import { Badge } from "@/components/ui/badge";

export type StreamStatusProps = {
  status: StreamStatusValue;
  eventCount: number;
  sentBatchCount: number;
  lastBatchEventCount: number;
  droppedEventCount: number;
};

type StatusPresentation = {
  label: string;
  variant: "outline" | "secondary" | "destructive";
  dotClassName: string;
};

function presentationFor(status: StreamStatusValue): StatusPresentation {
  switch (status) {
    case "idle":
      return {
        label: "Idle",
        variant: "outline",
        dotClassName: "bg-muted-foreground/50",
      };
    case "connected":
      return {
        label: "Connected",
        variant: "secondary",
        dotClassName: "bg-emerald-500",
      };
    case "buffering":
      return {
        label: "Buffering",
        variant: "secondary",
        dotClassName: "bg-amber-500",
      };
    case "offline":
      return {
        label: "Offline",
        variant: "destructive",
        dotClassName: "bg-white",
      };
    case "error":
      return {
        label: "Error",
        variant: "destructive",
        dotClassName: "bg-white",
      };
  }
}

export function StreamStatus({
  status,
  eventCount,
  sentBatchCount,
  lastBatchEventCount,
  droppedEventCount,
}: StreamStatusProps): ReactElement {
  const { label, variant, dotClassName } = presentationFor(status);

  const summaryParts = [
    `Pipeline: ${label}`,
    `Last batch: ${lastBatchEventCount} events`,
    `Events: ${eventCount}`,
    `Batches: ${sentBatchCount}`,
  ];
  if (droppedEventCount > 0) {
    summaryParts.push(`Dropped: ${droppedEventCount}`);
  }

  return (
    <div className="grid gap-2">
      <Badge variant={variant} className="gap-1.5">
        <span className={`size-1.5 rounded-full ${dotClassName}`} aria-hidden="true" />
        {`Stream: ${label}`}
      </Badge>
      <p className="text-xs text-muted-foreground">{summaryParts.join(" | ")}</p>
    </div>
  );
}
