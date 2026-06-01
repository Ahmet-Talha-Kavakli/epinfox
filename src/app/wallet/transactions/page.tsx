import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { getWalletTransactions } from "@/lib/actions/wallet";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { TransactionsView } from "@/components/wallet/transactions-view";

export const metadata: Metadata = { title: "Bakiye Hareketlerim" };

export default async function WalletTransactionsPage() {
  const current = await requireMember();
  const t = await getServerT();
  const txns = await getWalletTransactions(current.user.id, 200);

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("acct.transactions.title")}
      description={t("acct.transactions.desc")}
    >
      <TransactionsView txns={txns} />
    </AccountShell>
  );
}
