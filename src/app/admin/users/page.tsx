import { createAdminClient } from "@/lib/supabase/server";
import { UsersManager, type AdminUserRow } from "@/components/admin/users-manager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, nickname, email, role, balance, avatar_path, joined_at, banned_at, reseller_status")
    .order("joined_at", { ascending: false })
    .limit(500);

  const users = (data as AdminUserRow[]) ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Kullanıcılar</h1>
        <p className="mt-1 text-sm text-ink-500">
          Üyeleri ara, rolünü değiştir, bakiyesini düzelt veya hesabı askıya al.
        </p>
      </div>
      <UsersManager users={users} />
    </div>
  );
}
