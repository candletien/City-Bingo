// Clay magnets (PRD §9): matte, puffy, no outlines, soft shading and a small highlight.
// Placeholder art until the illustrated/photographed set lands: one per area, 8 stages.
import { useId, type ReactElement } from "react";

type Detail = { name: string; shape: Shape; color: string };
type Shape = "dot" | "drop" | "star" | "heart" | "leaf" | "wave" | "lantern" | "flower" | "boat" | "cross" | "moon" | "gear" | "diamond" | "bun";

type MagnetDef = { base: Base; color: string; accent: string; details: Detail[] };
type Base = "shophouse" | "lantern" | "chedi" | "church" | "fort" | "tram";

export const MAGNETS: Record<string, MagnetDef> = {
  "talat-noi": {
    base: "shophouse", color: "#3fa7a0", accent: "#1f6f69",
    details: [
      { name: "a river wave", shape: "wave", color: "#5b9bd5" },
      { name: "a rusty gear", shape: "gear", color: "#c9793a" },
      { name: "a red lantern", shape: "lantern", color: "#e4483b" },
      { name: "a mural splash", shape: "drop", color: "#ff7ac8" },
      { name: "a radish cake", shape: "bun", color: "#f3d27a" },
      { name: "a church star", shape: "star", color: "#ffd84d" },
      { name: "a little boat", shape: "boat", color: "#f2f0e6" },
    ],
  },
  yaowarat: {
    base: "lantern", color: "#e4483b", accent: "#9e241b",
    details: [
      { name: "a gold nugget", shape: "diamond", color: "#f2c230" },
      { name: "a dragon scale", shape: "leaf", color: "#3aa76d" },
      { name: "a steamed bun", shape: "bun", color: "#f5eddc" },
      { name: "a neon heart", shape: "heart", color: "#ff7ac8" },
      { name: "an incense glow", shape: "dot", color: "#ff9f43" },
      { name: "a lotus", shape: "flower", color: "#f7a8c4" },
      { name: "a lucky star", shape: "star", color: "#ffd84d" },
    ],
  },
  "tha-tien": {
    base: "chedi", color: "#f08a3c", accent: "#b1581a",
    details: [
      { name: "a jasmine garland", shape: "flower", color: "#fbf7ee" },
      { name: "a porcelain tile", shape: "diamond", color: "#4f8fd6" },
      { name: "a golden foot", shape: "drop", color: "#f2c230" },
      { name: "a rose", shape: "heart", color: "#e84a5f" },
      { name: "a river wave", shape: "wave", color: "#5b9bd5" },
      { name: "a lotus leaf", shape: "leaf", color: "#58b368" },
      { name: "a temple star", shape: "star", color: "#ffd84d" },
    ],
  },
  "kudi-chin": {
    base: "church", color: "#f2a7b8", accent: "#b85f75",
    details: [
      { name: "a Portuguese cake", shape: "bun", color: "#e7b55f" },
      { name: "a little cross", shape: "cross", color: "#fbf7ee" },
      { name: "a crescent moon", shape: "moon", color: "#6cc4a1" },
      { name: "a shrine lantern", shape: "lantern", color: "#e4483b" },
      { name: "a river wave", shape: "wave", color: "#5b9bd5" },
      { name: "a friendly heart", shape: "heart", color: "#ff7ac8" },
      { name: "a golden star", shape: "star", color: "#ffd84d" },
    ],
  },
  banglamphu: {
    base: "fort", color: "#7fb5e8", accent: "#3f76a8",
    details: [
      { name: "a grain of rice", shape: "drop", color: "#fbf7ee" },
      { name: "a lamphu leaf", shape: "leaf", color: "#58b368" },
      { name: "a sunset sun", shape: "dot", color: "#ff9f43" },
      { name: "a canal wave", shape: "wave", color: "#3f76a8" },
      { name: "a printing block", shape: "diamond", color: "#c26de0" },
      { name: "a flower", shape: "flower", color: "#ffd84d" },
      { name: "a sugar cube", shape: "bun", color: "#f5eddc" },
    ],
  },
  "charoen-krung": {
    base: "tram", color: "#8c7ae6", accent: "#5846b8",
    details: [
      { name: "a river boat", shape: "boat", color: "#f2f0e6" },
      { name: "a red brick", shape: "diamond", color: "#c8553d" },
      { name: "an antique gear", shape: "gear", color: "#d4a64a" },
      { name: "a street-art drop", shape: "drop", color: "#ff7ac8" },
      { name: "a crescent moon", shape: "moon", color: "#6cc4a1" },
      { name: "a writer's star", shape: "star", color: "#ffd84d" },
      { name: "a heart", shape: "heart", color: "#e84a5f" },
    ],
  },
};

export function detailName(areaId: string, stage: number): string | null {
  const def = MAGNETS[areaId];
  if (!def || stage < 2) return null;
  return def.details[Math.min(6, stage - 2)]?.name ?? null;
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt))));
  const r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// Detail slots around the base (cx, cy, size).
const SLOTS: [number, number, number][] = [
  [26, 30, 1], [95, 27, 0.95], [16, 74, 0.9], [104, 72, 0.9], [32, 106, 0.85], [88, 107, 0.85], [60, 13, 0.8],
];

function detailPath(shape: Shape): ReactElement {
  switch (shape) {
    case "dot": return <circle r="9" />;
    case "drop": return <path d="M0-11C5-4 8 0 8 4a8 8 0 0 1-16 0c0-4 3-8 8-15z" />;
    case "star": return <path d="M0-11l3.3 6.6 7.2 1-5.2 5.1 1.2 7.2L0 5.5-6.5 8.9l1.2-7.2-5.2-5.1 7.2-1z" strokeLinejoin="round" />;
    case "heart": return <path d="M0 9C-9 3-11-2-9-6c2-4 7-4 9 0 2-4 7-4 9 0 2 4 0 9-9 15z" />;
    case "leaf": return <path d="M-9 8C-10-4-2-10 10-10 10 2 4 10-9 8z" />;
    case "wave": return <path d="M-12 3c3-7 7-7 8-2s5 5 8 0 6-5 8 2v5h-24z" />;
    case "lantern": return <g><ellipse rx="8" ry="9" /><rect x="-4" y="-12" width="8" height="4" rx="2" /><rect x="-4" y="8" width="8" height="4" rx="2" /></g>;
    case "flower": return <g>{[0, 72, 144, 216, 288].map((a) => <circle key={a} r="4.6" cx={Math.cos((a * Math.PI) / 180) * 5.5} cy={Math.sin((a * Math.PI) / 180) * 5.5} />)}</g>;
    case "boat": return <g><path d="M-12 1h24l-4 7h-16z" /><path d="M0-12v11h9z" /></g>;
    case "cross": return <path d="M-3-11h6v6h6v6h-6v10h-6V1h-6v-6h6z" />;
    case "moon": return <path d="M4-10a10 10 0 1 0 6 16A8 8 0 1 1 4-10z" />;
    case "gear": return <g>{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => <circle key={a} r="3" cx={Math.cos((a * Math.PI) / 180) * 7.5} cy={Math.sin((a * Math.PI) / 180) * 7.5} />)}<circle r="7" /></g>;
    case "diamond": return <rect x="-7.5" y="-7.5" width="15" height="15" rx="4" transform="rotate(45)" />;
    case "bun": return <ellipse rx="10" ry="7" />;
  }
}

function basePath(base: Base, fill: string, accent: string, grad: string): ReactElement {
  const inset = { fill: accent, opacity: 0.55 };
  switch (base) {
    case "shophouse":
      return (<g><path d="M30 98V54c0-17 13-28 30-28s30 11 30 28v44q0 6-6 6H36q-6 0-6-6z" fill={grad} />
        <rect x="44" y="58" width="32" height="20" rx="10" {...inset} /><rect x="50" y="84" width="20" height="20" rx="6" {...inset} /></g>);
    case "lantern":
      return (<g><rect x="46" y="20" width="28" height="12" rx="6" fill={accent} /><ellipse cx="60" cy="64" rx="34" ry="34" fill={grad} />
        <path d="M40 40q-8 24 0 48M80 40q8 24 0 48M60 30v68" stroke={accent} strokeOpacity=".35" strokeWidth="5" fill="none" strokeLinecap="round" />
        <rect x="46" y="96" width="28" height="10" rx="5" fill={accent} /><rect x="56" y="104" width="8" height="12" rx="4" fill={fill} /></g>);
    case "chedi":
      return (<g><path d="M60 14c3 10 5 16 5 22 10 4 16 12 18 24 4 3 9 8 11 18l6 10q2 8-6 8H26q-8 0-6-8l6-10c2-10 7-15 11-18 2-12 8-20 18-24 0-6 2-12 5-22z" fill={grad} />
        <rect x="42" y="76" width="36" height="8" rx="4" {...inset} /><circle cx="60" cy="54" r="7" {...inset} /></g>);
    case "church":
      return (<g><path d="M30 104V62q0-8 8-8h6c0-16 7-30 16-30s16 14 16 30h6q8 0 8 8v42q0 4-4 4H34q-4 0-4-4z" fill={grad} />
        <circle cx="60" cy="44" r="7" {...inset} /><path d="M50 108V86a10 10 0 0 1 20 0v22z" {...inset} /></g>);
    case "fort":
      return (<g><path d="M44 22h32l22 22v36l-22 22H44L22 80V44z" fill={grad} strokeLinejoin="round" />
        <rect x="36" y="34" width="48" height="10" rx="5" {...inset} /><path d="M50 102V82a10 10 0 0 1 20 0v20z" {...inset} /></g>);
    case "tram":
      return (<g><rect x="22" y="30" width="76" height="70" rx="20" fill={grad} />
        <rect x="32" y="42" width="56" height="22" rx="8" {...inset} /><circle cx="42" cy="100" r="8" fill={accent} /><circle cx="78" cy="100" r="8" fill={accent} />
        <rect x="56" y="16" width="8" height="16" rx="4" fill={accent} /></g>);
  }
}

/**
 * stage 0 = locked outline · 1 = base · 2–7 = one more detail each · 8 = full scene + gold rim.
 * `highlight` pulses the detail added at that stage.
 */
export function Magnet({ areaId, stage, size = 96, highlight = false, title }:
  { areaId: string; stage: number; size?: number; highlight?: boolean; title?: string }) {
  const id = useId().replace(/:/g, "");
  const def = MAGNETS[areaId];
  if (!def) return null;

  if (stage <= 0) {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={title ?? "Magnet not won yet"}>
        <g opacity=".22" fill="currentColor">{basePath(def.base, "currentColor", "currentColor", "currentColor")}</g>
      </svg>
    );
  }

  const shown = Math.min(7, stage - 1);
  const newest = highlight && stage >= 2 ? Math.min(6, stage - 2) : -1;
  const colors = Array.from(new Set([def.color, ...def.details.slice(0, shown).map((d) => d.color)]));
  const g = (c: string) => `url(#${id}-${c.slice(1)})`;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={title ?? `Magnet stage ${stage} of 8`} style={{ overflow: "visible" }}>
      <defs>
        {colors.map((c) => (
          <radialGradient key={c} id={`${id}-${c.slice(1)}`} cx="35%" cy="30%" r="80%">
            <stop offset="0" stopColor={shade(c, 0.38)} />
            <stop offset=".45" stopColor={c} />
            <stop offset="1" stopColor={shade(c, -0.22)} />
          </radialGradient>
        ))}
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3c4" /><stop offset=".4" stopColor="#d4a64a" /><stop offset="1" stopColor="#8a6420" />
        </linearGradient>
        <filter id={`${id}-sh`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.4" floodColor="#1a1208" floodOpacity=".28" />
        </filter>
        <filter id={`${id}-soft`}><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>

      {stage >= 8 && (
        <g filter={`url(#${id}-sh)`}>
          <circle cx="60" cy="62" r="58" fill={`url(#${id}-rim)`} />
          <circle cx="60" cy="62" r="51" fill={shade(def.color, 0.72)} />
        </g>
      )}

      <g filter={`url(#${id}-sh)`}>{basePath(def.base, def.color, def.accent, g(def.color))}</g>
      <ellipse cx="46" cy="40" rx="11" ry="6" fill="#fff" opacity=".38" filter={`url(#${id}-soft)`} transform="rotate(-24 46 40)" />

      {def.details.slice(0, shown).map((d, i) => {
        const [x, y, s] = SLOTS[i];
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`} filter={`url(#${id}-sh)`} className={i === newest ? "magnet-new" : undefined}>
            {i === newest && <circle r="17" fill="var(--lime)" opacity=".9"><animate attributeName="r" values="14;19;14" dur="1.6s" repeatCount="indefinite" /></circle>}
            <g fill={g(d.color)}>{detailPath(d.shape)}</g>
            <ellipse cx="-3" cy="-4" rx="3.2" ry="2" fill="#fff" opacity=".45" />
          </g>
        );
      })}

      {stage >= 8 && [[14, 20], [106, 18], [110, 100]].map(([x, y], i) => (
        <path key={i} transform={`translate(${x} ${y})`} d="M0-7l1.8 5.2L7 0l-5.2 1.8L0 7l-1.8-5.2L-7 0l5.2-1.8z" fill="#fff3c4">
          <animate attributeName="opacity" values="1;.3;1" dur={`${1.4 + i * 0.4}s`} repeatCount="indefinite" />
        </path>
      ))}
    </svg>
  );
}
