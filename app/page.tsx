"use client";
import { useState } from "react";
import { useGame, hasProgress, foundCount, discoveredFlags, type State } from "@/lib/store";
import { getArea } from "@/lib/content";
import { oneMoreForBingo } from "@/lib/rules";
import { Button, IconButton, Logo, Loading, Split, Chip, Icon } from "@/components/ui";
import { Fridge, FridgeNote, Kitchen } from "@/components/Fridge";
import { MenuSheet } from "@/components/MenuSheet";

function inProgress(s: State) {
  const boards = Object.values(s.boards).filter((b) => !b.completedAt);
  return boards.find((b) => b.areaId === s.lastAreaId) ?? boards.sort((a, b) => b.createdAt - a.createdAt)[0];
}

export default function Home() {
  const s = useGame();
  const [menu, setMenu] = useState(false);
  if (!s) return <Loading tone="dark" />;

  const returning = hasProgress(s);
  const startHref = s.permissionsSeen ? "/areas" : "/permissions";
  const board = returning ? inProgress(s) : undefined;
  const area = board && getArea(board.areaId);
  const found = board ? foundCount(board) : 0;
  const near = board ? oneMoreForBingo(discoveredFlags(board)).size : 0;
  const magnetCount = Object.values(s.magnets).filter((m) => m > 0).length;

  return (
    <Kitchen>
      <main className="screen kitchen on-dark">
        <div className="row between rise">
          <Logo size={34} dark />
          {returning ? <IconButton icon="menu" tone="glass" label="Menu" onClick={() => setMenu(true)} /> : <Chip tone="glass">Bangkok</Chip>}
        </div>

        <div className="rise rise-2" style={{ margin: "18px 0 14px" }}>
          {returning
            ? <Split light="My" bold={magnetCount ? `fridge · ${magnetCount}/6` : "fridge"} />
            : <Split light="Find the city's" bold="secrets" />}
        </div>

        <div className="rise rise-3">
          <Fridge magnets={s.magnets} note={
            <FridgeNote>
              Your fridge is empty.
              <span className="body-s" style={{ display: "block", fontWeight: 500, marginTop: 6 }}>
                Get 3 in a row in a neighborhood to win its clay magnet.
              </span>
            </FridgeNote>
          } />
        </div>

        <div className="bottom rise rise-4">
          {board && area ? (
            <div className="card card-lime" style={{ gap: 12 }}>
              <div className="row between">
                <span className="label">IN PROGRESS · {found}/9</span>
                {near > 0 && <span className="chip chip-dark"><Icon name="sparkle" size={14} />1 away from bingo</span>}
              </div>
              <div className="display-l">{area.name}</div>
              <div className="progress" style={{ background: "rgba(21,21,21,.14)" }}><i style={{ width: `${(found / 9) * 100}%`, background: "var(--graphite)" }} /></div>
              <Button variant="dark" size="lg" href={`/play/${area.id}`}>Continue <Icon name="next" /></Button>
            </div>
          ) : null}
          {returning
            ? <Button variant={board ? "glass" : "primary"} size="lg" href="/areas">Pick a new area</Button>
            : <>
                <Button size="lg" href={startHref}>Start playing <Icon name="next" /></Button>
                <p className="body-s center" style={{ color: "rgba(255,255,255,.8)", margin: "6px 0 0" }}>No sign-up · 6 neighborhoods · 1–2 hrs each</p>
              </>}
        </div>
      </main>
      {returning && <MenuSheet open={menu} onClose={() => setMenu(false)} state={s} />}
    </Kitchen>
  );
}
