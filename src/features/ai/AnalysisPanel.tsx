"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { streamChat, getAiKey } from "@/features/ai/openrouter";
import { buildMessages, type SessionPayload } from "@/features/ai/prompts";

interface Props { payload: SessionPayload | null; hasKey: boolean; onNeedKey: () => void; }

export function AnalysisPanel({ payload, hasKey, onNeedKey }: Props) {
  const { t, i18n } = useTranslation();
  const [text, setText] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const run = async () => {
    if (!payload) return;
    if (!hasKey) { onNeedKey(); return; }
    setError(null); setText("");
    const { key, model } = getAiKey();
    if (!key) { onNeedKey(); return; }
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setRunning(true);
    try {
      const lang = i18n.language?.startsWith("en") ? "en" : "id";
      const messages = buildMessages(lang, payload);
      for await (const chunk of streamChat({ key, model, messages, signal: ctrl.signal })) {
        setText((prev) => prev + chunk);
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setRunning(false); abortRef.current = null; }
  };
  React.useEffect(() => () => abortRef.current?.abort(), []);
  const disabled = running || !payload;
  return (
    <div className="space-y-3">
      <Button onClick={run} disabled={disabled} className="w-full">
        <Sparkles className="h-4 w-4" /><span>{running ? t("ai.analyzing") : t("ai.analyze")}</span>
      </Button>
      {!hasKey && <p className="text-xs text-muted-foreground">{t("ai.needKey")}</p>}
      {error && <p className="text-xs text-destructive">{t("ai.error", { msg: error })}</p>}
      {(text || running) && (
        <div className="rounded-md border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold">{t("ai.coachReport")}</h3>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{text || "…"}</pre>
          <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <AlertTriangle className="h-3 w-3" /><span>{t("ai.disclaimer")}</span>
          </p>
        </div>
      )}
    </div>
  );
}
