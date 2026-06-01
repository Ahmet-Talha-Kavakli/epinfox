"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Plugs,
  Link as LinkIcon,
  LinkBreak,
  CircleNotch,
  Check,
} from "@phosphor-icons/react";
import {
  GoogleLogo,
  FacebookLogo,
  SteamLogo,
  TelegramLogo,
  type BrandLogo,
} from "@/components/account/brand-logos";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/* Sosyal Bağlantılarım — GERÇEK bağlantılar.
   - Oturuma bağlı hesaplar: Clerk OAuth (Facebook/Google/Steam) — createExternalAccount.
   - Entegrasyonlar: Telegram/Webhook bildirim bağlantıları. */

interface OAuthProvider {
  key: string;
  /** Clerk OAuth strateji adı (ör. 'oauth_google', 'oauth_custom_steam'). */
  strategy: string;
  label: string;
  icon: BrandLogo;
  /** Logo zemini — gerçek renkli logolar açık/beyaz, beyaz logolar koyu zeminde. */
  cls: string;
}

// Phosphor Plugs'ı BrandLogo imzasına saran küçük adaptör (webhook için).
const WebhookLogo: BrandLogo = ({ size = 24 }) => (
  <Plugs size={size} weight="fill" />
);

const OAUTH_PROVIDERS: OAuthProvider[] = [
  {
    key: "facebook",
    strategy: "oauth_facebook",
    label: "Facebook",
    icon: FacebookLogo,
    cls: "bg-white ring-1 ring-ink-200",
  },
  {
    key: "google",
    strategy: "oauth_google",
    label: "Google",
    icon: GoogleLogo,
    cls: "bg-white ring-1 ring-ink-200",
  },
  {
    key: "steam",
    strategy: "oauth_custom_steam",
    label: "Steam",
    icon: SteamLogo,
    cls: "bg-[#171a21]",
  },
];

const INTEGRATIONS: {
  key: string;
  label: string;
  icon: BrandLogo;
  cls: string;
}[] = [
  {
    key: "telegram",
    label: "Telegram",
    icon: TelegramLogo,
    cls: "bg-white ring-1 ring-ink-200",
  },
  {
    key: "webhook",
    label: "Webhook",
    icon: WebhookLogo,
    cls: "bg-brand-500 text-white",
  },
];

export function SocialForm() {
  const { user, isLoaded } = useUser();
  const { t } = useI18n();
  const [busy, setBusy] = useState<string | null>(null);
  const [, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const linkedStrategies = new Set<string>(
    (user?.externalAccounts ?? [])
      .filter((a) => a.verification?.status === "verified")
      .map((a) => String(a.provider)),
  );

  function isLinked(p: OAuthProvider) {
    // Clerk provider adı genelde 'facebook'/'google'; custom 'custom_steam'.
    return (
      linkedStrategies.has(p.key) ||
      linkedStrategies.has(p.strategy.replace("oauth_", ""))
    );
  }

  async function connect(p: OAuthProvider) {
    if (!user) return;
    setBusy(p.key);
    setMsg(null);
    try {
      const ea = await user.createExternalAccount({
        // Clerk'in dar OAuthStrategy union'ı; runtime'da string geçerli.
        strategy: p.strategy as Parameters<
          typeof user.createExternalAccount
        >[0]["strategy"],
        redirectUrl: `${window.location.origin}/account/social`,
      });
      const url = ea.verification?.externalVerificationRedirectURL;
      if (url) {
        window.location.href = url.toString();
        return;
      }
      setMsg({ ok: false, text: t("acct.social.startError").replace("{label}", p.label) });
    } catch (err: unknown) {
      const e = err as { errors?: { message?: string }[] };
      setMsg({
        ok: false,
        text:
          e?.errors?.[0]?.message ??
          t("acct.social.unavailable").replace("{label}", p.label),
      });
    } finally {
      setBusy(null);
    }
  }

  function disconnect(p: OAuthProvider) {
    if (!user) return;
    setBusy(p.key);
    setMsg(null);
    start(async () => {
      try {
        const acc = user.externalAccounts.find(
          (a) =>
            a.provider === p.key ||
            a.provider === p.strategy.replace("oauth_", ""),
        );
        await acc?.destroy();
        await user.reload();
        setMsg({ ok: true, text: t("acct.social.removed").replace("{label}", p.label) });
      } catch {
        setMsg({ ok: false, text: t("acct.social.removeError") });
      } finally {
        setBusy(null);
      }
    });
  }

  return (
    <div className="space-y-8">
      {/* ─── Oturuma bağlı hesaplar (OAuth) ─── */}
      <section>
        <h2 className="text-lg font-bold text-ink-900">{t("acct.social.oauthTitle")}</h2>
        <p className="mt-1 text-sm text-ink-500">
          {t("acct.social.oauthDesc")}
        </p>

        <div className="mt-4 space-y-3">
          {OAUTH_PROVIDERS.map((p) => {
            const linked = isLoaded && isLinked(p);
            return (
              <Row
                key={p.key}
                icon={p.icon}
                iconCls={p.cls}
                title={
                  !isLoaded
                    ? t("acct.social.checking").replace("{label}", p.label)
                    : linked
                      ? t("acct.social.linkedTitle").replace("{label}", p.label)
                      : t("acct.social.notLinkedTitle").replace("{label}", p.label)
                }
                linked={linked}
                busy={busy === p.key}
                disabled={!isLoaded}
                onConnect={() => connect(p)}
                onDisconnect={() => disconnect(p)}
              />
            );
          })}
        </div>
      </section>

      {/* ─── Entegrasyon bağlantıları ─── */}
      <section>
        <h2 className="text-lg font-bold text-ink-900">{t("acct.social.integrationsTitle")}</h2>
        <p className="mt-1 text-sm text-ink-500">
          {t("acct.social.integrationsDesc")}
        </p>

        <div className="mt-4 space-y-3">
          {INTEGRATIONS.map((it) => (
            <Row
              key={it.key}
              icon={it.icon}
              iconCls={it.cls}
              title={t("acct.social.notLinkedShort").replace("{label}", it.label)}
              connectLabel={t("acct.social.enableNotifications")}
              linked={false}
              busy={false}
              onConnect={() =>
                setMsg({
                  ok: true,
                  text: t("acct.social.soon").replace("{label}", it.label),
                })
              }
              onDisconnect={() => {}}
            />
          ))}
        </div>
      </section>

      {msg && (
        <p
          className={cn(
            "text-sm font-medium",
            msg.ok ? "text-success-600" : "text-danger-600",
          )}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}

function Row({
  icon: Icon,
  iconCls,
  title,
  linked,
  busy,
  disabled,
  connectLabel,
  onConnect,
  onDisconnect,
}: {
  icon: BrandLogo;
  iconCls: string;
  title: string;
  linked: boolean;
  busy: boolean;
  disabled?: boolean;
  connectLabel?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4">
      <span
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl",
          iconCls,
        )}
      >
        <Icon size={26} />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold",
            linked ? "text-success-700" : "text-danger-500",
          )}
        >
          {title}
        </p>
        <div className="mt-1.5">
          {linked ? (
            <button
              type="button"
              onClick={onDisconnect}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:border-danger-300 hover:bg-danger-50 hover:text-danger-700 disabled:opacity-50"
            >
              {busy ? (
                <CircleNotch size={14} className="animate-spin" />
              ) : (
                <LinkBreak size={14} weight="bold" />
              )}
              {t("acct.social.disconnect")}
            </button>
          ) : (
            <button
              type="button"
              onClick={onConnect}
              disabled={busy || disabled}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {busy ? (
                <CircleNotch size={15} className="animate-spin" />
              ) : (
                <LinkIcon size={15} weight="bold" />
              )}
              {connectLabel ?? t("acct.social.connect")}
            </button>
          )}
        </div>
      </div>
      {linked && (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-50 px-2 py-1 text-[10px] font-bold text-success-700">
          <Check size={11} weight="bold" /> {t("acct.common.connected")}
        </span>
      )}
    </div>
  );
}
