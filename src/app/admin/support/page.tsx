import { createAdminClient } from "@/lib/supabase/server";
import { SupportManager, type AdminTicket } from "@/components/admin/support-manager";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("support_tickets")
    .select(
      "id, subject, category, status, created_at, updated_at, user:profiles!support_tickets_user_id_fkey(nickname, email), messages:support_messages(id, is_staff, body, created_at)",
    )
    .order("updated_at", { ascending: false })
    .limit(200);

  const raw = (data as unknown as AdminTicket[]) ?? [];
  // Mesajları kronolojik sırala (Supabase ilişki sırası garantisiz).
  const tickets = raw.map((t) => ({
    ...t,
    messages: [...(t.messages ?? [])].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    ),
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Destek Talepleri</h1>
        <p className="mt-1 text-sm text-ink-500">
          Müşteri taleplerini görüntüle, yanıtla ve durumlarını yönet.
        </p>
      </div>
      <SupportManager tickets={tickets} />
    </div>
  );
}
