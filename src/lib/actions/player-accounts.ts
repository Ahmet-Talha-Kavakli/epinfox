"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";

export interface PlayerAccount {
  id: string;
  platform: string;
  label: string | null;
  value: string;
  updated_at: string;
}

export type SaveResult = { ok: true } | { ok: false; error: string };

/** Kullanıcının tüm kayıtlı hesapları (giriş yoksa boş). */
export async function getMyPlayerAccounts(): Promise<PlayerAccount[]> {
  const current = await getCurrentUser();
  if (!current) return [];
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("player_accounts")
    .select("id, platform, label, value, updated_at")
    .eq("user_id", current.user.id)
    .order("updated_at", { ascending: false });
  return (data as PlayerAccount[]) ?? [];
}

/**
 * Belirli bir platformun kayıtlı değerini döndürür (giriş yoksa null).
 * Sipariş ekranında otomatik doldurma için kullanılır.
 */
export async function getPlayerAccountFor(
  platform: string,
): Promise<string | null> {
  const current = await getCurrentUser();
  if (!current || !platform) return null;
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("player_accounts")
    .select("value")
    .eq("user_id", current.user.id)
    .eq("platform", platform)
    .maybeSingle();
  return (data?.value as string | undefined) ?? null;
}

/** Bir platformun hesabını kaydet/güncelle (upsert, platform başına tek kayıt). */
export async function savePlayerAccount(input: {
  platform: string;
  label?: string;
  value: string;
}): Promise<SaveResult> {
  const t = await getServerT();
  const saveSchema = z.object({
    platform: z.string().trim().min(1).max(60),
    label: z.string().trim().max(80).optional(),
    value: z.string().trim().min(1, t("srv.pl.valueRequired")).max(300),
  });

  const current = await requireMember();
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t("srv.pl.invalid") };
  }
  const { platform, label, value } = parsed.data;
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("player_accounts")
    .upsert(
      {
        user_id: current.user.id,
        platform,
        label: label ?? null,
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,platform" },
    );
  if (error) return { ok: false, error: t("srv.pl.saveFailed") };

  revalidatePath("/account/player-ids");
  return { ok: true };
}

/** Bir kayıtlı hesabı sil. */
export async function deletePlayerAccount(id: string): Promise<SaveResult> {
  const t = await getServerT();
  const current = await requireMember();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("player_accounts")
    .delete()
    .eq("id", id)
    .eq("user_id", current.user.id); // sahiplik
  if (error) return { ok: false, error: t("srv.pl.deleteFailed") };
  revalidatePath("/account/player-ids");
  return { ok: true };
}
