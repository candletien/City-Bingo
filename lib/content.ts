import raw from "@/content/boards.json";
import { AREAS_EN, CELLS_EN } from "@/content/en";

export type CellType = "normal" | "hard" | "mission";

export type Guess = { question: string; choices: string[]; answer: number };

export type Cell = {
  id: string;
  type: CellType;
  title: string;
  clue: string;
  hints: string[];
  guess: Guess | null;
  story: string;
  sources: string[];
  lat?: number;
  lng?: number;
  coordStatus?: string;
  placeOfWorship: boolean;
  clueImage?: string;
  titleTh: string;
};

export type Area = {
  id: string;
  name: string;
  nameTh: string;
  gettingThere: string;
  tagline: string;
  center: { lat: number; lng: number };
  radiusM: number;
  cells: Cell[];
};

type RawCell = {
  id: string;
  type: CellType;
  title: string;
  clue: string;
  hints: string[];
  guess?: Guess | null;
  story: string;
  sources?: string[];
  lat?: number;
  lng?: number;
  coord_status?: string;
  place_of_worship?: boolean;
  clue_image?: string;
};

type RawArea = {
  id: string;
  name_th: string;
  name_en: string;
  getting_there: string;
  center?: { lat: number; lng: number };
  radius_m?: number;
  cells: RawCell[];
};

// PRD §7.1: approximate centers until verified on site.
const CENTERS: Record<string, { lat: number; lng: number }> = {
  "talat-noi": { lat: 13.733, lng: 100.5135 },
  yaowarat: { lat: 13.74, lng: 100.509 },
  "tha-tien": { lat: 13.7455, lng: 100.4935 },
  "kudi-chin": { lat: 13.74, lng: 100.4915 },
  banglamphu: { lat: 13.762, lng: 100.4975 },
  "charoen-krung": { lat: 13.725, lng: 100.516 },
};

const WORSHIP = /\b(temple|church|shrine|mosque|wat|cathedral|buddha)\b/i;

function toCell(c: RawCell): Cell {
  const en = CELLS_EN[c.id];
  const guess = c.guess
    ? { question: en?.guess?.question ?? c.guess.question, choices: en?.guess?.choices ?? c.guess.choices, answer: c.guess.answer }
    : null;
  const title = en?.title ?? c.title;
  return {
    id: c.id,
    type: c.type,
    title,
    titleTh: c.title,
    clue: en?.clue ?? c.clue,
    hints: en?.hints ?? c.hints,
    guess,
    story: en?.story ?? c.story,
    sources: c.sources ?? [],
    lat: c.lat,
    lng: c.lng,
    coordStatus: c.coord_status,
    placeOfWorship: c.place_of_worship ?? (c.type === "hard" && WORSHIP.test(title)),
    clueImage: c.clue_image,
  };
}

export const AREAS: Area[] = (raw as { neighborhoods: RawArea[] }).neighborhoods.map((n) => ({
  id: n.id,
  name: n.name_en,
  nameTh: n.name_th,
  gettingThere: AREAS_EN[n.id]?.getting_there ?? n.getting_there,
  tagline: AREAS_EN[n.id]?.tagline ?? "",
  center: n.center ?? CENTERS[n.id],
  radiusM: n.radius_m ?? 700,
  cells: n.cells.map(toCell),
}));

export function getArea(id: string): Area | undefined {
  return AREAS.find((a) => a.id === id);
}

export function getCell(area: Area, cellId: string): Cell | undefined {
  return area.cells.find((c) => c.id === cellId);
}
