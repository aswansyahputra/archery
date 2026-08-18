"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/features/auth/AuthProvider";
import { createGearProfile, updateGearProfile } from "@/data/repos/gear";
import type { GearProfileRow } from "@/data/db";

interface Props { initial?: GearProfileRow; onClose: () => void; }

export function GearForm({ initial, onClose }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = React.useState(initial?.name ?? "");
  const [bowType, setBowType] = React.useState(initial?.bow_type ?? "horsebow");
  const [bowName, setBowName] = React.useState(initial?.bow_name ?? "");
  const [drawWeight, setDrawWeight] = React.useState<number | "">(initial?.draw_weight_lbs ?? "");
  const [drawLength, setDrawLength] = React.useState<number | "">(initial?.draw_length_in ?? "");
  const [spine, setSpine] = React.useState(initial?.arrow_spine ?? "");
  const [arrowWeight, setArrowWeight] = React.useState<number | "">(initial?.arrow_weight_gr ?? "");
  const [pointWeight, setPointWeight] = React.useState<number | "">(initial?.arrow_point_gr ?? "");
  const [material, setMaterial] = React.useState(initial?.arrow_material ?? "wood");
  const [technique, setTechnique] = React.useState(initial?.technique ?? "thumb");
  const [notes, setNotes] = React.useState(initial?.environment_notes ?? "");
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const save = async () => {
    if (!user) { setErr(t("auth.needInternet")); return; }
    if (!name.trim()) return;
    setBusy(true);
    try {
      const payload = {
        name: name.trim(),
        bow_type: bowType || undefined,
        bow_name: bowName || undefined,
        draw_weight_lbs: typeof drawWeight === "number" ? drawWeight : undefined,
        draw_length_in: typeof drawLength === "number" ? drawLength : undefined,
        arrow_spine: spine || undefined,
        arrow_weight_gr: typeof arrowWeight === "number" ? arrowWeight : undefined,
        arrow_point_gr: typeof pointWeight === "number" ? pointWeight : undefined,
        arrow_material: material,
        technique,
        environment_notes: notes || undefined,
      };
      if (initial) await updateGearProfile(initial.id, payload);
      else await createGearProfile(user.id, payload);
      onClose();
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  };

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div className="space-y-2">
          <Label htmlFor="g-name">{t("gear.name")}</Label>
          <Input id="g-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="g-bowtype">{t("gear.bowType")}</Label>
            <Input id="g-bowtype" value={bowType} onChange={(e) => setBowType(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="g-bowname">{t("gear.bowName")}</Label>
            <Input id="g-bowname" value={bowName} onChange={(e) => setBowName(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="g-dw">{t("gear.drawWeight")}</Label>
            <Input id="g-dw" type="number" value={drawWeight} onChange={(e) => setDrawWeight(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="g-dl">{t("gear.drawLength")}</Label>
            <Input id="g-dl" type="number" value={drawLength} onChange={(e) => setDrawLength(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-2">
            <Label htmlFor="g-spine">{t("gear.arrowSpine")}</Label>
            <Input id="g-spine" value={spine} onChange={(e) => setSpine(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="g-aw">{t("gear.arrowWeight")}</Label>
            <Input id="g-aw" type="number" value={arrowWeight} onChange={(e) => setArrowWeight(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="g-ap">{t("gear.arrowPoint")}</Label>
            <Input id="g-ap" type="number" value={pointWeight} onChange={(e) => setPointWeight(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>{t("gear.arrowMaterial")}</Label>
            <Select value={material} onValueChange={setMaterial}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="wood">{t("gear.materialWood")}</SelectItem>
                <SelectItem value="carbon">{t("gear.materialCarbon")}</SelectItem>
                <SelectItem value="bamboo">{t("gear.materialBamboo")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("gear.technique")}</Label>
            <Select value={technique} onValueChange={setTechnique}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="thumb">{t("gear.techniqueThumb")}</SelectItem>
                <SelectItem value="mediterranean">{t("gear.techniqueMediterranean")}</SelectItem>
                <SelectItem value="slavic">{t("gear.techniqueSlavic")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="g-notes">{t("gear.environmentNotes")}</Label>
          <Textarea id="g-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </div>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
          <Button onClick={save} disabled={busy || !name.trim()}>
            <Save className="h-4 w-4" /><span>{t("gear.save")}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
