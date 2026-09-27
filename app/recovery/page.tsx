"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import QRCode from "qrcode";
import { actions, useGame } from "@/lib/store";
import { Button, Icon, IconButton, Loading, Split, Toast } from "@/components/ui";

function Recovery() {
  const router = useRouter();
  const params = useSearchParams();
  const first = params.get("first") === "1";
  const areaId = params.get("area");
  const s = useGame();
  const [qr, setQr] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (s && !s.recoveryCode) actions.seeRecovery();
  }, [s]);

  const code = s?.recoveryCode;
  useEffect(() => {
    if (code) QRCode.toString(code, { type: "svg", margin: 0, color: { dark: "#151515", light: "#ffffff" } }).then(setQr);
  }, [code]);

  if (!s || !code) return <Loading />;

  const done = () => {
    actions.seeRecovery();
    if (s.pending[0]?.kind === "recovery") actions.shiftPending();
    router.replace(areaId ? `/play/${areaId}` : "/");
  };

  const saveImage = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 720; canvas.height = 960;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#e8e8e5"; ctx.fillRect(0, 0, 720, 960);
    ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.roundRect(60, 60, 600, 840, 48); ctx.fill();
    const q = document.createElement("canvas");
    await QRCode.toCanvas(q, code, { width: 380, margin: 0 });
    ctx.drawImage(q, 170, 170);
    ctx.fillStyle = "#151515"; ctx.textAlign = "center";
    ctx.font = "800 44px sans-serif"; ctx.fillText("City Bingo", 360, 130);
    ctx.font = "700 46px monospace"; ctx.fillText(code, 360, 640);
    ctx.fillStyle = "#5c5c58"; ctx.font = "500 26px sans-serif";
    ctx.fillText("Your recovery code. Keep it safe.", 360, 710);
    ctx.fillText("It brings your fridge back on a new phone.", 360, 750);
    const a = document.createElement("a");
    a.download = "city-bingo-recovery.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
    setToast("Saved. Check your downloads or photos.");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <main className="screen">
      <div className="topbar">
        {first ? <span /> : <IconButton icon="back" label="Back" href="/" />}
      </div>
      <div className="rise"><Split light={first ? "First find! Keep" : "Your"} bold="recovery code" /></div>
      <p className="body muted rise rise-2" style={{ margin: "10px 0 18px" }}>
        No account, no password. This code is how you get your boards and magnets back if you change phones or clear your browser.
      </p>

      <div className="card card-raised rise rise-3" style={{ alignItems: "center", gap: 16, padding: 24 }}>
        <div className="qr" aria-label="QR code of your recovery code" role="img" dangerouslySetInnerHTML={{ __html: qr }} />
        <div className="data-l" style={{ letterSpacing: ".06em" }}>{code}</div>
        <Button variant="secondary" onClick={() => navigator.clipboard?.writeText(code).then(() => { setToast("Code copied"); setTimeout(() => setToast(null), 2000); })}>Copy code</Button>
      </div>

      <div className="card card-grey rise rise-4" style={{ marginTop: 14, padding: 16, flexDirection: "row", gap: 12 }}>
        <Icon name="download" />
        <p className="body-s">Tip: add City Bingo to your home screen so it opens like an app, even offline.</p>
      </div>

      <div className="bottom">
        <Button size="lg" onClick={saveImage}><Icon name="download" />Save as image</Button>
        <Button variant="dark" size="lg" disabled title="Coming with online sync">Save for good with email or Google · soon</Button>
        <Button variant="ghost" onClick={done}>{first ? "Maybe later" : "Done"}</Button>
      </div>
      <Toast text={toast} />
    </main>
  );
}

export default function RecoveryPage() {
  return <Suspense fallback={<Loading />}><Recovery /></Suspense>;
}
