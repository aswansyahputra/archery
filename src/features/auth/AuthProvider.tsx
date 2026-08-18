"use client";
import * as React from "react";
import { getSupabase, hasSupabaseConfig } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { upsertProfile } from "@/data/repos/profiles";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [loading, setLoading] = React.useState(true);
  const configured = hasSupabaseConfig();

  React.useEffect(() => {
    if (!configured) { setLoading(false); return; }
    const supabase = getSupabase();
    if (!supabase) { setLoading(false); return; }
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) await syncProfile(data.session.user);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) await syncProfile(newSession.user);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, [configured]);

  const signInWithGoogle = React.useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase not configured");
    if (typeof navigator !== "undefined" && !navigator.onLine) throw new Error("offline");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
    });
  }, []);

  const signOut = React.useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return <AuthContext.Provider value={{ user: session?.user ?? null, session, loading, configured, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

async function syncProfile(user: User) {
  const meta = user.user_metadata ?? {};
  await upsertProfile({
    id: user.id,
    display_name: (meta.full_name as string | undefined) ?? (meta.name as string | undefined) ?? user.email ?? "",
    avatar_url: (meta.avatar_url as string | undefined) ?? (meta.picture as string | undefined),
    updated_at: new Date().toISOString(),
  });
}
