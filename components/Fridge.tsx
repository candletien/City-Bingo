"use client";
// The drawn Art Deco fridge (PRD §9) until the kitchen photo is supplied:
// rounded top, thick black outline, brass stepped badge, speed lines, handles, trapezoid feet.
import Link from "next/link";
import type { ReactNode } from "react";
import { AREAS } from "@/lib/content";
import { Magnet } from "./Magnet";

export function Kitchen({ children }: { children: ReactNode }) {
  return (
    <div className="kitchen-bg">
      {children}
    </div>
  );
}

type Props = {
  magnets: Record<string, number>;
  /** Area whose magnet should glow (just earned / just upgraded). */
  focus?: string;
  note?: ReactNode;
};

export function Fridge({ magnets, focus, note }: Props) {
  const owned = AREAS.filter((a) => (magnets[a.id] ?? 0) > 0);
  return (
    <div className="fridge">
      <svg className="fridge-art" viewBox="0 0 280 440" aria-hidden="true">
        <defs>
          <linearGradient id="fr-body" x1="0" x2="1">
            <stop offset="0" stopColor="#fbf7ea" /><stop offset=".55" stopColor="#f4eedc" /><stop offset="1" stopColor="#e2d9bf" />
          </linearGradient>
          <linearGradient id="fr-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3d68b" /><stop offset=".5" stopColor="#d4a64a" /><stop offset="1" stopColor="#9c7424" />
          </linearGradient>
        </defs>
        {/* feet */}
        <path d="M46 416h34l-6 20H52z" fill="#111" />
        <path d="M200 416h34l-6 20h-22z" fill="#111" />
        {/* body */}
        <path d="M22 418V96C22 44 64 14 140 14s118 30 118 82v322z" fill="url(#fr-body)" stroke="#111" strokeWidth="6" strokeLinejoin="round" />
        {/* freezer / main door split */}
        <path d="M22 138h236" stroke="#111" strokeWidth="5" />
        <path d="M22 392h236" stroke="#111" strokeWidth="5" />
        {/* kick plate */}
        <path d="M34 400h212" stroke="url(#fr-brass)" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 408h212" stroke="url(#fr-brass)" strokeWidth="3" strokeLinecap="round" opacity=".7" />
        {/* stepped brass badge */}
        <path d="M84 58h112v10h10v22h-10v10H84V90H74V68h10z" fill="url(#fr-brass)" stroke="#111" strokeWidth="3" strokeLinejoin="round" />
        <text x="140" y="87" textAnchor="middle" fontFamily="var(--font-deco)" fontSize="17" fill="#111" letterSpacing="1.5">CITY BINGO</text>
        {/* speed lines */}
        {[114, 122, 130].map((y, i) => (
          <path key={y} d={`M${58 + i * 10} ${y - 4}h${120 - i * 20}`} stroke="url(#fr-brass)" strokeWidth="3.5" strokeLinecap="round" />
        ))}
        {/* handles */}
        <rect x="222" y="96" width="14" height="34" rx="7" fill="url(#fr-brass)" stroke="#111" strokeWidth="3" />
        <rect x="222" y="160" width="14" height="96" rx="7" fill="url(#fr-brass)" stroke="#111" strokeWidth="3" />
        {/* body sheen */}
        <path d="M40 150v230" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity=".55" />
      </svg>

      <div className="fridge-door">
        {owned.length === 0 && note}
        {owned.length > 0 && (
          <ul className="fridge-grid">
            {AREAS.map((a, i) => {
              const stage = magnets[a.id] ?? 0;
              if (!stage) {
                return (
                  <li key={a.id}>
                    <Link href={`/areas/${a.id}/start`} className="fridge-ghost" aria-label={`${a.name}: not won yet`}>
                      <Magnet areaId={a.id} stage={0} size={56} />
                    </Link>
                  </li>
                );
              }
              return (
                <li key={a.id} style={{ transform: `rotate(${[-6, 4, -3, 7, -5, 3][i]}deg)` }}>
                  <Link href={`/areas/${a.id}/start`} className={`fridge-magnet ${focus === a.id ? "is-focus" : ""}`}
                    aria-label={`${a.name} magnet, ${stage} of 8${stage >= 8 ? ", complete" : ""}`}>
                    <Magnet areaId={a.id} stage={stage} size={78} />
                    <span className="fridge-tag">{a.name.split("–")[0]} · {stage}/8</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/** Sticky note held by a lime magnet, for the empty fridge. */
export function FridgeNote({ children }: { children: ReactNode }) {
  return (
    <div className="fridge-note">
      <span className="fridge-note-pin" aria-hidden="true" />
      {children}
    </div>
  );
}
