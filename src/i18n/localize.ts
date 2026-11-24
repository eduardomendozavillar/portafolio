import type { Lang } from "./dictionary";

/**
 * Pick the language variant of a data entry (S11): entries carry an optional
 * `en` override; Spanish stays the source of truth (CV v2 verbatim). Fields
 * not overridden (proper nouns, periods, links) fall through to the base.
 */
export function pickLocalized<T extends { en?: Partial<T> }>(item: T, lang: Lang): T {
  if (lang === "en" && item.en) {
    return { ...item, ...item.en } as T;
  }
  return item;
}
