"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Eye, EyeOff, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearAiKey, DEFAULT_MODEL, getAiKey, setAiKey } from "@/features/ai/openrouter";

interface Props { open: boolean; onOpenChange: (v: boolean) => void; }

export function AiSetupModal({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const [key, setKey] = React.useState("");
  const [model, setModel] = React.useState(DEFAULT_MODEL);
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    if (open) { const v = getAiKey(); setKey(v.key); setModel(v.model || DEFAULT_MODEL); }
  }, [open]);
  const save = () => { if (!key.trim()) return; setAiKey(key.trim(), model || DEFAULT_MODEL); onOpenChange(false); };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("ai.setupTitle")}</DialogTitle>
          <DialogDescription>{t("ai.setupIntro")}</DialogDescription>
        </DialogHeader>
        <ol className="space-y-3 text-sm">
          <li className="rounded-md border p-3">
            <p className="font-medium">{t("ai.step1Title")} <a href="https://openrouter.ai/" target="_blank" rel="noreferrer" className="ml-1 inline-flex items-center gap-1 text-primary underline">openrouter.ai <ExternalLink className="h-3 w-3" /></a></p>
            <p className="text-muted-foreground">{t("ai.step1Body")}</p>
          </li>
          <li className="rounded-md border p-3">
            <p className="font-medium">{t("ai.step2Title")}</p>
            <p className="text-muted-foreground">{t("ai.step2Body")}</p>
          </li>
          <li className="rounded-md border p-3">
            <p className="font-medium">{t("ai.step3Title")}</p>
            <p className="text-muted-foreground">{t("ai.step3Body")}</p>
          </li>
        </ol>
        <div className="space-y-2">
          <Label htmlFor="ai-key">{t("ai.keyLabel")}</Label>
          <div className="flex gap-2">
            <Input id="ai-key" type={show ? "text" : "password"} value={key} onChange={(e) => setKey(e.target.value)} placeholder={t("ai.keyPlaceholder")} autoComplete="off" />
            <Button type="button" variant="outline" size="icon" onClick={() => setShow((v) => !v)} aria-label={show ? "hide" : "show"}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <Label htmlFor="ai-model" className="block mt-2">{t("ai.modelLabel")}</Label>
          <Input id="ai-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder={DEFAULT_MODEL} />
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="ghost" onClick={() => { clearAiKey(); setKey(""); setModel(DEFAULT_MODEL); }}>
            <Trash2 className="h-4 w-4" /><span>{t("ai.clearKey")}</span>
          </Button>
          <Button type="button" onClick={save} disabled={!key.trim()}>{t("ai.saveKey")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
