"use client";
import Link from "next/link";
import { actions, type State } from "@/lib/store";
import { Icon, Sheet } from "./ui";

export function MenuSheet({ open, onClose, state }: { open: boolean; onClose: () => void; state: State }) {
  return (
    <Sheet open={open} onClose={onClose} label="Menu">
      <div className="stack">
        <h2 className="title">Menu</h2>
        <Link className="option" href="/recovery"><Icon name="key" />Recovery code</Link>
        <Link className="option" href="/areas"><Icon name="pin" />All neighborhoods</Link>
        <Link className="option" href="/privacy"><Icon name="shield" />Privacy and your data</Link>
        <button type="button" className="option" role="switch" aria-checked={state.testMode} onClick={() => actions.setTestMode(!state.testMode)}>
          <Icon name="near" />
          <span className="grow">Test mode<br /><span className="body-s muted">Pretend you are at each spot. For trying the game away from Bangkok.</span></span>
          <span className="chip chip-grey">{state.testMode ? "On" : "Off"}</span>
        </button>
      </div>
    </Sheet>
  );
}
