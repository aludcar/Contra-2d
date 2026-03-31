import { CANVAS_HEIGHT, CANVAS_WIDTH, MAX_DELTA, PLAYER_SPEED, WEAPONS, JUMP_SPEED } from '@/lib/game/constants';
import { clamp } from '@/lib/game/core/math';
import { consumeFrameInput } from '@/lib/game/core/input';
import { createBoss, createEnemy, createPickup, createPlayer } from '@/lib/game/entities/factories';
import { level1 } from '@/lib/game/levels/level1';
import { spawnPlayerBullets, handleCombatCollisions } from '@/lib/game/systems/combat';
import { updateEnemies } from '@/lib/game/systems/enemyAI';
import { applyGravity, moveEntity, resolvePlayerPlatforms } from '@/lib/game/systems/physics';
import type { GameState, InputState } from '@/types/game';

export const createInitialGameState = (highScore = 0): GameState => {
  const player = createPlayer();
  return {
    mode: 'start',
    player,
    enemies: level1.enemySpawns.map((spawn) =>
      createEnemy(spawn.type, spawn.x, spawn.y, spawn.patrolMin, spawn.patrolMax),
    ),
    bullets: [],
    pickups: level1.pickupSpawns.map((pickup) => createPickup(pickup.x, pickup.y, pickup.type)),
    effects: [],
    boss: null,
    camera: { x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
    level: level1,
    time: 0,
    shake: 0,
    flashTimer: 0,
    highScore,
    bossTriggered: false,
  };
};

export const resetRun = (state: GameState): GameState => {
  const fresh = createInitialGameState(Math.max(state.highScore, state.player.score));
  fresh.mode = 'playing';
  return fresh;
};

export const updateGameState = (state: GameState, input: InputState, dtRaw: number): GameState => {
  const dt = Math.min(MAX_DELTA, dtRaw);
  state.time += dt;

  if (state.mode === 'start') {
    if (input.startPressed) state.mode = 'playing';
    consumeFrameInput(input);
    return state;
  }

  if (state.mode === 'gameover' || state.mode === 'victory') {
    if (input.startPressed) {
      const next = resetRun(state);
      consumeFrameInput(input);
      return next;
    }
    consumeFrameInput(input);
    return state;
  }

  state.player.shootCooldown = Math.max(0, state.player.shootCooldown - dt);
  state.player.invulnTimer = Math.max(0, state.player.invulnTimer - dt);
  state.player.weaponTimer = Math.max(0, state.player.weaponTimer - dt);
  state.shake = Math.max(0, state.shake - dt);
  state.flashTimer = Math.max(0, state.flashTimer - dt);

  if (state.player.weaponTimer <= 0 && state.player.weapon.type !== 'pea') {
    state.player.weapon = { ...WEAPONS.pea };
  }

  state.player.vel.x = 0;
  if (input.left) {
    state.player.vel.x = -PLAYER_SPEED;
    state.player.facing = -1;
  }
  if (input.right) {
    state.player.vel.x = PLAYER_SPEED;
    state.player.facing = 1;
  }

  if (input.jumpPressed && state.player.onGround) {
    state.player.vel.y = -JUMP_SPEED;
    state.player.onGround = false;
  }

  if (input.shootHeld) {
    spawnPlayerBullets(state);
  }

  applyGravity(state.player, dt);
  moveEntity(state.player, dt);
  resolvePlayerPlatforms(state.player, state.level.platforms, state.level.groundY);

  if (state.player.pos.y > state.level.height + 100) {
    state.player.health = 0;
  }

  if (!state.bossTriggered && state.player.pos.x >= state.level.bossSpawnX - 280) {
    state.bossTriggered = true;
    state.boss = createBoss(state.level.bossSpawnX, state.level.groundY - 90);
  }

  updateEnemies(state, dt);

  for (const bullet of state.bullets) {
    bullet.ttl -= dt;
    moveEntity(bullet, dt);
    if (bullet.ttl <= 0) bullet.alive = false;
  }

  for (const pickup of state.pickups) {
    if (!pickup.alive) continue;
    pickup.bobTime += dt;
    pickup.pos.y += Math.sin(pickup.bobTime * 3) * 10 * dt;
  }

  for (const effect of state.effects) {
    effect.ttl -= dt;
    if (effect.ttl <= 0) effect.alive = false;
  }

  handleCombatCollisions(state);

  state.enemies = state.enemies.filter((e) => e.alive);
  state.bullets = state.bullets.filter((b) => b.alive);
  state.pickups = state.pickups.filter((p) => p.alive);
  state.effects = state.effects.filter((fx) => fx.alive);

  const maxCameraX = state.level.width - state.camera.width;
  const targetX = state.player.pos.x - state.camera.width * 0.35;
  state.camera.x = clamp(targetX, 0, maxCameraX);

  state.player.pos.x = clamp(state.player.pos.x, 0, state.level.width - state.player.size.x);

  if (state.player.score > state.highScore) {
    state.highScore = state.player.score;
  }

  consumeFrameInput(input);
  return state;
};
