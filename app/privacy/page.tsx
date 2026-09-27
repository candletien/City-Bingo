"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { actions } from "@/lib/store";
import { Button, Icon, IconButton, Sheet, Split } from "@/components/ui";

export default function Privacy() {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);

  return (
    <main className="screen">
      <div className="topbar"><IconButton icon="back" label="Back" href="/" /></div>
      <Split light="Privacy and" bold="your data" />

      <div className="stack" style={{ marginTop: 20 }}>
        <div className="card card-raised">
          <h2 className="subtitle">What we store</h2>
          <ul className="body muted" style={{ paddingLeft: 20, margin: 0 }}>
            <li>The photos you take for each square</li>
            <li>Your location at the moment you took each photo, and nothing else</li>
            <li>Your boards, hints used, answers, magnets and any problems you report</li>
          </ul>
        </div>
        <div className="card card-raised">
          <h2 className="subtitle">Where it lives</h2>
          <p className="body muted">Right now everything stays on this phone, in this browser. Nothing is uploaded. When online saving arrives, your data will be tied to an anonymous player, never your name.</p>
        </div>
        <div className="card card-raised">
          <h2 className="subtitle">Good manners</h2>
          <p className="body muted">Snap things, not strangers. Quests never lead into private property. At places of worship, dress modestly and keep quiet.</p>
        </div>
        <p className="body-s muted">We follow Thailand's PDPA and the EU GDPR. Every story lists its sources.</p>
      </div>

      <div className="bottom">
        <Button variant="secondary" size="lg" onClick={() => setConfirm(true)}><Icon name="trash" />Delete my data</Button>
      </div>

      <Sheet open={confirm} onClose={() => setConfirm(false)} label="Delete my data">
        <div className="stack">
          <h2 className="display-l">Delete everything?</h2>
          <p className="body muted">Your photos, boards, magnets and reports will be removed from this phone. This can't be undone.</p>
          <Button variant="dark" size="lg" onClick={async () => { await actions.deleteEverything(); router.replace("/"); }}>Delete my data</Button>
          <Button variant="ghost" onClick={() => setConfirm(false)}>Keep it</Button>
        </div>
      </Sheet>
    </main>
  );
}
