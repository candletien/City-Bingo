// Pure game rules (PRD §4). Shared by the client and the verify API.
import type { Area, Cell } from "./content";

export const HARD_POSITIONS = [1, 4, 6] as const;
export const OTHER_POSITIONS = [0, 2, 3, 5, 7, 8] as const;
export const HARD_RADIUS_M = 50;

export const LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** §4.1: 3 hard cells at 1/4/6, 6 others shuffled into the rest. Returns cell ids by position. */
export function buildBoard(area: Area, rand: () => number = Math.random): string[] {
  const hard = shuffle(area.cells.filter((c) => c.type === "hard"), rand).slice(0, 3);
  const rest = shuffle(area.cells.filter((c) => c.type !== "hard"), rand).slice(0, 6);
  if (hard.length < 3 || rest.length < 6) throw new Error(`Area ${area.id} has too few cells`);
  const board: string[] = new Array(9);
  HARD_POSITIONS.forEach((p, i) => (board[p] = hard[i].id));
  OTHER_POSITIONS.forEach((p, i) => (board[p] = rest[i].id));
  return board;
}

/** Indexes into LINES that are fully discovered. */
export function completedLines(discovered: boolean[]): number[] {
  return LINES.flatMap((line, i) => (line.every((p) => discovered[p]) ? [i] : []));
}

/** Positions that would complete at least one line if found next. */
export function oneMoreForBingo(discovered: boolean[]): Set<number> {
  const near = new Set<number>();
  for (const line of LINES) {
    const open = line.filter((p) => !discovered[p]);
    if (open.length === 1) near.add(open[0]);
  }
  return near;
}

export function haversineM(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type VerifyResult = {
  passed: boolean;
  distanceM: number | null;
  thresholdM: number | null;
  /** Reported accuracy worse than the threshold: suggest open sky. */
  lowAccuracy: boolean;
};

/** §4.2: hard ≤ 50 m from the cell, normal inside the area radius, mission always (after confirm). */
export function verifyPosition(area: Area, cell: Cell, pos: { lat: number; lng: number; accuracy?: number } | null): VerifyResult {
  if (cell.type === "mission") return { passed: true, distanceM: null, thresholdM: null, lowAccuracy: false };
  if (!pos) return { passed: false, distanceM: null, thresholdM: null, lowAccuracy: false };
  const target = cell.type === "hard" && cell.lat != null && cell.lng != null ? { lat: cell.lat, lng: cell.lng } : area.center;
  const thresholdM = cell.type === "hard" && cell.lat != null ? HARD_RADIUS_M : area.radiusM;
  const distanceM = Math.round(haversineM(pos, target));
  return {
    passed: distanceM <= thresholdM,
    distanceM,
    thresholdM,
    lowAccuracy: (pos.accuracy ?? 0) > thresholdM,
  };
}
