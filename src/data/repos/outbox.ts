import { getDb, type OutboxEntity, type OutboxOp, type OutboxRow } from "@/data/db";

export async function enqueue(op: OutboxOp, entity: OutboxEntity, entity_id: string, payload: unknown): Promise<void> {
  const db = getDb();
  await db.outbox.add({ op, entity, entity_id, payload, enqueued_at: new Date().toISOString(), attempts: 0 });
}

export async function pending(): Promise<OutboxRow[]> {
  return getDb().outbox.orderBy("enqueued_at").toArray();
}

export async function markSuccess(id: number): Promise<void> {
  await getDb().outbox.delete(id);
}

export async function markFailure(id: number, error: string): Promise<void> {
  const row = await getDb().outbox.get(id);
  if (!row) return;
  await getDb().outbox.update(id, { attempts: (row.attempts ?? 0) + 1, last_error: error });
}
