import { getSmmCatalog } from "@/lib/actions/admin-smm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SmmSyncButton } from "@/components/admin/smm-sync-button";

export const dynamic = "force-dynamic";

export default async function AdminSmmPage() {
  const catalog = await getSmmCatalog();

  return (
    <div className="space-y-6">
      <Card className="border-ink-200">
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>SMM Panel</CardTitle>
            <p className="mt-1 text-sm text-ink-500">
              Sosyal medya hizmetleri (Perfect Panel /api/v2). Aşağıdaki servis
              ID&apos;lerini ürün varyantlarınızın{" "}
              <code className="font-mono">supplier_service_id</code> (ve gerekirse{" "}
              <code className="font-mono">supplier_quantity</code>) alanına yazın
              (şimdilik seed/DB üzerinden).
            </p>
          </div>
          {catalog.ok && (
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-ink-400">
                Panel Bakiyesi
              </p>
              <p className="text-lg font-bold text-ink-900">
                {catalog.balance} {catalog.currency}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-ink-500">
            İşlenmekte olan SMM siparişlerinin durumunu panelden çekip
            tamamla/iade et.
          </p>
          <SmmSyncButton />
        </CardContent>
      </Card>

      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>
            Servis Kataloğu{" "}
            {catalog.ok ? `(${catalog.services.length})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!catalog.ok ? (
            <EmptyState
              title="Servisler alınamadı"
              description={
                catalog.error +
                " — SMM_API_URL ve SMM_API_KEY ortam değişkenlerini kontrol edin."
              }
            />
          ) : catalog.services.length === 0 ? (
            <EmptyState
              title="Servis bulunamadı"
              description="Panel boş bir liste döndürdü."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                    <th className="py-2 pr-4 font-medium">Servis ID</th>
                    <th className="py-2 pr-4 font-medium">Ad</th>
                    <th className="py-2 pr-4 font-medium">Kategori</th>
                    <th className="py-2 pr-4 font-medium">Tip</th>
                    <th className="py-2 pr-4 font-medium">Fiyat /1000</th>
                    <th className="py-2 pr-4 font-medium">Min</th>
                    <th className="py-2 font-medium">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {catalog.services.map((s) => (
                    <tr key={String(s.service)}>
                      <td className="py-2.5 pr-4 font-mono text-xs text-ink-700">
                        {s.service}
                      </td>
                      <td className="py-2.5 pr-4 text-ink-900">{s.name}</td>
                      <td className="py-2.5 pr-4 text-ink-500">{s.category}</td>
                      <td className="py-2.5 pr-4 text-ink-500">{s.type}</td>
                      <td className="py-2.5 pr-4 text-ink-700">{s.rate}</td>
                      <td className="py-2.5 pr-4 text-ink-500">{s.min}</td>
                      <td className="py-2.5 text-ink-500">{s.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
