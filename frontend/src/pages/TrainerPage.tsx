import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import { AimCanvas } from "@/components/AimCanvas";
import { SessionHUD } from "@/components/SessionHUD";
import { Button } from "@/components/ui/button";
import { useAimTrainer } from "@/hooks/useAimTrainer";

export function TrainerPage(): ReactElement {
  const trainer = useAimTrainer();

  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <section className="mx-auto grid max-w-6xl gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Aim Trainer</p>
            <h1 className="text-2xl font-semibold tracking-tight">Gameplay</h1>
          </div>
          <Button asChild variant="outline">
            <Link to="/">Home</Link>
          </Button>
        </header>

        <SessionHUD
          status={trainer.status}
          durationSeconds={trainer.durationSeconds}
          countdownRemaining={trainer.countdownRemaining}
          timeRemaining={trainer.timeRemaining}
          score={trainer.score}
          accuracyLabel={trainer.accuracyLabel}
          sessionId={trainer.sessionId}
          streamStatus={trainer.streamStatus}
          eventCount={trainer.eventCount}
          sentBatchCount={trainer.sentBatchCount}
          droppedEventCount={trainer.droppedEventCount}
          onDurationChange={trainer.setDuration}
          onStart={trainer.start}
          onStop={trainer.stop}
          onPlayAgain={trainer.playAgain}
          onReset={trainer.resetSession}
        />

        <AimCanvas
          canvasRef={trainer.canvasRef}
          status={trainer.status}
          onPointerMove={trainer.onPointerMove}
          onPointerDown={trainer.onPointerDown}
        />
      </section>
    </main>
  );
}
