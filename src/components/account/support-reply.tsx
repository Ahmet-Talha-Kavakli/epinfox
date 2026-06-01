"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PaperPlaneRight, CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { replyTicket } from "@/lib/actions/support";
import { useI18n } from "@/lib/i18n/provider";

export function SupportReply({
  ticketId,
  closed,
}: {
  ticketId: string;
  closed: boolean;
}) {
  const router = useRouter();
  const { t } = useI18n();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (closed) {
    return (
      <p className="rounded-xl border border-dashed border-ink-200 py-4 text-center text-sm text-ink-400">
        {t("sup.tickets.closedNotice1")}{" "}
        <span className="font-medium text-ink-600">{t("sup.tickets.closedNoticeBtn")}</span>{" "}
        {t("sup.tickets.closedNotice2")}
      </p>
    );
  }

  function send() {
    setError(null);
    start(async () => {
      const r = await replyTicket({ ticketId, body });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setBody("");
      router.refresh();
    });
  }

  return (
    <div>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder={t("sup.tickets.replyPlaceholder")}
        disabled={pending}
      />
      {error && (
        <p className="mt-2 text-sm font-medium text-danger-600">{error}</p>
      )}
      <div className="mt-2 flex justify-end">
        <Button onClick={send} disabled={pending || body.trim().length < 1} size="sm">
          {pending ? (
            <CircleNotch size={16} className="animate-spin" />
          ) : (
            <PaperPlaneRight size={16} weight="fill" />
          )}
          {t("sup.tickets.send")}
        </Button>
      </div>
    </div>
  );
}
