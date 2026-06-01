import { getAllOrders } from "@/lib/actions/admin-codes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatTL } from "@/lib/format";
import { formatDateTime } from "@/lib/utils";
import type { OrderStatus } from "@/lib/supabase/types";

/** Sipariş durumu → Türkçe etiket + renk (duruma göre). */
const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  completed: { label: "Tamamlandı", cls: "bg-success-50 text-success-700" },
  processing: { label: "İşleniyor", cls: "bg-brand-50 text-brand-700" },
  pending: { label: "Bekliyor", cls: "bg-warning-50 text-warning-700" },
  refunded: { label: "İade", cls: "bg-ink-100 text-ink-500" },
  failed: { label: "Başarısız", cls: "bg-danger-50 text-danger-600" },
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <Card className="border-ink-200">
      <CardHeader>
        <CardTitle>Tüm Siparişler ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <EmptyState title="Henüz sipariş yok" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-ink-400">
                <tr className="border-b border-ink-100">
                  <th className="py-2 pr-4 font-medium">Ürün</th>
                  <th className="py-2 pr-4 font-medium">Tutar</th>
                  <th className="py-2 pr-4 font-medium">Yöntem</th>
                  <th className="py-2 pr-4 font-medium">Durum</th>
                  <th className="py-2 font-medium">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 pr-4 font-medium text-ink-900">
                      {o.product_name}
                    </td>
                    <td className="py-2.5 pr-4 text-ink-700">{formatTL(o.price)}</td>
                    <td className="py-2.5 pr-4 text-ink-500">{o.payment_provider}</td>
                    <td className="py-2.5 pr-4">
                      {(() => {
                        const st =
                          STATUS_META[o.status as OrderStatus] ??
                          STATUS_META.completed;
                        return (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}
                          >
                            {st.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-2.5 text-xs text-ink-400">
                      {formatDateTime(o.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
