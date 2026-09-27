"use client";
// Player progress. Phase 1 keeps it on the device; the shape mirrors the Supabase
// tables in PRD §7.2 so it can move to the server without changing screens.
import { useSyncExternalStore } from "react";
import { getArea } from "./content";
import { buildBoard, completedLines } from "./rules";
import { deleteAllPhotos } from "./photos";

export type CellStatus = "open" | "passed" | "discovered";

export type BoardCell = {
  cellId: string;
  status: CellStatus;
  hintsUsed: number;
  wrong: number[];
  discoveredAt?: number;
};

export type Board = {
  areaId: string;
  createdAt: number;
  completedAt?: number;
  cells: BoardCell[]; // index = position 0–8
};

export type Pending =
  | { kind: "bingo"; areaId: string; stage: number; newLines: number }
  | { kind: "cleared"; areaId: string }
  | { kind: "recovery" };

export type ReportReason = "not_found" | "gone" | "no_access";

export type State = {
  v: 1;
  playerId: string;
  createdAt: number;
  permissionsSeen: boolean;
  recoveryCode: string | null;
  seenRecovery: boolean;
  boards: Record<string, Board>;
  magnets: Record<string, number>;
  reports: { cellId: string; reason: ReportReason; at: number }[];
  lastAreaId: string | null;
  pending: Pending[];
  testMode: boolean;
};

const KEY = "city-bingo:v1";
const listeners = new Set<() => void>();
let cache: State | null = null;

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function fresh(): State {
  return {
    v: 1, playerId: uid(), createdAt: Date.now(), permissionsSeen: false,
    recoveryCode: null, seenRecovery: false, boards: {}, magnets: {}, reports: [],
    lastAreaId: null, pending: [], testMode: false,
  };
}

function read(): State {
  if (cache) return cache;
  try {
    const s = localStorage.getItem(KEY);
    cache = s ? { ...fresh(), ...JSON.parse(s) } : fresh();
  } catch {
    cache = fresh();
  }
  return cache!;
}

function write(next: State) {
  cache = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage full or blocked: keep in memory */ }
  listeners.forEach((l) => l());
}

function update(fn: (s: State) => State) {
  write(fn(read()));
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; l(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
}

/** null during SSR / before hydration. */
export function useGame(): State | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

/** PRD §11: after any progress (a board exists) the app opens on Home (returning). */
export const hasProgress = (s: State) => Object.keys(s.boards).length > 0;

export const discoveredFlags = (b: Board) => b.cells.map((c) => c.status === "discovered");
export const foundCount = (b: Board) => b.cells.filter((c) => c.status === "discovered").length;

function recoveryCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = () => alphabet[Math.floor(Math.random() * alphabet.length)];
  const group = () => Array.from({ length: 4 }, pick).join("");
  return `BKK-${group()}-${group()}`;
}

function patchCell(s: State, areaId: string, pos: number, patch: Partial<BoardCell>): State {
  const b = s.boards[areaId];
  if (!b) return s;
  const cells = b.cells.slice();
  cells[pos] = { ...cells[pos], ...patch };
  return { ...s, boards: { ...s.boards, [areaId]: { ...b, cells } } };
}

export const actions = {
  seePermissions() {
    update((s) => ({ ...s, permissionsSeen: true }));
  },

  /** §4.1: one active board per area; re-opening resumes it. */
  ensureBoard(areaId: string): Board {
    const s = read();
    if (s.boards[areaId]) {
      if (s.lastAreaId !== areaId) write({ ...s, lastAreaId: areaId });
      return s.boards[areaId];
    }
    const area = getArea(areaId);
    if (!area) throw new Error("Unknown area");
    const board: Board = {
      areaId, createdAt: Date.now(),
      cells: buildBoard(area).map((cellId) => ({ cellId, status: "open", hintsUsed: 0, wrong: [] })),
    };
    write({ ...s, boards: { ...s.boards, [areaId]: board }, lastAreaId: areaId });
    return board;
  },

  useHint(areaId: string, pos: number) {
    update((s) => {
      const c = s.boards[areaId]?.cells[pos];
      return c ? patchCell(s, areaId, pos, { hintsUsed: Math.min(3, c.hintsUsed + 1) }) : s;
    });
  },

  markPassed(areaId: string, pos: number) {
    update((s) => (s.boards[areaId]?.cells[pos].status === "open" ? patchCell(s, areaId, pos, { status: "passed" }) : s));
  },

  wrongGuess(areaId: string, pos: number, choice: number) {
    update((s) => {
      const c = s.boards[areaId]?.cells[pos];
      return c && !c.wrong.includes(choice) ? patchCell(s, areaId, pos, { wrong: [...c.wrong, choice] }) : s;
    });
  },

  /** §4.5–4.8: mark discovered, recompute lines and magnet stage, queue the celebration screens. */
  reveal(areaId: string, pos: number) {
    const s = read();
    const b = s.boards[areaId];
    if (!b || b.cells[pos].status === "discovered") return;
    const before = completedLines(discoveredFlags(b)).length;
    const firstDiscovery = !Object.values(s.boards).some((x) => x.cells.some((c) => c.status === "discovered"));
    let next = patchCell(s, areaId, pos, { status: "discovered", discoveredAt: Date.now() });
    const nb = next.boards[areaId];
    const stage = completedLines(discoveredFlags(nb)).length;
    const pending: Pending[] = [];
    if (stage > before) pending.push({ kind: "bingo", areaId, stage, newLines: stage - before });
    if (foundCount(nb) === 9) {
      pending.push({ kind: "cleared", areaId });
      next = { ...next, boards: { ...next.boards, [areaId]: { ...nb, completedAt: Date.now() } } };
    }
    if (firstDiscovery && !s.seenRecovery) pending.push({ kind: "recovery" });
    write({
      ...next,
      magnets: { ...next.magnets, [areaId]: Math.max(next.magnets[areaId] ?? 0, stage) },
      recoveryCode: next.recoveryCode ?? recoveryCode(),
      pending: [...next.pending, ...pending],
    });
  },

  shiftPending() {
    update((s) => ({ ...s, pending: s.pending.slice(1) }));
  },

  seeRecovery() {
    update((s) => ({ ...s, seenRecovery: true, recoveryCode: s.recoveryCode ?? recoveryCode() }));
  },

  report(cellId: string, reason: ReportReason) {
    update((s) => ({ ...s, reports: [...s.reports, { cellId, reason, at: Date.now() }] }));
  },

  setTestMode(on: boolean) {
    update((s) => ({ ...s, testMode: on }));
  },

  async deleteEverything() {
    await deleteAllPhotos();
    write(fresh());
  },
};

/** Where to send the player after the story, following the pending queue (PRD §5). */
export function nextRoute(s: State, fallbackAreaId: string): string {
  const p = s.pending[0];
  if (!p) return `/play/${fallbackAreaId}`;
  if (p.kind === "bingo") return `/play/${p.areaId}/bingo`;
  if (p.kind === "cleared") return `/play/${p.areaId}/cleared`;
  return `/recovery?first=1&area=${fallbackAreaId}`;
}
