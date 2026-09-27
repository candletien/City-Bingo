# City Bingo · Bangkok (Phase 1)

A mobile-first web app for travellers. Each Bangkok neighborhood is a 3×3 bingo board of small hidden details. Walk, find, snap a photo, read the real story. Complete a line to win that neighborhood's clay magnet for your fridge; every extra line adds a detail, and a cleared board earns a gold rim.

- Requirements: [`docs/PRD.md`](docs/PRD.md)
- Content: [`content/boards.json`](content/boards.json) (Thai source) + [`content/en.ts`](content/en.ts) (English, translated with the facts unchanged)
- Look: the **City Bingo Signal** design system (concrete grey, frosted glass, one lime signal colour)

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # game rules (§4 / §11)
npm run build
```

Camera and geolocation need HTTPS on a phone (Vercel gives you that). To try the game away from Bangkok, open the menu on Home → **Test mode**, which pretends you are standing at each spot.

## Screens (PRD §6)

| # | Screen | Route |
| --- | --- | --- |
| 01 / 02 | Home (first time / returning), Art Deco fridge | `/` |
| 03 | Camera + location | `/permissions` |
| 04 | Pick an area | `/areas` |
| 05 | Building the board | `/areas/[areaId]/start` |
| 06 | Bingo board | `/play/[areaId]` |
| 07 / 08 | Quest + hints / Report sheet | `/play/[areaId]/[cellId]` |
| 09 / 10 | Camera / Photo didn't pass | `/play/[areaId]/[cellId]/snap` |
| 11 | Guess | `/play/[areaId]/[cellId]/guess` |
| 12 | The story | `/play/[areaId]/[cellId]/story` |
| 13 | Bingo! | `/play/[areaId]/bingo` |
| 14 | Board cleared | `/play/[areaId]/cleared` |
| 15 | Recovery code | `/recovery` |
| — | Privacy + delete my data | `/privacy` |

## How it's built

- `lib/rules.ts`: the exact rules (board builder with hard cells at 1/4/6, lines, one-more-for-bingo, haversine pass check: hard ≤ 50 m, normal inside the area radius, mission always).
- `app/api/verify`: runs the pass check on the server. If the phone is offline it falls back to the same rule locally.
- `lib/store.ts`: player progress. Its shape mirrors the Supabase tables in PRD §7.2.
- `lib/photos.ts`: photos, downscaled and kept in IndexedDB.
- `components/Magnet.tsx`, `components/Fridge.tsx`: placeholder clay magnets (6 areas × 8 stages) and the drawn Art Deco fridge.
- `public/sw.js`: offline cache for the app shell and pages you've opened.

## Not done yet (needs input or keys)

- **Supabase** (anonymous auth, server-side progress, photo storage, recovery-code restore, email/Google linking). Progress currently lives on the device, and the recovery code is generated but can't restore on another phone yet.
- Real **clue photos**, the **Art Deco kitchen photo**, and the final **clay magnet art** (PRD §12). Placeholders are in place.
- **Coordinates** are approximate (`coord_status: approx`). Walk every board before launch.
