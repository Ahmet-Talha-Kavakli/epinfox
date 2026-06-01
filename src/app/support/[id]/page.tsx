import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Headset } from "@phosphor-icons/react/dist/ssr";
import { requireMember } from "@/lib/auth/require-admin";
import { getTicketWithMessages } from "@/lib/actions/support";
import { AccountShell } from "@/components/account/account-shell";
import { SupportReply } from "@/components/account/support-reply";
import { TicketStatusActions } from "@/components/account/ticket-status-actions";
import { UserAvatar } from "@/components/account/user-avatar";
import { Card } from "@/components/ui/card";
import { formatDateTime, cn } from "@/lib/utils";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Destek Talebi" };

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const current = await requireMember();
  const data = await getTicketWithMessages(id);
  if (!data) notFound();
  const t = await getServerT();

  const { ticket, messages } = data;

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={ticket.subject}
      description={`${t("sup.tickets.ticketNo").replace("{id}", ticket.id.slice(0, 8).toUpperCase())} · ${formatDateTime(ticket.created_at)}`}
      actions={
        <TicketStatusActions ticketId={ticket.id} status={ticket.status} />
      }
    >
      <Link
        href="/support"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft size={15} /> {t("sup.tickets.allTickets")}
      </Link>

      <Card className="border-ink-200 p-5">
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn("flex gap-3", m.is_staff ? "" : "flex-row-reverse")}
            >
              {/* Avatar */}
              <div className="shrink-0">
                {m.is_staff ? (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-200">
                    <Headset size={18} weight="duotone" />
                  </span>
                ) : (
                  <UserAvatar
                    name={current.nickname}
                    avatarPath={current.avatarPath}
                    size={36}
                  />
                )}
              </div>

              {/* Balon */}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5",
                  m.is_staff
                    ? "rounded-tl-sm bg-ink-100 text-ink-800"
                    : "rounded-tr-sm bg-brand-600 text-white",
                )}
              >
                <p className="text-[11px] font-semibold opacity-70">
                  {m.is_staff ? t("sup.tickets.staffName") : t("sup.tickets.youName")}
                </p>
                <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed">
                  {m.body}
                </p>
                {/* Ek dosyalar (imzalı URL) */}
                {(m as unknown as { attachments?: Array<{ name: string; mime: string; url?: string }> })
                  .attachments?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(m as unknown as { attachments: Array<{ name: string; mime: string; url?: string }> }).attachments.map(
                      (a, j) =>
                        a.mime.startsWith("image/") && a.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <a key={j} href={a.url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={a.url}
                              alt={a.name}
                              className="h-24 w-24 rounded-lg object-cover ring-1 ring-black/10"
                            />
                          </a>
                        ) : (
                          <a
                            key={j}
                            href={a.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs underline-offset-2 hover:underline",
                              m.is_staff ? "bg-ink-200 text-ink-700" : "bg-white/20 text-white",
                            )}
                          >
                            📎 {a.name}
                          </a>
                        ),
                    )}
                  </div>
                ) : null}
                <p
                  className={cn(
                    "mt-1 text-[10px]",
                    m.is_staff ? "text-ink-400" : "text-white/60",
                  )}
                >
                  {formatDateTime(m.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-ink-200 pt-4">
          <SupportReply ticketId={ticket.id} closed={ticket.status === "closed"} />
        </div>
      </Card>
    </AccountShell>
  );
}
