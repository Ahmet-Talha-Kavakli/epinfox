import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { getMyOrders } from "@/lib/actions/orders";
import { getServerT } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { OrdersView } from "@/components/orders/orders-view";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Siparişlerim" };

export default async function SiparislerimPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: yeni } = await searchParams;
  const current = await requireMember();
  const orders = await getMyOrders(current.user.id);
  const t = await getServerT();

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("account.orders.title")}
      description={t("account.orders.desc")}
    >
      {orders.length === 0 ? (
        <EmptyState
          title={t("account.orders.empty.title")}
          description={t("account.orders.empty.desc")}
          cta={{ label: t("account.orders.empty.cta"), href: "/store" }}
        />
      ) : (
        <OrdersView orders={orders} newOrderId={yeni} />
      )}
    </AccountShell>
  );
}
