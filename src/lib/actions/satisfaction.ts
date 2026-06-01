"use server";

import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
  path: z.string().trim().max(200).optional(),
});

export type SatisfactionResult = { ok: true } | { ok: false; error: string };

/** Memnuniyet anketi gönderimi (misafir de gönderebilir). */
export async function submitSatisfaction(
  input: z.infer<typeof schema>,
): Promise<SatisfactionResult> {
  const t = await getServerT();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: t("srv.sa.invalidRating") };

  let userId: string | null = null;
  try {
    const current = await getCurrentUser();
    userId = current?.user.id ?? null;
  } catch {
    /* misafir */
  }

  const supabase = await createAdminClient();
  const { error } = await supabase.from("satisfaction_feedback").insert({
    user_id: userId,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
    path: parsed.data.path || null,
  });
  if (error) {
    console.error("submitSatisfaction error:", error.message);
    return { ok: false, error: t("srv.sa.sendFailed") };
  }
  return { ok: true };
}
