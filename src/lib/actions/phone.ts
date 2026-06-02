"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";

export type PhoneSyncResult =
  | { ok: true; verified: boolean }
  | { ok: false; error: string };

/**
 * Kullanıcı telefonu Clerk'te (client tarafı useUser ile) ekleyip kod ile
 * doğruladıktan SONRA çağrılır. Clerk'teki primary phone'un verified durumunu
 * Supabase profiles.phone_verified_at + phone alanına senkronlar.
 *
 * Tek kaynak Clerk; biz sadece yansıtırız. Idempotent.
 * Desen: lib/actions/steam-email.ts + lib/auth/current-user.ts.
 */
export async function syncPhoneVerified(): Promise<PhoneSyncResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthorized" };

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    const primary = user.primaryPhoneNumber;
    const verified = primary?.verification?.status === "verified";

    const supabase = await createAdminClient();
    await supabase
      .from("profiles")
      .update({
        phone_verified_at: verified ? new Date().toISOString() : null,
        ...(verified && primary?.phoneNumber ? { phone: primary.phoneNumber } : {}),
      })
      .eq("clerk_user_id", userId);

    return { ok: true, verified };
  } catch (e) {
    console.error("syncPhoneVerified failed:", e);
    return { ok: false, error: "server_error" };
  }
}
