"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleNotch, XCircle, ArrowClockwise } from "@phosphor-icons/react";
import { setTicketStatus } from "@/lib/actions/support";
import { TICKET_STATUS_META } from "@/lib/support-meta";
import type { TicketStatus } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

/** Talep durumu rozeti + kullanıcının kapat / yeniden aç aksiyonu. */
export function TicketStatusActions({
  ticketId,
  status,
}: {
  ticketId: string;
  status: TicketStatus;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [pending, start] = useTransition();
  const st = TICKET_STATUS_META[status];
  const isClosed = status === "closed";

  function run(action: "close" | "reopen") {
    start(async () => {
      const r = await setTicketStatus({ ticketId, action });
      if (r.ok) router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium",
          st.cls,
        )}
      >
        {t(st.statusKey)}
      </span>
      <button
        type="button"
        onClick={() => run(isClosed ? "reopen" : "close")}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50",
          isClosed
            ? "border-brand-300 text-brand-700 hover:bg-brand-50"
            : "border-ink-200 text-ink-600 hover:bg-ink-50",
        )}
      >
        {pending ? (
          <CircleNotch size={15} className="animate-spin" />
        ) : isClosed ? (
          <ArrowClockwise size={15} weight="bold" />
        ) : (
          <XCircle size={15} weight="bold" />
        )}
        {isClosed ? t("sup.tickets.reopen") : t("sup.tickets.closeTicket")}
      </button>
    </div>
  );
}
