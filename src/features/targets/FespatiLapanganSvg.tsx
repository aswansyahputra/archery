"use client";
import * as React from "react";

interface Props { size?: number; className?: string; showLabels?: boolean; }

export function FespatiLapanganSvg({ size = 200, className, showLabels = true }: Props) {
  const r = size / 2;
  const cx = r, cy = r;
  const radii = [1, 2, 3, 4, 5, 6].map((i) => (r * i) / 6);
  const fills = ["#fdd835", "#fdd835", "#e53935", "#1e88e5", "#ffffff", "#1e88e5"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className} role="img" aria-label="FESPATI Lapangan target">
      <rect x={0} y={0} width={size} height={size} fill="#ffffff" stroke="#222" strokeWidth={1} />
      {radii.map((rr, i) => (
        <circle key={i} cx={cx} cy={cy} r={rr} fill={fills[i]} stroke="#222" strokeWidth={1} />
      ))}
      <circle cx={cx} cy={cy} r={r / 18} fill="#fff8d6" stroke="#222" strokeWidth={0.8} />
      <path d={`M ${cx - r / 22} ${cy} L ${cx + r / 22} ${cy} M ${cx} ${cy - r / 22} L ${cx} ${cy + r / 22}`} stroke="#222" strokeWidth={1} fill="none" />
      {showLabels && [6, 5, 4, 3, 2, 1].map((v, i) => {
        const rr = radii[i];
        const x = cx + rr * 0.85;
        return (
          <text key={v} x={x} y={cy + 4} fontSize={Math.max(8, size / 22)} fill="#222" textAnchor="middle">{v === 6 ? "6+" : v}</text>
        );
      })}
    </svg>
  );
}
