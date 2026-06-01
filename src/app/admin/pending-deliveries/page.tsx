import { getPendingDeliveries } from "@/lib/actions/admin-codes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PendingDeliveryRowCard } from "@/components/admin/pending-delivery-row";

export const dynamic = "force-dynamic";

export default async function PendingDeliveriesPage() {
  const orders = await getPendingDeliveries();

  return (
    <Card className="border-ink-200">
      <CardHeader>
        <CardTitle>Bekleyen Teslimatlar ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <EmptyState
            title="Bekleyen teslimat yok"
            description="Manuel köprü (elle teslim) ürünleri satıldıkça siparişler burada belirir. Her birine kod ya da teslim notu girip müşteriye ulaştırırsın."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <PendingDeliveryRowCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
