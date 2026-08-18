"use client";
import * as React from "react";

export function Wa10ZoneSvg({ size = 200, className }: { size?: number; className?: string }) {
  const r = size / 2;
  const radii = Array.from({ length: 10 }, (_, i) => (r * (i + 1)) / 10);
  const fills = ["#fdd835", "#fdd835", "#e53935", "#e53935", "#1e88e5", "#1e88e5", "#000000", "#000000", "#ffffff", "#ffffff"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className}>
      {radii.map((rr, i) => <circle key={i} cx={r} cy={r} r={rr} fill={fills[i]} stroke="#222" strokeWidth={0.6} />)}
      <circle cx={r} cy={r} r={r / 22} fill="none" stroke="#222" strokeWidth={0.8} />
    </svg>
  );
}
