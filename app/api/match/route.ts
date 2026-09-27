import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getArea, getCell } from "@/lib/content";
import type { MatchResult } from "@/lib/match";

// AI photo check: does the player's photo show what this square asks for?
// Needs ANTHROPIC_API_KEY on the server. Without it the check reports "off" and
// the square falls back to the location rule alone (PRD §4.2).

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

const SCHEMA = {
  type: "object",
  properties: {
    matched: { type: "boolean", description: "True if the photo plausibly shows what the square asks for." },
    confidence: { type: "number", description: "0 to 1." },
    seen: { type: "string", description: "One short, friendly sentence (max 20 words) naming what you see in the photo that matches or doesn't." },
  },
  required: ["matched", "confidence", "seen"],
  additionalProperties: false,
};

const SYSTEM = `You judge photos for City Bingo, a walking game in Bangkok. A player was given a square to find and took a photo.
Decide if the photo plausibly shows what the square asks for. Be generous: street photos are messy, partly blocked, taken at odd angles or at night.
Say "matched" when the key thing is recognisably in the frame. For a mission square, match when the photo is plausible proof of doing the activity.
Say not matched for blank, blurry-beyond-recognition, or clearly unrelated photos (a selfie, the floor, a screenshot).
Write "seen" to the player in simple English, warm and short.`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const area = body && getArea(String(body.areaId));
  const cell = area && getCell(area, String(body.cellId));
  const image = typeof body?.image === "string" ? body.image : "";
  const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/.exec(image);
  if (!area || !cell || !m) return NextResponse.json({ error: "bad request" }, { status: 400 });
  if (image.length > 6_000_000) return NextResponse.json({ error: "photo too large" }, { status: 413 });

  if (!client) return NextResponse.json({ status: "off" } satisfies MatchResult);

  const square = [
    `Neighborhood: ${area.name}`,
    `Square type: ${cell.type}`,
    `Square: ${cell.title}`,
    `Clue: ${cell.clue}`,
  ].join("\n");

  try {
    const res = await client.beta.messages.create({
      model: "claude-opus-5",
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      system: SYSTEM,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: m[1] as "image/jpeg", data: m[2] } },
          { type: "text", text: square },
        ],
      }],
    });
    if (res.stop_reason === "refusal") return NextResponse.json({ status: "off" } satisfies MatchResult);
    const text = res.content.find((b) => b.type === "text");
    const out = text && text.type === "text" ? JSON.parse(text.text) : null;
    if (!out || typeof out.matched !== "boolean") throw new Error("no verdict");
    return NextResponse.json({
      status: out.matched ? "matched" : "nomatch",
      confidence: Math.max(0, Math.min(1, Number(out.confidence) || 0)),
      seen: String(out.seen ?? "").slice(0, 200),
    } satisfies MatchResult);
  } catch (e) {
    console.error("match failed", e instanceof Anthropic.APIError ? `${e.status} ${e.message}` : e);
    return NextResponse.json({ status: "off" } satisfies MatchResult);
  }
}
