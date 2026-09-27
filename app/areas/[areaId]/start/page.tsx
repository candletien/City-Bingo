"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getArea } from "@/lib/content";
import { actions, useGame } from "@/lib/store";
import { Button, IconButton, Split } from "@/components/ui";

export default function Building() {
  const { areaId } = useParams<{ areaId: string }>();
  const router = useRouter();
  const s = useGame();
  const area = getArea(areaId);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const resuming = !!s?.boards[areaId];

  useEffect(() => {
    if (!s || !area) return;
    setError(false);
    try {
      actions.ensureBoard(area.id);
      router.prefetch(`/play/${area.id}`);
      const t = setTimeout(() => router.replace(`/play/${area.id}`), resuming ? 250 : 1700);
      return () => clearTimeout(t);
    } catch {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!s, area?.id, attempt]);

  if (!area) {
    return (
      <main className="screen graphite on-dark">
        <div className="topbar"><IconButton icon="back" tone="glass" label="Back" href="/areas" /></div>
        <Split light="Area" bold="not found" />
      </main>
    );
  }

  return (
    <main className="screen graphite on-dark">
      <div className="topbar"><IconButton icon="back" tone="glass" label="Back to areas" href="/areas" /></div>
      <div className="grow" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
        <div className="build-grid" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => <span key={i} style={{ animationDelay: `${[0, 2, 4, 1, 3, 5, 6, 8, 7][i] * 0.12}s` }} className={[1, 4, 6].includes(i) ? "hard" : ""} />)}
        </div>
        <div className="center">
          <Split light={error ? "Something went" : resuming ? "Back to" : "Building your"} bold={error ? "wrong" : area.name} />
          <p className="body" style={{ marginTop: 12, color: "rgba(255,255,255,.75)" }} role="status">
            {error ? "We couldn't set up this board." : resuming ? "Opening your board…" : "Shuffling 9 hidden details and saving them for offline…"}
          </p>
        </div>
      </div>
      {error && <div className="bottom"><Button size="lg" onClick={() => setAttempt((a) => a + 1)}>Retry</Button></div>}
    </main>
  );
}
