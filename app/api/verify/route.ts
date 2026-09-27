import { NextResponse } from "next/server";
import { getArea, getCell } from "@/lib/content";
import { verifyPosition } from "@/lib/rules";

// PRD §7.3: the pass check runs on the server, never trusted from the client.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const area = body && getArea(String(body.areaId));
  const cell = area && getCell(area, String(body.cellId));
  if (!area || !cell) return NextResponse.json({ error: "unknown cell" }, { status: 400 });

  const { lat, lng, accuracy } = body;
  const pos = typeof lat === "number" && typeof lng === "number" ? { lat, lng, accuracy: Number(accuracy) || 0 } : null;
  return NextResponse.json(verifyPosition(area, cell, pos));
}
