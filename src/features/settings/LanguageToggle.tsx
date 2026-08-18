"use client";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setStoredLang, type Lang } from "@/lib/i18n";

export function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const toggle = () => {
    const next: Lang = i18n.language?.startsWith("en") ? "id" : "en";
    void i18n.changeLanguage(next);
    setStoredLang(next);
  };
  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label={t("common.language")}>
      <Languages className="h-4 w-4" />
      <span className="font-mono text-xs uppercase">{i18n.language?.slice(0, 2)}</span>
    </Button>
  );
}
