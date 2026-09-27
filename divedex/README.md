# DiveDex

Standalone prototype, separate from City Bingo: a diver's log that works like a Pokédex plus an aquarium.

- **Logbook**: record each dive (date, site, max depth, bottom time, water temp, visibility, buddy, notes) and pick the animals you saw, with an optional photo for each one.
- **Creature dex**: 40 animals found in Thai waters. Ones you haven't seen stay as silhouettes, and each one has a rarity (common, uncommon, rare, legendary) and a fact. A new species gets a reveal card when you save the dive.
- **Aquarium**: every species you've seen swims in the tank. Seeing it again on another dive levels it up (Lv 1 to 5, at 1/3/6/10/15 dives) and it grows bigger. Tap the water to drop food, or tap an animal to open its card. Hitting dive counts unlocks decorations (soft coral, anemone, sea fan, wreck and more).
- **Care is optional by design**: the animals never go hungry and never die, so a diver who only gets in the water a few times a year never comes back to an empty tank.

Data stays on the device (localStorage, with photos in IndexedDB). Backup/restore works by copying and pasting JSON (photos not included).

## Files

- `divedex.html`: the source. Body-only markup, so it can also be published as a claude.ai artifact.
- `build.mjs`: wraps it into `public/divedex/index.html` (`npm run build:divedex`), which Next serves at `/divedex/`.
