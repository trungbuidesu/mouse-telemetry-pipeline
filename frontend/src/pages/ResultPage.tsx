import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultPage(): ReactElement {
  const { sessionId = "pending-session" } = useParams();

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Session result</p>
            <h1 className="text-2xl font-semibold tracking-tight">Result placeholder</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/play">Play</Link>
          </Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Session {sessionId}</CardTitle>
            <CardDescription>
              Phase 1 will show client metrics. Later phases will add processed API metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Processing model not implemented yet</Badge>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

