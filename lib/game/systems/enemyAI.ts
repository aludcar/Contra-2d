import { clamp } from '@/lib/game/core/math';
import { createBullet } from '@/lib/game/entities/factories';
import type { BossEntity, EnemyEntity, GameState } from '@/types/game';

const updateWalker = (enemy: EnemyEntity, dt: number): void => {
  enemy.pos.x += enemy.vel.x * dt;
  if (enemy.pos.x <= enemy.patrol.minX) enemy.vel.x = enemy.speed;
  if (enemy.pos.x + enemy.size.x >= enemy.patrol.maxX) enemy.vel.x = -enemy.speed;
};

const updateDrone = (enemy: EnemyEntity, dt: number, state: GameState): void => {
  enemy.patternTime += dt;
  enemy.pos.x += enemy.vel.x * dt;
  enemy.pos.y += Math.sin(enemy.patternTime * 3.5) * 26 * dt;

  if (enemy.pos.x <= enemy.patrol.minX) enemy.vel.x = enemy.speed;
  if (enemy.pos.x + enemy.size.x >= enemy.patrol.maxX) enemy.vel.x = -enemy.speed;

  if (enemy.shootCooldown !== undefined) {
    enemy.shootCooldown -= dt;
    if (enemy.shootCooldown <= 0 && Math.abs(state.player.pos.x - enemy.pos.x) < 480) {
      const direction = state.player.pos.x < enemy.pos.x ? -1 : 1;
      state.bullets.push(createBullet('enemy', enemy.pos.x + enemy.size.x / 2, enemy.pos.y + 8, direction * 260, 0, 1));
      enemy.shootCooldown = 2.2;
    }
  }
};

const updateBoss = (boss: BossEntity, dt: number, state: GameState): void => {
  boss.patternTimer += dt;
  boss.pos.x += boss.vel.x * dt;

  if (boss.pos.x <= boss.moveBounds.minX) boss.vel.x = Math.abs(boss.vel.x);
  if (boss.pos.x + boss.size.x >= boss.moveBounds.maxX) boss.vel.x = -Math.abs(boss.vel.x);

  const healthRatio = boss.health / boss.maxHealth;
  boss.phase = healthRatio < 0.45 ? 3 : healthRatio < 0.75 ? 2 : 1;
  boss.shootCooldown -= dt;

  if (boss.shootCooldown <= 0) {
    const centerX = boss.pos.x + boss.size.x / 2;
    const baseY = boss.pos.y + 24;
    const spread = boss.phase === 1 ? [0] : boss.phase === 2 ? [-80, 0, 80] : [-120, -40, 40, 120];
    for (const vy of spread) {
      const directionX = state.player.pos.x < centerX ? -220 : 220;
      state.bullets.push(createBullet('enemy', centerX, baseY, directionX, vy, 1));
    }

    boss.shootCooldown = clamp(1.45 - boss.phase * 0.2, 0.6, 1.3);
  }
};

export const updateEnemies = (state: GameState, dt: number): void => {
  for (const enemy of state.enemies) {
    if (!enemy.alive) continue;
    if (enemy.enemyType === 'walker') updateWalker(enemy, dt);
    if (enemy.enemyType === 'drone') updateDrone(enemy, dt, state);
  }

  if (state.boss?.alive) {
    updateBoss(state.boss, dt, state);
  }
};
