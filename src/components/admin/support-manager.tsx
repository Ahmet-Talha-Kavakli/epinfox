"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  PaperPlaneRight,
  CircleNotch,
  Headset,
  CheckCircle,
  Lock,
} from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminReplyTicket, adminSetTicketStatus } from "@/lib/actions/admin";
import { TICKET_STATUS_META, TICKET_CATEGORIES } from "@/lib/support-meta";
import { cn } from "@/lib/utils";
import type { TicketStatus } from "@/lib/supabase/types";

const CATEGORY_LABEL = Object.fromEntries(
  TICKET_CATEGORIES.map((c) => [c.value, c.label]),
) as Record<string, string>;

export interface AdminTicket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  user: { nickname: string; email: string } | null;
  messages: { id: string; is_staff: boolean; body: string; created_at: string }[];
}

function fmt(d: string) {
  return new Date(d).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function SupportManager({ tickets }: { tickets: AdminTicket[] }) {
  const [activeId, setActiveId] = useState<string | null>(tickets[0]?.id ?? null);
  const [filter, setFilter] = useState<"all" | TicketStatus>("all");

  const visible = useMemo(
    () => tickets.filter((t) => filter === "all" || t.status === filter),
    [tickets, filter],
  );
  const active = tickets.find((t) => t.id === activeId) ?? null;

  const chips: { key: "all" | TicketStatus; label: string }[] = [
    { key: "all", label: "Tümü" },
    { key: "open", label: "Açık" },
    { key: "answered", label: "Yanıtlandı" },
    { key: "resolved", label: "Çözüldü" },
    { key: "closed", label: "Kapalı" },
  ];

  return (
    <div className="grid h-[calc(100vh-13rem)] min-h-[480px] grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
      {/* Sol: liste */}
      <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white">
        <div className="flex flex-wrap gap-1 border-b border-ink-200 p-2">
          {chips.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                filter === c.key ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {visible.length === 0 ? (
            <p className="p-6 text-center text-sm text-ink-400">Talep yok.</p>
          ) : (
            visible.map((t) => {
              const st = TICKET_STATUS_META[t.status];
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-ink-100 px-4 py-3 text-left transition-colors",
                    activeId === t.id ? "bg-brand-50" : "hover:bg-ink-50",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-ink-900">{t.subject}</span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}>{st.label}</span>
                  </div>
                  <span className="truncate text-xs text-ink-400">
                    {t.user?.nickname ?? "—"} · {CATEGORY_LABEL[t.category] ?? "Genel"} · {fmt(t.updated_at)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Sağ: detay + yanıt */}
      <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white">
        {active ? (
          <TicketDetail key={active.id} t={active} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center text-ink-400">
            <Headset size={40} weight="duotone" />
            <p className="mt-3 text-sm">Soldan bir talep seç.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TicketDetail({ t }: { t: AdminTicket }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [resolveAfter, setResolveAfter] = useState(false);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function send() {
    if (!body.trim()) return;
    setErr(null);
    start(async () => {
      const r = await adminReplyTicket({
        ticketId: t.id,
        body,
        status: resolveAfter ? "resolved" : "answered",
      });
      if (r.ok) {
        setBody("");
        router.refresh();
      } else setErr(r.error);
    });
  }

  function setStatus(status: TicketStatus) {
    start(async () => {
      const r = await adminSetTicketStatus({ ticketId: t.id, status });
      if (r.ok) router.refresh();
      else setErr(r.error);
    });
  }

  const closed = t.status === "closed";

  return (
    <>
      {/* Başlık */}
      <div className="flex items-center justify-between gap-3 border-b border-ink-200 px-5 py-3.5">
        <div className="min-w-0">
          <p className="truncate font-bold text-ink-900">{t.subject}</p>
          <p className="truncate text-xs text-ink-400">
            {t.user?.nickname} ({t.user?.email}) · {CATEGORY_LABEL[t.category] ?? "Genel"}
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Button onClick={() => setStatus("resolved")} disabled={pending} size="sm" variant="outline">
            <CheckCircle size={14} weight="fill" /> Çözüldü
          </Button>
          <Button onClick={() => setStatus(closed ? "open" : "closed")} disabled={pending} size="sm" variant="ghost">
            <Lock size={14} weight="fill" /> {closed ? "Aç" : "Kapat"}
          </Button>
        </div>
      </div>

      {/* Mesajlar */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-ink-50/40 p-5">
        {t.messages.map((m) => (
          <div key={m.id} className={cn("flex", m.is_staff ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                m.is_staff ? "rounded-br-md bg-brand-600 text-white" : "rounded-bl-md border border-ink-200 bg-white text-ink-800",
              )}
            >
              <p>{m.body}</p>
              <p className={cn("mt-1 text-right text-[10px]", m.is_staff ? "text-white/70" : "text-ink-400")}>
                {m.is_staff ? "Destek" : "Müşteri"} · {fmt(m.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Yanıt */}
      {closed ? (
        <div className="border-t border-ink-200 px-5 py-4 text-center text-sm text-ink-400">
          Bu talep kapalı. Yanıtlamak için yukarıdan “Aç”.
        </div>
      ) : (
        <div className="border-t border-ink-200 px-4 py-3">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Yanıtını yaz…"
            disabled={pending}
          />
          {err && <p className="mt-1 text-xs font-medium text-danger-600">{err}</p>}
          <div className="mt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setResolveAfter((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-ink-600"
            >
              <span className={cn("grid h-4 w-4 place-items-center rounded border", resolveAfter ? "border-brand-600 bg-brand-600 text-white" : "border-ink-300")}>
                {resolveAfter && <CheckCircle size={11} weight="fill" />}
              </span>
              Yanıtla ve çözüldü işaretle
            </button>
            <Button onClick={send} disabled={pending || !body.trim()} size="sm">
              {pending ? <CircleNotch size={15} className="animate-spin" /> : <PaperPlaneRight size={15} weight="fill" />}
              Gönder
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
