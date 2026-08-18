"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Sparkles, Play } from "lucide-react";
import { db } from "@/data/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPreset } from "@/features/targets/presets";
import { computeTotals, scoreFor } from "@/features/scoring/engine";
import { formatDateTime } from "@/lib/format";
import { AiSetupModal } from "@/features/ai/AiSetupModal";
import { AnalysisPanel } from "@/features/ai/AnalysisPanel";
import { getAiKey } from "@/features/ai/openrouter";
import type { SessionArrowRow, SessionRow, GearProfileRow } from "@/data/db";
import type { SessionPayload } from "@/features/ai/prompts";

export function SessionDetailScreen() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [setupOpen, setSetupOpen] = React.useState(false);
  const [hasKey, setHasKey] = React.useState(false);
  React.useEffect(() => { setHasKey(Boolean(getAiKey().key)); }, [setupOpen]);

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
  const gear = useLiveQuery<GearProfileRow | undefined, GearProfileRow | undefined>(
    async () => { if (!db || !session?.gear_profile_id) return undefined; return db.gear_profiles.get(session.gear_profile_id); },
    [session?.gear_profile_id],
    undefined,
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
    return computeTotals(sorted.map((a) => ({ value: a.value, is_x: a.is_x, is_miss: a.is_miss })), session.total_ends, session.arrows_per_end, rule);
  }, [sorted, session, rule]);

  if (!session) return <p className="text-sm text-muted-foreground">{t("common.loading")}</p>;

  const lang = (i18n.language?.startsWith("en") ? "en" : "id") as "id" | "en";
  const payload: SessionPayload | null = totals && rule && preset ? {
    targetName: t(preset.labelKey),
    distanceM: session.distance_m,
    gearName: gear?.name,
    totalEnds: session.total_ends,
    arrowsPerEnd: session.arrows_per_end,
    endTotals: totals.endTotals,
    runningTotal: totals.running,
    avgPerArrow: totals.avgPerArrow,
    hits: totals.hitCount,
    highRing: totals.highRingCount,
    xCount: totals.xCount,
    missCount: totals.missCount,
    arrowsShot: totals.arrowsShot,
    arrows: sorted.map((a) => ({ end: a.end_index, arrow: a.arrow_index, value: a.value, isX: a.is_x, isMiss: a.is_miss })),
    environmentNotes: session.environment_notes,
  } : null;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /><span>{t("common.back")}</span>
        </Button>
        <h1 className="text-base font-semibold">{preset ? t(preset.labelKey) : session.target_id}</h1>
      </header>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">{formatDateTime(session.started_at, lang)}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {session.distance_m} m · {session.total_ends}×{session.arrows_per_end} ·{" "}
              {session.status === "completed" ? t("history.completed") : t("history.active")}
            </p>
          </div>
          {session.status === "active" && (
            <Button size="sm" onClick={() => navigate(`/sessions/${session.id}/score`)}>
              <Play className="h-4 w-4" /><span>{t("scoring.view")}</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {totals && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label={t("scoring.runningTotal")} value={totals.running} />
              <Stat label={t("scoring.avgPerArrow")} value={totals.avgPerArrow.toFixed(2)} />
              <Stat label={t("scoring.hits")} value={`${totals.hitCount}/${totals.arrowsShot}`} />
              <Stat label={t("scoring.highRing")} value={`${totals.highRingCount}/${totals.arrowsShot}`} />
              <Stat label={t("scoring.xCount")} value={totals.xCount} />
              <Stat label={t("scoring.missCount")} value={totals.missCount} />
            </div>
          )}
          {gear && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">{t("setup.reuseGear")}</p>
                <p className="text-sm font-medium">{gear.name}</p>
                <p className="text-xs text-muted-foreground">
                  {gear.bow_name ?? gear.bow_type ?? "—"} · {gear.draw_weight_lbs ?? "?"} lbs @ {gear.draw_length_in ?? "?"}″ · {gear.arrow_material ?? "—"} {gear.arrow_weight_gr ?? "?"}gr
                </p>
              </div>
            </>
          )}
          {session.environment_notes && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">{t("setup.notes")}</p>
                <p className="text-sm">{session.environment_notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      {rule && (
        <Card>
          <CardContent className="space-y-2 pt-4">
            {Array.from({ length: session.total_ends }).map((_, e) => (
              <div key={e} className="flex items-center gap-2">
                <span className="w-10 text-right text-xs text-muted-foreground">{t("scoring.end")} {e + 1}</span>
                <div className="flex flex-1 gap-1">
                  {Array.from({ length: session.arrows_per_end }).map((_, a) => {
                    const arr = sorted.find((x) => x.end_index === e && x.arrow_index === a);
                    const s = arr ? scoreFor(rule, arr.value, arr.is_x) : null;
                    return (
                      <div key={a} className={`flex-1 rounded border px-2 py-1 text-center text-sm ${s?.isHigh ? "border-primary bg-primary/10 font-semibold" : arr ? "bg-secondary" : "bg-muted/30"}`}>
                        {arr ? (arr.is_miss ? "M" : s?.display ?? "—") : "·"}
                      </div>
                    );
                  })}
                </div>
                <span className="w-10 text-right text-xs font-semibold">{totals?.endTotals[e] ?? 0}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {session.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" />{t("nav.ai")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnalysisPanel payload={payload} hasKey={hasKey} onNeedKey={() => setSetupOpen(true)} />
          </CardContent>
        </Card>
      )}
      <AiSetupModal open={setupOpen} onOpenChange={setSetupOpen} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border p-2">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
