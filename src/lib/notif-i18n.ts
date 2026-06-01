// Bildirim metnini render anında çevirir. title_key varsa o dilde çözer +
// i18n_params ile {x} parçalarını doldurur; yoksa TR snapshot'a (title/body)
// düşer (eski kayıtlar + anahtarsız bildirimler). Client-safe (DICTIONARIES saf).

import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { DICTIONARIES } from "@/lib/i18n/dictionaries";
import type { Notification } from "@/lib/supabase/types";

function applyParams(text: string, params?: Record<string, string>): string {
  if (!params) return text;
  let out = text;
  for (const [k, v] of Object.entries(params)) {
    out = out.replaceAll(`{${k}}`, v);
  }
  return out;
}

function resolve(
  key: string | null,
  fallback: string | null,
  params: Record<string, string> | undefined,
  locale: Locale,
): string | null {
  if (key) {
    const dict = DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
    const tpl = dict[key] ?? DICTIONARIES[DEFAULT_LOCALE][key];
    if (tpl) return applyParams(tpl, params);
  }
  return fallback;
}

/** Bildirimin başlık + gövdesini aktif locale'de döndürür. */
export function localizeNotification(
  n: Pick<Notification, "title" | "body" | "title_key" | "body_key" | "i18n_params">,
  locale: Locale,
): { title: string; body: string | null } {
  return {
    title: resolve(n.title_key, n.title, n.i18n_params, locale) ?? n.title,
    body: resolve(n.body_key, n.body, n.i18n_params, locale),
  };
}
