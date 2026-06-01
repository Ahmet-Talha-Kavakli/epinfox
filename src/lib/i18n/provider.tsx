"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  type Locale,
  type CurrencyCode,
  type RatesMap,
  DEFAULT_LOCALE,
  LOCALE_META,
  formatMoney,
} from "./config";
import { DICTIONARIES } from "./dictionaries";

interface I18nContextValue {
  locale: Locale;
  currency: CurrencyCode;
  setLocale: (l: Locale) => void;
  setCurrency: (c: CurrencyCode) => void;
  t: (key: string) => string;
  money: (amountTRY: number) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    document.cookie = `${key}=${value};path=/;max-age=31536000`;
  } catch {
    /* no-op */
  }
}

export function I18nProvider({
  initialLocale = DEFAULT_LOCALE,
  initialCurrency,
  rates,
  children,
}: {
  initialLocale?: Locale;
  initialCurrency?: CurrencyCode;
  /** Sunucudan gelen canlı kurlar (TRY tabanlı). Yoksa sabit fallback. */
  rates?: RatesMap;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [currency, setCurrencyState] = useState<CurrencyCode>(
    initialCurrency ?? LOCALE_META[initialLocale].defaultCurrency,
  );

  // İlk yüklemede localStorage'tan oku (cookie SSR'ı, localStorage CSR'ı kapsar)
  useEffect(() => {
    const sl = localStorage.getItem("locale") as Locale | null;
    const sc = localStorage.getItem("currency") as CurrencyCode | null;
    if (sl && sl in DICTIONARIES) setLocaleState(sl);
    if (sc) setCurrencyState(sc);
  }, []);

  // dir + lang HTML attribute güncelle
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALE_META[locale].dir;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    persist("locale", l);
    // Dil değişince varsayılan para birimini de öner (kullanıcı override edebilir)
    const cur = LOCALE_META[l].defaultCurrency;
    setCurrencyState(cur);
    persist("currency", cur);
    // Server-render içerik (DB ürün/kategori/çekiliş çevirileri cookie'den okunur)
    // ancak sayfa yenilenince tazelenir. Kullanıcı bunu bilmeyebilir → otomatik
    // reload ile tüm sayfayı yeni dile geçir. (Cookie zaten yazıldı.)
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    persist("currency", c);
  }, []);

  const t = useCallback(
    (key: string) =>
      DICTIONARIES[locale][key] ?? DICTIONARIES[DEFAULT_LOCALE][key] ?? key,
    [locale],
  );

  const money = useCallback(
    (amountTRY: number) => formatMoney(amountTRY, currency, rates),
    [currency, rates],
  );

  return (
    <I18nContext.Provider
      value={{ locale, currency, setLocale, setCurrency, t, money }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
