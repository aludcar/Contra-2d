import { WEAPONS } from '@/lib/game/constants';
import { rectsOverlap, toRect } from '@/lib/game/core/math';
import { createBullet } from '@/lib/game/entities/factories';
import type { EnemyEntity, GameState } from '@/types/game';

export const spawnPlayerBullets = (state: GameState): void => {
  const { player } = state;

  if (player.shootCooldown > 0) {
    return;
  }

  const muzzleX = player.pos.x + (player.facing > 0 ? player.size.x + 2 : -10);
  const muzzleY = player.pos.y + 14;

  if (player.weapon.type === 'spread') {
    const speed = player.weapon.bulletSpeed * player.facing;
    state.bullets.push(createBullet('player', muzzleX, muzzleY, speed, -60, player.weapon.bulletDamage));
    state.bullets.push(createBullet('player', muzzleX, muzzleY, speed, 0, player.weapon.bulletDamage));
    state.bullets.push(createBullet('player', muzzleX, muzzleY, speed, 60, player.weapon.bulletDamage));
  } else {
    state.bullets.push(
      createBullet(
        'player',
        muzzleX,
        muzzleY,
        player.weapon.bulletSpeed * player.facing,
        0,
        player.weapon.bulletDamage,
      ),
    );
  }

  player.shootCooldown = player.weapon.fireRate;
};

const defeatEnemy = (enemy: EnemyEntity, state: GameState): void => {
  enemy.alive = false;
  state.player.score += enemy.enemyType === 'walker' ? 150 : 200;
  state.shake = 0.15;
  state.effects.push({
    id: `fx-${enemy.id}`,
    kind: 'effect',
    pos: { x: enemy.pos.x, y: enemy.pos.y },
    vel: { x: 0, y: 0 },
    size: { x: enemy.size.x, y: enemy.size.y },
    health: 1,
    maxHealth: 1,
    alive: true,
    ttl: 0.22,
    color: '#f77f00',
  });
};

export const handleCombatCollisions = (state: GameState): void => {
  const playerRect = toRect(state.player);

  for (const bullet of state.bullets) {
    if (!bullet.alive) continue;

    if (bullet.owner === 'player') {
      for (const enemy of state.enemies) {
        if (!enemy.alive) continue;
        if (rectsOverlap(toRect(bullet), toRect(enemy))) {
          bullet.alive = false;
          enemy.health -= bullet.damage;
          if (enemy.health <= 0) defeatEnemy(enemy, state);
          break;
        }
      }

      if (state.boss?.alive && bullet.alive && rectsOverlap(toRect(bullet), toRect(state.boss))) {
        bullet.alive = false;
        state.boss.health -= bullet.damage;
        state.player.score += 25;
        if (state.boss.health <= 0) {
          state.boss.alive = false;
          state.player.score += 5000;
          state.mode = 'victory';
          state.shake = 0.35;
        }
      }
    } else if (rectsOverlap(toRect(bullet), playerRect)) {
      bullet.alive = false;
      damagePlayer(state, bullet.damage);
    }
  }

  for (const enemy of state.enemies) {
    if (enemy.alive && rectsOverlap(toRect(enemy), playerRect)) {
      damagePlayer(state, enemy.damage);
    }
  }

  if (state.boss?.alive && rectsOverlap(toRect(state.boss), playerRect)) {
    damagePlayer(state, state.boss.damage);
  }

  for (const pickup of state.pickups) {
    if (!pickup.alive) continue;
    if (rectsOverlap(toRect(pickup), playerRect)) {
      pickup.alive = false;
      state.player.weapon = { ...WEAPONS[pickup.pickupType] };
      state.player.weaponTimer = 12;
      state.player.score += 250;
      state.flashTimer = 0.12;
    }
  }
};

export const damagePlayer = (state: GameState, damage: number): void => {
  if (state.player.invulnTimer > 0) return;
  state.player.health -= damage;
  state.player.invulnTimer = 1.2;
  state.flashTimer = 0.15;
  state.shake = 0.22;

  if (state.player.health <= 0) {
    state.player.lives -= 1;
    if (state.player.lives < 0) {
      state.mode = 'gameover';
      return;
    }

    state.player.health = state.player.maxHealth;
    state.player.pos.x = Math.max(80, state.player.pos.x - 180);
    state.player.pos.y = 390;
    state.player.vel.x = 0;
    state.player.vel.y = 0;
    state.player.invulnTimer = 2;
  }
};
