"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

function diff(target: number) {
  const now = Date.now();
  const ms = Math.max(0, target - now);
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { d, h, m, s, done: ms === 0 };
}

/** Çekiliş tarihine canlı geri sayım — premium "kapanıyor" hissi. */
export function RaffleCountdown({
  endsAt,
  compact = false,
}: {
  endsAt: string;
  compact?: boolean;
}) {
  const { t: tr } = useI18n();
  const target = new Date(endsAt).getTime();
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { v: t.d, l: tr("c3.countdown.days") },
    { v: t.h, l: tr("c3.countdown.hours") },
    { v: t.m, l: tr("c3.countdown.minutes") },
    { v: t.s, l: tr("c3.countdown.seconds") },
  ];

  if (compact) {
    return (
      <span className="font-mono text-sm font-bold text-ink-900 tabular-nums">
        {t.d}
        {tr("c3.countdown.daySuffix")} {String(t.h).padStart(2, "0")}:
        {String(t.m).padStart(2, "0")}:{String(t.s).padStart(2, "0")}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      {units.map((u) => (
        <div
          key={u.l}
          className="flex min-w-[3.25rem] flex-col items-center rounded-xl bg-ink-900 px-2.5 py-2 text-white shadow-soft"
        >
          <span className="font-mono text-xl font-bold tabular-nums">
            {String(u.v).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-white/60">
            {u.l}
          </span>
        </div>
      ))}
    </div>
  );
}
