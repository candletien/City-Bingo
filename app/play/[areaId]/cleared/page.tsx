"use client";
import { useParams, useRouter } from "next/navigation";
import { getArea } from "@/lib/content";
import { actions, useGame } from "@/lib/store";
import { Fridge, Kitchen } from "@/components/Fridge";
import { Button, Icon, Loading, Split, Stamp } from "@/components/ui";
import { Confetti } from "@/components/Confetti";

export default function Cleared() {
  const { areaId } = useParams<{ areaId: string }>();
  const router = useRouter();
  const s = useGame();
  const area = getArea(areaId);
  if (!s || !area) return <Loading tone="dark" />;

  const ev = s.pending[0]?.kind === "cleared" ? s.pending[0] : null;
  const done = Object.values(s.boards).filter((b) => b.completedAt).length;

  const pickNew = () => {
    if (ev) actions.shiftPending();
    const rest = ev ? s.pending.slice(1) : s.pending;
    router.replace(rest[0]?.kind === "recovery" ? `/recovery?first=1&area=${areaId}` : "/areas");
  };

  return (
    <Kitchen>
      <main className="screen kitchen on-dark">
        <Confetti count={60} />
        <div className="row between rise" style={{ alignItems: "flex-start" }}>
          <Split light="Board" bold="cleared" />
          <Stamp label="9/9" sub={area.name.split("–")[0]} rotate={6} />
        </div>
        <p className="body rise rise-2" style={{ margin: "10px 0 14px", color: "rgba(255,255,255,.85)" }}>
          Every secret of {area.name} found. Your magnet got its gold rim.
        </p>
        <div className="rise rise-3"><Fridge magnets={s.magnets} focus={areaId} /></div>
        <div className="bottom">
          <p className="label center" style={{ opacity: 0.8 }}>{done} OF 6 NEIGHBORHOODS CLEARED</p>
          <Button size="lg" onClick={pickNew}>Pick a new area <Icon name="next" /></Button>
        </div>
      </main>
    </Kitchen>
  );
}
