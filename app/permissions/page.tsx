"use client";
import { useRouter } from "next/navigation";
import { actions } from "@/lib/store";
import { Button, Icon, IconButton, Split } from "@/components/ui";

function Why({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="card card-raised" style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
      <span className="ibtn ibtn-dark" style={{ width: 48, height: 48, borderRadius: 16 }} aria-hidden="true"><Icon name={icon} /></span>
      <div>
        <h2 className="subtitle">{title}</h2>
        <p className="body muted" style={{ marginTop: 4 }}>{children}</p>
      </div>
    </div>
  );
}

export default function Permissions() {
  const router = useRouter();
  const go = () => { actions.seePermissions(); router.push("/areas"); };

  return (
    <main className="screen">
      <div className="topbar"><IconButton icon="back" label="Back" href="/" /></div>
      <div className="rise"><Split light="Two things" bold="we'll ask for" /></div>
      <p className="body muted rise rise-2" style={{ margin: "12px 0 20px" }}>
        Only at the moment you snap a photo. Never in the background.
      </p>

      <div className="stack rise rise-3">
        <Why icon="camera" title="Camera">To snap each hidden detail you find. That photo is your bingo stamp.</Why>
        <Why icon="pin" title="Location, only when you snap">To check you're at the right spot. We read it once per photo, then stop.</Why>
        <div className="card card-grey" style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Icon name="check" />
          <p className="body" style={{ fontWeight: 700 }}>No sign-up needed. Just play.</p>
        </div>
      </div>

      <details className="rise rise-4" style={{ marginTop: 16 }}>
        <summary className="subtitle" style={{ cursor: "pointer", minHeight: 44, display: "flex", alignItems: "center" }}>What we store</summary>
        <ul className="body muted" style={{ paddingLeft: 20, margin: "4px 0 0" }}>
          <li>Your photos of each square</li>
          <li>Where you were when you took them</li>
          <li>Your boards, hints and magnets</li>
        </ul>
        <p className="body-s muted" style={{ marginTop: 8 }}>For now it all stays on this phone. You can delete everything any time from <a href="/privacy">Privacy</a>.</p>
      </details>

      <div className="bottom">
        <Button size="lg" onClick={go}>Allow and continue <Icon name="next" /></Button>
        <p className="body-s center muted">Your browser will ask when you take your first photo.</p>
      </div>
    </main>
  );
}
