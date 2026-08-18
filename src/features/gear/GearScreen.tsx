"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { db } from "@/data/db";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteGearProfile } from "@/data/repos/gear";
import { GearForm } from "@/features/gear/GearForm";
import type { GearProfileRow } from "@/data/db";

export function GearScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [editing, setEditing] = React.useState<GearProfileRow | null>(null);
  const [creating, setCreating] = React.useState(false);
  const profiles = useLiveQuery<GearProfileRow[], GearProfileRow[]>(
    async () => { if (!db || !user) return []; return db.gear_profiles.where("user_id").equals(user.id).toArray(); },
    [user?.id],
    [],
  );
  const remove = async (id: string) => { if (!confirm(t("gear.deleteConfirm"))) return; await deleteGearProfile(id); };
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("gear.title")}</h1>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" /><span>{t("gear.add")}</span>
        </Button>
      </header>
      {(creating || editing) && <GearForm initial={editing ?? undefined} onClose={() => { setCreating(false); setEditing(null); }} />}
      {profiles.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("gear.noProfiles")}</p>
      ) : (
        <ul className="space-y-2">
          {profiles.map((p) => (
            <li key={p.id}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{p.bow_name ?? p.bow_type ?? "—"} · {p.draw_weight_lbs ?? "?"} lbs @ {p.draw_length_in ?? "?"}″ · {p.technique ?? "—"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                {p.environment_notes && <CardContent><p className="text-xs text-muted-foreground">{p.environment_notes}</p></CardContent>}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
