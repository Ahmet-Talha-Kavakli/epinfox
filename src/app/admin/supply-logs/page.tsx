import { getSupplierLogs } from "@/lib/actions/admin-codes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/utils";

export default async function SupplyLogsPage() {
  const logs = await getSupplierLogs(200);

  return (
    <Card className="border-ink-200">
      <CardHeader>
        <CardTitle>Tedarik Logları</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <EmptyState
            title="Henüz tedarik kaydı yok"
            description="Otomatik (mock/API) tedarikli ürünler satıldıkça çağrı logları burada görünür."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-2 pr-4 font-medium">Tarih</th>
                  <th className="py-2 pr-4 font-medium">Kaynak</th>
                  <th className="py-2 pr-4 font-medium">Adet</th>
                  <th className="py-2 pr-4 font-medium">Durum</th>
                  <th className="py-2 pr-4 font-medium">Referans</th>
                  <th className="py-2 font-medium">Hata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td className="py-2.5 pr-4 text-ink-500">
                      {formatDateTime(l.created_at)}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">
                        {l.source}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-ink-700">{l.qty}</td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={
                          "rounded-full px-2 py-0.5 text-xs font-medium " +
                          (l.status === "success"
                            ? "bg-success-50 text-success-700"
                            : "bg-danger-50 text-danger-600")
                        }
                      >
                        {l.status === "success" ? "Başarılı" : "Başarısız"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-xs text-ink-500">
                      {l.supplier_ref ?? "—"}
                    </td>
                    <td className="py-2.5 text-xs text-danger-600">
                      {l.error ?? ""}
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
