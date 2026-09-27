"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getArea, getCell } from "@/lib/content";
import { verifyPosition, type VerifyResult } from "@/lib/rules";
import { actions, useGame } from "@/lib/store";
import { downscale, photoKey, savePhoto } from "@/lib/photos";
import { Button, Chip, Icon, IconButton, Loading, Sheet } from "@/components/ui";

type Phase =
  | { k: "ready" }
  | { k: "checking" }
  | { k: "confirm" } // mission: photo + tap confirm
  | { k: "fail"; r: VerifyResult }
  | { k: "nofix"; denied: boolean };

type Pos = { lat: number; lng: number; accuracy: number };

/** One read at capture time; never watchPosition (PRD §3). */
function readLocation(): Promise<Pos> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) return reject({ code: 2 });
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      reject,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}

function fmt(m: number) {
  return m < 1000 ? `${m} m` : `${(m / 1000).toLocaleString("en", { maximumFractionDigits: 1 })} km`;
}

export default function Snap() {
  const { areaId, cellId } = useParams<{ areaId: string; cellId: string }>();
  const router = useRouter();
  const s = useGame();
  const input = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>({ k: "ready" });
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  const area = getArea(areaId);
  const cell = area && getCell(area, cellId);
  const board = s?.boards[areaId];
  const pos = board?.cells.findIndex((c) => c.cellId === cellId) ?? -1;

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => {
    if (s && pos < 0) router.replace(`/play/${areaId}`);
  }, [s, pos, areaId, router]);

  if (!s || !area || !cell || pos < 0) return <Loading tone="dark" />;

  const passed = async (photo: Blob) => {
    await savePhoto(photoKey(areaId, cellId), photo);
    actions.markPassed(areaId, pos);
    if (cell.guess) return router.replace(`/play/${areaId}/${cellId}/guess`);
    actions.reveal(areaId, pos);
    router.replace(`/play/${areaId}/${cellId}/story?new=1`);
  };

  const check = async (photo: Blob) => {
    if (cell.type === "mission") return setPhase({ k: "confirm" });
    setPhase({ k: "checking" });
    let here: Pos;
    try {
      if (s.testMode) {
        const t = cell.type === "hard" && cell.lat != null ? { lat: cell.lat, lng: cell.lng! } : area.center;
        here = { lat: t.lat + 0.00008, lng: t.lng - 0.00005, accuracy: 12 };
        await new Promise((r) => setTimeout(r, 700));
      } else {
        here = await readLocation();
      }
    } catch (e) {
      return setPhase({ k: "nofix", denied: (e as GeolocationPositionError)?.code === 1 });
    }
    let r: VerifyResult;
    try {
      const res = await fetch("/api/verify", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ areaId, cellId, ...here }),
      });
      if (!res.ok) throw new Error();
      r = await res.json();
    } catch {
      // Offline on the street: same rule locally; re-checked on the server once sync exists.
      r = verifyPosition(area, cell, here);
    }
    if (r.passed) return passed(photo);
    setPhase({ k: "fail", r });
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (preview) URL.revokeObjectURL(preview);
    const small = await downscale(f);
    setBlob(small);
    setPreview(URL.createObjectURL(small));
    check(small);
  };

  const shoot = () => { setPhase({ k: "ready" }); input.current?.click(); };
  const fail = phase.k === "fail" ? phase.r : null;
  const closeness = fail?.distanceM && fail.thresholdM ? Math.max(0.06, Math.min(0.94, fail.thresholdM / fail.distanceM)) : 0;

  return (
    <main className="screen dark on-dark" style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}>
      <div className="topbar">
        <IconButton icon="close" tone="glass" label="Close camera" href={`/play/${areaId}/${cellId}`} />
        <span className="spacer" />
        {s.testMode && <Chip tone="lime">Test mode</Chip>}
        <Chip tone="glass">N°{pos + 1}</Chip>
      </div>

      <div className="viewfinder">
        {preview ? <img src={preview} alt="Your photo" /> : (
          <div className="vf-empty">
            <Icon name="camera" size={40} />
            <p className="subtitle" style={{ marginTop: 12 }}>{cell.title}</p>
            <p className="body-s" style={{ opacity: 0.75, marginTop: 6, maxWidth: 260 }}>
              {cell.type === "mission" ? "Snap proof of your mission." : "Fill the frame with what you found."} Keep strangers' faces out of it.
            </p>
          </div>
        )}
        <i className="vf-c tl" /><i className="vf-c tr" /><i className="vf-c bl" /><i className="vf-c br" />
        {phase.k === "checking" && (
          <div className="vf-checking" role="status">
            <span className="spin" style={{ width: 22, height: 22, borderRadius: "50%", border: "3px solid var(--lime)", borderTopColor: "transparent" }} />
            Checking where you are…
          </div>
        )}
      </div>

      <div className="row" style={{ marginTop: 14, gap: 10 }}>
        <span className="snap-thumb" aria-hidden="true"><Icon name={cell.type === "hard" ? "pin" : "zoom"} size={18} /></span>
        <p className="body-s" style={{ opacity: 0.8 }}>
          {cell.type === "mission" ? "No location needed for missions." : "Location is checked only when you snap."}
        </p>
      </div>

      <div className="bottom" style={{ alignItems: "center" }}>
        {phase.k === "confirm" ? (
          <div className="stack" style={{ width: "100%" }}>
            <Button size="lg" onClick={() => blob && passed(blob)}><Icon name="check" />Yes, I did it</Button>
            <Button variant="glass" size="lg" onClick={shoot}>Retake photo</Button>
          </div>
        ) : (
          <button type="button" className="shutter" onClick={shoot} disabled={phase.k === "checking"} aria-label="Take a photo">
            <span />
          </button>
        )}
      </div>

      <input ref={input} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />

      <Sheet open={phase.k === "fail"} onClose={() => setPhase({ k: "ready" })} label="Photo didn't pass">
        {fail && (
          <div className="stack">
            <h2 className="display-l">Almost there!</h2>
            <p className="body muted">
              {cell.type === "hard"
                ? <>You're about <b style={{ color: "var(--ink)" }}>{fmt(fail.distanceM!)}</b> away. Get within {fail.thresholdM} m of the spot.</>
                : <>You're about <b style={{ color: "var(--ink)" }}>{fmt(fail.distanceM! - fail.thresholdM!)}</b> outside {area.name}. Head back into the neighborhood.</>}
            </p>
            <div className="meter" aria-hidden="true">
              <i style={{ left: `${closeness * 100}%` }} />
            </div>
            <div className="row between label muted"><span>Far</span><span>Close</span></div>
            {fail.lowAccuracy && (
              <div className="card card-grey" style={{ padding: 14, flexDirection: "row", gap: 10 }}>
                <Icon name="info" /><p className="body-s">Your GPS is fuzzy here. Step into open sky, away from tall buildings, and try again.</p>
              </div>
            )}
            <Button size="lg" onClick={shoot}><Icon name="camera" />Take a photo</Button>
            <Button variant="secondary" size="lg" href={`/play/${areaId}/${cellId}#hints`}><Icon name="bulb" />Get a hint</Button>
          </div>
        )}
      </Sheet>

      <Sheet open={phase.k === "nofix"} onClose={() => setPhase({ k: "ready" })} label="Can't get your location">
        {phase.k === "nofix" && (
          <div className="stack">
            <h2 className="display-l">Can't get your location</h2>
            {phase.denied ? (
              <p className="body muted">Location is turned off for this site. Turn it on, then try again:<br />
                <b>iPhone:</b> Settings › Privacy › Location Services › Safari Websites › While Using.<br />
                <b>Android:</b> tap the icon left of the address bar › Permissions › Location › Allow.</p>
            ) : (
              <p className="body muted">We couldn't get a fix in 10 seconds. Move to open sky, away from tall buildings. This square isn't counted yet.</p>
            )}
            <Button size="lg" onClick={() => blob && check(blob)}><Icon name="refresh" />Retry</Button>
            <Button variant="ghost" onClick={() => setPhase({ k: "ready" })}>Not now</Button>
          </div>
        )}
      </Sheet>
    </main>
  );
}

