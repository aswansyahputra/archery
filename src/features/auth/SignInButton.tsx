"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { LogIn, LogOut, WifiOff } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const { t } = useTranslation();
  const { user, configured, signInWithGoogle, signOut } = useAuth();
  const [offline, setOffline] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);

  if (!configured) return <p className="text-xs text-muted-foreground">{t("auth.notConfigured")}</p>;
  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground hidden sm:inline">{t("auth.signedInAs", { name: user.user_metadata?.full_name ?? user.email })}</span>
        <Button size="sm" variant="ghost" onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{t("auth.signOut")}</span>
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <Button size="sm" onClick={async () => {
        try { setErr(null); await signInWithGoogle(); }
        catch (e: unknown) { const msg = e instanceof Error ? e.message : String(e); setErr(msg === "offline" ? t("auth.needInternet") : msg); }
      }}>
        <LogIn className="h-4 w-4" />
        <span>{t("auth.signIn")}</span>
      </Button>
      {(offline || err) && <span className="flex items-center gap-1 text-xs text-destructive"><WifiOff className="h-3 w-3" />{err ?? t("auth.needInternet")}</span>}
    </div>
  );
}
