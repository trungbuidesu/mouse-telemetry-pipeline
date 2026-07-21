import { Crosshair } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function TrainerPage(): ReactElement {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto grid max-w-6xl gap-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Aim Trainer</p>
            <h1 className="text-2xl font-semibold tracking-tight">Training canvas placeholder</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/">Home</Link>
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair aria-hidden="true" className="size-5" />
              Canvas foundation
            </CardTitle>
            <CardDescription>
              Phase 1 will attach canvas rendering, gameplay state and telemetry collection here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex aspect-video items-center justify-center rounded-md border border-dashed bg-muted/30">
              <p className="text-sm text-muted-foreground">No gameplay implementation in phase0.</p>
            </div>
            <Progress value={0} />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

