"use client";
import * as React from "react";
import { applyTheme, getStoredTheme, setStoredTheme, type Theme } from "@/lib/theme";

interface ThemeContextValue { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void; }
const Ctx = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light");
  React.useEffect(() => {
    const initial = getStoredTheme() ?? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setThemeState(initial);
    applyTheme(initial);
  }, []);
  const setTheme = (t: Theme) => { setThemeState(t); setStoredTheme(t); applyTheme(t); };
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
