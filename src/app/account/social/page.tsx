import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { SocialForm } from "@/components/account/social-form";

export const metadata: Metadata = { title: "Sosyal Bağlantılarım" };

export default async function AccountSocialPage() {
  const current = await requireMember();
  const t = await getServerT();

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("acct.social.title")}
      description={t("acct.social.desc")}
    >
      <SocialForm />
    </AccountShell>
  );
}
