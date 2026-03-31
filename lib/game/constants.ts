import type { WeaponConfig } from '@/types/game';

export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 540;
export const WORLD_GRAVITY = 1900;
export const PLAYER_SPEED = 250;
export const JUMP_SPEED = 640;
export const PLAYER_SIZE = { x: 28, y: 40 };
export const BULLET_SIZE = { x: 8, y: 4 };
export const MAX_DELTA = 1 / 30;

export const WEAPONS: Record<string, WeaponConfig> = {
  pea: {
    type: 'pea',
    fireRate: 0.25,
    bulletSpeed: 480,
    bulletDamage: 1,
  },
  rapid: {
    type: 'rapid',
    fireRate: 0.1,
    bulletSpeed: 520,
    bulletDamage: 1,
  },
  spread: {
    type: 'spread',
    fireRate: 0.2,
    bulletSpeed: 480,
    bulletDamage: 1,
  },
};

export const COLORS = {
  bgSky: '#123055',
  bgFar: '#1d4c7d',
  bgNear: '#2b6596',
  ground: '#3a5a40',
  platform: '#6d6875',
  playerBody: '#f4d35e',
  playerHead: '#ee964b',
  enemyWalker: '#d7263d',
  enemyDrone: '#4cc9f0',
  boss: '#8338ec',
  bulletPlayer: '#f1fa8c',
  bulletEnemy: '#ff6b6b',
  pickup: '#80ed99',
};
