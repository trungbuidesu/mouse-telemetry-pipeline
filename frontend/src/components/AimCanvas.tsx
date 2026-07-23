import type { PointerEvent, ReactElement, RefObject } from "react";

import type { GameStatus } from "@/game/types";

type AimCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  status: GameStatus;
  onPointerMove: (event: PointerEvent<HTMLCanvasElement>) => void;
  onPointerDown: (event: PointerEvent<HTMLCanvasElement>) => void;
};

export function AimCanvas({
  canvasRef,
  status,
  onPointerMove,
  onPointerDown,
}: AimCanvasProps): ReactElement {
  return (
    <div className="relative overflow-hidden rounded-md border bg-slate-950">
      <canvas
        ref={canvasRef}
        data-testid="aim-canvas"
        className="block aspect-video w-full touch-none"
        aria-label="Aim trainer play area"
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
      />
      {status === "countdown" ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40">
          <p className="text-sm font-medium text-slate-100">Get ready</p>
        </div>
      ) : null}
    </div>
  );
}
