import { requireAdmin } from "@/lib/auth/require-admin";
import { BroadcastForm } from "@/components/admin/broadcast-form";

export const dynamic = "force-dynamic";

export default async function AdminBroadcastPage() {
  await requireAdmin();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Duyuru Gönder</h1>
        <p className="mt-1 text-sm text-ink-500">
          Tüm kullanıcılara veya belirli bir kitleye toplu bildirim gönder.
        </p>
      </div>
      <BroadcastForm />
    </div>
  );
}
