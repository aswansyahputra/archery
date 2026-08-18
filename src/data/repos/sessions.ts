import { v4 as uuid } from "uuid";
import { getDb, type SessionRow, type SessionArrowRow } from "@/data/db";
import { enqueue } from "@/data/repos/outbox";

export interface NewSessionInput {
  user_id: string;
  started_at: string;
  target_id: string;
  distance_m: number;
  lane?: string;
  gear_profile_id?: string;
  environment_notes?: string;
  total_ends: number;
  arrows_per_end: number;
}

export async function listSessions(userId: string): Promise<SessionRow[]> {
  return getDb().sessions.where("user_id").equals(userId).reverse().sortBy("started_at");
}

export async function getSession(id: string): Promise<SessionRow | undefined> {
  return getDb().sessions.get(id);
}

export async function getLastSession(userId: string): Promise<SessionRow | undefined> {
  const rows = await getDb().sessions.where("user_id").equals(userId).reverse().sortBy("started_at");
  return rows[0];
}

export async function createSession(input: NewSessionInput): Promise<SessionRow> {
  const now = new Date().toISOString();
  const row: SessionRow = { id: uuid(), status: "active", created_at: now, updated_at: now, ...input };
  await getDb().sessions.put(row);
  await enqueue("insert", "sessions", row.id, row);

  const arrows: SessionArrowRow[] = [];
  for (let e = 0; e < row.total_ends; e++) {
    for (let a = 0; a < row.arrows_per_end; a++) {
      arrows.push({ id: uuid(), session_id: row.id, user_id: row.user_id, end_index: e, arrow_index: a, value: null, is_x: false, is_miss: false, updated_at: now });
    }
  }
  if (arrows.length) {
    await getDb().session_arrows.bulkPut(arrows);
    for (const arr of arrows) await enqueue("insert", "session_arrows", arr.id, arr);
  }
  return row;
}

export async function completeSession(id: string): Promise<SessionRow | undefined> {
  const existing = await getDb().sessions.get(id);
  if (!existing) return undefined;
  const next: SessionRow = { ...existing, status: "completed", ended_at: new Date().toISOString(), updated_at: new Date().toISOString() };
  await getDb().sessions.put(next);
  await enqueue("update", "sessions", id, next);
  return next;
}

export async function listArrows(sessionId: string): Promise<SessionArrowRow[]> {
  return getDb().session_arrows.where("session_id").equals(sessionId).toArray();
}

export async function setArrow(id: string, patch: Partial<Pick<SessionArrowRow, "value" | "is_x" | "is_miss">>): Promise<SessionArrowRow | undefined> {
  const existing = await getDb().session_arrows.get(id);
  if (!existing) return undefined;
  const next: SessionArrowRow = { ...existing, ...patch, updated_at: new Date().toISOString() };
  await getDb().session_arrows.put(next);
  await enqueue("update", "session_arrows", id, next);
  return next;
}
