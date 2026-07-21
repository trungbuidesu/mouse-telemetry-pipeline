import { Database } from "lucide-react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardPage(): ReactElement {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Dashboard</p>
            <h1 className="text-2xl font-semibold tracking-tight">Analytics placeholder</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/">Home</Link>
          </Button>
        </header>

        <Tabs defaultValue="pipeline">
          <TabsList>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
          <TabsContent value="pipeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database aria-hidden="true" className="size-5" />
                  Big Data stack deferred
                </CardTitle>
                <CardDescription>
                  Kafka, Spark, MinIO, InfluxDB and Grafana remain future phase work.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Frontend and API foundations are prepared first.
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Session list</CardTitle>
                <CardDescription>No session data exists in phase0.</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}

