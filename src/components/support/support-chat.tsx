"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  PaperPlaneRight,
  CircleNotch,
  Paperclip,
  FileText,
  ImageSquare,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

type Attachment = {
  kind: "image" | "pdf" | "text";
  name: string;
  data: string; // image: data URL; pdf/text: base64
  mime?: string;
  previewUrl?: string; // sadece UI önizleme için (görsel)
};

type Msg = { role: "user" | "assistant"; content: string; attachments?: Attachment[] };

const MAX_FILE_MB = 8;
const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain";

/** Dosyayı backend'in beklediği Attachment biçimine çevir. */
function fileToAttachment(file: File): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read_error"));
    if (file.type.startsWith("image/")) {
      reader.onload = () =>
        resolve({
          kind: "image",
          name: file.name,
          data: String(reader.result), // data URL
          mime: file.type,
          previewUrl: String(reader.result),
        });
      reader.readAsDataURL(file);
    } else {
      const kind = file.type === "application/pdf" ? "pdf" : "text";
      reader.onload = () => {
        // data URL'den base64 kısmını ayıkla
        const res = String(reader.result);
        const base64 = res.includes(",") ? res.split(",")[1] : res;
        resolve({ kind, name: file.name, data: base64, mime: file.type });
      };
      reader.readAsDataURL(file);
    }
  });
}

export function SupportChat() {
  const { t } = useI18n();
  // WELCOME mesajı identity ile filtreleniyor; ilk render'da bir kez kuruluyor.
  const welcomeRef = useRef<Msg>({
    role: "assistant",
    content: t("c1.chat.welcome"),
  });
  const WELCOME = welcomeRef.current;
  const SUGGESTIONS = [
    t("c1.chat.suggest.code"),
    t("c1.chat.suggest.bonus"),
    t("c1.chat.suggest.refund"),
  ];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<Attachment[]>([]); // gönderilmeyi bekleyen ekler
  const [fileErr, setFileErr] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, pending]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setFileErr(null);
    const incoming = Array.from(files).slice(0, 4 - pending.length);
    const out: Attachment[] = [];
    for (const f of incoming) {
      if (f.size > MAX_FILE_MB * 1024 * 1024) {
        setFileErr(t("c1.chat.err.tooLarge").replace("{n}", String(MAX_FILE_MB)));
        continue;
      }
      try {
        out.push(await fileToAttachment(f));
      } catch {
        setFileErr(t("c1.chat.err.read"));
      }
    }
    if (out.length) setPending((p) => [...p, ...out].slice(0, 4));
    if (fileRef.current) fileRef.current.value = "";
  }

  async function send(text: string) {
    const content = text.trim();
    const atts = pending;
    if ((!content && !atts.length) || loading) return;
    const userMsg: Msg = {
      role: "user",
      content: content || (atts.length ? t("c1.chat.fileSent") : ""),
      attachments: atts.length ? atts : undefined,
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setPending([]);
    setLoading(true);
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next
            .filter((m) => m.role !== "assistant" || m !== WELCOME)
            .map((m) => ({
              role: m.role,
              content: m.content,
              // previewUrl'i backend'e yollama (gereksiz şişme)
              attachments: m.attachments?.map(({ previewUrl, ...rest }) => {
                void previewUrl;
                return rest;
              }),
            })),
        }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply ?? data.error ?? t("c1.chat.err.generic"),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: t("c1.chat.err.connection") },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Açma sekmesi — sağ kenarda dikey yeşil "Çevrimiçi" şeridi */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("c1.chat.aria.liveSupport")}
        className={cn(
          "group fixed right-0 top-1/2 z-50 flex -translate-y-1/2 items-center gap-2 rounded-l-2xl bg-success-500 py-5 pl-3 pr-2.5 text-white shadow-float transition-all hover:bg-success-600 hover:pr-3.5",
          open && "translate-x-full opacity-0",
        )}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>
        <span
          className="text-sm font-bold tracking-wide [writing-mode:vertical-rl]"
          style={{ textOrientation: "mixed" }}
        >
          {t("c1.chat.online")}
        </span>
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-5 right-5 z-50 flex w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-float transition-all",
          open
            ? "pointer-events-auto h-[560px] max-h-[calc(100vh-2.5rem)] opacity-100"
            : "pointer-events-none h-0 opacity-0",
        )}
      >
        {/* Başlık — sadece banner görseli */}
        <div
          className="relative flex h-[68px] items-center justify-end overflow-hidden bg-white bg-[length:auto_150%] bg-left bg-no-repeat px-4"
          style={{ backgroundImage: "url(/brand/topbar-banner.png)" }}
        >
          {/* Çevrimiçi rozeti + kapat (banner üstünde okunsun diye beyaz zemin) */}
          <span className="relative inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-ink-600 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-success-500" />{" "}
            {t("c1.chat.online")}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("c1.chat.aria.close")}
            className="relative ml-2 grid h-8 w-8 place-items-center rounded-full bg-white/70 text-ink-700 shadow-sm transition-colors hover:bg-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mesajlar */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-ink-50 p-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-brand-600 text-white"
                    : "border border-ink-200 bg-white text-ink-800",
                )}
              >
                {/* Ek dosya önizlemeleri */}
                {m.attachments?.length ? (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {m.attachments.map((a, j) =>
                      a.kind === "image" && a.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={j}
                          src={a.previewUrl}
                          alt={a.name}
                          className="h-20 w-20 rounded-lg object-cover ring-1 ring-white/30"
                        />
                      ) : (
                        <span
                          key={j}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs",
                            m.role === "user" ? "bg-white/20" : "bg-ink-100 text-ink-600",
                          )}
                        >
                          <FileText size={14} /> {a.name}
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-500">
                <CircleNotch size={15} className="animate-spin" />{" "}
                {t("c1.chat.typing")}
              </div>
            </div>
          )}
          {/* Öneriler (sadece ilk mesajda) */}
          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-600 hover:border-brand-300 hover:text-brand-600"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bekleyen ek dosyalar + hata */}
        {(pending.length > 0 || fileErr) && (
          <div className="border-t border-ink-200 bg-white px-3 pt-2">
            {fileErr && (
              <p className="mb-1.5 text-xs font-medium text-danger-600">{fileErr}</p>
            )}
            {pending.length > 0 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {pending.map((a, i) => (
                  <span
                    key={i}
                    className="group/att relative inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-ink-50 py-1 pl-1.5 pr-6 text-xs text-ink-600"
                  >
                    {a.kind === "image" ? (
                      <ImageSquare size={14} className="text-brand-600" />
                    ) : (
                      <FileText size={14} className="text-brand-600" />
                    )}
                    <span className="max-w-[120px] truncate">{a.name}</span>
                    <button
                      type="button"
                      onClick={() => setPending((p) => p.filter((_, j) => j !== i))}
                      aria-label={t("c1.chat.aria.remove")}
                      className="absolute right-1 top-1/2 -translate-y-1/2 grid h-4 w-4 place-items-center rounded-full text-ink-400 hover:bg-ink-200 hover:text-ink-700"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Giriş */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-ink-200 bg-white p-3"
        >
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading || pending.length >= 4}
            aria-label={t("c1.chat.aria.attach")}
            title={t("c1.chat.title.attach")}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-brand-600 disabled:opacity-40"
          >
            <Paperclip size={20} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("c1.chat.placeholder")}
            className="h-11 flex-1 rounded-full border border-ink-200 bg-white px-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <button
            type="submit"
            disabled={loading || (!input.trim() && pending.length === 0)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            aria-label={t("c1.chat.aria.send")}
          >
            <PaperPlaneRight size={18} weight="fill" />
          </button>
        </form>
      </div>
    </>
  );
}
