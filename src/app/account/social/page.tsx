import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { SocialForm } from "@/components/account/social-form";

export const metadata: Metadata = { title: "Sosyal Bağlantılarım" };

export default async function AccountSocialPage() {
  const current = await requireMember();
  const t = await getServerT();

  // Kullanıcının kayıtlı sosyal profil kullanıcı adlarını çek (form'da doldurulur).
  const supabase = await createAdminClient();
  const { data: p } = await supabase
    .from("profiles")
    .select("social_instagram, social_tiktok, social_steam, social_discord, social_x")
    .eq("id", current.user.id)
    .maybeSingle();

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
      <SocialForm
        initial={{
          instagram: p?.social_instagram ?? "",
          tiktok: p?.social_tiktok ?? "",
          steam: p?.social_steam ?? "",
          discord: p?.social_discord ?? "",
          x: p?.social_x ?? "",
        }}
      />
    </AccountShell>
  );
}
