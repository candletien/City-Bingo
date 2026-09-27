"use client";
import { useParams, useRouter } from "next/navigation";
import { getArea } from "@/lib/content";
import { actions, useGame, nextRoute } from "@/lib/store";
import { Magnet, detailName } from "@/components/Magnet";
import { Button, Icon, Loading } from "@/components/ui";
import { Confetti } from "@/components/Confetti";

export default function Bingo() {
  const { areaId } = useParams<{ areaId: string }>();
  const router = useRouter();
  const s = useGame();
  const area = getArea(areaId);
  if (!s || !area) return <Loading tone="dark" />;

  const p = s.pending[0];
  const ev = p?.kind === "bingo" && p.areaId === areaId ? p : null;
  const stage = ev?.stage ?? s.magnets[areaId] ?? 0;
  const lines = ev?.newLines ?? 1;
  const first = stage === lines; // the magnet was just won
  // A double bingo adds two details at once: name them all.
  const details = Array.from({ length: lines }, (_, i) => detailName(areaId, stage - i)).filter(Boolean).reverse();
  const detail = details.join(" and ");

  const keepPlaying = () => {
    if (ev) actions.shiftPending();
    const after = { ...s, pending: ev ? s.pending.slice(1) : s.pending };
    router.replace(nextRoute(after, areaId));
  };

  return (
    <main className="screen graphite on-dark bingo" style={{ textAlign: "center" }}>
      <Confetti />
      <p className="label" style={{ color: "var(--lime)", marginTop: 16 }}>{area.name.toUpperCase()} · LINE {Math.max(1, stage)}</p>
      <h1 className="bingo-word">{lines > 1 ? "Double bingo!" : "Bingo!"}</h1>

      <div className="bingo-magnet">
        <span className="bingo-burst" aria-hidden="true" />
        <Magnet areaId={areaId} stage={stage} size={220} highlight title={`${area.name} magnet, stage ${stage} of 8`} />
      </div>

      <div className="stage-dots" role="img" aria-label={`Stage ${stage} of 8`}>
        {Array.from({ length: 8 }, (_, i) => <i key={i} className={i < stage ? (i >= stage - lines ? "new" : "on") : ""} />)}
      </div>
      <p className="label" style={{ opacity: 0.75, marginTop: 8 }}>STAGE {stage}/8</p>

      <p className="title" style={{ marginTop: 14 }}>
        {first ? `You won the ${area.name} magnet!` : `New on your magnet: ${detail}`}
      </p>
      <p className="body" style={{ opacity: 0.78, marginTop: 6 }}>
        {stage >= 8 ? "Every line done. The gold rim is yours." : first ? "It's on your fridge now. Every extra line adds a detail." : `${8 - stage} more ${8 - stage === 1 ? "line" : "lines"} to the gold rim.`}
      </p>

      {first && Object.values(s.magnets).filter((m) => m > 0).length === 1 && (
        <div className="card card-glass" style={{ marginTop: 18, padding: 16, flexDirection: "row", gap: 12, textAlign: "left", alignItems: "center" }}>
          <Icon name="download" />
          <p className="body-s">Add City Bingo to your home screen: tap <b>Share › Add to Home Screen</b> (iPhone) or <b>⋮ › Install app</b> (Android).</p>
        </div>
      )}

      <div className="bottom">
        <Button size="lg" onClick={keepPlaying}>Keep playing <Icon name="next" /></Button>
      </div>
    </main>
  );
}
