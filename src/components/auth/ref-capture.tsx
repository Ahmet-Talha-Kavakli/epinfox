"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Davet linkinden gelen ?ref=KOD değerini cookie'ye yazar. Profil ilk
 * oluştuğunda (ensureProfile) bu cookie okunup referans kaydı kurulur.
 * 30 gün geçerli.
 */
export function RefCapture() {
  const params = useSearchParams();

  useEffect(() => {
    const ref = params.get("ref");
    if (ref && /^[A-Z0-9]{4,16}$/i.test(ref)) {
      document.cookie = `ref_code=${ref.toUpperCase()}; path=/; max-age=${30 * 24 * 3600}; samesite=lax`;
    }
  }, [params]);

  return null;
}
