import Dexie, { type Table } from "dexie";

export interface ProfileRow {
  id: string;
  display_name?: string;
  avatar_url?: string;
  updated_at: string;
}

export interface GearProfileRow {
  id: string;
  user_id: string;
  name: string;
  bow_type?: string;
  bow_name?: string;
  draw_weight_lbs?: number;
  draw_length_in?: number;
  arrow_spine?: string;
  arrow_weight_gr?: number;
  arrow_point_gr?: number;
  arrow_material?: string;
  technique?: string;
  environment_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionRow {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  target_id: string;
  distance_m: number;
  lane?: string;
  gear_profile_id?: string;
  environment_notes?: string;
  total_ends: number;
  arrows_per_end: number;
  status: "active" | "completed";
  created_at: string;
  updated_at: string;
}

export interface SessionArrowRow {
  id: string;
  session_id: string;
  user_id: string;
  end_index: number;
  arrow_index: number;
  value: number | null;
  is_x: boolean;
  is_miss: boolean;
  updated_at: string;
}

export type OutboxOp = "insert" | "update" | "delete" | "upsert";
export type OutboxEntity = "gear_profiles" | "sessions" | "session_arrows" | "profiles";

export interface OutboxRow {
  id?: number;
  op: OutboxOp;
  entity: OutboxEntity;
  entity_id: string;
  payload: unknown;
  enqueued_at: string;
  attempts: number;
  last_error?: string;
}

class HorsebowDB extends Dexie {
  profiles!: Table<ProfileRow, string>;
  gear_profiles!: Table<GearProfileRow, string>;
  sessions!: Table<SessionRow, string>;
  session_arrows!: Table<SessionArrowRow, string>;
  outbox!: Table<OutboxRow, number>;

  constructor() {
    super("horsebow");
    this.version(1).stores({
      profiles: "id, updated_at",
      gear_profiles: "id, user_id, updated_at",
      sessions: "id, user_id, started_at, updated_at, status",
      session_arrows: "id, session_id, [session_id+end_index+arrow_index], updated_at",
      outbox: "++id, op, entity, entity_id, enqueued_at",
    });
  }
}

export const db = typeof window !== "undefined" ? new HorsebowDB() : (null as unknown as HorsebowDB);

export function getDb(): HorsebowDB {
  if (!db) throw new Error("Dexie only available in the browser");
  return db;
}
