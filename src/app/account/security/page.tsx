import type { Metadata } from "next";
import { LightbulbFilament } from "@phosphor-icons/react/dist/ssr";
import { requireMember } from "@/lib/auth/require-admin";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { PasswordForm, EmailForm } from "@/components/account/account-forms";
import {
  SecurityScore,
  TwoFactorSection,
  ConnectedAccounts,
  SessionsSection,
} from "@/components/account/security-features";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Güvenlik" };

export default async function SecurityPage() {
  const current = await requireMember();
  const t = await getServerT();

  const TIPS = [
    t("acct.security.tip1"),
    t("acct.security.tip2"),
    t("acct.security.tip3"),
  ];

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("acct.security.title")}
      description={t("acct.security.desc")}
    >
      <div className="space-y-6">
        {/* Güvenlik skoru özeti */}
        <SecurityScore />

        {/* Şifre + e-posta (yan yana) */}
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
          <PasswordForm />
          <EmailForm currentEmail={current.email} />
        </div>

        {/* 2FA + bağlı hesaplar */}
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
          <TwoFactorSection />
          <ConnectedAccounts />
        </div>

        <SessionsSection />

        {/* Güvenlik ipuçları */}
        <Card className="border-brand-200 bg-brand-50/40 p-6">
          <div className="flex items-center gap-2 text-brand-700">
            <LightbulbFilament size={20} weight="fill" />
            <h2 className="font-semibold">{t("acct.security.tipsTitle")}</h2>
          </div>
          <ul className="mt-3 space-y-2">
            {TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-sm text-ink-600"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AccountShell>
  );
}
