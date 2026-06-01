"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/auth/require-admin";

export async function markNotificationRead(formData: FormData) {
  const current = await requireMember();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;

  const supabase = await createAdminClient();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", current.user.id)
    .is("read_at", null);

  revalidatePath("/notifications");
}

export async function markAllNotificationsRead() {
  const current = await requireMember();
  const supabase = await createAdminClient();
  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", current.user.id)
    .is("read_at", null);

  revalidatePath("/notifications");
}
