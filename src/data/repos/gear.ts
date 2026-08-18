import { v4 as uuid } from "uuid";
import { getDb, type GearProfileRow } from "@/data/db";
import { enqueue } from "@/data/repos/outbox";

export async function listGearProfiles(userId: string): Promise<GearProfileRow[]> {
  return getDb().gear_profiles.where("user_id").equals(userId).reverse().sortBy("updated_at");
}

export async function getGearProfile(id: string): Promise<GearProfileRow | undefined> {
  return getDb().gear_profiles.get(id);
}

export async function createGearProfile(userId: string, data: Omit<GearProfileRow, "id" | "user_id" | "created_at" | "updated_at">): Promise<GearProfileRow> {
  const now = new Date().toISOString();
  const row: GearProfileRow = { id: uuid(), user_id: userId, created_at: now, updated_at: now, ...data };
  await getDb().gear_profiles.put(row);
  await enqueue("insert", "gear_profiles", row.id, row);
  return row;
}

export async function updateGearProfile(id: string, patch: Partial<GearProfileRow>): Promise<GearProfileRow | undefined> {
  const existing = await getDb().gear_profiles.get(id);
  if (!existing) return undefined;
  const next: GearProfileRow = { ...existing, ...patch, id: existing.id, user_id: existing.user_id, updated_at: new Date().toISOString() };
  await getDb().gear_profiles.put(next);
  await enqueue("update", "gear_profiles", id, next);
  return next;
}

export async function deleteGearProfile(id: string): Promise<void> {
  await getDb().gear_profiles.delete(id);
  await enqueue("delete", "gear_profiles", id, { id });
}
