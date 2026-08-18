import { getSupabase, hasSupabaseConfig } from "@/lib/supabase";
import { getDb } from "@/data/db";
import { markFailure, markSuccess, pending } from "@/data/repos/outbox";
import type { OutboxRow } from "@/data/db";

const BACKOFF_MS = [1000, 5000, 15000, 60000, 300000];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function pushRow(row: OutboxRow): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { entity, op, entity_id, payload } = row;
  if (entity === "gear_profiles") {
    if (op === "delete") {
      const { error } = await supabase.from("gear_profiles").delete().eq("id", entity_id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("gear_profiles").upsert(payload as never);
      if (error) throw error;
    }
  } else if (entity === "sessions") {
    if (op === "delete") {
      const { error } = await supabase.from("sessions").delete().eq("id", entity_id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("sessions").upsert(payload as never);
      if (error) throw error;
    }
  } else if (entity === "session_arrows") {
    const { error } = await supabase.from("session_arrows").upsert(payload as never);
    if (error) throw error;
  } else if (entity === "profiles") {
    const { error } = await supabase.from("profiles").upsert(payload as never);
    if (error) throw error;
  }
}

let flushing = false;
const listeners = new Set<(state: SyncState) => void>();
export interface SyncState {
  status: "idle" | "syncing" | "error" | "offline";
  pending: number;
  lastSync?: string;
  lastError?: string;
}

let state: SyncState = { status: "idle", pending: 0 };
const emit = () => { for (const l of listeners) l(state); };

export function onSyncChange(listener: (s: SyncState) => void): () => void {
  listeners.add(listener);
  listener(state);
  return () => { listeners.delete(listener); };
}

export async function refreshPending(): Promise<void> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    state = { ...state, status: "offline" };
    emit();
    return;
  }
  const rows = await pending();
  state = { ...state, pending: rows.length };
  emit();
}

export async function flush(): Promise<void> {
  if (flushing) return;
  if (!hasSupabaseConfig()) {
    state = { ...state, status: "idle", lastError: "Supabase not configured" };
    emit();
    return;
  }
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    state = { ...state, status: "offline" };
    emit();
    return;
  }
  flushing = true;
  state = { ...state, status: "syncing", lastError: undefined };
  emit();
  try {
    const rows = await pending();
    state = { ...state, pending: rows.length };
    emit();
    for (const row of rows) {
      try {
        await pushRow(row);
        if (row.id != null) await markSuccess(row.id);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (row.id != null) await markFailure(row.id, msg);
        const delay = BACKOFF_MS[Math.min(row.attempts ?? 0, BACKOFF_MS.length - 1)];
        state = { ...state, status: "error", lastError: msg };
        emit();
        await sleep(delay);
      }
    }
    await refreshPending();
    if (state.status !== "error") {
      state = { ...state, status: "idle", lastSync: new Date().toISOString() };
      emit();
    }
  } finally {
    flushing = false;
  }
}

export async function pull(userId: string): Promise<void> {
  if (!hasSupabaseConfig()) return;
  const supabase = getSupabase();
  if (!supabase) return;
  if (typeof navigator !== "undefined" && !navigator.onLine) return;
  const db = getDb();
  try {
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const { data: gear } = await supabase.from("gear_profiles").select("*").eq("user_id", userId).gt("updated_at", since);
    if (gear?.length) await db.gear_profiles.bulkPut(gear as never);
    const { data: sess } = await supabase.from("sessions").select("*").eq("user_id", userId).gt("updated_at", since);
    if (sess?.length) await db.sessions.bulkPut(sess as never);
    const sessionIds = (sess ?? []).map((s: { id: string }) => s.id);
    if (sessionIds.length) {
      const { data: arrows } = await supabase.from("session_arrows").select("*").eq("user_id", userId).in("session_id", sessionIds);
      if (arrows?.length) await db.session_arrows.bulkPut(arrows as never);
    }
    const { data: prof } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
    if (prof) await db.profiles.put(prof as never);
  } catch (e) {
    console.warn("pull failed", e);
  }
}

export function initSyncListeners() {
  if (typeof window === "undefined") return;
  window.addEventListener("online", () => { void flush(); });
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then((reg) => {
      (reg as unknown as { sync?: { register?: (tag: string) => Promise<void> } }).sync?.register?.("outbox-flush").catch(() => {});
    });
  }
}
