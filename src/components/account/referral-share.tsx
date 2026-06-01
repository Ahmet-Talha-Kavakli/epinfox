"use client";

import { useState } from "react";
import Image from "next/image";
import {
  WhatsappLogo,
  TelegramLogo,
  XLogo,
  Copy,
  Check,
  QrCode,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

export function ReferralShare({
  code,
  link,
}: {
  code: string;
  link: string;
}) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const message = t("c3.referral.waMessage").replace("{link}", link);
  const enc = encodeURIComponent(message);
  const encLink = encodeURIComponent(link);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  }

  const shares = [
    {
      label: "WhatsApp",
      icon: WhatsappLogo,
      href: `https://wa.me/?text=${enc}`,
      cls: "bg-[#25D366]/10 text-[#1da851] hover:bg-[#25D366]/20",
    },
    {
      label: "Telegram",
      icon: TelegramLogo,
      href: `https://t.me/share/url?url=${encLink}&text=${encodeURIComponent(t("c3.referral.tgMessage"))}`,
      cls: "bg-[#229ED9]/10 text-[#1c87b8] hover:bg-[#229ED9]/20",
    },
    {
      label: "X",
      icon: XLogo,
      href: `https://twitter.com/intent/tweet?text=${enc}`,
      cls: "bg-ink-100 text-ink-800 hover:bg-ink-200",
    },
  ];

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encLink}`;

  return (
    <div className="space-y-4">
      {/* Kod kartı */}
      <div className="overflow-hidden rounded-2xl border border-ink-900">
        <div className="bg-gradient-to-br from-brand-600 to-accent-600 p-6 text-white">
          <p className="text-sm text-white/80">{t("c3.referral.code")}</p>
          <p className="mt-1 font-mono text-3xl font-extrabold tracking-widest">
            {code}
          </p>
        </div>
        <div className="space-y-3 p-5">
          {/* Link + kopyala */}
          <div className="flex items-center gap-2">
            <code className="flex-1 select-all truncate rounded-xl border border-ink-200 bg-ink-50 px-3 py-2.5 font-mono text-sm text-ink-700">
              {link}
            </code>
            <button
              onClick={copy}
              aria-label={t("c3.referral.copy")}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink-100 text-ink-700 transition-colors hover:bg-ink-200"
            >
              {copied ? (
                <Check size={20} className="text-success-600" />
              ) : (
                <Copy size={20} />
              )}
            </button>
            <button
              onClick={() => setShowQr((v) => !v)}
              aria-label={t("c3.referral.qr")}
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-2xl transition-colors",
                showQr
                  ? "bg-brand-600 text-white"
                  : "bg-ink-100 text-ink-700 hover:bg-ink-200",
              )}
            >
              <QrCode size={20} />
            </button>
          </div>

          {/* QR */}
          {showQr && (
            <div className="flex justify-center rounded-xl border border-ink-200 bg-white p-4">
              <Image
                src={qrSrc}
                alt={t("c3.referral.qrAlt")}
                width={180}
                height={180}
                unoptimized
                className="rounded-lg"
              />
            </div>
          )}

          {/* Paylaşım butonları */}
          <div className="grid grid-cols-3 gap-2">
            {shares.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  s.cls,
                )}
              >
                <s.icon size={18} weight="fill" />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
