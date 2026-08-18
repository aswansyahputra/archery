"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Undo2, CheckCircle2, X } from "lucide-react";
import { db } from "@/data/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPreset } from "@/features/targets/presets";
import { computeTotals, scoreFor } from "@/features/scoring/engine";
import { completeSession, setArrow } from "@/data/repos/sessions";
import type { SessionArrowRow, SessionRow } from "@/data/db";

export function ScoringScreen() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const session = useLiveQuery<SessionRow | undefined, SessionRow | undefined>(
    async () => (db && id ? db.sessions.get(id) : undefined),
    [id],
    undefined,
  );
  const arrows = useLiveQuery<SessionArrowRow[], SessionArrowRow[]>(
    async () => { if (!db || !id) return []; return db.session_arrows.where("session_id").equals(id).toArray(); },
    [id],
    [],
  );

  const preset = session ? getPreset(session.target_id) : undefined;
  const rule = preset?.rule;
  const sorted = React.useMemo(() => {
    if (!session) return [];
    const list = [...(arrows ?? [])];
    list.sort((a, b) => a.end_index - b.end_index || a.arrow_index - b.arrow_index);
    return list;
  }, [arrows, session]);

  const totals = React.useMemo(() => {
    if (!session || !rule) return null;
    return computeTotals(
      sorted.map((a) => ({ value: a.value, is_x: a.is_x, is_miss: a.is_miss })),
      session.total_ends, session.arrows_per_end, rule,
    );
  }, [sorted, session, rule]);

  const currentIndex = React.useMemo(() => {
    if (!sorted.length) return 0;
    return sorted.findIndex((a) => a.value === null && !a.is_miss);
  }, [sorted]);
  const current = sorted[currentIndex];

  const score = async (value: number, isX = false) => { if (!current) return; await setArrow(current.id, { value, is_x: isX, is_miss: false }); };
  const markMiss = async () => { if (!current) return; await setArrow(current.id, { value: null, is_x: false, is_miss: true }); };
  const undo = async () => {
    const lastIdx = [...sorted].reverse().findIndex((a) => a.value !== null || a.is_miss);
    if (lastIdx < 0) return;
    const last = sorted[sorted.length - 1 - lastIdx];
    await setArrow(last.id, { value: null, is_x: false, is_miss: false });
  };

  const finish = async () => {
    if (!session) return;
    await completeSession(session.id);
    navigate(`/sessions/${session.id}`);
  };

  if (!session) return <p className="text-sm text-muted-foreground">{t("common.loading")}</p>;
  if (session.status === "completed") { navigate(`/sessions/${session.id}`); return null; }
  if (!preset || !rule || !totals) return <p className="text-sm text-destructive">Invalid target: {session.target_id}</p>;

  const totalArrows = session.total_ends * session.arrows_per_end;
  const progress = sorted.filter((a) => a.value !== null || a.is_miss).length;
  const maxPossible = totalArrows * rule.maxScore;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/sessions/${session.id}`)}>
          <ArrowLeft className="h-4 w-4" /><span>{t("common.back")}</span>
        </Button>
        <div className="text-xs text-muted-foreground">
          {t("scoring.end")} {current ? current.end_index + 1 : session.total_ends}/{session.total_ends} · {t("scoring.arrow")} {current ? current.arrow_index + 1 : session.arrows_per_end}/{session.arrows_per_end}
        </div>
      </header>
      <Card>
        <CardContent className="grid grid-cols-2 gap-3 py-4 sm:grid-cols-4">
          <Stat label={t("scoring.runningTotal")} value={totals.running} accent />
          <Stat label={t("scoring.endTotal")} value={totals.endTotals[current ? current.end_index : 0]} />
          <Stat label={t("scoring.avgPerArrow")} value={totals.avgPerArrow.toFixed(2)} />
          <Stat label={t("scoring.highRing")} value={`${totals.highRingCount}/${totals.arrowsShot}`} />
          <Stat label={t("scoring.hits")} value={`${totals.hitCount}/${totals.arrowsShot}`} />
          <Stat label={t("scoring.xCount")} value={totals.xCount} />
          <Stat label={t("scoring.missCount")} value={totals.missCount} />
          <Stat label={t("scoring.maxPossible")} value={maxPossible} />
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {rule.rings.map((ring) => {
          const isX = !!ring.isX;
          const label = isX ? `${ring.value}+` : String(ring.value);
          return (
            <Button key={`${ring.value}-${isX}`} size="lg" onClick={() => score(ring.value, isX)} className="h-16 text-xl font-bold" disabled={!current}>
              {label}
            </Button>
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="destructive" size="lg" onClick={markMiss} disabled={!current}>
          <X className="h-5 w-5" /><span>{t("scoring.miss")}</span>
        </Button>
        <Button variant="outline" size="lg" onClick={undo} disabled={progress === 0}>
          <Undo2 className="h-5 w-5" /><span>{t("scoring.undoLast")}</span>
        </Button>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{progress}/{totalArrows}</span>
        <Button onClick={finish} disabled={progress < totalArrows}>
          <CheckCircle2 className="h-5 w-5" /><span>{t("scoring.complete")}</span>
        </Button>
      </div>
      <ProgressGrid arrows={sorted} ends={session.total_ends} arrowsPerEnd={session.arrows_per_end} rule={rule} />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-md border p-2 ${accent ? "bg-primary/5 border-primary/30" : ""}`}>
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className={`text-lg font-bold ${accent ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}

function ProgressGrid({ arrows, ends, arrowsPerEnd, rule }: { arrows: SessionArrowRow[]; ends: number; arrowsPerEnd: number; rule: import("@/features/scoring/engine").ScoringRule }) {
  return (
    <div className="space-y-1">
      {Array.from({ length: ends }).map((_, e) => (
        <div key={e} className="flex items-center gap-1">
          <span className="w-12 text-right text-xs text-muted-foreground">E{e + 1}</span>
          <div className="flex flex-1 gap-1">
            {Array.from({ length: arrowsPerEnd }).map((_, a) => {
              const arr = arrows.find((x) => x.end_index === e && x.arrow_index === a);
              const s = arr ? scoreFor(rule, arr.value, arr.is_x) : null;
              return (
                <div key={a} className={`flex-1 rounded border px-1 py-0.5 text-center text-xs ${s?.isHigh ? "border-primary bg-primary/10" : arr ? "bg-secondary" : "bg-muted/50"}`}>
                  {arr ? (arr.is_miss ? "M" : s?.display ?? "—") : "·"}
                </div>
              );
            })}
          </div>
          <span className="w-10 text-right text-xs text-muted-foreground">
            {arrows.filter((x) => x.end_index === e).reduce((acc, x) => acc + (x.is_miss ? 0 : x.value ?? 0), 0)}
          </span>
        </div>
      ))}
    </div>
  );
}
