import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import id from "../../messages/id.json";
import en from "../../messages/en.json";

export const SUPPORTED_LANGS = ["id", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "id";
const STORAGE_KEY = "horsebow.lang";

let initialized = false;

export function getStoredLang(): Lang | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === "id" || v === "en") return v;
  return null;
}

export function setStoredLang(l: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, l);
  document.documentElement.lang = l;
}

export function initI18n(initial?: Lang) {
  if (initialized) return i18next;
  initialized = true;
  void i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: { id: { translation: id }, en: { translation: en } },
      lng: initial ?? DEFAULT_LANG,
      fallbackLng: DEFAULT_LANG,
      supportedLngs: [...SUPPORTED_LANGS],
      interpolation: { escapeValue: false },
      detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
      returnNull: false,
    });
  return i18next;
}
