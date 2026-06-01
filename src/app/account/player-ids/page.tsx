import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { PlayerAccountsManager } from "@/components/account/player-accounts-manager";
import { getMyPlayerAccounts } from "@/lib/actions/player-accounts";

export const metadata: Metadata = { title: "Oyuncu ID & Hesaplarım" };

export default async function PlayerIdsPage() {
  const current = await requireMember();
  const t = await getServerT();
  const accounts = await getMyPlayerAccounts();

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("acct.playerIds.title")}
      description={t("acct.playerIds.desc")}
    >
      <PlayerAccountsManager accounts={accounts} />
    </AccountShell>
  );
}
