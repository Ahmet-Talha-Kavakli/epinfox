import Link from "next/link";
import {
  CurrencyCircleDollar,
  ArrowDown,
  ArrowUp,
  Wallet,
  HandHeart,
  ShoppingBag,
  ArrowCounterClockwise,
  SlidersHorizontal,
  ArrowsClockwise,
} from "@phosphor-icons/react/dist/ssr";
import { createAdminClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { formatTL } from "@/lib/format";
import type { WalletTxnType } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface TxnRow {
  id: string;
  user_id: string;
  type: WalletTxnType;
  amount: number;
  balance_after: number;
  note: string | null;
  created_at: string;
  profile: { nickname: string } | null;
}

const TXN_META: Record<WalletTxnType, { label: string; icon: typeof Wallet; tone: string }> = {
  topup: { label: "Yükleme", icon: Wallet, tone: "bg-success-50 text-success-600 ring-success-200" },
  purchase: { label: "Satın alma", icon: ShoppingBag, tone: "bg-brand-50 text-brand-600 ring-brand-200" },
  refund: { label: "İade", icon: ArrowCounterClockwise, tone: "bg-accent-50 text-accent-600 ring-accent-200" },
  adjustment: { label: "Düzeltme", icon: SlidersHorizontal, tone: "bg-ink-100 text-ink-500 ring-ink-200" },
  donation: { label: "Bağış", icon: HandHeart, tone: "bg-accent-50 text-accent-600 ring-accent-200" },
};

function fmt(d: string) {
  return new Date(d).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminFinancePage() {
  const supabase = await createAdminClient();

  const [{ data: txnData }, { data: completedOrders }, { data: walletAgg }] = await Promise.all([
    supabase
      .from("wallet_transactions")
      .select("id, user_id, type, amount, balance_after, note, created_at, profile:profiles!wallet_transactions_user_id_fkey(nickname)")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("orders").select("price").eq("status", "completed"),
    supabase.from("wallet_transactions").select("type, amount"),
  ]);

  const txns = (txnData as unknown as TxnRow[]) ?? [];
  const revenue = ((completedOrders as { price: number }[]) ?? []).reduce((s, o) => s + Number(o.price), 0);

  const agg = ((walletAgg as { type: WalletTxnType; amount: number }[]) ?? []).reduce(
    (acc, t) => {
      if (t.type === "topup") acc.topup += Number(t.amount);
      if (t.type === "refund") acc.refund += Math.abs(Number(t.amount));
      if (t.type === "donation") acc.donation += Math.abs(Number(t.amount));
      return acc;
    },
    { topup: 0, refund: 0, donation: 0 },
  );

  const stats = [
    { label: "Toplam Ciro (satış)", value: formatTL(revenue), icon: CurrencyCircleDollar, tone: "from-success-500 to-success-600" },
    { label: "Toplam Yükleme", value: formatTL(agg.topup), icon: Wallet, tone: "from-brand-500 to-brand-600" },
    { label: "Toplam İade", value: formatTL(agg.refund), icon: ArrowCounterClockwise, tone: "from-accent-500 to-accent-600" },
    { label: "Toplam Bağış", value: formatTL(agg.donation), icon: HandHeart, tone: "from-ink-500 to-ink-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Finans / Cüzdan</h1>
        <p className="mt-1 text-sm text-ink-500">
          Ciro özeti ve tüm cüzdan hareketleri. Manuel bakiye düzeltmesini{" "}
          <Link href="/admin/users" className="font-medium text-brand-600 hover:underline">
            Kullanıcılar
          </Link>{" "}
          sayfasından yapabilirsin.
        </p>
      </div>

      {/* Özet */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-ink-200 p-5">
            <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${s.tone} text-white shadow-soft`}>
              <s.icon size={22} weight="fill" />
            </span>
            <p className="mt-3 text-xl font-extrabold text-ink-900">{s.value}</p>
            <p className="text-sm text-ink-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Hareketler */}
      <Card className="border-ink-200 p-5">
        <h2 className="mb-3 flex items-center gap-2 font-bold text-ink-900">
          <ArrowsClockwise size={18} weight="duotone" className="text-brand-500" />
          Son Cüzdan Hareketleri
        </h2>
        {txns.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-400">Henüz hareket yok.</p>
        ) : (
          <div className="divide-y divide-ink-100">
            {txns.map((t) => {
              const meta = TXN_META[t.type];
              const positive = t.amount >= 0;
              return (
                <div key={t.id} className="flex items-center gap-3 py-2.5">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${meta.tone}`}>
                    <meta.icon size={17} weight="duotone" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {t.profile?.nickname ?? "—"}
                      <span className="ml-2 text-xs font-normal text-ink-400">{meta.label}</span>
                    </p>
                    <p className="truncate text-xs text-ink-400">
                      {t.note || "—"} · {fmt(t.created_at)}
                    </p>
                  </div>
                  <span className={`flex shrink-0 items-center gap-1 text-sm font-bold ${positive ? "text-success-700" : "text-danger-600"}`}>
                    {positive ? <ArrowUp size={13} weight="bold" /> : <ArrowDown size={13} weight="bold" />}
                    {formatTL(Math.abs(t.amount))}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
