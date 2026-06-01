import Link from "next/link";
import {
  Package,
  Receipt,
  Ticket,
  UsersThree,
  Storefront,
  CurrencyCircleDollar,
  TrendUp,
  Truck,
  Headset,
  ArrowRight,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react/dist/ssr";
import { getAdminDashboard } from "@/lib/actions/admin-codes";
import { Card } from "@/components/ui/card";
import { formatTL } from "@/lib/format";

function fmtTime(d: string) {
  return new Date(d).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
  completed: { label: "Tamamlandı", cls: "bg-success-50 text-success-700" },
  processing: { label: "İşleniyor", cls: "bg-brand-50 text-brand-700" },
  pending: { label: "Bekliyor", cls: "bg-warning-50 text-warning-700" },
  failed: { label: "Başarısız", cls: "bg-danger-50 text-danger-600" },
  refunded: { label: "İade", cls: "bg-ink-100 text-ink-500" },
};

export default async function AdminHome() {
  const d = await getAdminDashboard();
  const maxTrend = Math.max(1, ...d.trend.map((t) => t.count));

  const metrics = [
    { label: "Bugünkü Ciro", value: formatTL(d.revenue.today), icon: CurrencyCircleDollar, tone: "from-success-500 to-success-600", href: "/admin/finance" },
    { label: "Aylık Ciro", value: formatTL(d.revenue.month), icon: TrendUp, tone: "from-brand-500 to-brand-600", href: "/admin/finance" },
    { label: "Toplam Sipariş", value: String(d.counts.orders), icon: Receipt, tone: "from-accent-500 to-accent-600", href: "/admin/orders" },
    { label: "Kullanıcı", value: String(d.counts.users), icon: UsersThree, tone: "from-ink-500 to-ink-700", href: "/admin/users" },
  ];

  const subMetrics = [
    { label: "Aktif Ürün", value: d.counts.products, icon: Package, href: "/admin/products" },
    { label: "Stoktaki Kod", value: d.counts.availableCodes, icon: Ticket, href: "/admin/codes" },
    { label: "Aktif Bayi", value: d.counts.resellers, icon: Storefront, href: "/admin/resellers" },
  ];

  const todos = [
    { label: "Bekleyen teslimat", count: d.todo.pendingDeliveries, icon: Truck, href: "/admin/pending-deliveries" },
    { label: "Bekleyen bayi başvurusu", count: d.todo.pendingResellerApps, icon: Storefront, href: "/admin/resellers" },
    { label: "Açık destek talebi", count: d.todo.openTickets, icon: Headset, href: "/admin/support" },
  ];
  const totalTodo = todos.reduce((s, t) => s + t.count, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Genel Bakış</h1>
        <p className="mt-1 text-sm text-ink-500">
          Mağazanın anlık durumu, bekleyen işler ve son hareketler.
        </p>
      </div>

      {/* Ana metrikler */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <Link key={m.label} href={m.href}>
            <Card className="border-ink-200 p-5 transition-all hover:-translate-y-0.5 hover:shadow-float">
              <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${m.tone} text-white shadow-soft`}>
                <m.icon size={22} weight="fill" />
              </span>
              <p className="mt-3 text-2xl font-extrabold text-ink-900">{m.value}</p>
              <p className="text-sm text-ink-500">{m.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Sol: trend + son siparişler */}
        <div className="space-y-6">
          {/* 7 günlük trend */}
          <Card className="border-ink-200 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-ink-900">Son 7 Gün — Tamamlanan Sipariş</h2>
              <span className="text-xs text-ink-400">
                Toplam {d.trend.reduce((s, t) => s + t.count, 0)} sipariş
              </span>
            </div>
            <div className="flex h-40 items-end gap-2">
              {d.trend.map((t, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-400 transition-all"
                      style={{ height: `${Math.max(4, (t.count / maxTrend) * 100)}%` }}
                      title={`${t.count} sipariş · ${formatTL(t.revenue)}`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-ink-500">{t.day}</span>
                  <span className="text-xs font-bold text-ink-900">{t.count}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Son siparişler */}
          <Card className="border-ink-200 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold text-ink-900">Son Siparişler</h2>
              <Link href="/admin/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                Tümü
              </Link>
            </div>
            {d.recentOrders.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-400">Henüz sipariş yok.</p>
            ) : (
              <ul className="divide-y divide-ink-100">
                {d.recentOrders.map((o) => {
                  const st = ORDER_STATUS[o.status] ?? ORDER_STATUS.completed;
                  return (
                    <li key={o.id} className="flex items-center gap-3 py-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500">
                        <Package size={18} weight="duotone" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink-900">{o.product_name}</p>
                        <p className="text-xs text-ink-400">{fmtTime(o.created_at)}</p>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-ink-900">{formatTL(o.price)}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}>
                        {st.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>

        {/* Sağ: yapılacaklar + katalog + son üyeler */}
        <div className="space-y-6">
          {/* Yapılacaklar */}
          <Card className="border-ink-200 p-5">
            <h2 className="flex items-center gap-2 font-bold text-ink-900">
              {totalTodo > 0 ? (
                <WarningCircle size={20} weight="fill" className="text-warning-500" />
              ) : (
                <CheckCircle size={20} weight="fill" className="text-success-500" />
              )}
              Yapılacaklar
            </h2>
            <div className="mt-3 space-y-2">
              {todos.map((t) => (
                <Link
                  key={t.label}
                  href={t.href}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 transition-colors ${
                    t.count > 0
                      ? "border-warning-200 bg-warning-50/50 hover:bg-warning-50"
                      : "border-ink-200 hover:bg-ink-50"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm text-ink-700">
                    <t.icon size={17} weight="duotone" className="text-ink-400" />
                    {t.label}
                  </span>
                  <span className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-xs font-bold ${
                    t.count > 0 ? "bg-warning-500 text-white" : "bg-ink-100 text-ink-400"
                  }`}>
                    {t.count}
                  </span>
                </Link>
              ))}
              {totalTodo === 0 && (
                <p className="rounded-xl bg-success-50 px-3 py-2 text-center text-sm font-medium text-success-700">
                  Bekleyen iş yok 🎉
                </p>
              )}
            </div>
          </Card>

          {/* Katalog alt metrikleri */}
          <Card className="border-ink-200 p-5">
            <h2 className="mb-3 font-bold text-ink-900">Katalog</h2>
            <div className="space-y-1">
              {subMetrics.map((s) => (
                <Link key={s.label} href={s.href} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-ink-50">
                  <span className="flex items-center gap-2 text-sm text-ink-600">
                    <s.icon size={17} weight="duotone" className="text-ink-400" />
                    {s.label}
                  </span>
                  <span className="text-sm font-bold text-ink-900">{s.value}</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Son üyeler */}
          <Card className="border-ink-200 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold text-ink-900">Son Üyeler</h2>
              <Link href="/admin/users" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                Tümü
              </Link>
            </div>
            <ul className="space-y-2">
              {d.recentUsers.map((u) => (
                <li key={u.id} className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                    {u.nickname.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">{u.nickname}</p>
                    <p className="truncate text-xs text-ink-400">{u.email}</p>
                  </div>
                  <ArrowRight size={14} className="shrink-0 text-ink-300" />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
