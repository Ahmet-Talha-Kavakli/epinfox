import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getMyTickets } from "@/lib/account";
import { AccountShell } from "@/components/account/account-shell";
import { SupportNew } from "@/components/account/support-new";
import { SupportView } from "@/components/account/support-view";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Destek Taleplerim" };

export default async function SupportPage() {
  const current = await requireMember();
  const supabase = await createAdminClient();
  const tickets = await getMyTickets(supabase, current.user.id);
  const t = await getServerT();

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("sup.tickets.pageTitle")}
      description={t("sup.tickets.pageDesc")}
      actions={<SupportNew />}
    >
      <SupportView tickets={tickets} />
    </AccountShell>
  );
}
