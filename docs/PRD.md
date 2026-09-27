# City Bingo — Product Requirements (Phase 1: Bangkok)

> Hand this file to Claude Code together with `boards.json`. It is written to be built from directly: rules are exact, screens map to routes, and every feature has acceptance criteria.

**Visual source of truth:** the "City Bingo – UI" design canvas (page **UI**, 15 phone screens, 390×844) and page **Wireflow** (screen-to-screen transitions). Screen names below match the canvas artboard titles (01–15).

---

## 1. What we're building

City Bingo is a mobile-first web app for tourists. Each neighborhood is a 3×3 bingo board of small hidden details in the city (a street sign naming an old trade, a church hidden in Chinatown, a house with a dive pool). Players walk around, find each one, snap a photo, and read its real history. Completing a line earns a clay fridge magnet for that neighborhood; every extra line adds a detail to the same magnet. All magnets live on the player's virtual fridge.

**Principles**
- Dead simple: everyone already knows bingo. No extra systems.
- Facts only: every story comes from real sources, shown under the story.
- Look up at the city, not at the screen: big buttons, short copy, no turn-by-turn map.

**Phase 1 goal:** a deployed web app that is fully playable in 6 Bangkok neighborhoods, tested on the street with friends.

## 2. Scope

**In scope (Phase 1)**
- 6 neighborhoods from `boards.json`: Talat Noi, Yaowarat–Sampheng, Tha Tien–Pak Khlong Talat, Kudi Chin, Banglamphu–Phra Athit, Charoen Krung–Bang Rak.
- Pick an area → system builds a board from that area's content pool.
- Play a square: clue → up to 3 hints → photo + location check → optional guess → story.
- Lines → magnet with 8 evolution stages → fridge.
- No sign-up: anonymous player, progress saved on the server, recovery code / QR, optional link to email or Google.
- English UI (content in `boards.json` is currently Thai; see §12).
- Installable PWA with offline cache of the active board.

**Out of scope (later)**
- AI-generated boards for any city in the world.
- Players submitting new hidden details.
- AI checking that a photo matches the clue.
- Social features, events, leaderboards.

## 3. Tech stack

Use this unless there is a strong reason not to:

| Layer | Choice | Notes |
| --- | --- | --- |
| App | Next.js (App Router) + TypeScript | Mobile-first, one codebase |
| Styling | Tailwind CSS + CSS variables for tokens (§9) | |
| Backend | Supabase: Postgres, anonymous auth, Storage | Anonymous sign-in on first open; can later link email/Google |
| Hosting | Vercel | HTTPS is required for camera + geolocation |
| PWA | Web app manifest + service worker | Cache app shell, active board JSON and clue images |
| Content | `boards.json` in the repo, seeded into Postgres (or read as static JSON) | Content is read-only in Phase 1 |

**Hard constraints**
- Geolocation is requested **only at the moment the player takes a photo**, never watched in the background.
- Camera via `<input type="file" accept="image/*" capture="environment">` or `getUserMedia`; either is fine, pick the one that works best on iOS Safari + Android Chrome.
- Read location from the browser Geolocation API at capture time, not from photo EXIF (often stripped on upload).
- No proprietary map data or scraped content. Credit sources on every story.

## 4. Game rules (exact)

### 4.1 Board
- A board is 3×3; positions `0–8`, left→right, top→bottom.
- **Hard squares are always at positions 1, 4 (center) and 6.** The other 6 are `normal` or `mission`.
- On "pick an area", the server creates a board for the player: pick 3 `hard` cells and 6 non-hard cells at random from that area's pool, place hard cells at 1/4/6 and shuffle the rest into 0/2/3/5/7/8. (Today each pool has exactly 3 + 6, so only the order of non-hard cells varies. The code must handle bigger pools.)
- One active board per player per area. Re-opening an area resumes it.

### 4.2 Square types and how a square passes

| Type | Player task | Passes when |
| --- | --- | --- |
| `hard` | Find this one specific thing | Photo taken **≤ 50 m** from the cell's `lat/lng` (haversine) |
| `normal` | Find any example of this kind in the area | Photo taken **inside the neighborhood** (≤ `radius_m` from the area center, default 700 m) |
| `mission` | Do a local activity (e.g. taste a snack) | Photo taken + player taps confirm (no location check) |

- If the device can't get a location fix within ~10 s, show the "Can't get your location" state with Retry. Do not pass the square.
- Accuracy: if `coords.accuracy` > distance threshold, still compare with the reported position but show the "move to open sky and retry" tip on failure.

### 4.3 Hints
- Every square has exactly 3 hints, unlocked strictly in order (1 → 2 → 3). Hint 1 is broad, hint 3 nearly gives it away.
- Using hints costs nothing.
- A failed photo check routes the player to the hints (see flow).
- After all 3 hints: "Skip for now" (square stays open) and "Can't find it / It's gone" (report sheet).

### 4.4 Guess
- Only squares whose content has a `guess` object show it. It appears **after the photo passes, before the story.**
- 3 choices. **A wrong answer does not end the question: the player retries until correct.** Mark the wrong choice, show "Not quite, try again".
- Squares without `guess` go straight from a passed photo to the story.

### 4.5 Discovered squares
- A passed square becomes `discovered`, shows the player's photo and a check badge on the board.
- Tapping a discovered square opens its story again (read-only). It can't be played again.

### 4.6 Lines and the magnet
- 8 lines: 3 rows, 3 columns, 2 diagonals.
- `magnet_stage` for an area = number of completed lines (0–8).
- Stage 1 (first line) = the player gets that area's magnet. Stages 2–7 add one detail each, in a fixed order per area (not tied to which line). Stage 8 = full scene + gold rim.
- On any newly completed line → show the **Bingo!** screen, then back to the board.
- One magnet per area on the fridge (never duplicates).

### 4.7 Board complete
- All 9 discovered (which also means stage 8) → **Board cleared** screen → "Pick a new area" goes to the area list.

### 4.8 First discovery
- The first time a player ever discovers a square, after the story show the **Recovery code** screen once.

## 5. User flow (from the Wireflow page)

Main path (solid):
`01 Home (first time)` → Start playing → `03 Camera + location` → Allow → `04 Pick an area` → pick → `05 Building the board` → ready → `06 Bingo board` → tap square → `07 Quest` → Found it → `09 Camera` → pass → `11 Guess` → correct → `12 The story` → (line completed) → `13 Bingo!` → (all 9) → `14 Board cleared` → `04 Pick an area`

Branches and loops (dashed):
- `07 Quest` ↔ hints 1 → 2 → 3 (same screen)
- `07 Quest` → Can't find it → `08 Report sheet` → Send → `06 Board`
- `09 Camera` → fail → `10 Photo didn't pass` → Take a photo → `09 Camera`, or Get a hint → `07 Quest`
- `09 Camera` → pass on a square without a guess → `12 The story`
- `11 Guess` → wrong → `11 Guess` (retry)
- `12 The story` → no line completed → `06 Board`
- `12 The story` → first discovery ever → `15 Recovery code` → `06 Board`
- `13 Bingo!` → Keep playing → `06 Board`
- `02 Home (returning)` → Continue → `06 Board` of the in-progress area, or Pick a new area → `04`
- Returning players open to `02`; first-time players open to `01`.

## 6. Screens and routes

| # | Screen | Route | Key content | States |
| --- | --- | --- | --- | --- |
| 01 | Home (first time) | `/` | Logo, headline "Find the city's secrets", empty Art Deco fridge, note "Your fridge is empty…", **Start playing** | — |
| 02 | Home (returning) | `/` | Fridge with one clay magnet per area + label ("Kudi Chin · 4/8"), in-progress card with **Continue**, **Pick a new area** | no board in progress (hide card) |
| 03 | Camera + location | `/permissions` | Why we need camera and location (only when you snap), "No sign-up needed", **Allow and continue**, "What we store" | denied → how to re-enable in browser settings |
| 04 | Pick an area | `/areas` | 6 area rows: name, how to get there, 1–2 hrs, status chip (Done / Playing n/9 / New); **Find an area near me** at the bottom | near-me sorts by distance from one location read |
| 05 | Building the board | `/areas/[areaId]/start` | Short loading, caches board + images | error → Retry |
| 06 | Bingo board | `/play/[areaId]` | Area name, "n of 9 found", 3×3 tiles with clue image + short title, Hard / Mission badges, pink ring on tiles that would complete a line | undiscovered · discovered (photo + check) · one-more-for-bingo |
| 07 | Quest | `/play/[areaId]/[cellId]` | Close-up clue photo (tap to zoom), title, clue text with highlights, hints list, rough distance (hard only), place-of-worship note when relevant, **Found it · Take a photo**, Skip for now, Can't find it / It's gone | hint 0/1/2/3 |
| 08 | Report sheet | bottom sheet on 07 | Reasons: couldn't find it / it's gone / can't get in; **Send and back to board**; Keep looking | — |
| 09 | Camera | `/play/[areaId]/[cellId]/snap` | Camera, small clue thumbnail, framing tip, shutter; note "Location is checked only when you snap" | checking… |
| 10 | Photo didn't pass | sheet on 09 | "Almost there!", distance, far→close meter, **Get a hint**, **Take a photo** | no location fix |
| 11 | Guess | `/play/[areaId]/[cellId]/guess` | "Photo passed", question, 3 choices | wrong (retry) · correct (continue) |
| 12 | The story | `/play/[areaId]/[cellId]/story` | Player photo, "Found it!", answer chip, title, story, **Sources**, **Back to board** | first view · re-read |
| 13 | Bingo! | overlay/route after story | "Bingo!", magnet with new detail highlighted, stage n/8, **Keep playing** | stage 1 (new magnet) · 2–7 |
| 14 | Board cleared | overlay/route | Full magnet with gold rim on the fridge, **Pick a new area** | — |
| 15 | Recovery code | `/recovery` | QR + code, **Save as image**, **Save for good with email or Google**, add-to-home-screen tip, Maybe later | also reachable from a menu later |

Copy on the canvas is the starting point for all UI text (English).

## 7. Data

### 7.1 Content (`boards.json`)
Shape today:
```json
{
  "neighborhoods": [{
    "id": "talat-noi",
    "name_th": "ตลาดน้อย", "name_en": "Talat Noi",
    "getting_there": "…",
    "cells": [{
      "id": "tn-1", "position": 0, "type": "normal|hard|mission",
      "title": "…", "clue": "…", "hints": ["…","…","…"],
      "guess": { "question": "…", "choices": ["…","…","…"], "answer": 0 } | null,
      "story": "…", "sources": ["https://…"],
      "lat": 13.73, "lng": 100.51, "coord_status": "approx"
    }]
  }]
}
```
Add when loading (keep backward compatible):
- Per neighborhood: `center: {lat, lng}`, `radius_m` (default 700), `magnet: {base, details[7], complete}` asset paths.
- Per cell: `clue_image` (path), `title_en`, `clue_en`, `hints_en`, `guess_en`, `story_en` (see §12), optional `place_of_worship: true`.
- `position` in the file is a suggestion only; the board builder decides positions (§4.1).

Approximate area centers to start with (verify on site):

| Area | lat | lng |
| --- | --- | --- |
| talat-noi | 13.7330 | 100.5135 |
| yaowarat | 13.7400 | 100.5090 |
| tha-tien | 13.7455 | 100.4935 |
| kudi-chin | 13.7400 | 100.4915 |
| banglamphu | 13.7620 | 100.4975 |
| charoen-krung | 13.7250 | 100.5160 |

### 7.2 Database (Supabase)
- `players` — `id` (auth uid), `created_at`, `recovery_code_hash`, `linked_email` (nullable), `seen_recovery` (bool)
- `boards` — `id`, `player_id`, `area_id`, `created_at`, `completed_at` (nullable), unique(`player_id`, `area_id`) for the active board
- `board_cells` — `board_id`, `position` (0–8), `cell_id`, `status` (`open|discovered`), `hints_used` (0–3), `photo_path`, `photo_lat`, `photo_lng`, `photo_accuracy`, `discovered_at`
- `magnets` — `player_id`, `area_id`, `stage` (0–8)
- `reports` — `id`, `player_id`, `cell_id`, `reason` (`not_found|gone|no_access`), `created_at`
- Row Level Security: players can only read/write their own rows.
- Storage bucket `photos/{player_id}/…`, private.

### 7.3 Server logic
- `POST /api/boards` `{areaId}` → build board (§4.1) or return the existing one.
- `POST /api/cells/verify` `{boardId, position, lat, lng, accuracy, photo}` → run the pass check on the server (§4.2), store the photo, return `{passed, distance_m}`. Never trust a client-side pass.
- `POST /api/cells/reveal` → mark discovered after guess (or right away if no guess), recompute lines, update `magnets.stage`, return `{newLines, stage, boardComplete, firstDiscovery}`.
- `POST /api/reports`.
- Recovery: generate a code on first discovery, store only a hash; `POST /api/recover` `{code}` re-links the data to the current anonymous user.

## 8. Saving progress without an account
1. Anonymous Supabase session on first open; all progress on the server.
2. Recovery code + QR shown once after the first discovery (screen 15), and later from a menu.
3. Optional "Save for good" links the anonymous user to email (magic link) or Google.
4. Prompt "Add to home screen" when the player gets their first magnet.

## 9. Design system

**Look:** joyful and bold. Each screen sits on a flat, saturated color block; white rounded cards on top; condensed uppercase headlines mixing light + extra-bold lines; black pill buttons; sticker-style photos with thick white borders, slightly rotated; key words highlighted with colored pills; small black mono tags.

**Fridge screens (01, 02, 14):** a real photo of an **Art Deco kitchen** with a vintage fridge as the background (to be supplied, see §12). Until then use the drawn Art Deco fridge from the canvas: rounded top, thick black outline, brass stepped badge "CITY BINGO", brass speed lines and handles, trapezoid feet.

**Magnets:** clay style — soft, matte, puffy shapes, no outlines, soft shading and a small highlight. One set per area, 8 stages. Final art will be illustrated or photographed clay; use the canvas SVGs as placeholders.

**Tokens**

| Token | Value | Use |
| --- | --- | --- |
| `--tomato` | `#F2542D` | Screen color, hard badge, camera shutter |
| `--lime` | `#C9F24D` | Screen color, success/check, logo "o" |
| `--lavender` | `#A9A6F5` | Screen color, secondary accents |
| `--pink` | `#FF7AC8` | Screen color, highlights, one-more-for-bingo ring |
| `--ink` | `#111111` | Text, primary buttons, outlines |
| `--card` | `#FFFFFF` | Cards, sheets |
| `--cream` | `#F4EEDC` | Fridge, magnet base |
| `--brass` | `#D4A64A` | Art Deco details, gold rim |
| Radius | 28px cards · 999px pills · 18px tiles | |

**Type:** Barlow Condensed (300 / 800, uppercase) for headlines · Plus Jakarta Sans (500–800) for UI and body · Bricolage Grotesque 800 for the logo only · JetBrains Mono for codes · Limelight for the fridge badge.

**Logo:** "City" / "Bing●" stacked, where the "o" is a lime circle with a black check (a stamped bingo square).

**Screen colors:** 01/02/14 kitchen photo · 03 lime · 04 pink · 05 tomato · 06 lime · 07–08 lavender · 09–10 dark camera · 11 pink · 12 tomato · 13 lime · 15 lavender.

**Accessibility:** touch targets ≥ 44px, text contrast ≥ 4.5:1, real `<button>`/`<a>` elements, don't rely on color alone for state (discovered = photo + check icon).

## 10. Privacy and safety
- Explain what is stored (photos, location at capture time, progress) on screen 03 and a `/privacy` page; comply with PDPA (Thailand) and GDPR (EU visitors).
- "Delete my data" removes the player, boards, photos and reports.
- Don't store photos where other people's faces are the subject; add a gentle note on the camera screen.
- Quests never lead into private property; places of worship show a dress/quiet note.

## 11. Acceptance criteria
- [ ] First open lands on 01; after any progress, app opens on 02.
- [ ] Picking an area creates a board with hard cells at positions 1, 4, 6; re-picking resumes the same board.
- [ ] Hints unlock only in order; hint count persists across reloads.
- [ ] Hard square passes at ≤ 50 m and fails at > 50 m (server-side check, unit tested with known coordinates).
- [ ] Normal square passes anywhere within the area radius, fails outside.
- [ ] Mission square passes with photo + confirm, no location needed.
- [ ] Failed photo shows distance and routes to hints or camera.
- [ ] Wrong guess keeps the player on the question; correct guess shows the story.
- [ ] Square without a guess goes from passed photo to story.
- [ ] Completing a line shows Bingo! and increments the magnet stage; completing two lines at once adds two stages.
- [ ] 9/9 shows Board cleared, then the area list; the area shows "Done" and the fridge shows the gold-rim magnet.
- [ ] Recovery code appears once after the first discovery and restores progress on another device.
- [ ] Location is requested only when taking a photo (no `watchPosition`).
- [ ] Board and clue images load offline after the board was opened once.
- [ ] Works on iOS Safari and Android Chrome at 390×844.

## 12. Known gaps (need input before launch)
- **Content language:** `boards.json` text is Thai. Add English fields (`*_en`) — translate from the Thai and keep facts unchanged; English cell titles are already on the canvas for Talat Noi.
- **Coordinates are approximate** (`coord_status`). Verify every hard cell on site.
- **Clue photos:** not in the repo yet; the team will shoot them on site. Use placeholders.
- **Art Deco kitchen photo** for screens 01/02/14: to be supplied (free-license, e.g. Unsplash/Pexels, credit if required).
- **Clay magnet art:** 6 areas × (base + 7 details + gold rim) to be produced.
- Content has only been checked online; walk each board once before public release.

## 13. Suggested build order for Claude Code
1. Scaffold Next.js + TypeScript + Tailwind; design tokens and fonts; static screens 01–15 from the canvas with fake data.
2. Load `boards.json`; area list (04) and board builder with the position rule; board screen (06).
3. Quest flow: 07 with hints, 08 report sheet, 11 guess (retry until correct), 12 story.
4. Camera + geolocation at capture; server verify endpoint with haversine; 09/10.
5. Lines, magnet stages, 13 Bingo!, 14 Board cleared, fridge on 01/02.
6. Supabase anonymous auth, tables + RLS, photo storage, persistence and resume.
7. Recovery code (15), restore, optional email/Google linking.
8. PWA + offline cache; privacy page and delete-my-data.
9. Tests for rules in §4 and acceptance criteria in §11; deploy to Vercel.
