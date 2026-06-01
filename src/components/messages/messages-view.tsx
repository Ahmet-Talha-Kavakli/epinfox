"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  ChatsCircle,
  PaperPlaneRight,
  MagnifyingGlass,
  Headset,
  Storefront,
  ShieldCheck,
  CheckCircle,
  DotsThreeVertical,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

/* Mesajlaşma arayüzü — iki panelli (sohbet listesi + sohbet penceresi).
   Gerçek mesaj backend'i henüz yok; konuşmalar client-state'te tutulur ve
   seed verisiyle başlatılır. Backend bağlanınca seed yerine props'tan gelen
   konuşmalar kullanılacak (initialConversations). Boş gelirse tasarımdaki
   "Henüz sohbet bulunmuyor" + "Hoş Geldiniz" boş durumları gösterilir. */

type Sender = "me" | "them" | "system";

interface Message {
  id: string;
  sender: Sender;
  text: string;
  /** Deterministik saat etiketi (ör. "14:32") — hydration güvenli. */
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  /** Sohbet türü — avatar/ikon ve rozet rengini belirler. */
  kind: "support" | "seller" | "system";
  /** Karşı tarafın çevrimiçi olup olmadığı (sadece görsel). */
  online: boolean;
  messages: Message[];
}

/** Seed konuşmalar — gerçek backend bağlanınca buradan beslenecek. Şimdilik
   boş; arayüz "Henüz sohbet bulunmuyor" + "Hoş Geldiniz" boş durumlarını gösterir. */
const SEED: Conversation[] = [];

const KIND_META: Record<
  Conversation["kind"],
  { icon: typeof Headset; ring: string; chip: string; labelKey: string }
> = {
  support: {
    icon: Headset,
    ring: "from-brand-500 to-brand-600",
    chip: "bg-brand-50 text-brand-700",
    labelKey: "sup.messages.kind.support",
  },
  seller: {
    icon: Storefront,
    ring: "from-accent-500 to-accent-600",
    chip: "bg-accent-50 text-accent-700",
    labelKey: "sup.messages.kind.seller",
  },
  system: {
    icon: ShieldCheck,
    ring: "from-ink-500 to-ink-700",
    chip: "bg-ink-100 text-ink-600",
    labelKey: "sup.messages.kind.system",
  },
};

export function MessagesView({
  nickname,
  initialConversations,
}: {
  nickname: string;
  initialConversations?: Conversation[];
}) {
  const { t } = useI18n();
  const [conversations, setConversations] = useState<Conversation[]>(
    initialConversations && initialConversations.length > 0
      ? initialConversations
      : SEED,
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.name.toLowerCase().includes(q));
  }, [conversations, query]);

  // Yeni mesaj geldiğinde / sohbet değiştiğinde en alta kaydır.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active?.messages.length, activeId]);

  function send() {
    const text = draft.trim();
    if (!text || !active) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m${c.messages.length + 1}-${c.id}`,
                  sender: "me",
                  text,
                  time: t("sup.messages.now"),
                },
              ],
            }
          : c,
      ),
    );
    setDraft("");
  }

  return (
    <div className="grid h-[calc(100vh-13rem)] min-h-[520px] grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
      {/* ───── Sol panel: sohbet listesi ───── */}
      <aside className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        <div className="border-b border-ink-200 px-5 py-4">
          <h2 className="text-lg font-bold text-ink-900">{t("sup.messages.conversations")}</h2>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 px-3 py-2 focus-within:border-brand-300">
            <MagnifyingGlass size={16} className="text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("sup.messages.searchPlaceholder")}
              className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-ink-400">
              {query ? t("sup.messages.noMatch") : t("sup.messages.noConversations")}
            </p>
          ) : (
            filtered.map((c) => {
              const meta = KIND_META[c.kind];
              const last = c.messages[c.messages.length - 1];
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                    isActive ? "bg-brand-50" : "hover:bg-ink-100",
                  )}
                >
                  <span className="relative shrink-0">
                    <span
                      className={cn(
                        "grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br text-white",
                        meta.ring,
                      )}
                    >
                      <meta.icon size={22} weight="duotone" />
                    </span>
                    {c.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-success-500" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-ink-900">
                        {c.name}
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-400">
                        {last?.time}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-500">
                      {last?.text}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* ───── Sağ panel: sohbet penceresi ───── */}
      <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        {active ? (
          <>
            {/* Başlık */}
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-3.5">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br text-white",
                    KIND_META[active.kind].ring,
                  )}
                >
                  {(() => {
                    const Icon = KIND_META[active.kind].icon;
                    return <Icon size={20} weight="duotone" />;
                  })()}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">{active.name}</p>
                  <p className="flex items-center gap-1.5 text-xs text-ink-500">
                    {active.online ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-success-500" />
                        {t("sup.messages.online")}
                      </>
                    ) : (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                          KIND_META[active.kind].chip,
                        )}
                      >
                        {t(KIND_META[active.kind].labelKey)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label={t("sup.messages.options")}
                className="grid h-9 w-9 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-100"
              >
                <DotsThreeVertical size={20} weight="bold" />
              </button>
            </div>

            {/* Mesaj akışı */}
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-ink-50/40 px-5 py-5"
            >
              {active.messages.map((m) =>
                m.sender === "system" ? (
                  <div key={m.id} className="flex justify-center">
                    <span className="rounded-full bg-ink-100 px-3 py-1.5 text-center text-xs text-ink-500">
                      {m.text}
                    </span>
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className={cn(
                      "flex items-end gap-2",
                      m.sender === "me" ? "justify-end" : "justify-start",
                    )}
                  >
                    {m.sender === "them" && (
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br text-white",
                          KIND_META[active.kind].ring,
                        )}
                      >
                        {(() => {
                          const Icon = KIND_META[active.kind].icon;
                          return <Icon size={16} weight="duotone" />;
                        })()}
                      </span>
                    )}
                    <div
                      className={cn(
                        "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                        m.sender === "me"
                          ? "rounded-br-md bg-brand-600 text-white"
                          : "rounded-bl-md border border-ink-200 bg-white text-ink-800",
                      )}
                    >
                      <p>{m.text}</p>
                      <p
                        className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-[10px]",
                          m.sender === "me" ? "text-white/70" : "text-ink-400",
                        )}
                      >
                        {m.time}
                        {m.sender === "me" && (
                          <CheckCircle size={12} weight="fill" />
                        )}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Mesaj yazma alanı */}
            <div className="border-t border-ink-200 px-4 py-3">
              <div className="flex items-end gap-2 rounded-2xl border border-ink-200 bg-white px-3 py-2 focus-within:border-brand-300">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder={t("sup.messages.composePlaceholder")}
                  className="max-h-32 min-h-[24px] w-full resize-none bg-transparent py-1 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={!draft.trim()}
                  aria-label={t("sup.messages.send")}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <PaperPlaneRight size={18} weight="fill" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Boş durum — tasarımdaki "Hoş Geldiniz" ekranı */
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-50 to-accent-50 text-ink-400">
              <ChatsCircle size={40} weight="duotone" />
            </span>
            <h2 className="mt-5 text-2xl font-bold text-ink-900">
              {t("sup.messages.welcome").replace("{name}", nickname)}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-ink-500">
              {t("sup.messages.welcomeDesc")}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
