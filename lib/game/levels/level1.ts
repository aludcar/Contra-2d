import type { LevelData } from '@/types/game';

export const level1: LevelData = {
  width: 4600,
  height: 540,
  groundY: 450,
  platforms: [
    { x: 360, y: 380, width: 180, height: 18 },
    { x: 700, y: 340, width: 220, height: 18 },
    { x: 1100, y: 300, width: 160, height: 18 },
    { x: 1450, y: 370, width: 230, height: 18 },
    { x: 1950, y: 330, width: 220, height: 18 },
    { x: 2450, y: 280, width: 260, height: 18 },
    { x: 2850, y: 360, width: 180, height: 18 },
    { x: 3250, y: 320, width: 260, height: 18 },
    { x: 3700, y: 290, width: 180, height: 18 },
  ],
  enemySpawns: [
    { type: 'walker', x: 500, y: 410, patrolMin: 470, patrolMax: 680 },
    { type: 'walker', x: 980, y: 410, patrolMin: 930, patrolMax: 1160 },
    { type: 'walker', x: 1750, y: 410, patrolMin: 1680, patrolMax: 1880 },
    { type: 'walker', x: 2100, y: 290, patrolMin: 1960, patrolMax: 2160 },
    { type: 'walker', x: 3050, y: 320, patrolMin: 2900, patrolMax: 3150 },
    { type: 'drone', x: 1250, y: 200, patrolMin: 1140, patrolMax: 1400 },
    { type: 'drone', x: 2250, y: 190, patrolMin: 2060, patrolMax: 2450 },
    { type: 'drone', x: 3380, y: 170, patrolMin: 3200, patrolMax: 3550 },
  ],
  pickupSpawns: [
    { x: 760, y: 300, type: 'rapid' },
    { x: 2550, y: 240, type: 'spread' },
  ],
  bossSpawnX: 4180,
};
