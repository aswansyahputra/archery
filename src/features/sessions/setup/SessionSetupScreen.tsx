"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { Copy, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/data/db";
import { useAuth } from "@/features/auth/AuthProvider";
import { TARGET_PRESETS, getPreset, DEFAULT_TARGET_ID } from "@/features/targets/presets";
import { createSession } from "@/data/repos/sessions";
import type { GearProfileRow, SessionRow } from "@/data/db";

export function SessionSetupScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [targetId, setTargetId] = React.useState<string>(DEFAULT_TARGET_ID);
  const [distance, setDistance] = React.useState<number>(getPreset(DEFAULT_TARGET_ID)?.defaultDistance ?? 18);
  const [ends, setEnds] = React.useState<number>(6);
  const [arrowsPerEnd, setArrowsPerEnd] = React.useState<number>(3);
  const [lane, setLane] = React.useState("");
  const [gearId, setGearId] = React.useState<string>("");
  const [notes, setNotes] = React.useState("");
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 16));
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const gearProfiles = useLiveQuery<GearProfileRow[], GearProfileRow[]>(
    async () => {
      if (!db || !user) return [];
      return db.gear_profiles.where("user_id").equals(user.id).toArray();
    },
    [user?.id],
    [],
  );
  const lastSession = useLiveQuery<SessionRow | undefined, SessionRow | undefined>(
    async () => {
      if (!db || !user) return undefined;
      const rows = await db.sessions.where("user_id").equals(user.id).reverse().sortBy("started_at");
      return rows[0];
    },
    [user?.id],
    undefined,
  );

  const preset = getPreset(targetId);
  React.useEffect(() => {
    if (!preset) return;
    if (!preset.distances.includes(distance)) setDistance(preset.defaultDistance);
  }, [preset, distance]);

  const onTargetChange = (id: string) => {
    setTargetId(id);
    const p = getPreset(id);
    if (p) setDistance(p.defaultDistance);
  };

  const copyLast = () => {
    if (!lastSession) return;
    setTargetId(lastSession.target_id);
    setDistance(lastSession.distance_m);
    setEnds(lastSession.total_ends);
    setArrowsPerEnd(lastSession.arrows_per_end);
    setLane(lastSession.lane ?? "");
    setGearId(lastSession.gear_profile_id ?? "");
    setNotes(lastSession.environment_notes ?? "");
  };

  const start = async () => {
    if (!user) { setErr(t("auth.needInternet")); return; }
    if (ends < 1 || arrowsPerEnd < 1) { setErr(t("setup.invalidEnds")); return; }
    setSubmitting(true);
    try {
      const s = await createSession({
        user_id: user.id,
        started_at: new Date(date).toISOString(),
        target_id: targetId,
        distance_m: Number(distance),
        lane: lane || undefined,
        gear_profile_id: gearId || undefined,
        environment_notes: notes || undefined,
        total_ends: ends,
        arrows_per_end: arrowsPerEnd,
      });
      navigate(`/sessions/${s.id}/score`);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header><h1 className="text-2xl font-bold">{t("setup.title")}</h1></header>
      <div className="flex gap-2">
        <Button variant="outline" onClick={copyLast} disabled={!lastSession}>
          <Copy className="h-4 w-4" /><span>{t("setup.copyLastSession")}</span>
        </Button>
      </div>
      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>{t("setup.target")}</Label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {TARGET_PRESETS.map((p) => {
                const Svg = p.Svg;
                return (
                  <button key={p.id} type="button" onClick={() => onTargetChange(p.id)}
                    className={`flex flex-col items-center gap-1 rounded-md border p-2 text-xs hover:bg-accent ${targetId === p.id ? "border-primary ring-2 ring-primary/40" : ""}`}>
                    <Svg size={64} /><span className="text-center">{t(p.labelKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">{t("setup.date")}</Label>
              <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">{t("setup.distance")}</Label>
              <Select value={String(distance)} onValueChange={(v) => setDistance(Number(v))}>
                <SelectTrigger id="distance"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(preset?.distances ?? [18, 30, 50, 70]).map((d) => (
                    <SelectItem key={d} value={String(d)}>{d} m</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ends">{t("setup.ends")}</Label>
              <Input id="ends" type="number" min={1} max={36} value={ends} onChange={(e) => setEnds(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrows">{t("setup.arrowsPerEnd")}</Label>
              <Input id="arrows" type="number" min={1} max={12} value={arrowsPerEnd} onChange={(e) => setArrowsPerEnd(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lane">{t("setup.lane")}</Label>
            <Input id="lane" value={lane} onChange={(e) => setLane(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>{t("setup.reuseGear")}</Label>
            <Select value={gearId || "_none"} onValueChange={(v) => setGearId(v === "_none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder={t("setup.noGearProfiles")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">—</SelectItem>
                {gearProfiles.map((g) => (<SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{t("setup.notes")}</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <Button onClick={start} disabled={submitting} className="w-full" size="lg">
            <Play className="h-5 w-5" /><span>{t("setup.start")}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
