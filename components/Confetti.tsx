"use client";
import { useMemo } from "react";

const COLORS = ["#d8f51c", "#ffffff", "#d8f51c", "#d4a64a", "#b7b8a8"];

/** CSS-only confetti burst; honours reduced motion via the global rule. */
export function Confetti({ count = 44 }: { count?: number }) {
  const bits = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    dur: 1.8 + Math.random() * 1.4,
    rot: Math.random() * 360,
    w: 6 + Math.random() * 8,
    c: COLORS[i % COLORS.length],
    round: i % 3 === 0,
  })), [count]);
  return (
    <div className="confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <i key={i} style={{
          left: `${b.left}%`, width: b.w, height: b.round ? b.w : b.w * 0.5, background: b.c,
          borderRadius: b.round ? "50%" : 2, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s`,
          transform: `rotate(${b.rot}deg)`,
        }} />
      ))}
    </div>
  );
}
