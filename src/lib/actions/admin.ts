"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/server";
import { notify } from "@/lib/notifications";
import { sendEmail, emailTemplate } from "@/lib/email";
import type { UserRole } from "@/lib/supabase/types";

export type Result = { ok: true } | { ok: false; error: string };

/* ─────────────────────────── Kullanıcı yönetimi ────────────────────────── */

const roleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["owner", "admin", "member"]),
});

export async function setUserRole(
  input: z.infer<typeof roleSchema>,
): Promise<Result> {
  const parsed = roleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz istek." };
  const me = await requireAdmin();
  const supabase = await createAdminClient();

  // Kendi rolünü düşürmeyi engelle (owner kilitlenmesin).
  if (parsed.data.userId === me.user.id && parsed.data.role !== "owner") {
    return { ok: false, error: "Kendi yönetici rolünü değiştiremezsin." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role as UserRole })
    .eq("id", parsed.data.userId);
  if (error) return { ok: false, error: "Rol güncellenemedi." };
  revalidatePath("/admin/users");
  return { ok: true };
}

const banSchema = z.object({
  userId: z.string().uuid(),
  ban: z.boolean(),
  reason: z.string().trim().max(300).optional(),
});

export async function setUserBan(
  input: z.infer<typeof banSchema>,
): Promise<Result> {
  const parsed = banSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz istek." };
  const me = await requireAdmin();
  const supabase = await createAdminClient();

  if (parsed.data.userId === me.user.id) {
    return { ok: false, error: "Kendi hesabını askıya alamazsın." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      banned_at: parsed.data.ban ? new Date().toISOString() : null,
      ban_reason: parsed.data.ban ? parsed.data.reason || null : null,
    })
    .eq("id", parsed.data.userId);
  if (error) return { ok: false, error: "İşlem başarısız." };
  revalidatePath("/admin/users");
  return { ok: true };
}

/* ───────────────────────────── Finans / cüzdan ─────────────────────────── */

const adjustSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().refine((n) => n !== 0, "Tutar 0 olamaz.").max(1_000_000).min(-1_000_000),
  note: z.string().trim().max(160).optional(),
});

export async function adjustBalance(
  input: z.infer<typeof adjustSchema>,
): Promise<Result> {
  const parsed = adjustSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  await requireAdmin();
  const supabase = await createAdminClient();

  const { error } = await supabase.rpc("wallet_adjust", {
    p_user_id: parsed.data.userId,
    p_amount: parsed.data.amount,
    p_note: parsed.data.note || "Admin düzeltme",
  });
  if (error) {
    if (error.message?.includes("INSUFFICIENT_BALANCE"))
      return { ok: false, error: "Bakiye eksiye düşemez." };
    return { ok: false, error: "İşlem başarısız." };
  }

  // Bildirim
  await notify(supabase, {
    userId: parsed.data.userId,
    type: parsed.data.amount > 0 ? "wallet.topup" : "wallet.refund",
    title: parsed.data.amount > 0 ? "Cüzdanına bakiye eklendi" : "Cüzdanından düşüm yapıldı",
    body: parsed.data.note || "Yönetici tarafından bakiye düzeltmesi yapıldı.",
    link: "/wallet/transactions",
  });

  revalidatePath("/admin/finance");
  revalidatePath("/admin/users");
  return { ok: true };
}

/* ───────────────────────────── Destek (admin) ──────────────────────────── */

const adminReplySchema = z.object({
  ticketId: z.string().uuid(),
  body: z.string().trim().min(1, "Mesaj boş olamaz.").max(2000),
  // Yanıt sonrası durum
  status: z.enum(["answered", "resolved", "closed"]).optional(),
});

export async function adminReplyTicket(
  input: z.infer<typeof adminReplySchema>,
): Promise<Result> {
  const parsed = adminReplySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  const me = await requireAdmin();
  const supabase = await createAdminClient();

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id, user_id")
    .eq("id", parsed.data.ticketId)
    .maybeSingle();
  if (!ticket) return { ok: false, error: "Talep bulunamadı." };

  await supabase.from("support_messages").insert({
    ticket_id: parsed.data.ticketId,
    author_id: me.user.id,
    is_staff: true,
    body: parsed.data.body,
  });

  await supabase
    .from("support_tickets")
    .update({
      status: parsed.data.status ?? "answered",
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.ticketId);

  await notify(supabase, {
    userId: ticket.user_id,
    type: "system",
    title: "Destek talebine yanıt geldi",
    body: "Açık talebine destek ekibimiz yanıt verdi.",
    link: `/support/${parsed.data.ticketId}`,
  });

  revalidatePath("/admin/support");
  revalidatePath(`/support/${parsed.data.ticketId}`);
  return { ok: true };
}

const adminStatusSchema = z.object({
  ticketId: z.string().uuid(),
  status: z.enum(["open", "answered", "resolved", "closed"]),
});

export async function adminSetTicketStatus(
  input: z.infer<typeof adminStatusSchema>,
): Promise<Result> {
  const parsed = adminStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Geçersiz istek." };
  await requireAdmin();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.ticketId);
  if (error) return { ok: false, error: "Güncellenemedi." };
  revalidatePath("/admin/support");
  return { ok: true };
}

/* ───────────────────────────── Bildirim broadcast ──────────────────────── */

const broadcastSchema = z.object({
  title: z.string().trim().min(2, "Başlık gerekli.").max(120),
  body: z.string().trim().max(500).optional(),
  link: z.string().trim().max(200).optional(),
  // hedef kitle
  audience: z.enum(["all", "resellers", "members"]),
  // E-posta olarak da gönder (yalnızca pazarlama izni olanlara — KVKK).
  sendEmail: z.boolean().optional(),
});

export type BroadcastResult =
  | { ok: true; count: number; emailCount?: number }
  | { ok: false; error: string };

export async function broadcastNotification(
  input: z.infer<typeof broadcastSchema>,
): Promise<BroadcastResult> {
  const parsed = broadcastSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  await requireAdmin();
  const supabase = await createAdminClient();

  let q = supabase.from("profiles").select("id, email, marketing_opt_in");
  if (parsed.data.audience === "resellers") {
    q = q.eq("reseller_status", "approved");
  } else if (parsed.data.audience === "members") {
    q = q.eq("role", "member");
  }
  const { data: users } = await q;
  const audience =
    (users as { id: string; email: string | null; marketing_opt_in: boolean }[]) ??
    [];

  const rows = audience.map((u) => ({
    user_id: u.id,
    type: "promo" as const,
    title: parsed.data.title,
    body: parsed.data.body || null,
    link: parsed.data.link || null,
    metadata: {},
  }));
  if (rows.length === 0) return { ok: false, error: "Hedef kitlede kullanıcı yok." };

  // Toplu insert (büyük listede parçalı).
  const chunk = 500;
  for (let i = 0; i < rows.length; i += chunk) {
    const { error } = await supabase.from("notifications").insert(rows.slice(i, i + chunk));
    if (error) return { ok: false, error: "Gönderim başarısız." };
  }

  // E-posta olarak da gönder — yalnızca pazarlama izni olan ve gerçek
  // (sentetik olmayan) adreslere. KVKK: opt-out'a saygı şart.
  let emailCount = 0;
  if (parsed.data.sendEmail) {
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://epinfox.com";
    const recipients = audience.filter(
      (u) =>
        u.marketing_opt_in &&
        u.email &&
        !u.email.endsWith("@users.epinfox.com"),
    );
    const link = parsed.data.link
      ? parsed.data.link.startsWith("http")
        ? parsed.data.link
        : `${SITE_URL}${parsed.data.link}`
      : `${SITE_URL}/store`;
    const html = emailTemplate({
      heading: parsed.data.title,
      bodyHtml: (parsed.data.body || "").replace(/\n/g, "<br>"),
      cta: { label: "EpinFox'a Git", href: link },
    });
    const text = `${parsed.data.title}\n\n${parsed.data.body || ""}\n\n${link}`;

    // Resend'i boğmamak için küçük gruplar halinde, hatalar yutularak.
    for (const u of recipients) {
      const r = await sendEmail({
        to: u.email!,
        subject: parsed.data.title,
        text,
        html,
      }).catch(() => ({ ok: false }));
      if (r.ok) emailCount++;
    }
  }

  return { ok: true, count: rows.length, emailCount };
}

/* ───────────────────────────── Promo kodları ───────────────────────────── */

const promoSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(3, "Kod en az 3 karakter.").max(40),
  type: z.enum(["bonus_balance", "percent", "free_shipping"]),
  value: z.number().min(0).max(100000),
  description: z.string().trim().max(160).optional().nullable(),
  maxUses: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function savePromoCode(
  input: z.infer<typeof promoSchema>,
): Promise<Result> {
  const parsed = promoSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Geçersiz." };
  }
  await requireAdmin();
  const supabase = await createAdminClient();
  const d = parsed.data;
  const row = {
    code: d.code.toUpperCase(),
    type: d.type,
    value: d.value,
    description: d.description || null,
    max_uses: d.maxUses || null,
    expires_at: d.expiresAt || null,
    is_active: d.isActive,
  };

  if (d.id) {
    const { error } = await supabase.from("promo_codes").update(row).eq("id", d.id);
    if (error) return { ok: false, error: "Güncellenemedi." };
  } else {
    const { error } = await supabase.from("promo_codes").insert(row);
    if (error) {
      if (error.code === "23505") return { ok: false, error: "Bu kod zaten var." };
      return { ok: false, error: "Eklenemedi." };
    }
  }
  revalidatePath("/admin/promos");
  return { ok: true };
}

export async function togglePromoCode(input: {
  id: string;
  active: boolean;
}): Promise<Result> {
  const id = z.string().uuid().safeParse(input.id);
  if (!id.success) return { ok: false, error: "Geçersiz." };
  await requireAdmin();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("promo_codes")
    .update({ is_active: input.active })
    .eq("id", id.data);
  if (error) return { ok: false, error: "İşlem başarısız." };
  revalidatePath("/admin/promos");
  return { ok: true };
}

export async function deletePromoCode(input: { id: string }): Promise<Result> {
  const id = z.string().uuid().safeParse(input.id);
  if (!id.success) return { ok: false, error: "Geçersiz." };
  await requireAdmin();
  const supabase = await createAdminClient();
  const { error } = await supabase.from("promo_codes").delete().eq("id", id.data);
  if (error) return { ok: false, error: "Silinemedi." };
  revalidatePath("/admin/promos");
  return { ok: true };
}
