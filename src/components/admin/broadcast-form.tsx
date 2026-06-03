"use client";

import { useState, useTransition } from "react";
import {
  Megaphone,
  CircleNotch,
  PaperPlaneTilt,
  UsersThree,
  Storefront,
  User,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { broadcastNotification } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

type Audience = "all" | "resellers" | "members";

const AUDIENCES: { key: Audience; label: string; icon: typeof UsersThree }[] = [
  { key: "all", label: "Herkes", icon: UsersThree },
  { key: "members", label: "Üyeler", icon: User },
  { key: "resellers", label: "Bayiler", icon: Storefront },
];

export function BroadcastForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [alsoEmail, setAlsoEmail] = useState(false);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function send() {
    setMsg(null);
    start(async () => {
      const r = await broadcastNotification({
        title,
        body: body || undefined,
        link: link || undefined,
        audience,
        sendEmail: alsoEmail,
      });
      if (r.ok) {
        const emailNote =
          alsoEmail && r.emailCount != null
            ? ` · ${r.emailCount} e-posta gönderildi (izin verenlere)`
            : "";
        setMsg({
          ok: true,
          text: `Bildirim ${r.count} kullanıcıya gönderildi${emailNote}.`,
        });
        setTitle("");
        setBody("");
        setLink("");
      } else {
        setMsg({ ok: false, text: r.error });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {/* Form */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
            <Megaphone size={20} weight="duotone" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-ink-900">Duyuru / Bildirim</h2>
            <p className="text-xs text-ink-500">Seçtiğin kitleye anlık bildirim gönder.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <Label>Hedef Kitle</Label>
            <div className="grid grid-cols-3 gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => setAudience(a.key)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    audience === a.key ? "border-brand-400 bg-brand-50 text-brand-700" : "border-ink-200 text-ink-600 hover:bg-ink-50",
                  )}
                >
                  <a.icon size={16} weight="duotone" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="b-title">Başlık *</Label>
            <Input id="b-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Örn. Hafta sonu kampanyası başladı!" disabled={pending} />
          </div>
          <div>
            <Label htmlFor="b-body">İçerik</Label>
            <Textarea id="b-body" value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Bildirimin detay metni…" disabled={pending} />
          </div>
          <div>
            <Label htmlFor="b-link">Yönlendirme Linki</Label>
            <Input id="b-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="/store veya /raffles" disabled={pending} />
          </div>

          {/* E-posta seçeneği */}
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
              alsoEmail ? "border-brand-400 bg-brand-50/60" : "border-ink-200 hover:bg-ink-50",
            )}
          >
            <input
              type="checkbox"
              checked={alsoEmail}
              onChange={(e) => setAlsoEmail(e.target.checked)}
              disabled={pending}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                <EnvelopeSimple size={16} weight="duotone" className="text-brand-600" />
                E-posta olarak da gönder
              </span>
              <span className="mt-0.5 block text-xs text-ink-500">
                Yalnızca <b>pazarlama e-postası izni olan</b> kullanıcılara gider (KVKK). Markalı EpinFox şablonuyla gönderilir.
              </span>
            </span>
          </label>

          <Button onClick={send} disabled={pending || title.trim().length < 2}>
            {pending ? <CircleNotch size={16} className="animate-spin" /> : <PaperPlaneTilt size={16} weight="fill" />}
            {alsoEmail ? "Bildirim + E-posta Gönder" : "Bildirimi Gönder"}
          </Button>

          {msg && (
            <p className={cn("text-sm font-medium", msg.ok ? "text-success-600" : "text-danger-600")}>{msg.text}</p>
          )}
        </div>
      </div>

      {/* Önizleme */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">Önizleme</p>
        <div className="rounded-2xl border border-brand-200 bg-brand-50/40 p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-600 ring-1 ring-accent-200">
              <Megaphone size={20} weight="duotone" />
            </span>
            <div className="min-w-0">
              <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-700">Kampanya</span>
              <p className="mt-1 text-sm font-bold text-ink-900">{title || "Başlık önizlemesi"}</p>
              {body && <p className="mt-0.5 text-sm text-ink-600">{body}</p>}
              <p className="mt-1.5 text-xs text-ink-400">şimdi</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-400">
          Bildirim, kullanıcıların zil ikonunda ve /notifications sayfasında görünür.
        </p>
      </div>
    </div>
  );
}
