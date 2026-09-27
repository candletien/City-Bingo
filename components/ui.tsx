"use client";
import Link from "next/link";
import { useEffect, type ReactNode, type ButtonHTMLAttributes, type CSSProperties } from "react";

// Line icons, 2px stroke, round caps (design system: Iconography).
const ICONS: Record<string, string> = {
  back: "M14.5 6l-6 6 6 6",
  next: "M9.5 6l6 6-6 6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6L6 18",
  route: "M6 19a2 2 0 1 0 0-.01M18 5a2 2 0 1 0 0-.01M6 17V13a3 3 0 0 1 3-3h6a3 3 0 0 0 3-3",
  camera: "M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.5-2h5L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  pin: "M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  menu: "M5 7h14M5 12h14M5 17h9",
  flag: "M6 21V4M6 4h11l-2 4 2 4H6",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  shield: "M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z",
  key: "M14.5 9.5a4 4 0 1 1-1.2 2.9L4 21.7M8 17.5l2 2M6 19.5l2 2",
  near: "M12 3v3M12 18v3M3 12h3M18 12h3M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7.5V12l3 2",
  boat: "M3 16l2 4h14l2-4zM6 16V9h12v7M12 9V4M9 6.5h6",
  zoom: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4M11 8v6M8 11h6",
  share: "M12 3v12M7 8l5-5 5 5M5 14v5h14v-5",
  download: "M12 4v12M7 11l5 5 5-5M5 20h14",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
  trash: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
  plus: "M12 5v14M5 12h14",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6",
  temple: "M12 3l3 4H9zM6 10h12M7 10v9M17 10v9M12 10v9M4 20h16",
};

export function Icon({ name, size = 22, style }: { name: string; size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>
      <path d={ICONS[name] ?? ICONS.next} />
    </svg>
  );
}

type Variant = "primary" | "dark" | "secondary" | "ghost" | "glass";

export function Button({ variant = "primary", size = "md", href, className, children, ...rest }:
  { variant?: Variant; size?: "md" | "lg"; href?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `btn btn-${variant} btn-${size} ${className ?? ""}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type="button" className={cls} {...rest}>{children}</button>;
}

export function IconButton({ icon, tone = "light", label, href, onClick, className }:
  { icon: string; tone?: "glass" | "lime" | "dark" | "light"; label: string; href?: string; onClick?: () => void; className?: string }) {
  const cls = `ibtn ibtn-${tone} ${className ?? ""}`;
  if (href) return <Link href={href} className={cls} aria-label={label}><Icon name={icon} /></Link>;
  return <button type="button" className={cls} aria-label={label} onClick={onClick}><Icon name={icon} /></button>;
}

export function Chip({ tone = "light", icon, children }: { tone?: "light" | "lime" | "dark" | "glass" | "grey"; icon?: string; children: ReactNode }) {
  return <span className={`chip chip-${tone}`}>{icon && <Icon name={icon} size={14} />}{children}</span>;
}

export function Card({ tone = "raised", eyebrow, kicker, title, children, className, style }:
  { tone?: "raised" | "grey" | "lime" | "dark" | "glass"; eyebrow?: ReactNode; kicker?: ReactNode; title?: ReactNode; children?: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`card card-${tone} ${className ?? ""}`} style={style}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      {(kicker || title) && (
        <div>
          {kicker && <span className="kicker">{kicker}</span>}
          {title && <div className="display-l">{title}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Stamp({ label, sub, tone = "lime", rotate = 0 }: { label: string; sub?: string; tone?: "lime" | "dark" | "grey"; rotate?: number }) {
  return (
    <div className={`stamp stamp-${tone}`} style={{ transform: `rotate(${rotate}deg)` }}>
      <div className="stamp-in">
        <div className="stamp-label">{label}</div>
        {sub && <div className="stamp-sub">{sub}</div>}
      </div>
    </div>
  );
}

/** Split headline: light line over bold line ("Choose / Area"). */
export function Split({ light, bold, as: Tag = "h1" }: { light: ReactNode; bold: ReactNode; as?: "h1" | "h2" }) {
  return (
    <Tag className="split">
      <span className="kicker">{light}</span>
      <span className="b">{bold}</span>
    </Tag>
  );
}

export function HintRow({ n, state, text, onClick }: { n: number; state: "open" | "next" | "locked"; text?: string; onClick?: () => void }) {
  if (state === "next") {
    return (
      <button type="button" className="hint hint-next" onClick={onClick}>
        <span className="hint-n">{n}</span><span>Show hint {n}</span>
      </button>
    );
  }
  return (
    <div className={`hint hint-${state}`}>
      <span className="hint-n">{n}</span>
      <span>{state === "locked" ? `Unlocks after hint ${n - 1}` : text}</span>
    </div>
  );
}

export function Logo({ size = 44, dark = false }: { size?: number; dark?: boolean }) {
  const color = dark ? "var(--on-dark)" : "var(--ink)";
  return (
    <div aria-label="City Bingo" role="img" style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, fontSize: size, color }}>
      <div style={{ fontWeight: 400, opacity: dark ? 0.85 : 1 }}>City</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        Bing
        <span style={{ width: size * 0.62, height: size * 0.62, marginLeft: size * 0.04, marginTop: size * 0.08, borderRadius: "50%", background: "var(--lime)", color: "var(--on-lime)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={size * 0.42} style={{ strokeWidth: 3 }} />
        </span>
      </div>
    </div>
  );
}

export function Sheet({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" />
        {children}
      </div>
    </div>
  );
}

export function Loading({ tone = "surface" }: { tone?: "surface" | "olive" | "dark" }) {
  return (
    <main className={`screen ${tone === "surface" ? "" : tone}`} aria-busy="true">
      <div className="grow" style={{ display: "grid", placeItems: "center" }}>
        <span className="spin" style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid currentColor", borderTopColor: "transparent", opacity: 0.5 }} />
      </div>
    </main>
  );
}

export function Toast({ text }: { text: string | null }) {
  if (!text) return null;
  return <div className="toast" role="status">{text}</div>;
}
