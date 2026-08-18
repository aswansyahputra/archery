"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { CloudOff, Cloud, RefreshCw } from "lucide-react";
import { onSyncChange, refreshPending, flush, type SyncState } from "@/data/sync/syncEngine";

export function SyncIndicator() {
  const { t } = useTranslation();
  const [s, setS] = React.useState<SyncState>({ status: "idle", pending: 0 });
  React.useEffect(() => {
    void refreshPending();
    const off = onSyncChange(setS);
    return () => off();
  }, []);
  const isOffline = s.status === "offline";
  const isError = s.status === "error";
  return (
    <button type="button" className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent" onClick={() => void flush()} title={s.lastError ?? ""}>
      {isOffline ? (<><CloudOff className="h-4 w-4" /><span>{t("common.offline")}</span></>) :
       isError ? (<><CloudOff className="h-4 w-4 text-destructive" /><span>{t("common.syncError")}</span></>) :
       s.status === "syncing" ? (<><RefreshCw className="h-4 w-4 animate-spin" /><span>{t("common.syncing")}</span></>) :
       (<><Cloud className="h-4 w-4" />{s.pending > 0 ? <span>{t("common.pendingSync", { count: s.pending })}</span> : <span>{t("common.online")}</span>}</>)}
    </button>
  );
}
