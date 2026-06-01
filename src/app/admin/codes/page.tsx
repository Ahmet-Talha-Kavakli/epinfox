import { getStockSummary } from "@/lib/actions/admin-codes";
import { getAdminProducts } from "@/lib/actions/admin-products";
import { CodeBulkForm } from "@/components/admin/code-bulk-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminCodesPage() {
  const [products, summary] = await Promise.all([
    getAdminProducts(),
    getStockSummary(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <Card className="border-ink-200 lg:col-span-2">
        <CardHeader>
          <CardTitle>Toplu Kod Ekle</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBulkForm products={products.map((p) => ({ id: p.id, name: p.name }))} />
        </CardContent>
      </Card>

      <Card className="border-ink-200 lg:col-span-3">
        <CardHeader>
          <CardTitle>Stok Özeti</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-ink-100">
            {summary.map((s) => {
              const manual = s.supply_source === "manual";
              const lowStock = manual && s.available > 0 && s.available <= 5;
              return (
                <li
                  key={s.product_id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {s.product_name}
                    </p>
                    <div className="mt-1 flex gap-1.5">
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-500">
                        {manual ? "Manuel" : s.supply_source}
                      </span>
                      {s.delivery_type === "topup" && (
                        <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-700">
                          Top-up
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs">
                    {manual ? (
                      <>
                        <span
                          className={
                            "rounded-full px-2.5 py-1 font-medium " +
                            (s.available === 0
                              ? "bg-danger-50 text-danger-600"
                              : lowStock
                                ? "bg-warning-50 text-warning-700"
                                : "bg-success-50 text-success-700")
                          }
                        >
                          {s.available} stokta{lowStock ? " ⚠" : ""}
                        </span>
                        <span className="rounded-full bg-ink-100 px-2.5 py-1 font-medium text-ink-500">
                          {s.sold} satıldı
                        </span>
                      </>
                    ) : (
                      <span className="rounded-full bg-brand-50 px-2.5 py-1 font-medium text-brand-700">
                        Otomatik tedarik · {s.sold} satıldı
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
