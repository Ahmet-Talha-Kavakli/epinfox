"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember, requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { notify } from "@/lib/notifications";

type Result = { ok: true } | { ok: false; error: string };

const applySchema = z.object({
  platform: z.string().trim().min(1, "Platform seç."),
  tier: z.string().trim().min(1, "Takipçi kademesi seç."),
  streamUrl: z.string().trim().url("Geçerli bir yayın adresi gir."),
  pageTitle: z.string().trim().min(2, "Sayfa başlığı gir.").max(60),
  minDonation: z.number().min(5).max(10000),
  alertProvider: z.string().trim().max(60).optional().nullable(),
});

/** Yayıncı başvurusu — DB'ye yazar, profil durumunu 'pending' yapar. */
export async function applyForPublisher(
  input: z.infer<typeof applySchema>,
): Promise<Result> {
  const parsed = applySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz form." };
  }
  const current = await requireMember();
  const supabase = await createAdminClient();
  const d = parsed.data;

  // Zaten bekleyen başvuru var mı?
  const { data: existing } = await supabase
    .from("publisher_applications")
    .select("id, status")
    .eq("user_id", current.user.id)
    .eq("status", "pending")
    .maybeSingle();
  if (existing) {
    return { ok: false, error: "Zaten bekleyen bir başvurun var." };
  }

  const { error } = await supabase.from("publisher_applications").insert({
    user_id: current.user.id,
    platform: d.platform,
    tier: d.tier,
    stream_url: d.streamUrl,
    page_title: d.pageTitle,
    min_donation: d.minDonation,
    alert_provider: d.alertProvider || null,
  });
  if (error) {
    console.error("applyForPublisher error:", error.message);
    return { ok: false, error: "Başvuru kaydedilemedi, tekrar dene." };
  }

  await supabase
    .from("profiles")
    .update({ publisher_status: "pending" })
    .eq("id", current.user.id);

  revalidatePath("/publisher/apply");
  revalidatePath("/admin/publishers");
  return { ok: true };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "yayinci";

/** Admin: başvuruyu onayla → publishers'a ekle, veya reddet. */
export async function decidePublisherApplication(input: {
  applicationId: string;
  decision: "approve" | "reject";
  rejectReason?: string;
}): Promise<Result> {
  const id = z.string().uuid().safeParse(input.applicationId);
  if (!id.success) return { ok: false, error: "Geçersiz." };
  await requireAdmin();
  const supabase = await createAdminClient();

  const { data: app } = await supabase
    .from("publisher_applications")
    .select("*")
    .eq("id", id.data)
    .maybeSingle();
  if (!app) return { ok: false, error: "Başvuru bulunamadı." };

  if (input.decision === "reject") {
    await supabase
      .from("publisher_applications")
      .update({
        status: "rejected",
        reject_reason: input.rejectReason || "Belirtilmedi",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id.data);
    await supabase
      .from("profiles")
      .update({ publisher_status: "rejected" })
      .eq("id", app.user_id);
    await notify(supabase, {
      userId: app.user_id,
      type: "system",
      title: "Yayıncı başvurun değerlendirildi",
      body: `Başvurun onaylanmadı. Sebep: ${input.rejectReason || "Belirtilmedi"}`,
    });
    revalidatePath("/admin/publishers");
    return { ok: true };
  }

  // Onay → benzersiz slug üret + publishers'a ekle
  let slug = slugify(app.page_title);
  const { data: clash } = await supabase
    .from("publishers")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (clash) slug = `${slug}-${app.id.slice(0, 4)}`;

  const { error: insErr } = await supabase.from("publishers").insert({
    user_id: app.user_id,
    slug,
    name: app.page_title,
    platform: app.platform,
    stream_url: app.stream_url,
    min_donation: app.min_donation,
    is_active: true,
  });
  if (insErr) {
    console.error("publisher insert error:", insErr.message);
    return { ok: false, error: "Yayıncı oluşturulamadı." };
  }

  await supabase
    .from("publisher_applications")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", id.data);
  await supabase
    .from("profiles")
    .update({ publisher_status: "approved" })
    .eq("id", app.user_id);
  await notify(supabase, {
    userId: app.user_id,
    type: "system",
    title: "Yayıncı başvurun onaylandı! 🎉",
    body: "Tebrikler! Yayıncı sayfan oluşturuldu.",
    link: `/publisher/${slug}`,
  });

  revalidatePath("/admin/publishers");
  revalidatePath("/publisher");
  return { ok: true };
}
