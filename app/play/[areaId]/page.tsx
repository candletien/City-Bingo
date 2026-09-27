"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getArea, getCell } from "@/lib/content";
import { completedLines, oneMoreForBingo } from "@/lib/rules";
import { useGame, discoveredFlags, foundCount } from "@/lib/store";
import { usePhotos } from "@/lib/usePhotos";
import { BingoTile } from "@/components/BingoTile";
import { Magnet } from "@/components/Magnet";
import { Icon, IconButton, Loading } from "@/components/ui";

export default function BoardScreen() {
  const { areaId } = useParams<{ areaId: string }>();
  const router = useRouter();
  const s = useGame();
  const area = getArea(areaId);
  const board = s?.boards[areaId];

  useEffect(() => {
    if (s && area && !board) router.replace(`/areas/${areaId}/start`);
  }, [s, area, board, areaId, router]);

  const discoveredIds = board?.cells.filter((c) => c.status === "discovered").map((c) => c.cellId) ?? [];
  const photos = usePhotos(areaId, discoveredIds);

  if (!s || !area || !board) return <Loading />;

  const flags = discoveredFlags(board);
  const found = foundCount(board);
  const lines = completedLines(flags).length;
  const near = oneMoreForBingo(flags);
  const stage = s.magnets[areaId] ?? 0;
  const recent = board.cells.findIndex((c) => c.discoveredAt && Date.now() - c.discoveredAt < 8000);

  const open = (pos: number) => {
    const bc = board.cells[pos];
    const base = `/play/${areaId}/${bc.cellId}`;
    if (bc.status === "discovered") router.push(`${base}/story`);
    else if (bc.status === "passed") router.push(`${base}/guess`);
    else router.push(base);
  };

  // Suggest where to go next: a square that completes a line, else the first open one.
  const nextPos = [...near][0] ?? board.cells.findIndex((c) => c.status !== "discovered");
  const nextCell = nextPos >= 0 ? getCell(area, board.cells[nextPos].cellId) : undefined;

  let nudge: { eyebrow: string; text: string };
  if (found === 9) nudge = { eyebrow: "BOARD CLEARED", text: "Every secret found. Pick a new area." };
  else if (near.size > 0) nudge = { eyebrow: "ONE MORE FOR BINGO", text: nextCell?.title ?? "" };
  else if (found === 0) nudge = { eyebrow: "START ANYWHERE", text: "Tap a square to read its clue" };
  else nudge = { eyebrow: `${9 - found} LEFT`, text: nextCell?.title ?? "" };

  return (
    <main className="screen" style={{ paddingBottom: "calc(120px + env(safe-area-inset-bottom))" }}>
      <div className="topbar">
        <IconButton icon="back" label="Home" href="/" />
        <span className="spacer" />
        <a href="/" className="row" style={{ gap: 6, textDecoration: "none" }} aria-label={`Your ${area.name} magnet: stage ${stage} of 8`}>
          <Magnet areaId={areaId} stage={stage} size={44} />
          <span className="label">{stage}/8</span>
        </a>
      </div>

      <h1 className="split rise">
        <span className="kicker">{area.name}</span>
        <span className="b">{found} of 9 found</span>
      </h1>
      <div className="row rise rise-2" style={{ margin: "12px 0 20px", gap: 8, flexWrap: "wrap" }}>
        <span className="chip chip-dark">{lines} {lines === 1 ? "line" : "lines"}</span>
        {near.size > 0 && found < 9 && <span className="chip chip-lime"><Icon name="sparkle" size={14} />{near.size} {near.size === 1 ? "square" : "squares"} to bingo</span>}
      </div>

      <div className="board rise rise-3" role="grid" aria-label={`${area.name} bingo board`}>
        {board.cells.map((bc, pos) => {
          const cell = getCell(area, bc.cellId)!;
          return (
            <BingoTile key={bc.cellId} n={pos + 1} title={cell.title} kind={cell.type} state={bc.status}
              photo={photos[bc.cellId]} image={cell.clueImage} near={near.has(pos)} pop={pos === recent}
              onOpen={() => open(pos)} onHint={() => router.push(`/play/${areaId}/${bc.cellId}#hints`)} />
          );
        })}
      </div>

      <div className="action-bar">
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="label" style={{ color: nudge.eyebrow === "ONE MORE FOR BINGO" ? "var(--lime)" : "rgba(255,255,255,.7)" }}>{nudge.eyebrow}</div>
          <div className="subtitle" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nudge.text}</div>
        </div>
        {found === 9
          ? <IconButton icon="next" tone="lime" label="Pick a new area" href="/areas" />
          : <IconButton icon="next" tone="lime" label={`Open ${nudge.text}`} onClick={() => open(nextPos)} />}
      </div>
    </main>
  );
}
