"use client";

import { useEffect, useState } from "react";
import { CaretUp } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Sağ altta sabit "yukarı çık" butonu. Sayfa aşağı inildikçe görünür olur ve
 * etrafındaki halka (turuncu/accent) scroll ilerlemesine göre dolar.
 * Tıklayınca yumuşakça en üste döner.
 */
const SIZE = 52;
const STROKE = 3;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export function ScrollToTop() {
  const { t } = useI18n();
  const [progress, setProgress] = useState(0); // 0..1
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(p);
      setVisible(scrollTop > 150); // biraz aşağıda hemen görünür
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const dashOffset = CIRC * (1 - progress);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t("misc.scrollTop.aria")}
      className={
        "fixed bottom-6 right-6 z-40 grid place-items-center " +
        (visible ? "opacity-100" : "pointer-events-none hidden opacity-0")
      }
      style={{ width: SIZE, height: SIZE }}
    >
      {/* İlerleme halkası */}
      <svg
        width={SIZE}
        height={SIZE}
        className="absolute inset-0 -rotate-90"
        aria-hidden
      >
        {/* iz */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="text-ink-200"
        />
        {/* dolan kısım — turuncu (accent) */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          className="text-accent-500 transition-[stroke-dashoffset] duration-75"
        />
      </svg>
      {/* Ortadaki daire + ok */}
      <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-ink-900 text-white shadow-lg transition-colors group-hover:bg-ink-800">
        <CaretUp size={18} weight="bold" />
      </span>
    </button>
  );
}
