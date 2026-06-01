"use client";

import { useI18n } from "@/lib/i18n/provider";

/** 0-4 arası kaba şifre gücü skoru. */
export function scorePassword(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}

const BAR_CLS = ["bg-ink-200", "bg-danger-500", "bg-warning-500", "bg-warning-400", "bg-success-500"];
const LABEL_KEY = ["", "auth.pw.weak", "auth.pw.fair", "auth.pw.good", "auth.pw.strong"];

/** Şifre güç çubuğu + etiket. pw boşken gizli. */
export function PasswordStrength({ pw }: { pw: string }) {
  const { t } = useI18n();
  if (!pw) return null;
  const score = scorePassword(pw);
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= score ? BAR_CLS[score] : "bg-ink-200"
            }`}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="mt-1 text-xs text-ink-500">{t(LABEL_KEY[score])}</p>
      )}
    </div>
  );
}
