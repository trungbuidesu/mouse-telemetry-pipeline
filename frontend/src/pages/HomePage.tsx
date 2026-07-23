import { Activity, Gauge, Target } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function HomePage(): ReactElement {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mouse Telemetry Pipeline</p>
              <h1 className="text-xl font-semibold tracking-tight">MouseStream</h1>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link to="/play">Play</Link>
            </Button>
          </nav>
        </header>

        <div className="grid flex-1 items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge variant="secondary">Phase 1 gameplay shell</Badge>
            <div className="space-y-4">
              <h2 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight">
                Aim Trainer prepared for high-frequency telemetry capture.
              </h2>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Open the trainer to run session lifecycle controls on the playable `/play` route.
                Target hit detection and score arrive in the next task.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/play">
                  <Target aria-hidden="true" className="size-4" />
                  Open trainer
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">
                  <Gauge aria-hidden="true" className="size-4" />
                  View dashboard
                </Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Foundation status</CardTitle>
              <CardDescription>Gameplay and ingestion are intentionally deferred.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <StatusRow label="UI stack" value="Vite + React + shadcn/ui" />
              <StatusRow label="Server state" value="TanStack Query boundary" />
              <StatusRow label="Telemetry hot path" value="Plain TS modules + refs later" />
              <Separator />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline">No gameplay yet</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Phase 1 will add canvas gameplay and telemetry capture.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

type StatusRowProps = {
  label: string;
  value: string;
};

function StatusRow({ label, value }: StatusRowProps): ReactElement {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

