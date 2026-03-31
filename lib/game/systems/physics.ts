import { WORLD_GRAVITY } from '@/lib/game/constants';
import { rectsOverlap, toRect } from '@/lib/game/core/math';
import type { Platform, PlayerEntity } from '@/types/game';

export const applyGravity = (entity: { vel: { y: number } }, dt: number): void => {
  entity.vel.y += WORLD_GRAVITY * dt;
};

export const moveEntity = (entity: { pos: { x: number; y: number }; vel: { x: number; y: number } }, dt: number): void => {
  entity.pos.x += entity.vel.x * dt;
  entity.pos.y += entity.vel.y * dt;
};

export const resolvePlayerPlatforms = (player: PlayerEntity, platforms: Platform[], groundY: number): void => {
  player.onGround = false;

  if (player.pos.y + player.size.y >= groundY) {
    player.pos.y = groundY - player.size.y;
    player.vel.y = 0;
    player.onGround = true;
  }

  for (const platform of platforms) {
    const platformRect = { x: platform.x, y: platform.y, width: platform.width, height: platform.height };
    const playerRect = toRect(player);

    if (!rectsOverlap(playerRect, platformRect)) {
      continue;
    }

    const playerBottomPrev = player.pos.y + player.size.y - player.vel.y * (1 / 60);
    if (playerBottomPrev <= platform.y && player.vel.y >= 0) {
      player.pos.y = platform.y - player.size.y;
      player.vel.y = 0;
      player.onGround = true;
    }
  }
};
