"use client";

import { GoogleLogo, SteamLogo } from "@phosphor-icons/react";
import { useI18n } from "@/lib/i18n/provider";

export type OAuthStrategy = "oauth_google" | "oauth_custom_steam";

const PROVIDERS: {
  strategy: OAuthStrategy;
  labelKey: string;
  icon: typeof GoogleLogo;
  cls: string;
  iconCls: string;
}[] = [
  {
    strategy: "oauth_google",
    labelKey: "auth.google",
    icon: GoogleLogo,
    cls: "border-ink-200 bg-white text-ink-800 hover:bg-ink-50",
    iconCls: "text-[#4285F4]",
  },
  {
    strategy: "oauth_custom_steam",
    labelKey: "auth.steam",
    icon: SteamLogo,
    cls: "border-transparent bg-[#171a21] text-white hover:bg-[#2a3f5a]",
    iconCls: "text-white",
  },
];

/**
 * Sosyal giriş butonları (Google / Steam) — marka renkli. onProvider,
 * Clerk sso() çağrısını yapan handler'a strateji geçirir. Steam Clerk'te "custom"
 * OAuth bağlantısı olarak açılır (oauth_custom_steam).
 */
export function OAuthButtons({
  onProvider,
}: {
  onProvider: (strategy: OAuthStrategy) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-2.5">
      {PROVIDERS.map(({ strategy, labelKey, icon: Icon, cls, iconCls }) => (
        <button
          key={strategy}
          type="button"
          onClick={() => {
            // Steam Clerk OAuth değil — kendi OpenID akışımıza yönlendir.
            if (strategy === "oauth_custom_steam") {
              window.location.href = "/api/auth/steam";
              return;
            }
            onProvider(strategy);
          }}
          className={`flex h-11 w-full items-center justify-center gap-2.5 rounded-full border text-sm font-semibold transition-colors ${cls}`}
        >
          <Icon size={19} weight="fill" className={iconCls} />
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}
