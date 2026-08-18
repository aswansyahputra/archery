import { getDb, type ProfileRow } from "@/data/db";
import { enqueue } from "@/data/repos/outbox";

export async function upsertProfile(p: ProfileRow): Promise<void> {
  await getDb().profiles.put(p);
  await enqueue("upsert", "profiles", p.id, p);
}

export async function getProfile(id: string): Promise<ProfileRow | undefined> {
  return getDb().profiles.get(id);
}
