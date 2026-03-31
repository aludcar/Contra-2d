'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { HUD } from '@/components/game/HUD';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/lib/game/constants';
import { useInput } from '@/lib/game/core/input';
import { createInitialGameState, updateGameState } from '@/lib/game/core/state';
import { renderGame } from '@/lib/game/systems/render';
import type { GameState } from '@/types/game';

const STORAGE_KEY = 'retro-runner-high-score';

const loadHighScore = (): number => {
  if (typeof window === 'undefined') return 0;
  const value = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(value ?? '0');
  return Number.isFinite(parsed) ? parsed : 0;
};

export function GameCanvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState | null>(null);
  const inputRef = useInput();
  const [uiState, setUiState] = useState<GameState | null>(null);

  const scaleStyle = useMemo(
    () => ({
      width: 'min(100vw, 1200px)',
      height: 'auto',
      imageRendering: 'pixelated' as const,
    }),
    [],
  );

  useEffect(() => {
    const initial = createInitialGameState(loadHighScore());
    stateRef.current = initial;
    setUiState({ ...initial });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let lastTime = performance.now();

    const tick = (now: number): void => {
      const current = stateRef.current;
      if (!current) return;

      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const next = updateGameState(current, inputRef.current, dt);
      stateRef.current = next;

      if (next.highScore > 0) {
        window.localStorage.setItem(STORAGE_KEY, String(next.highScore));
      }

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      renderGame(ctx, next);

      setUiState((prev) => {
        if (!prev || prev.time + 0.045 < next.time || prev.mode !== next.mode || prev.player.health !== next.player.health) {
          return { ...next };
        }
        return prev;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [inputRef]);

  return (
    <div className="gameShell">
      {uiState ? <HUD state={uiState} /> : null}
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={scaleStyle} className="gameCanvas" />
      <div className="overlay">
        {uiState?.mode === 'start' ? (
          <>
            <h1>OPERATION IRON FALCON</h1>
            <p>Run. Jump. Blast through hostile lines.</p>
            <p>Press ENTER to start</p>
          </>
        ) : null}
        {uiState?.mode === 'gameover' ? (
          <>
            <h1>MISSION FAILED</h1>
            <p>Score: {uiState.player.score}</p>
            <p>Press ENTER to retry</p>
          </>
        ) : null}
        {uiState?.mode === 'victory' ? (
          <>
            <h1>SECTOR CLEARED</h1>
            <p>Score: {uiState.player.score}</p>
            <p>Press ENTER for new run</p>
          </>
        ) : null}
      </div>
      <div className="controls">
        Controls: Move (Arrow Keys / WASD), Jump (Space / J), Shoot (K / X), Start/Restart (Enter)
      </div>
    </div>
  );
}
