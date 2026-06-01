"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Arama kutusu placeholder'ı için typewriter efekti: verilen ürün adlarından
 * rastgele birini harf harf yazar, kısa bekler, harf harf siler, sonra
 * bir sonrakine geçer. Liste boşsa sabit metne döner.
 */
export function SearchTypewriter({
  items,
  prefix,
  fallback,
}: {
  items: string[];
  prefix?: string;
  fallback?: string;
}) {
  const { t } = useI18n();
  const prefixText = prefix ?? t("misc.search.prefix");
  const fallbackText = fallback ?? t("misc.search.fallback");
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  // Rastgele sıralanmış, benzersiz, kısa-ish ürün adları (en fazla 12).
  const [words] = useState<string[]>(() => {
    const uniq = Array.from(new Set(items.filter(Boolean).map((s) => s.trim())));
    // Fisher-Yates yerine basit deterministik karıştırma (index tabanlı) yeterli.
    const shuffled = uniq
      .map((w, i) => ({ w, k: (i * 9301 + 49297) % 233280 }))
      .sort((a, b) => a.k - b.k)
      .map((x) => x.w);
    return shuffled.slice(0, 12);
  });

  useEffect(() => {
    if (!words.length) return;
    const current = words[idx % words.length];
    let delay = 90;

    if (phase === "typing") {
      if (text.length < current.length) {
        delay = 150; // harf harf, sakin tempo
      } else {
        setPhase("pausing");
        delay = 1800; // tam yazınca daha uzun bekle
      }
    } else if (phase === "pausing") {
      setPhase("deleting");
      delay = 400;
    } else {
      // deleting
      if (text.length > 0) {
        delay = 90; // silme de yavaş ama yazmadan biraz hızlı
      } else {
        setIdx((i) => (i + 1) % words.length);
        setPhase("typing");
        delay = 500; // sonraki kelimeye geçmeden kısa duraklama
      }
    }

    const t = setTimeout(() => {
      if (phase === "typing") setText(current.slice(0, text.length + 1));
      else if (phase === "deleting") setText(current.slice(0, text.length - 1));
    }, delay);
    return () => clearTimeout(t);
  }, [text, phase, idx, words]);

  if (!words.length) {
    return <span className="truncate">{fallbackText}</span>;
  }

  return (
    <span className="truncate">
      {prefixText}
      <span className="text-ink-600">{text}</span>
      <span className="ml-0.5 inline-block w-px animate-pulse text-ink-500">|</span>
    </span>
  );
}
