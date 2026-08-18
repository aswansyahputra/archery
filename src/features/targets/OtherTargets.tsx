"use client";
import * as React from "react";

export function Wa5ZoneSvg({ size = 200, className }: { size?: number; className?: string }) {
  const r = size / 2;
  const radii = Array.from({ length: 5 }, (_, i) => (r * (i + 1)) / 5);
  const fills = ["#fdd835", "#e53935", "#1e88e5", "#000000", "#ffffff"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className}>
      {radii.map((rr, i) => <circle key={i} cx={r} cy={r} r={rr} fill={fills[i]} stroke="#222" strokeWidth={0.8} />)}
    </svg>
  );
}

export function NfaaSvg({ size = 200, className }: { size?: number; className?: string }) {
  const r = size / 2;
  const radii = Array.from({ length: 5 }, (_, i) => (r * (i + 1)) / 5);
  const fills = ["#fdd835", "#e53935", "#1e88e5", "#ffffff", "#000000"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className}>
      {radii.map((rr, i) => <circle key={i} cx={r} cy={r} r={rr} fill={fills[i]} stroke="#fff" strokeWidth={0.8} />)}
      <circle cx={r} cy={r} r={r / 22} fill="none" stroke="#fff" strokeWidth={0.8} />
    </svg>
  );
}

export function KoreanTraditionalSvg({ size = 200, className }: { size?: number; className?: string }) {
  const r = size / 2;
  const radii = Array.from({ length: 6 }, (_, i) => (r * (i + 1)) / 6);
  const fills = ["#fff8d6", "#fdd835", "#e53935", "#1e88e5", "#ffffff", "#000000"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className}>
      {radii.map((rr, i) => <circle key={i} cx={r} cy={r} r={rr} fill={fills[i]} stroke="#222" strokeWidth={0.8} />)}
    </svg>
  );
}

export function TurkishTraditionalSvg({ size = 200, className }: { size?: number; className?: string }) {
  const r = size / 2;
  const radii = Array.from({ length: 5 }, (_, i) => (r * (i + 1)) / 5);
  const fills = ["#fdd835", "#e53935", "#1e88e5", "#ffffff", "#000000"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className}>
      {radii.map((rr, i) => <circle key={i} cx={r} cy={r} r={rr} fill={fills[i]} stroke="#222" strokeWidth={0.8} />)}
    </svg>
  );
}

export function AsiaticRingSvg({ size = 200, className }: { size?: number; className?: string }) {
  const r = size / 2;
  const radii = Array.from({ length: 3 }, (_, i) => (r * (i + 1)) / 3);
  const fills = ["#fdd835", "#e53935", "#ffffff"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className}>
      {radii.map((rr, i) => <circle key={i} cx={r} cy={r} r={rr} fill={fills[i]} stroke="#222" strokeWidth={0.8} />)}
    </svg>
  );
}
