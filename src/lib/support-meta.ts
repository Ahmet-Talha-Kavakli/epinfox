import type { TicketStatus, TicketCategory } from "@/lib/supabase/types";

// label = TR fallback (ör. admin paneli). labelKey/statusKey = i18n anahtarı.
export const TICKET_CATEGORIES: {
  value: TicketCategory;
  label: string;
  labelKey: string;
}[] = [
  { value: "general", label: "Genel", labelKey: "sup.tickets.cat.general" },
  { value: "order", label: "Sipariş / Kod", labelKey: "sup.tickets.cat.order" },
  { value: "wallet", label: "Cüzdan / Bakiye", labelKey: "sup.tickets.cat.wallet" },
  { value: "other", label: "Diğer", labelKey: "sup.tickets.cat.other" },
];

/** Destek talebi durumu → etiket + renk (liste ve detay sayfası ortak). */
export const TICKET_STATUS_META: Record<
  TicketStatus,
  { label: string; statusKey: string; cls: string }
> = {
  open: { label: "Açık", statusKey: "sup.tickets.status.open", cls: "bg-brand-50 text-brand-700" },
  answered: { label: "Yanıtlandı", statusKey: "sup.tickets.status.answered", cls: "bg-success-50 text-success-700" },
  resolved: { label: "Çözüldü", statusKey: "sup.tickets.status.resolved", cls: "bg-ink-100 text-ink-600" },
  closed: { label: "Kapalı", statusKey: "sup.tickets.status.closed", cls: "bg-ink-100 text-ink-500" },
};
