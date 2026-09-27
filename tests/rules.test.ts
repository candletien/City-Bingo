import { describe, expect, it } from "vitest";
import { AREAS, getArea, getCell } from "@/lib/content";
import { buildBoard, completedLines, haversineM, oneMoreForBingo, verifyPosition, HARD_POSITIONS } from "@/lib/rules";

// Move a point north by `m` metres.
const north = (p: { lat: number; lng: number }, m: number) => ({ lat: p.lat + m / 111_195, lng: p.lng });

describe("content", () => {
  it("loads 6 areas with 9 cells, all translated to English", () => {
    expect(AREAS).toHaveLength(6);
    for (const a of AREAS) {
      expect(a.cells).toHaveLength(9);
      for (const c of a.cells) {
        expect(c.title).not.toBe(c.titleTh);
        expect(c.hints).toHaveLength(3);
        if (c.guess) expect(c.guess.choices).toHaveLength(3);
      }
    }
  });
});

describe("buildBoard (§4.1)", () => {
  it("puts hard cells at 1, 4, 6 and uses each cell once", () => {
    for (const area of AREAS) {
      for (let i = 0; i < 20; i++) {
        const board = buildBoard(area);
        expect(new Set(board).size).toBe(9);
        board.forEach((id, pos) => {
          const hard = getCell(area, id)!.type === "hard";
          expect(hard).toBe((HARD_POSITIONS as readonly number[]).includes(pos));
        });
      }
    }
  });

  it("handles pools larger than 3 + 6", () => {
    const base = AREAS[0];
    const big = { ...base, cells: [...base.cells, ...base.cells.map((c) => ({ ...c, id: c.id + "b" }))] };
    const board = buildBoard(big);
    expect(board).toHaveLength(9);
    expect(new Set(board).size).toBe(9);
  });
});

describe("lines", () => {
  const f = (found: number[]) => Array.from({ length: 9 }, (_, i) => found.includes(i));
  it("counts rows, columns and diagonals", () => {
    expect(completedLines(f([0, 1, 2]))).toHaveLength(1);
    expect(completedLines(f([0, 1, 2, 4, 6, 8]))).toHaveLength(3); // row + 2 diagonals
    expect(completedLines(f([0, 1, 2, 3, 4, 5, 6, 7, 8]))).toHaveLength(8);
  });
  it("finds squares that are one away from bingo", () => {
    expect([...oneMoreForBingo(f([0, 1]))]).toEqual([2]);
    expect(oneMoreForBingo(f([])).size).toBe(0);
  });
});

describe("verifyPosition (§4.2)", () => {
  const area = getArea("talat-noi")!;
  const hard = area.cells.find((c) => c.type === "hard" && c.lat != null)!;
  const normal = area.cells.find((c) => c.type === "normal")!;
  const mission = area.cells.find((c) => c.type === "mission")!;
  const spot = { lat: hard.lat!, lng: hard.lng! };

  it("haversine is accurate to a metre over short distances", () => {
    expect(Math.round(haversineM(spot, north(spot, 100)))).toBe(100);
  });
  it("hard passes at ≤ 50 m and fails beyond", () => {
    expect(verifyPosition(area, hard, north(spot, 45)).passed).toBe(true);
    expect(verifyPosition(area, hard, north(spot, 50)).passed).toBe(true);
    const r = verifyPosition(area, hard, north(spot, 60));
    expect(r.passed).toBe(false);
    expect(r.distanceM).toBe(60);
  });
  it("normal passes inside the area radius and fails outside", () => {
    expect(verifyPosition(area, normal, north(area.center, 650)).passed).toBe(true);
    expect(verifyPosition(area, normal, north(area.center, 750)).passed).toBe(false);
  });
  it("mission needs no location; others fail without a fix", () => {
    expect(verifyPosition(area, mission, null).passed).toBe(true);
    expect(verifyPosition(area, normal, null).passed).toBe(false);
  });
  it("flags low accuracy", () => {
    expect(verifyPosition(area, hard, { ...north(spot, 80), accuracy: 120 }).lowAccuracy).toBe(true);
  });
});
