"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { Trash2 } from "lucide-react";
import { db } from "@/data/db";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { getPreset } from "@/features/targets/presets";
import type { SessionRow } from "@/data/db";

export function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language?.startsWith("en") ? "en" : "id") as "id" | "en";
  const sessions = useLiveQuery<SessionRow[], SessionRow[]>(
    async () => {
      if (!db) return [];
      const all = await db.sessions.toArray();
      return all.sort((a, b) => b.started_at.localeCompare(a.started_at));
    },
    [],
    [],
  );
  const remove = async (id: string) => {
    if (!confirm(t("history.deleteConfirm")) || !db) return;
    await db.transaction("rw", db.sessions, db.session_arrows, db.outbox, async () => {
      await db.session_arrows.where("session_id").equals(id).delete();
      await db.sessions.delete(id);
      await db.outbox.where("entity_id").equals(id).delete();
    });
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("history.title")}</h1>
      {sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("history.empty")}</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => {
            const preset = getPreset(s.target_id);
            return (
              <li key={s.id}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{preset ? t(preset.labelKey) : s.target_id}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(s.started_at, lang)} · {s.distance_m} m · {s.total_ends}×{s.arrows_per_end} ·{" "}
                        {s.status === "completed" ? t("history.completed") : t("history.active")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link to={`/sessions/${s.id}`}><Button size="sm" variant="outline">{t("scoring.view")}</Button></Link>
                      <Button size="icon" variant="ghost" onClick={() => remove(s.id)} aria-label={t("common.delete")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
