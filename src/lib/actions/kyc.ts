"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";

export type KycResult = { ok: true } | { ok: false; error: string };

const BUCKET = "kyc-documents";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

/** TC kimlik no doğrulaması — 11 hane + standart algoritma. */
function isValidTC(id: string): boolean {
  if (!/^[1-9][0-9]{10}$/.test(id)) return false;
  const d = id.split("").map(Number);
  const odd = d[0] + d[2] + d[4] + d[6] + d[8];
  const even = d[1] + d[3] + d[5] + d[7];
  const c10 = (odd * 7 - even) % 10;
  if (c10 !== d[9]) return false;
  const sum10 = d.slice(0, 10).reduce((a, b) => a + b, 0);
  return sum10 % 10 === d[10];
}

async function uploadDoc(
  t: (key: string) => string,
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
  side: "front" | "back",
  file: File,
): Promise<string> {
  if (!ALLOWED.includes(file.type)) {
    throw new Error(t("srv.ky.fileType"));
  }
  if (file.size > MAX_BYTES) {
    throw new Error(t("srv.ky.fileSize"));
  }
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${userId}/${side}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });
  if (error) throw new Error(t("srv.ky.uploadFailed"));
  return path;
}

/**
 * KYC başvurusu: kimlik bilgileri + ön/arka belge görselleri.
 * FormData ile çağrılır (dosya taşımak için). Service-role ile özel bucket'a yazar.
 */
export async function submitKyc(formData: FormData): Promise<KycResult> {
  const t = await getServerT();
  const submitSchema = z.object({
    fullName: z.string().trim().min(3, t("srv.ky.fullNameRequired")).max(80),
    nationalId: z.string().trim().refine(isValidTC, t("srv.ky.invalidTc")),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t("srv.ky.birthDateRequired")),
  });

  const parsed = submitSchema.safeParse({
    fullName: formData.get("fullName"),
    nationalId: formData.get("nationalId"),
    birthDate: formData.get("birthDate"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? t("srv.ky.invalid") };
  }

  const front = formData.get("docFront");
  const back = formData.get("docBack");
  if (!(front instanceof File) || front.size === 0) {
    return { ok: false, error: t("srv.ky.uploadFront") };
  }
  if (!(back instanceof File) || back.size === 0) {
    return { ok: false, error: t("srv.ky.uploadBack") };
  }

  const current = await requireMember();

  // Zaten onaylıysa tekrar göndermeye gerek yok.
  if (current.profile.kyc_status === "approved") {
    return { ok: false, error: t("srv.ky.alreadyApproved") };
  }
  if (current.profile.kyc_status === "pending") {
    return { ok: false, error: t("srv.ky.underReview") };
  }

  const supabase = await createAdminClient();

  let frontPath: string;
  let backPath: string;
  try {
    frontPath = await uploadDoc(t, supabase, current.user.id, "front", front);
    backPath = await uploadDoc(t, supabase, current.user.id, "back", back);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : t("srv.ky.uploadError") };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      kyc_status: "pending",
      kyc_full_name: parsed.data.fullName,
      kyc_national_id: parsed.data.nationalId,
      kyc_birth_date: parsed.data.birthDate,
      kyc_doc_front_path: frontPath,
      kyc_doc_back_path: backPath,
      kyc_submitted_at: new Date().toISOString(),
      kyc_reviewed_at: null,
      kyc_reject_reason: null,
    })
    .eq("id", current.user.id);

  if (error) return { ok: false, error: t("srv.ky.submitFailed") };

  revalidatePath("/account/settings");
  return { ok: true };
}
