"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/features/settings/ThemeToggle";
import { LanguageToggle } from "@/features/settings/LanguageToggle";
import { SyncIndicator } from "@/features/settings/SyncIndicator";
import { flush, pull } from "@/data/sync/syncEngine";
import { useAuth } from "@/features/auth/AuthProvider";
import { hasSupabaseConfig } from "@/lib/supabase";

export function SettingsScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [msg, setMsg] = React.useState<string | null>(null);
  const sync = async () => {
    setMsg(null);
    try { if (user) await pull(user.id); await flush(); setMsg(t("common.online")); }
    catch (e: unknown) { setMsg(e instanceof Error ? e.message : String(e)); }
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">{t("settings.appearance")}</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-2">
          <ThemeToggle /><LanguageToggle />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">{t("settings.data")}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <SyncIndicator />
            <Button size="sm" variant="outline" onClick={sync} disabled={!hasSupabaseConfig()}>
              <RefreshCw className="h-4 w-4" /><span>{t("settings.syncNow")}</span>
            </Button>
          </div>
          {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
          {!hasSupabaseConfig() && <p className="text-xs text-muted-foreground">{t("auth.notConfigured")}</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">{t("settings.about")}</CardTitle></CardHeader>
        <CardContent className="text-xs text-muted-foreground">Horsebow Scoring PWA · v0.1 · Built with Next.js + Supabase.</CardContent>
      </Card>
    </div>
  );
}
