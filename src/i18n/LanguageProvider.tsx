"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionary, type Dictionary, type Lang } from "./dictionary";

/**
 * Language state (portfolio-rebrand S11): ES/EN toggle persisted in
 * localStorage ("ev-lang"), default `es` (the CV's language), with the
 * <html lang> attribute kept in sync for assistive tech. The context default
 * lets components render Spanish outside the provider (tests, storybook).
 */
type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
};

const LangContext = createContext<LangContextValue>({
  lang: "es",
  setLang: () => undefined,
  t: dictionary.es,
});

const STORAGE_KEY = "ev-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  // Restore the saved choice once on mount (SSR renders Spanish).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "es") setLangState(saved);
    } catch {
      // Storage unavailable (private mode): keep Spanish.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next);
        try {
          window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
          // Storage unavailable: the choice lives for this session only.
        }
      },
      t: dictionary[lang],
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}

export function useT(): Dictionary {
  return useContext(LangContext).t;
}
