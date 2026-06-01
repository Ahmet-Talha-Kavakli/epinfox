"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";

export type ProfileResult =
  | { ok: true }
  | { ok: false; error: string };

export async function updateNickname(
  input: { nickname: string },
): Promise<ProfileResult> {
  const t = await getServerT();
  const nicknameSchema = z.object({
    nickname: z
      .string()
      .trim()
      .min(3, t("srv.pr.nicknameMin"))
      .max(32, t("srv.pr.nicknameMax"))
      .regex(/^[a-zA-Z0-9._-]+$/, t("srv.pr.nicknameChars")),
  });

  const parsed = nicknameSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t("srv.pr.invalid") };
  }
  const current = await requireMember();
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("profiles")
    .update({ nickname: parsed.data.nickname })
    .eq("id", current.user.id);

  if (error) {
    if (error.code === "23505")
      return { ok: false, error: t("srv.pr.nicknameTaken") };
    return { ok: false, error: t("srv.pr.updateFailed") };
  }
  revalidatePath("/account");
  return { ok: true };
}

export async function updateAvatar(
  input: { avatarPath: string | null },
): Promise<ProfileResult> {
  const t = await getServerT();
  // avatar_path: "fox:<1-8>" (tilki), "color:<key>" (renk) veya "url:<https...>" (foto)
  const avatarSchema = z.object({
    avatarPath: z
      .string()
      .max(500)
      .nullable()
      .refine(
        (v) =>
          v === null ||
          /^fox:[1-8]$/.test(v) ||
          /^color:[a-z]+$/.test(v) ||
          /^url:https:\/\/.+/.test(v),
        t("srv.pr.invalidAvatar"),
      ),
  });

  const parsed = avatarSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: t("srv.pr.invalidAvatar") };

  const current = await requireMember();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_path: parsed.data.avatarPath })
    .eq("id", current.user.id);

  if (error) return { ok: false, error: t("srv.pr.updateFailed") };
  revalidatePath("/account");
  return { ok: true };
}

// ─── Profil alanları (ad soyad, telefon, doğum, pazarlama tercihi) ───────────
export async function updateProfileFields(
  input: {
    fullName: string | null;
    phone: string | null;
    birthDate: string | null;
    marketingOptIn: boolean;
  },
): Promise<ProfileResult> {
  const t = await getServerT();
  const profileFieldsSchema = z.object({
    fullName: z.string().trim().max(80).nullable(),
    phone: z
      .string()
      .trim()
      .max(20)
      .regex(/^[0-9+()\s-]*$/, t("srv.pr.invalidPhone"))
      .nullable(),
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, t("srv.pr.invalidDate"))
      .nullable(),
    marketingOptIn: z.boolean(),
  });

  const parsed = profileFieldsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t("srv.pr.invalid") };
  }
  const current = await requireMember();
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName || null,
      phone: parsed.data.phone || null,
      birth_date: parsed.data.birthDate || null,
      marketing_opt_in: parsed.data.marketingOptIn,
    })
    .eq("id", current.user.id);

  if (error) return { ok: false, error: t("srv.pr.updateFailed") };
  revalidatePath("/account/settings");
  return { ok: true };
}
