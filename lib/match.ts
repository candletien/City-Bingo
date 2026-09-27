// Result of the AI photo check (app/api/match).
// "off": no AI available (no key, offline, or it declined) — location rule decides alone.
export type MatchResult =
  | { status: "matched" | "nomatch"; confidence: number; seen: string }
  | { status: "off" };

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
