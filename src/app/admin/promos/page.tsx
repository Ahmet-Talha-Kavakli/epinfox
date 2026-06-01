import { createAdminClient } from "@/lib/supabase/server";
import { PromosManager } from "@/components/admin/promos-manager";
import type { PromoCode } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminPromosPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  const promos = (data as PromoCode[]) ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Promo Kodlar</h1>
        <p className="mt-1 text-sm text-ink-500">
          İndirim ve bonus kodları oluştur, düzenle, aktif/pasif yap.
        </p>
      </div>
      <PromosManager promos={promos} />
    </div>
  );
}
