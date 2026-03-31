import type { GameState } from '@/types/game';

interface HUDProps {
  state: GameState;
}

export function HUD({ state }: HUDProps): JSX.Element {
  const bossRatio = state.boss?.alive ? state.boss.health / state.boss.maxHealth : 0;

  return (
    <div className="hud">
      <div className="row">
        <span>LIVES: {Math.max(0, state.player.lives)}</span>
        <span>HP: {state.player.health}/{state.player.maxHealth}</span>
        <span>SCORE: {state.player.score}</span>
        <span>HIGH: {state.highScore}</span>
        <span>WEAPON: {state.player.weapon.type.toUpperCase()}</span>
      </div>
      {state.boss?.alive ? (
        <div className="bossWrap">
          <div className="bossLabel">BOSS</div>
          <div className="bossBar">
            <div className="bossFill" style={{ width: `${Math.max(0, bossRatio) * 100}%` }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
