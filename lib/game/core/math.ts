import type { Rect } from '@/types/game';

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const rectsOverlap = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.width &&
  a.x + a.width > b.x &&
  a.y < b.y + b.height &&
  a.y + a.height > b.y;

export const toRect = (entity: { pos: { x: number; y: number }; size: { x: number; y: number } }): Rect => ({
  x: entity.pos.x,
  y: entity.pos.y,
  width: entity.size.x,
  height: entity.size.y,
});
