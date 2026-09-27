"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getArea, getCell } from "@/lib/content";
import { actions, useGame } from "@/lib/store";
import { usePhotos } from "@/lib/usePhotos";
import { Chip, Icon, IconButton, Loading } from "@/components/ui";

export default function GuessScreen() {
  const { areaId, cellId } = useParams<{ areaId: string; cellId: string }>();
  const router = useRouter();
  const s = useGame();
  const [correct, setCorrect] = useState(false);
  const [shake, setShake] = useState<number | null>(null);
  const photos = usePhotos(areaId, [cellId]);

  const area = getArea(areaId);
  const cell = area && getCell(area, cellId);
  const board = s?.boards[areaId];
  const pos = board?.cells.findIndex((c) => c.cellId === cellId) ?? -1;
  const bc = pos >= 0 ? board!.cells[pos] : undefined;

  useEffect(() => {
    if (!s || correct) return;
    // Only a passed photo unlocks the guess (PRD §4.4).
    if (!bc || bc.status === "open") router.replace(`/play/${areaId}/${cellId}`);
    else if (bc.status === "discovered" || !cell?.guess) router.replace(`/play/${areaId}/${cellId}/story`);
  }, [s, bc, cell, correct, areaId, cellId, router]);

  if (!s || !area || !cell?.guess || !bc) return <Loading />;
  const g = cell.guess;

  const choose = (i: number) => {
    if (correct || bc.wrong.includes(i)) return;
    if (i === g.answer) {
      setCorrect(true);
      actions.reveal(areaId, pos);
      setTimeout(() => router.replace(`/play/${areaId}/${cellId}/story?new=1`), 900);
    } else {
      actions.wrongGuess(areaId, pos, i);
      setShake(i);
      setTimeout(() => setShake(null), 450);
    }
  };

  const lastWrong = bc.wrong.length > 0 && !correct;

  return (
    <main className="screen">
      <div className="topbar">
        <IconButton icon="back" label="Back to board" href={`/play/${areaId}`} />
        <span className="spacer" />
        <Chip tone="lime" icon="check">Photo passed</Chip>
      </div>

      <div className="row rise" style={{ alignItems: "flex-end", gap: 16, marginBottom: 20 }}>
        <div className="polaroid" style={{ width: 112, transform: "rotate(-5deg)", flexShrink: 0 }}>
          {photos[cellId] ? <img src={photos[cellId]!} alt="Your photo" /> : <div className="ph" />}
        </div>
        <div>
          <span className="label muted">ONE QUICK QUESTION</span>
          <p className="subtitle" style={{ marginTop: 4 }}>{cell.title}</p>
        </div>
      </div>

      <h1 className="display-l rise rise-2" style={{ fontSize: 30, lineHeight: "34px" }}>{g.question}</h1>

      <div className="stack rise rise-3" role="group" aria-label="Choices" style={{ marginTop: 22, gap: 10 }}>
        {g.choices.map((c, i) => {
          const wrong = bc.wrong.includes(i);
          const right = correct && i === g.answer;
          return (
            <button key={i} type="button" onClick={() => choose(i)} disabled={wrong || correct}
              className={`choice ${wrong ? "is-wrong" : ""} ${right ? "is-right" : ""} ${shake === i ? "shake" : ""}`}
              aria-label={`${c}${wrong ? ", not quite" : ""}${right ? ", correct" : ""}`}>
              <span className="choice-n">{right ? <Icon name="check" size={16} /> : wrong ? <Icon name="close" size={16} /> : "ABC"[i]}</span>
              <span>{c}</span>
            </button>
          );
        })}
      </div>

      <p className="subtitle center" role="status" style={{ marginTop: 18, minHeight: 22, color: correct ? "var(--success)" : "var(--error)" }}>
        {correct ? "That's it!" : lastWrong ? "Not quite, try again" : ""}
      </p>
      <p className="body-s muted center" style={{ marginTop: "auto" }}>No penalty for wrong answers. Keep guessing.</p>
    </main>
  );
}
