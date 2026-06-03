"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireMember } from "@/lib/auth/require-admin";
import { getServerT } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import type { SupportTicket, SupportMessage } from "@/lib/supabase/types";

const createSchema = z.object({
  subject: z.string().trim().min(4).max(120),
  category: z.enum(["general", "order", "wallet", "other"]),
  body: z.string().trim().min(5).max(2000),
  orderId: z.string().uuid().optional(),
});

export type CreateTicketResult =
  | { ok: true; ticketId: string }
  | { ok: false; error: string };

const SUPPORT_BUCKET = "support-attachments";
const ATTACH_ALLOWED = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
];
const ATTACH_MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ATTACH_MAX_COUNT = 4;

type StoredAttachment = { path: string; name: string; mime: string; size: number };

/** Talebe iliştirilen dosyaları özel bucket'a yükler; meta listesi döner. */
async function uploadAttachments(
  supabase: Awaited<ReturnType<typeof createAdminClient>>,
  userId: string,
  ticketId: string,
  files: File[],
): Promise<StoredAttachment[]> {
  const out: StoredAttachment[] = [];
  for (const file of files.slice(0, ATTACH_MAX_COUNT)) {
    if (!file || file.size === 0) continue;
    if (!ATTACH_ALLOWED.includes(file.type)) continue;
    if (file.size > ATTACH_MAX_BYTES) continue;
    const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80);
    const path = `${userId}/${ticketId}/${out.length}_${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage
      .from(SUPPORT_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: true });
    if (error) {
      console.error("support attachment upload error:", error.message);
      continue;
    }
    out.push({ path, name: safeName, mime: file.type, size: file.size });
  }
  return out;
}

/**
 * Yeni destek talebi + ilk mesaj. FormData (dosya ekleri için) veya düz nesne
 * ile çağrılabilir. FormData alanları: subject, category, body, orderId?, files[].
 */
export async function createTicket(
  input: z.infer<typeof createSchema> | FormData,
): Promise<CreateTicketResult> {
  const isForm = typeof FormData !== "undefined" && input instanceof FormData;
  const raw = isForm
    ? {
        subject: input.get("subject"),
        category: input.get("category"),
        body: input.get("body"),
        orderId: (input.get("orderId") as string) || undefined,
      }
    : input;
  const t = await getServerT();
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: t("srv.sp.fillAll") };

  const current = await requireMember();

  // Spam koruması: kullanıcı başına saatte en fazla 10 yeni talep.
  const allowed = await checkRateLimit(
    `support:create:${current.user.id}`,
    10,
    3600,
  );
  if (!allowed) return { ok: false, error: t("srv.sp.tooMany") };

  const supabase = await createAdminClient();

  // İlgili siparişin gerçekten bu kullanıcıya ait olduğunu doğrula.
  let orderId: string | null = null;
  if (parsed.data.orderId) {
    const { data: ord } = await supabase
      .from("orders")
      .select("id")
      .eq("id", parsed.data.orderId)
      .eq("user_id", current.user.id)
      .maybeSingle();
    orderId = ord?.id ?? null;
  }

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: current.user.id,
      subject: parsed.data.subject,
      category: parsed.data.category,
      status: "open",
      order_id: orderId,
    })
    .select("id")
    .single();

  if (error || !ticket) {
    console.error("createTicket error:", error?.message);
    return { ok: false, error: t("srv.sp.createFailed") };
  }

  // Dosya ekleri (FormData ile geldiyse) yüklenir.
  let attachments: StoredAttachment[] = [];
  if (isForm) {
    const files = input.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length) {
      attachments = await uploadAttachments(
        supabase,
        current.user.id,
        ticket.id as string,
        files,
      );
    }
  }

  await supabase.from("support_messages").insert({
    ticket_id: ticket.id,
    author_id: current.user.id,
    is_staff: false,
    body: parsed.data.body,
    attachments,
  });

  revalidatePath("/support");
  return { ok: true, ticketId: ticket.id as string };
}

const replySchema = z.object({
  ticketId: z.string().uuid(),
  body: z.string().trim().min(1).max(2000),
});

export type ReplyResult = { ok: true } | { ok: false; error: string };

/** Mevcut talebe kullanıcı yanıtı ekler. Sahiplik RPC değil app-code'da doğrulanır. */
export async function replyTicket(
  input: z.infer<typeof replySchema>,
): Promise<ReplyResult> {
  const t = await getServerT();
  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: t("srv.sp.msgInvalid") };

  const current = await requireMember();
  const supabase = await createAdminClient();

  // Sahiplik kontrolü
  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id, user_id, status")
    .eq("id", parsed.data.ticketId)
    .maybeSingle();

  if (!ticket || ticket.user_id !== current.user.id) {
    return { ok: false, error: t("srv.sp.notFound") };
  }
  if (ticket.status === "closed") {
    return { ok: false, error: t("srv.sp.closed") };
  }

  await supabase.from("support_messages").insert({
    ticket_id: parsed.data.ticketId,
    author_id: current.user.id,
    is_staff: false,
    body: parsed.data.body,
  });

  // Kullanıcı yanıt verince durum tekrar "open"
  await supabase
    .from("support_tickets")
    .update({ status: "open", updated_at: new Date().toISOString() })
    .eq("id", parsed.data.ticketId);

  revalidatePath(`/support/${parsed.data.ticketId}`);
  revalidatePath("/support");
  return { ok: true };
}

const statusSchema = z.object({
  ticketId: z.string().uuid(),
  action: z.enum(["close", "reopen"]),
});

export type StatusResult = { ok: true } | { ok: false; error: string };

/**
 * Kullanıcı kendi talebini kapatır (close) veya kapalı talebi yeniden açar
 * (reopen). Diğer durum geçişleri (answered/resolved) destek ekibinindir.
 */
export async function setTicketStatus(
  input: z.infer<typeof statusSchema>,
): Promise<StatusResult> {
  const t = await getServerT();
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: t("srv.sp.badRequest") };

  const current = await requireMember();
  const supabase = await createAdminClient();

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id, user_id, status")
    .eq("id", parsed.data.ticketId)
    .maybeSingle();

  if (!ticket || ticket.user_id !== current.user.id) {
    return { ok: false, error: t("srv.sp.notFound") };
  }

  if (parsed.data.action === "close" && ticket.status === "closed") {
    return { ok: false, error: t("srv.sp.alreadyClosed") };
  }
  if (parsed.data.action === "reopen" && ticket.status !== "closed") {
    return { ok: false, error: t("srv.sp.alreadyOpen") };
  }

  const nextStatus = parsed.data.action === "close" ? "closed" : "open";

  // Yeniden açışta sisteme bilgi mesajı ekle (geçmiş izi).
  if (parsed.data.action === "reopen") {
    await supabase.from("support_messages").insert({
      ticket_id: parsed.data.ticketId,
      author_id: current.user.id,
      is_staff: false,
      body: t("srv.sp.reopened"),
    });
  }

  await supabase
    .from("support_tickets")
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.ticketId);

  revalidatePath(`/support/${parsed.data.ticketId}`);
  revalidatePath("/support");
  return { ok: true };
}

/** Tek talebi + mesajlarını döndürür (sahiplik doğrulamalı). */
export async function getTicketWithMessages(
  ticketId: string,
): Promise<{ ticket: SupportTicket; messages: SupportMessage[] } | null> {
  const current = await requireMember();
  const supabase = await createAdminClient();

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("id", ticketId)
    .eq("user_id", current.user.id)
    .maybeSingle();
  if (!ticket) return null;

  const { data: messages } = await supabase
    .from("support_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  // Ek dosyalar için imzalı URL üret (bucket private). 1 saat geçerli.
  const list = (messages as SupportMessage[]) ?? [];
  for (const m of list) {
    const atts = (m as unknown as { attachments?: StoredAttachment[] }).attachments;
    if (!atts?.length) continue;
    for (const a of atts) {
      const { data: signed } = await supabase.storage
        .from(SUPPORT_BUCKET)
        .createSignedUrl(a.path, 3600);
      (a as StoredAttachment & { url?: string }).url = signed?.signedUrl;
    }
  }

  return {
    ticket: ticket as SupportTicket,
    messages: list,
  };
}
