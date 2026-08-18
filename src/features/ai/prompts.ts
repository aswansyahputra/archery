import type { Lang } from "@/lib/i18n";

export interface SessionPayload {
  targetName: string;
  distanceM: number;
  gearName?: string;
  totalEnds: number;
  arrowsPerEnd: number;
  endTotals: number[];
  runningTotal: number;
  avgPerArrow: number;
  hits: number;
  highRing: number;
  xCount: number;
  missCount: number;
  arrowsShot: number;
  arrows: { end: number; arrow: number; value: number | null; isX: boolean; isMiss: boolean }[];
  environmentNotes?: string;
}

export function buildMessages(lang: Lang, payload: SessionPayload): { role: "system" | "user"; content: string }[] {
  const langName = lang === "id" ? "Indonesian (Bahasa Indonesia)" : "English";
  const sys = `You are a coach for traditional archery / horsebow (FESPATI). Respond in ${langName}. Provide a structured coach-style report with: (1) strengths, (2) weaknesses, (3) end-by-end trend observation, (4) three actionable drills. Be concise, specific, and supportive.`;
  const user = `Session summary:
- Target: ${payload.targetName}
- Distance: ${payload.distanceM} m
- Gear: ${payload.gearName ?? "(none)"}
- Configuration: ${payload.totalEnds} ends x ${payload.arrowsPerEnd} arrows
- Arrows shot: ${payload.arrowsShot}/${payload.totalEnds * payload.arrowsPerEnd}
- Running total: ${payload.runningTotal}
- Average per arrow: ${payload.avgPerArrow.toFixed(2)}
- Hits: ${payload.hits}, High ring: ${payload.highRing}, X: ${payload.xCount}, Misses: ${payload.missCount}
- End totals: ${payload.endTotals.join(", ")}
- Environment notes: ${payload.environmentNotes ?? "(none)"}

Arrows:
${payload.arrows.map((a) => `End ${a.end + 1} Arrow ${a.arrow + 1}: ${a.isMiss ? "M" : a.isX ? `${a.value}+` : a.value ?? "-"}`).join("\n")}`;
  return [{ role: "system", content: sys }, { role: "user", content: user }];
}
