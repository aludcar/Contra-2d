export type GameMode = 'start' | 'playing' | 'gameover' | 'victory';

export interface Vector2 {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Facing = -1 | 1;
export type WeaponType = 'pea' | 'rapid' | 'spread';

export interface WeaponConfig {
  type: WeaponType;
  fireRate: number;
  bulletSpeed: number;
  bulletDamage: number;
}

export interface BaseEntity {
  id: string;
  kind: 'player' | 'enemy' | 'boss' | 'bullet' | 'pickup' | 'effect';
  pos: Vector2;
  vel: Vector2;
  size: Vector2;
  health: number;
  maxHealth: number;
  alive: boolean;
}

export interface PlayerEntity extends BaseEntity {
  kind: 'player';
  onGround: boolean;
  facing: Facing;
  lives: number;
  score: number;
  invulnTimer: number;
  shootCooldown: number;
  weapon: WeaponConfig;
  weaponTimer: number;
}

export type EnemyType = 'walker' | 'drone';

export interface EnemyEntity extends BaseEntity {
  kind: 'enemy';
  enemyType: EnemyType;
  damage: number;
  speed: number;
  patrol: { minX: number; maxX: number };
  shootCooldown?: number;
  patternTime: number;
}

export interface BossEntity extends BaseEntity {
  kind: 'boss';
  damage: number;
  phase: number;
  moveBounds: { minX: number; maxX: number };
  shootCooldown: number;
  burstShots: number;
  patternTimer: number;
}

export interface BulletEntity extends BaseEntity {
  kind: 'bullet';
  owner: 'player' | 'enemy';
  damage: number;
  ttl: number;
}

export interface PickupEntity extends BaseEntity {
  kind: 'pickup';
  pickupType: WeaponType;
  bobTime: number;
}

export interface EffectEntity extends BaseEntity {
  kind: 'effect';
  ttl: number;
  color: string;
}

export type Entity =
  | PlayerEntity
  | EnemyEntity
  | BossEntity
  | BulletEntity
  | PickupEntity
  | EffectEntity;

export interface Camera {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LevelData {
  width: number;
  height: number;
  groundY: number;
  platforms: Platform[];
  enemySpawns: Array<
    | {
        type: 'walker';
        x: number;
        y: number;
        patrolMin: number;
        patrolMax: number;
      }
    | {
        type: 'drone';
        x: number;
        y: number;
        patrolMin: number;
        patrolMax: number;
      }
  >;
  pickupSpawns: Array<{ x: number; y: number; type: WeaponType }>;
  bossSpawnX: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jumpPressed: boolean;
  jumpHeld: boolean;
  shootHeld: boolean;
  startPressed: boolean;
}

export interface GameState {
  mode: GameMode;
  player: PlayerEntity;
  enemies: EnemyEntity[];
  bullets: BulletEntity[];
  pickups: PickupEntity[];
  effects: EffectEntity[];
  boss: BossEntity | null;
  camera: Camera;
  level: LevelData;
  time: number;
  shake: number;
  flashTimer: number;
  highScore: number;
  bossTriggered: boolean;
}
