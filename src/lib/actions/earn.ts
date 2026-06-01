"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember, requireAdmin } from "@/lib/auth/require-admin";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";
import { notify, notifyAdmins } from "@/lib/notifications";
import { EARN_PLATFORMS } from "@/lib/earn-platforms";

const EARN_BUCKET = "earn-attachments";
const ATTACH_ALLOWED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const ATTACH_MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ATTACH_MAX_COUNT = 3;

type StoredAttachment = { path: string; name: string; mime: string; size: number };

const submitSchema = z.object({
  platform: z.enum(EARN_PLATFORMS),
  // Sentinel anahtar; submitEarn içinde getServerT ile çevrilir.
  contentUrl: z.string().trim().url("srv.ea.urlInvalid").max(500),
  note: z.string().trim().max(500).optional(),
});

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/** Kanıt görsellerini özel bucket'a yükler. */
async function uploadProofs(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
  submissionId: string,
  files: File[],
): Promise<StoredAttachment[]> {
  const out: StoredAttachment[] = [];
  for (const file of files.slice(0, ATTACH_MAX_COUNT)) {
    if (!file || file.size === 0) continue;
    if (!ATTACH_ALLOWED.includes(file.type)) continue;
    if (file.size > ATTACH_MAX_BYTES) continue;
    const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
    const path = `${userId}/${submissionId}/${out.length}_${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(EARN_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: true });
    if (error) {
      console.error("earn proof upload error:", error.message);
      continue;
    }
    out.push({ path, name: safeName, mime: file.type, size: file.size });
  }
  return out;
}

/** Kullanıcı yeni bir içerik paylaşımı gönderir (FormData: platform, contentUrl, note, files[]). */
export async function submitEarn(formData: FormData): Promise<SubmitResult> {
  const t = await getServerT();
  const current = await requireMember();
  const supabase = await createAdminClient();

  const parsed = submitSchema.safeParse({
    platform: formData.get("platform"),
    contentUrl: formData.get("contentUrl"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) {
    const key = parsed.error.issues[0]?.message;
    return { ok: false, error: key ? t(key) : t("srv.ea.invalidData") };
  }
  const { platform, contentUrl, note } = parsed.data;

  // Aynı linki tekrar göndermeyi engelle (kullanıcı bazında).
  const { data: dup } = await supabase
    .from("earn_submissions")
    .select("id")
    .eq("user_id", current.user.id)
    .eq("content_url", contentUrl)
    .maybeSingle();
  if (dup) {
    return { ok: false, error: t("srv.ea.duplicate") };
  }

  // Önce kayıt (id lazım → dosya yolu), sonra kanıtlar.
  const { data: inserted, error: insErr } = await supabase
    .from("earn_submissions")
    .insert({
      user_id: current.user.id,
      platform,
      content_url: contentUrl,
      note: note ?? null,
      status: "pending",
    })
    .select("id")
    .maybeSingle();
  if (insErr || !inserted) {
    return { ok: false, error: t("srv.ea.submitFailed") };
  }
  const id = inserted.id as string;

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length) {
    const atts = await uploadProofs(supabase, current.user.id, id, files);
    if (atts.length) {
      await supabase.from("earn_submissions").update({ attachments: atts }).eq("id", id);
    }
  }

  // Adminlere bilgi (best-effort).
  await notifyAdmins(supabase, {
    type: "system",
    title: t("srv.ea.adminTitle"),
    body: t("srv.ea.adminBody")
      .replace("{nickname}", current.nickname)
      .replace("{platform}", platform),
    link: "/admin/earn",
    titleKey: "srv.ea.adminTitle",
    bodyKey: "srv.ea.adminBody",
    params: { nickname: current.nickname, platform },
  });

  revalidatePath("/earn");
  revalidatePath("/admin/earn");
  return { ok: true, id };
}

export type DecideResult = { ok: true } | { ok: false; error: string };

/** Admin: başvuruyu onayla (ödül ver) veya reddet. */
export async function decideEarn(input: {
  submissionId: string;
  approve: boolean;
  reward?: number;
  rejectReason?: string;
}): Promise<DecideResult> {
  await requireAdmin();
  const t = await getServerT();
  const supabase = await createAdminClient();

  const { data: sub } = await supabase
    .from("earn_submissions")
    .select("id, user_id, platform, status")
    .eq("id", input.submissionId)
    .maybeSingle();
  if (!sub) return { ok: false, error: t("srv.ea.notFound") };
  if (sub.status !== "pending") {
    return { ok: false, error: t("srv.ea.alreadyHandled") };
  }

  if (input.approve) {
    const reward = Math.max(0, Math.round(Number(input.reward ?? 0) * 100) / 100);
    const { data: ok, error } = await supabase.rpc("approve_earn_submission", {
      p_submission_id: input.submissionId,
      p_reward: reward,
    });
    if (error || ok !== true) {
      return { ok: false, error: t("srv.ea.approveFailed") };
    }
    const rewardStr = `${reward.toLocaleString("tr-TR")}₺`;
    await notify(supabase, {
      userId: sub.user_id,
      type: "promo",
      title: t("srv.ea.approvedTitle"),
      body:
        reward > 0
          ? t("srv.ea.approvedBodyReward").replace("{reward}", rewardStr)
          : t("srv.ea.approvedBodyNoReward"),
      link: "/wallet",
      titleKey: "srv.ea.approvedTitle",
      bodyKey: reward > 0 ? "srv.ea.approvedBodyReward" : "srv.ea.approvedBodyNoReward",
      ...(reward > 0 ? { params: { reward: rewardStr } } : {}),
    });
  } else {
    const { error } = await supabase
      .from("earn_submissions")
      .update({
        status: "rejected",
        reject_reason: input.rejectReason?.trim() || t("srv.ea.rejectDefault"),
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", input.submissionId);
    if (error) return { ok: false, error: t("srv.ea.rejectFailed") };
    await notify(supabase, {
      userId: sub.user_id,
      type: "system",
      title: t("srv.ea.rejectedTitle"),
      body: input.rejectReason?.trim() || t("srv.ea.rejectedBody"),
      link: "/earn",
      titleKey: "srv.ea.rejectedTitle",
    });
  }

  revalidatePath("/admin/earn");
  revalidatePath("/earn");
  return { ok: true };
}
