"use client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/features/settings/ThemeProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { I18nProvider } from "@/app-shell/I18nProvider";
import { HomeScreen } from "@/features/sessions/HomeScreen";
import { SessionSetupScreen } from "@/features/sessions/setup/SessionSetupScreen";
import { ScoringScreen } from "@/features/sessions/score/ScoringScreen";
import { HistoryScreen } from "@/features/sessions/history/HistoryScreen";
import { SessionDetailScreen } from "@/features/sessions/detail/SessionDetailScreen";
import { GearScreen } from "@/features/gear/GearScreen";
import { SettingsScreen } from "@/features/settings/SettingsScreen";
import { Shell } from "@/app-shell/Shell";

export function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            <HashRouter>
              <Shell>
                <Routes>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/sessions/new" element={<SessionSetupScreen />} />
                  <Route path="/sessions/:id" element={<SessionDetailScreen />} />
                  <Route path="/sessions/:id/score" element={<ScoringScreen />} />
                  <Route path="/history" element={<HistoryScreen />} />
                  <Route path="/gear" element={<GearScreen />} />
                  <Route path="/settings" element={<SettingsScreen />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Shell>
            </HashRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
