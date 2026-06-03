import Link from "next/link";
import { ShieldStar } from "@phosphor-icons/react/dist/ssr";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { UserAvatar } from "@/components/account/user-avatar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await requireAdmin();
  const supabase = await createAdminClient();

  // Sidebar rozetleri — aksiyon bekleyen sayılar
  const [deliveries, resellers, tickets, earn, kyc] = await Promise.all([
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "processing"]),
    supabase
      .from("reseller_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("support_tickets")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "answered"]),
    supabase
      .from("earn_submissions")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("kyc_status", "pending"),
  ]);

  const badges = {
    deliveries: deliveries.count ?? 0,
    resellers: resellers.count ?? 0,
    tickets: tickets.count ?? 0,
    earn: earn.count ?? 0,
    kyc: kyc.count ?? 0,
  };

  return (
    <div className="min-h-screen bg-ink-50/40">
      {/* Üst bar */}
      <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white shadow-soft">
              <ShieldStar size={20} weight="fill" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-ink-900">EpinFox Yönetim</p>
              <p className="text-[11px] text-ink-400">Admin Paneli</p>
            </div>
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="hidden text-right sm:block">
              <span className="block text-sm font-semibold text-ink-900">
                {current.nickname}
              </span>
              <span className="block text-[11px] text-ink-400 capitalize">
                {current.profile.role}
              </span>
            </span>
            <UserAvatar
              name={current.nickname}
              avatarPath={current.avatarPath}
              size={38}
            />
          </div>
        </div>
      </header>

      {/* İçerik: sidebar + ana alan */}
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24">
            <AdminSidebar badges={badges} />
          </div>
        </div>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
