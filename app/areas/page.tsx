"use client";
import Link from "next/link";
import { useState } from "react";
import { AREAS, type Area } from "@/lib/content";
import { haversineM } from "@/lib/rules";
import { useGame, foundCount } from "@/lib/store";
import { Magnet } from "@/components/Magnet";
import { Button, Icon, IconButton, Loading, Split, Toast } from "@/components/ui";

type Status = { kind: "done" } | { kind: "playing"; n: number } | { kind: "new" };

function walk(m: number) {
  return m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`;
}

function AreaRow({ area, status, stage, distance, i }: { area: Area; status: Status; stage: number; distance?: number; i: number }) {
  return (
    <li className={`rise rise-${Math.min(4, i + 1)}`}>
      <Link href={`/areas/${area.id}/start`} className="card card-raised area-row" style={{ textDecoration: "none" }}>
        <div className="area-magnet" aria-hidden="true">
          <Magnet areaId={area.id} stage={stage} size={64} />
        </div>
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="row" style={{ gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            {status.kind === "done" && <span className="chip chip-dark"><Icon name="check" size={14} />Done</span>}
            {status.kind === "playing" && <span className="chip chip-lime">Playing {status.n}/9</span>}
            {status.kind === "new" && <span className="chip chip-grey">New</span>}
            <span className="chip chip-grey"><Icon name="clock" size={14} />1–2 hrs</span>
            {distance != null && <span className="chip chip-grey"><Icon name="pin" size={14} />{walk(distance)}</span>}
          </div>
          <h2 className="display-l" style={{ fontSize: 24, lineHeight: "26px" }}>{area.name}</h2>
          <p className="body-s muted" style={{ marginTop: 4 }}>{area.tagline}</p>
          <p className="label muted" style={{ marginTop: 8 }}>{area.gettingThere}</p>
        </div>
        <Icon name="next" />
      </Link>
    </li>
  );
}

export default function Areas() {
  const s = useGame();
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  if (!s) return <Loading />;

  const nearMe = () => {
    if (!("geolocation" in navigator)) return setToast("Location isn't available on this device");
    setLocating(true);
    // One read, no watching (PRD §3).
    navigator.geolocation.getCurrentPosition(
      (p) => { setHere({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocating(false); },
      () => { setLocating(false); setToast("Couldn't get your location"); setTimeout(() => setToast(null), 2500); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  const rows = AREAS.map((a) => {
    const b = s.boards[a.id];
    const status: Status = b?.completedAt ? { kind: "done" } : b ? { kind: "playing", n: foundCount(b) } : { kind: "new" };
    return { a, status, stage: s.magnets[a.id] ?? 0, distance: here ? haversineM(here, a.center) : undefined };
  });
  if (here) rows.sort((x, y) => x.distance! - y.distance!);

  return (
    <main className="screen">
      <div className="topbar">
        <IconButton icon="back" label="Home" href="/" />
        <span className="spacer" />
        <span className="chip chip-dark">{Object.values(s.magnets).filter((m) => m > 0).length}/6 magnets</span>
      </div>
      <div className="rise"><Split light="Pick an" bold="area" /></div>
      <p className="body muted rise rise-2" style={{ margin: "10px 0 18px" }}>Each one is a 3×3 board of hidden details. Walk, find, snap.</p>

      <ul className="stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {rows.map((r, i) => <AreaRow key={r.a.id} area={r.a} status={r.status} stage={r.stage} distance={r.distance} i={i} />)}
      </ul>

      <div className="bottom">
        <Button variant="dark" size="lg" onClick={nearMe} disabled={locating}>
          <Icon name="near" />{locating ? "Finding you…" : here ? "Sorted by distance" : "Find an area near me"}
        </Button>
      </div>
      <Toast text={toast} />
    </main>
  );
}
