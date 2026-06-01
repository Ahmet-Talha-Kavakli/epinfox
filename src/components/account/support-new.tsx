"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, CircleNotch, X, Paperclip, FileText, ImageSquare } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { createTicket } from "@/lib/actions/support";
import { TICKET_CATEGORIES } from "@/lib/support-meta";
import type { TicketCategory } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

const ATTACH_ACCEPT = "image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain";
const ATTACH_MAX_MB = 8;
const ATTACH_MAX = 4;

export function SupportNew() {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<TicketCategory>("general");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setError(null);
    const next = [...files];
    for (const f of Array.from(list)) {
      if (next.length >= ATTACH_MAX) break;
      if (f.size > ATTACH_MAX_MB * 1024 * 1024) {
        setError(t("sup.tickets.fileTooBig").replace("{mb}", String(ATTACH_MAX_MB)));
        continue;
      }
      next.push(f);
    }
    setFiles(next.slice(0, ATTACH_MAX));
    if (fileRef.current) fileRef.current.value = "";
  }

  function submit() {
    setError(null);
    start(async () => {
      const fd = new FormData();
      fd.set("subject", subject);
      fd.set("category", category);
      fd.set("body", body);
      for (const f of files) fd.append("files", f);
      const r = await createTicket(fd);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      router.push(`/support/${r.ticketId}`);
    });
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus size={16} weight="bold" /> {t("sup.tickets.new")}
      </Button>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-ink-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-ink-900">{t("sup.tickets.newTitle")}</h2>
        <button
          onClick={() => setOpen(false)}
          aria-label={t("sup.tickets.close")}
          className="grid h-8 w-8 place-items-center rounded-full text-ink-500 hover:bg-ink-100"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="subject">{t("sup.tickets.subject")}</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("sup.tickets.subjectPlaceholder")}
            disabled={pending}
          />
        </div>

        <div>
          <Label>{t("sup.tickets.category")}</Label>
          <div className="flex flex-wrap gap-2">
            {TICKET_CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory(c.value)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  category === c.value
                    ? "bg-brand-50 text-brand-700 ring-1 ring-brand-300"
                    : "bg-ink-100 text-ink-600 hover:bg-ink-200",
                )}
              >
                {t(c.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="body">{t("sup.tickets.message")}</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder={t("sup.tickets.messagePlaceholder")}
            disabled={pending}
          />
        </div>

        {/* Dosya ekleri */}
        <div>
          <Label>{t("sup.tickets.attachLabel")}</Label>
          <input
            ref={fileRef}
            type="file"
            accept={ATTACH_ACCEPT}
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending || files.length >= ATTACH_MAX}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-ink-300 px-3.5 py-2 text-sm font-medium text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-600 disabled:opacity-40"
          >
            <Paperclip size={16} /> {t("sup.tickets.attachBtn")}
            <span className="text-xs text-ink-400">{t("sup.tickets.attachHint").replace("{max}", String(ATTACH_MAX)).replace("{mb}", String(ATTACH_MAX_MB))}</span>
          </button>
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {files.map((f, i) => (
                <span
                  key={i}
                  className="relative inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-ink-50 py-1 pl-2 pr-6 text-xs text-ink-600"
                >
                  {f.type.startsWith("image/") ? (
                    <ImageSquare size={14} className="text-brand-600" />
                  ) : (
                    <FileText size={14} className="text-brand-600" />
                  )}
                  <span className="max-w-[140px] truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}
                    aria-label={t("sup.tickets.remove")}
                    className="absolute right-1 top-1/2 grid h-4 w-4 -translate-y-1/2 place-items-center rounded-full text-ink-400 hover:bg-ink-200 hover:text-ink-700"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm font-medium text-danger-600">{error}</p>}

        <div className="flex gap-2">
          <Button
            onClick={submit}
            disabled={pending || subject.length < 4 || body.length < 5}
          >
            {pending ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              t("sup.tickets.send")
            )}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>
            {t("sup.tickets.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
