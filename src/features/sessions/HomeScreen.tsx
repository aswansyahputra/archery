"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, History as HistoryIcon } from "lucide-react";
import { db } from "@/data/db";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInButton } from "@/features/auth/SignInButton";
import { formatDate } from "@/lib/format";
import { getPreset } from "@/features/targets/presets";
import type { SessionRow } from "@/data/db";

export function HomeScreen() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sessions = useLiveQuery<SessionRow[], SessionRow[]>(
    async () => {
      if (!db || !user) return [];
      return db.sessions.where("user_id").equals(user.id).reverse().sortBy("started_at");
    },
    [user?.id],
    [],
  );
  const lang = (i18n.language?.startsWith("en") ? "en" : "id") as "id" | "en";
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("home.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("home.subtitle")}</p>
        </div>
        <SignInButton />
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button size="lg" onClick={() => navigate("/sessions/new")}>
          <Plus className="h-5 w-5" /><span>{t("home.startSession")}</span>
        </Button>
        <Button size="lg" variant="outline" onClick={() => navigate("/history")}>
          <HistoryIcon className="h-5 w-5" /><span>{t("nav.history")}</span>
        </Button>
      </div>
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase">{t("home.recentSessions")}</h2>
        {sessions && sessions.length > 0 ? (
          <ul className="space-y-2">
            {sessions.slice(0, 5).map((s) => {
              const preset = getPreset(s.target_id);
              return (
                <li key={s.id}>
                  <Link to={`/sessions/${s.id}`}>
                    <Card className="hover:bg-accent transition-colors">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">{preset ? t(preset.labelKey) : s.target_id}</CardTitle>
                        <span className="text-xs text-muted-foreground">{s.distance_m} m</span>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground">
                        {formatDate(s.started_at, lang)} · {s.status === "completed" ? t("history.completed") : t("history.active")}
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{t("home.noSessions")}</p>
        )}
      </section>
    </div>
  );
}
