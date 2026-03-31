# Operation Iron Falcon (Retro Run-and-Gun MVP)

A playable side-scrolling run-and-gun browser game inspired by classic 8-bit/16-bit arcade action, built with **Next.js App Router + TypeScript + HTML5 Canvas**.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Controls

- Move: **Arrow Left/Right** or **A/D**
- Jump: **Space** or **J**
- Shoot: **K** or **X**
- Start / Restart: **Enter**

## What is implemented

- Start screen
- Playable scrolling level with platforms
- Player movement, jump, gravity, and collisions
- Shooting with weapon upgrades (`rapid`, `spread`)
- Ground and flying enemies with predictable patterns
- Enemy bullets and contact damage
- Lives + health + invulnerability frames
- Score + high score (localStorage)
- Boss encounter with phased attack pattern + health bar
- Game over and victory flow with restart
- Retro style visuals, parallax, hit flash, and light screen shake

## Architecture overview

```text
app/
components/game/
lib/game/
  core/
  entities/
  levels/
  systems/
types/
```

- `components/game/GameCanvas.tsx`: client entry point, canvas lifecycle, RAF loop, high score persistence.
- `lib/game/core/state.ts`: explicit update phase, state machine, player movement, camera control.
- `lib/game/systems/render.ts`: render phase, parallax, entities, effects.
- `lib/game/systems/physics.ts`: gravity, movement, platform collision.
- `lib/game/systems/combat.ts`: bullets, damage, pickups, death handling.
- `lib/game/systems/enemyAI.ts`: enemy and boss behavior patterns.
- `lib/game/levels/level1.ts`: array-based level/platform/enemy/pickup layout.
- `lib/game/entities/factories.ts`: typed factories for entities.
- `types/game.ts`: shared interfaces and game contracts.

## Where to modify content

- **Level geometry/spawns:** `lib/game/levels/level1.ts`
- **Enemy behavior:** `lib/game/systems/enemyAI.ts`
- **Weapons and tuning:** `lib/game/constants.ts` and `lib/game/systems/combat.ts`
- **Physics feel:** `lib/game/constants.ts` and `lib/game/systems/physics.ts`
- **Rendering style:** `lib/game/systems/render.ts` and `app/globals.css`

## Notes for expansion

The code is organized to support adding new levels, enemy variants, and future gamepad/audio systems with minimal refactors.
