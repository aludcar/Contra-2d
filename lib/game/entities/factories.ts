import { BULLET_SIZE, PLAYER_SIZE, WEAPONS } from '@/lib/game/constants';
import type { BossEntity, BulletEntity, EnemyEntity, PickupEntity, PlayerEntity, WeaponType } from '@/types/game';

const id = (prefix: string): string => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const createPlayer = (): PlayerEntity => ({
  id: id('player'),
  kind: 'player',
  pos: { x: 80, y: 390 },
  vel: { x: 0, y: 0 },
  size: { ...PLAYER_SIZE },
  health: 5,
  maxHealth: 5,
  alive: true,
  onGround: false,
  facing: 1,
  lives: 3,
  score: 0,
  invulnTimer: 0,
  shootCooldown: 0,
  weapon: { ...WEAPONS.pea },
  weaponTimer: 0,
});

export const createEnemy = (
  type: 'walker' | 'drone',
  x: number,
  y: number,
  patrolMin: number,
  patrolMax: number,
): EnemyEntity => ({
  id: id(type),
  kind: 'enemy',
  enemyType: type,
  pos: { x, y },
  vel: { x: type === 'walker' ? 65 : 90, y: 0 },
  size: { x: type === 'walker' ? 26 : 24, y: type === 'walker' ? 34 : 20 },
  health: type === 'walker' ? 2 : 1,
  maxHealth: type === 'walker' ? 2 : 1,
  alive: true,
  damage: 1,
  speed: type === 'walker' ? 65 : 90,
  patrol: { minX: patrolMin, maxX: patrolMax },
  shootCooldown: type === 'drone' ? 2.8 : undefined,
  patternTime: 0,
});

export const createBoss = (x: number, y: number): BossEntity => ({
  id: id('boss'),
  kind: 'boss',
  pos: { x, y },
  vel: { x: 80, y: 0 },
  size: { x: 96, y: 90 },
  health: 30,
  maxHealth: 30,
  alive: true,
  damage: 2,
  phase: 1,
  moveBounds: { minX: x - 140, maxX: x + 100 },
  shootCooldown: 1.2,
  burstShots: 3,
  patternTimer: 0,
});

export const createBullet = (
  owner: 'player' | 'enemy',
  x: number,
  y: number,
  vx: number,
  vy: number,
  damage: number,
): BulletEntity => ({
  id: id('bullet'),
  kind: 'bullet',
  owner,
  pos: { x, y },
  vel: { x: vx, y: vy },
  size: { ...BULLET_SIZE },
  health: 1,
  maxHealth: 1,
  alive: true,
  damage,
  ttl: 2,
});

export const createPickup = (x: number, y: number, pickupType: WeaponType): PickupEntity => ({
  id: id('pickup'),
  kind: 'pickup',
  pickupType,
  pos: { x, y },
  vel: { x: 0, y: 0 },
  size: { x: 18, y: 18 },
  health: 1,
  maxHealth: 1,
  alive: true,
  bobTime: 0,
});
