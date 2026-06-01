import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { getMyInvoices } from "@/lib/account";
import { AccountShell } from "@/components/account/account-shell";
import { InvoicesView } from "@/components/account/invoices-view";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Faturalarım" };

export default async function InvoicesPage() {
  const current = await requireMember();
  const supabase = await createAdminClient();
  const invoices = await getMyInvoices(supabase, current.user.id);
  const t = await getServerT();

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("sup.invoices.pageTitle")}
      description={t("sup.invoices.pageDesc")}
    >
      <InvoicesView invoices={invoices} />
    </AccountShell>
  );
}
