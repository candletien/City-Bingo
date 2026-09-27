"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getArea, getCell } from "@/lib/content";
import { actions, useGame, type ReportReason } from "@/lib/store";
import { Button, Icon, IconButton, HintRow, Loading, Sheet, Chip } from "@/components/ui";

const ACTION = /^(Find|Try|Take|Ask|Watch|Buy|Follow|Eat|Snap|Walk)\b/;

/** Highlight the sentence that tells the player what to do. */
function Clue({ text }: { text: string }) {
  const parts = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  return (
    <p className="body" style={{ fontSize: 17, lineHeight: "26px" }}>
      {parts.map((p, i) => (ACTION.test(p.trim()) ? <span key={i}><span className="hl">{p.trim()}</span> </span> : <span key={i}>{p}</span>))}
    </p>
  );
}

const REASONS: { id: ReportReason; label: string }[] = [
  { id: "not_found", label: "I couldn't find it" },
  { id: "gone", label: "It's gone" },
  { id: "no_access", label: "I can't get in" },
];

function RuleChip({ type, area }: { type: string; area: string }): ReactNode {
  if (type === "hard") return <Chip tone="dark" icon="pin">This exact spot · within 50 m</Chip>;
  if (type === "mission") return <Chip tone="lime" icon="sparkle">Mission · no location needed</Chip>;
  return <Chip tone="grey" icon="zoom">Any example in {area}</Chip>;
}

export default function Quest() {
  const { areaId, cellId } = useParams<{ areaId: string; cellId: string }>();
  const router = useRouter();
  const s = useGame();
  const [report, setReport] = useState(false);
  const [reason, setReason] = useState<ReportReason>("not_found");
  const [zoom, setZoom] = useState(false);
  const hintsRef = useRef<HTMLDivElement>(null);

  const area = getArea(areaId);
  const cell = area && getCell(area, cellId);
  const board = s?.boards[areaId];
  const pos = board?.cells.findIndex((c) => c.cellId === cellId) ?? -1;
  const bc = pos >= 0 ? board!.cells[pos] : undefined;

  useEffect(() => {
    if (s && (!board || !bc)) router.replace(`/play/${areaId}`);
    else if (bc?.status === "discovered") router.replace(`/play/${areaId}/${cellId}/story`);
  }, [s, board, bc, areaId, cellId, router]);

  useEffect(() => {
    if (bc && location.hash === "#hints") hintsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [!!bc]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!s || !area || !cell || !bc) return <Loading tone="olive" />;

  const used = bc.hintsUsed;
  const n = pos + 1;

  return (
    <main className="screen quest" style={{ padding: 0, background: "var(--surface)" }}>
      <div className="quest-hero on-dark">
        <div className="topbar" style={{ padding: "calc(16px + env(safe-area-inset-top)) 20px 0", margin: 0 }}>
          <IconButton icon="back" tone="glass" label="Back to board" href={`/play/${areaId}`} />
          <span className="spacer" />
          <Chip tone="glass">N°{n} · {area.name}</Chip>
        </div>
        <button type="button" className="quest-photo" onClick={() => cell.clueImage && setZoom(true)} aria-label={cell.clueImage ? "Zoom clue photo" : "Clue photo coming soon"}>
          {cell.clueImage
            ? <img src={cell.clueImage} alt="" />
            : <span className="quest-ph"><Icon name={cell.type === "mission" ? "sparkle" : cell.type === "hard" ? "pin" : "zoom"} size={48} /><span className="label">Clue photo coming soon</span></span>}
        </button>
      </div>

      <div className="quest-body">
        <div className="row" style={{ flexWrap: "wrap", gap: 8 }}><RuleChip type={cell.type} area={area.name} /></div>
        <h1 className="display-l" style={{ margin: "14px 0 10px" }}>{cell.title}</h1>
        <Clue text={cell.clue} />

        {cell.placeOfWorship && (
          <div className="card card-grey" style={{ flexDirection: "row", gap: 12, marginTop: 16, padding: 16 }}>
            <Icon name="temple" />
            <p className="body-s"><b>A place of worship.</b> Cover shoulders and knees, keep your voice low, and take shoes off where others do.</p>
          </div>
        )}

        <div ref={hintsRef} id="hints" className="stack" style={{ marginTop: 24, gap: 8 }}>
          <div className="row between">
            <h2 className="title">Hints</h2>
            <span className="label muted">{used}/3 · free</span>
          </div>
          {cell.hints.map((h, i) => (
            <HintRow key={i} n={i + 1} text={h}
              state={i < used ? "open" : i === used ? "next" : "locked"}
              onClick={() => actions.useHint(areaId, pos)} />
          ))}
        </div>

        {used >= 3 && (
          <div className="row" style={{ marginTop: 14, gap: 8, flexWrap: "wrap" }}>
            <Button variant="secondary" onClick={() => router.push(`/play/${areaId}`)}>Skip for now</Button>
            <Button variant="secondary" onClick={() => setReport(true)}><Icon name="flag" size={18} />Can't find it / It's gone</Button>
          </div>
        )}
      </div>

      <div className="quest-cta">
        {bc.status === "passed"
          ? <Button size="lg" href={`/play/${areaId}/${cellId}/guess`}>Photo passed · Continue <Icon name="next" /></Button>
          : <Button size="lg" href={`/play/${areaId}/${cellId}/snap`}><Icon name="camera" />Found it · Take a photo</Button>}
        {used < 3 && <Button variant="ghost" href={`/play/${areaId}`}>Skip for now</Button>}
      </div>

      <Sheet open={report} onClose={() => setReport(false)} label="Report a problem">
        <div className="stack">
          <h2 className="title">What happened?</h2>
          <p className="body-s muted">Thanks. This helps us fix the board for everyone. The square stays open.</p>
          <div role="radiogroup" aria-label="Reason" className="stack" style={{ gap: 8 }}>
            {REASONS.map((r) => (
              <button key={r.id} type="button" role="radio" aria-checked={reason === r.id} className="option" onClick={() => setReason(r.id)}>
                <span className="radio" />{r.label}
              </button>
            ))}
          </div>
          <Button size="lg" onClick={() => { actions.report(cellId, reason); router.push(`/play/${areaId}`); }}>Send and back to board</Button>
          <Button variant="ghost" onClick={() => setReport(false)}>Keep looking</Button>
        </div>
      </Sheet>

      {zoom && cell.clueImage && (
        <div className="sheet-backdrop" style={{ alignItems: "center", background: "rgba(0,0,0,.92)" }} onClick={() => setZoom(false)} role="dialog" aria-label="Clue photo">
          <img src={cell.clueImage} alt={cell.title} style={{ maxHeight: "90dvh", objectFit: "contain" }} />
        </div>
      )}
    </main>
  );
}
