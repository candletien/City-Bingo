"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { getArea, getCell } from "@/lib/content";
import { useGame, nextRoute } from "@/lib/store";
import { usePhotos } from "@/lib/usePhotos";
import { Button, Chip, Icon, IconButton, Loading, Stamp } from "@/components/ui";

function host(u: string) {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; }
}

function Story() {
  const { areaId, cellId } = useParams<{ areaId: string; cellId: string }>();
  const fresh = useSearchParams().get("new") === "1";
  const router = useRouter();
  const s = useGame();
  const photos = usePhotos(areaId, [cellId]);

  const area = getArea(areaId);
  const cell = area && getCell(area, cellId);
  const bc = s?.boards[areaId]?.cells.find((c) => c.cellId === cellId);

  useEffect(() => {
    if (s && bc?.status !== "discovered") router.replace(`/play/${areaId}/${cellId}`);
  }, [s, bc, areaId, cellId, router]);

  if (!s || !area || !cell || bc?.status !== "discovered") return <Loading tone="olive" />;
  const answer = cell.guess ? cell.guess.choices[cell.guess.answer] : null;
  const pending = s.pending.length > 0;
  const next = pending ? nextRoute(s, areaId) : `/play/${areaId}`;

  return (
    <main className="screen" style={{ padding: 0 }}>
      <div className="story-hero on-dark">
        <div className="topbar" style={{ padding: "calc(16px + env(safe-area-inset-top)) 20px 0", margin: 0 }}>
          <IconButton icon="back" tone="glass" label="Back to board" href={`/play/${areaId}`} />
          <span className="spacer" />
          <Chip tone="glass">{area.name}</Chip>
        </div>
        <div className="story-photo">
          <div className={`polaroid ${fresh ? "drop-in" : ""}`} style={{ transform: "rotate(-3deg)" }}>
            {photos[cellId] ? <img src={photos[cellId]!} alt={`Your photo of ${cell.title}`} /> : <div className="ph" />}
          </div>
          <div className={`story-stamp ${fresh ? "stamp-in-anim" : ""}`}>
            <Stamp label="Found it!" sub={bc.discoveredAt ? new Date(bc.discoveredAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : undefined} rotate={8} />
          </div>
        </div>
      </div>

      <article className="story-body">
        {answer && <Chip tone="lime" icon="check">{answer}</Chip>}
        <h1 className="display-l" style={{ margin: "14px 0 4px" }}>{cell.title}</h1>
        <p className="label muted" lang="th">{cell.titleTh}</p>
        <p className="body" style={{ marginTop: 16, fontSize: 16, lineHeight: "26px" }}>{cell.story}</p>

        {cell.sources.length > 0 && (
          <section style={{ marginTop: 24 }}>
            <h2 className="label muted" style={{ margin: "0 0 8px" }}>SOURCES</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="stack">
              {cell.sources.map((u) => (
                <li key={u}>
                  <a href={u} target="_blank" rel="noreferrer" className="source-link">
                    <span className="mono">{host(u)}</span><Icon name="next" size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <div className="quest-cta">
        <Button size="lg" href={next}>{pending && s.pending[0].kind === "bingo" ? <>See what you won <Icon name="sparkle" /></> : <>Back to board <Icon name="next" /></>}</Button>
      </div>
    </main>
  );
}

export default function StoryPage() {
  return <Suspense fallback={<Loading tone="olive" />}><Story /></Suspense>;
}
