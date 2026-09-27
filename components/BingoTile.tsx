"use client";
import type { CellType } from "@/lib/content";
import { Icon } from "./ui";

// Placeholder glyph per square until the team's clue photos land (PRD §12).
const GLYPH: Record<CellType, string> = { hard: "pin", normal: "zoom", mission: "sparkle" };

export function BingoTile({ n, title, kind, state, photo, image, near, pop, onOpen, onHint }: {
  n: number; title: string; kind: CellType; state: "open" | "passed" | "discovered";
  photo?: string | null; image?: string; near?: boolean; pop?: boolean;
  onOpen: () => void; onHint: () => void;
}) {
  const found = state === "discovered";
  const bg = found ? photo : image;
  const label = `${title}${found ? ", found" : ""}${kind === "hard" ? ", hard" : ""}${kind === "mission" ? ", mission" : ""}${near ? ", one more for bingo" : ""}`;
  return (
    <div className={`tile ${found ? "tile-found" : ""} ${near && !found ? "tile-near" : ""} ${state === "passed" ? "tile-passed" : ""} ${pop ? "tile-pop" : ""}`}>
      <button type="button" className="tile-main" onClick={onOpen} aria-label={label}>
        <span className="tile-img" style={bg ? { backgroundImage: `url(${bg})` } : undefined}>
          {!bg && <span className="tile-glyph"><Icon name={GLYPH[kind]} size={34} /></span>}
          {found
            ? <span className="tile-ok"><Icon name="check" size={16} /></span>
            : <span className="tile-no" aria-hidden="true">N°{n}</span>}
          {kind !== "normal" && !found && (
            <span className={`tile-kind tile-kind-${kind}`} aria-hidden="true">{kind === "hard" ? "Hard" : "Mission"}</span>
          )}
        </span>
        <span className="tile-title">{title}</span>
      </button>
      {!found && (
        <button type="button" className="tile-hint" onClick={onHint} aria-label={`Hints for ${title}`}>
          <Icon name="bulb" size={16} />
        </button>
      )}
    </div>
  );
}
