import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { DonationCenter } from "@/components/account/donation-center";
import type { Donation } from "@/lib/supabase/types";

export const metadata: Metadata = { title: "Bağışlarım" };

export default async function AccountDonationsPage() {
  const current = await requireMember();
  const t = await getServerT();
  const supabase = await createAdminClient();

  const { data } = await supabase
    .from("donations")
    .select("*")
    .eq("user_id", current.user.id)
    .order("created_at", { ascending: false });

  const donations = (data as Donation[]) ?? [];

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("acct.donations.title")}
      description={t("acct.donations.desc")}
    >
      <DonationCenter donations={donations} />
    </AccountShell>
  );
}
