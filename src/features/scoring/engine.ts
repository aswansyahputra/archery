export interface ScoringRing { value: number; isX?: boolean; labelKey: string; }
export interface ScoringRule {
  id: string;
  rings: ScoringRing[];
  hitValues: number[];
  highRingValue: number;
  maxScore: number;
}
export interface ScoreResult { display: string; numeric: number; isHit: boolean; isHigh: boolean; isMiss: boolean; }

export function scoreFor(rule: ScoringRule, value: number | null, isX = false): ScoreResult {
  if (value === null) return { display: "—", numeric: 0, isHit: false, isHigh: false, isMiss: false };
  const ring = rule.rings.find((r) => r.value === value && (r.isX ?? false) === isX);
  const display = ring?.isX ? `${value}+` : String(value);
  return { display, numeric: value, isHit: rule.hitValues.includes(value), isHigh: value >= rule.highRingValue, isMiss: false };
}

export interface ArrowInput { value: number | null; is_x: boolean; is_miss: boolean; }
export interface Totals {
  running: number;
  endTotals: number[];
  avgPerArrow: number;
  hitCount: number;
  highRingCount: number;
  xCount: number;
  missCount: number;
  arrowsShot: number;
}

export function computeTotals(arrows: ArrowInput[], totalEnds: number, arrowsPerEnd: number, rule: ScoringRule): Totals {
  let running = 0, highRingCount = 0, hitCount = 0, xCount = 0, missCount = 0, arrowsShot = 0;
  const endTotals: number[] = Array(totalEnds).fill(0);
  for (let e = 0; e < totalEnds; e++) {
    for (let a = 0; a < arrowsPerEnd; a++) {
      const arr = arrows[e * arrowsPerEnd + a];
      if (!arr) continue;
      if (arr.is_miss) { missCount++; arrowsShot++; continue; }
      if (arr.value === null) continue;
      running += arr.value;
      endTotals[e] += arr.value;
      arrowsShot++;
      if (rule.hitValues.includes(arr.value)) hitCount++;
      if (arr.value >= rule.highRingValue) highRingCount++;
      if (arr.is_x) xCount++;
    }
  }
  return { running, endTotals, avgPerArrow: arrowsShot > 0 ? running / arrowsShot : 0, hitCount, highRingCount, xCount, missCount, arrowsShot };
}
