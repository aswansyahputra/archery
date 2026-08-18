"use client";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Plus, History, Target, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { SyncIndicator } from "@/features/settings/SyncIndicator";

export function Shell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const location = useLocation();
  const isScoring = /\/sessions\/[^/]+\/score$/.test(location.pathname);
  if (isScoring) return <main className="mx-auto min-h-screen max-w-md p-4">{children}</main>;
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 px-4 py-2 backdrop-blur">
        <span className="text-sm font-semibold">{t("common.appName")}</span>
        <SyncIndicator />
      </header>
      <main className="flex-1 p-4 pb-20">{children}</main>
      <nav className="sticky bottom-0 z-10 grid grid-cols-5 border-t bg-background/80 backdrop-blur">
        <NavItem to="/" icon={<Home className="h-5 w-5" />} label={t("nav.home")} />
        <NavItem to="/sessions/new" icon={<Plus className="h-5 w-5" />} label={t("nav.newSession")} />
        <NavItem to="/history" icon={<History className="h-5 w-5" />} label={t("nav.history")} />
        <NavItem to="/gear" icon={<Target className="h-5 w-5" />} label={t("nav.gear")} />
        <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label={t("nav.settings")} />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink to={to} className={({ isActive }) => cn("flex flex-col items-center justify-center gap-0.5 py-2 text-xs text-muted-foreground", isActive && "text-primary")}>
      {icon}<span>{label}</span>
    </NavLink>
  );
}
