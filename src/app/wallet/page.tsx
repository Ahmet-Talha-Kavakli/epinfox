import type { Metadata } from "next";
import Link from "next/link";
import {
  Wallet,
  ArrowsClockwise,
  TrendUp,
  Gift,
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";
import { requireMember } from "@/lib/auth/require-admin";
import { getWalletTransactions } from "@/lib/actions/wallet";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { TopUpFlow } from "@/components/wallet/topup-flow";
import { Price } from "@/components/store/price";

export const metadata: Metadata = { title: "Cüzdan" };

export default async function WalletPage() {
  const current = await requireMember();
  const txns = await getWalletTransactions(current.user.id, 200);
  const t = await getServerT();

  // Bu ay yüklenen toplam + son bonus.
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthTopup = txns
    .filter((t) => t.type === "topup" && new Date(t.created_at).getTime() >= startOfMonth)
    .reduce((s, t) => s + t.amount, 0);
  const lastBonus = txns.find((t) => t.type === "adjustment" && t.amount > 0);

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("account.wallet.title")}
      description={t("account.wallet.desc")}
    >
      {/* Bakiye banner — tam genişlik, içinde mini istatistikler */}
      <div className="overflow-hidden rounded-3xl border border-ink-900 bg-gradient-to-br from-brand-600 via-brand-600 to-accent-600">
        <div className="grid grid-cols-1 gap-6 p-6 sm:p-8 md:grid-cols-[1.3fr_1fr] md:items-center">
          {/* Bakiye */}
          <div className="text-white">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Wallet size={18} weight="fill" /> {t("account.wallet.currentBalance")}
            </div>
            <p className="mt-2 text-5xl font-extrabold tracking-tight">
              <Price amountTRY={current.balance} />
            </p>
            <Link
              href="/wallet/transactions"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-xs font-semibold backdrop-blur transition-colors hover:bg-white/25"
            >
              <ArrowsClockwise size={14} weight="bold" />
              {t("account.wallet.transactionsLink")}
              <CaretRight size={12} weight="bold" />
            </Link>
          </div>

          {/* Mini istatistikler — banner içinde, camsı */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/12 p-4 backdrop-blur">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20 text-white">
                <TrendUp size={18} weight="duotone" />
              </span>
              <p className="mt-3 text-lg font-bold text-white">
                <Price amountTRY={monthTopup} />
              </p>
              <p className="text-xs text-white/70">{t("account.wallet.monthTopup")}</p>
            </div>
            <div className="rounded-2xl bg-white/12 p-4 backdrop-blur">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/20 text-white">
                <Gift size={18} weight="duotone" />
              </span>
              <p className="mt-3 text-lg font-bold text-white">
                {lastBonus ? <Price amountTRY={lastBonus.amount} /> : "—"}
              </p>
              <p className="text-xs text-white/70">{t("account.wallet.lastBonus")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Yükleme akışı — adım adım: önce yöntem seç, sonra tutar */}
      <div className="mt-6">
        <TopUpFlow />
      </div>
    </AccountShell>
  );
}
