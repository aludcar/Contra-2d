import { CANVAS_HEIGHT, CANVAS_WIDTH, COLORS } from '@/lib/game/constants';
import type { BossEntity, EnemyEntity, GameState, PlayerEntity } from '@/types/game';

const drawParallax = (ctx: CanvasRenderingContext2D, cameraX: number): void => {
  ctx.fillStyle = COLORS.bgSky;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = COLORS.bgFar;
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 280 - cameraX * 0.2) % (CANVAS_WIDTH + 280)) - 120;
    ctx.fillRect(x, 190, 190, 220);
  }

  ctx.fillStyle = COLORS.bgNear;
  for (let i = 0; i < 8; i += 1) {
    const x = ((i * 220 - cameraX * 0.45) % (CANVAS_WIDTH + 240)) - 100;
    ctx.fillRect(x, 250, 130, 220);
  }
};

const drawPlayer = (ctx: CanvasRenderingContext2D, player: PlayerEntity, cameraX: number, flicker: boolean): void => {
  if (flicker && Math.floor(performance.now() / 70) % 2 === 0) {
    return;
  }

  const x = player.pos.x - cameraX;
  const y = player.pos.y;

  ctx.fillStyle = COLORS.playerBody;
  ctx.fillRect(x + 6, y + 10, 16, 28);

  ctx.fillStyle = COLORS.playerHead;
  ctx.fillRect(x + 8, y, 12, 12);

  ctx.fillStyle = '#ffffff';
  const gunX = player.facing === 1 ? x + 22 : x - 4;
  ctx.fillRect(gunX, y + 15, 8, 4);
};

const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: EnemyEntity, cameraX: number): void => {
  const x = enemy.pos.x - cameraX;
  const y = enemy.pos.y;

  if (enemy.enemyType === 'walker') {
    ctx.fillStyle = COLORS.enemyWalker;
    ctx.fillRect(x, y + 8, enemy.size.x, enemy.size.y - 8);
    ctx.fillStyle = '#ffcad4';
    ctx.fillRect(x + 5, y, 14, 10);
  } else {
    ctx.fillStyle = COLORS.enemyDrone;
    ctx.fillRect(x, y, enemy.size.x, enemy.size.y);
    ctx.fillStyle = '#caf0f8';
    ctx.fillRect(x + 4, y + 6, 16, 6);
  }
};

const drawBoss = (ctx: CanvasRenderingContext2D, boss: BossEntity, cameraX: number): void => {
  const x = boss.pos.x - cameraX;
  const y = boss.pos.y;

  ctx.fillStyle = COLORS.boss;
  ctx.fillRect(x, y, boss.size.x, boss.size.y);
  ctx.fillStyle = '#e0aaff';
  ctx.fillRect(x + 16, y + 20, 18, 16);
  ctx.fillRect(x + 62, y + 20, 18, 16);
};

export const renderGame = (ctx: CanvasRenderingContext2D, state: GameState): void => {
  const shakeX = state.shake > 0 ? (Math.random() - 0.5) * 8 : 0;
  const shakeY = state.shake > 0 ? (Math.random() - 0.5) * 8 : 0;

  ctx.save();
  ctx.translate(shakeX, shakeY);

  drawParallax(ctx, state.camera.x);

  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, state.level.groundY, CANVAS_WIDTH, CANVAS_HEIGHT - state.level.groundY);

  ctx.fillStyle = COLORS.platform;
  for (const platform of state.level.platforms) {
    ctx.fillRect(platform.x - state.camera.x, platform.y, platform.width, platform.height);
  }

  drawPlayer(ctx, state.player, state.camera.x, state.player.invulnTimer > 0);

  for (const enemy of state.enemies) {
    drawEnemy(ctx, enemy, state.camera.x);
  }

  if (state.boss?.alive) {
    drawBoss(ctx, state.boss, state.camera.x);
  }

  for (const pickup of state.pickups) {
    ctx.fillStyle = COLORS.pickup;
    ctx.fillRect(pickup.pos.x - state.camera.x, pickup.pos.y, pickup.size.x, pickup.size.y);
    ctx.fillStyle = '#22577a';
    ctx.fillRect(pickup.pos.x - state.camera.x + 4, pickup.pos.y + 4, 10, 10);
  }

  for (const bullet of state.bullets) {
    ctx.fillStyle = bullet.owner === 'player' ? COLORS.bulletPlayer : COLORS.bulletEnemy;
    ctx.fillRect(bullet.pos.x - state.camera.x, bullet.pos.y, bullet.size.x, bullet.size.y);
  }

  for (const effect of state.effects) {
    ctx.fillStyle = effect.color;
    ctx.globalAlpha = Math.max(0, effect.ttl / 0.22);
    ctx.fillRect(effect.pos.x - state.camera.x, effect.pos.y, effect.size.x, effect.size.y);
    ctx.globalAlpha = 1;
  }

  if (state.flashTimer > 0) {
    ctx.fillStyle = `rgba(255,255,255,${Math.min(0.35, state.flashTimer * 2)})`;
    ctx.fillRect(-20, -20, CANVAS_WIDTH + 40, CANVAS_HEIGHT + 40);
  }

  ctx.restore();
};
