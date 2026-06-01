"use client";

import { useState } from "react";
import Image from "next/image";
import { ChatCircle, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr";
import { useI18n } from "@/lib/i18n/provider";

/** "Nasıl buldun?" tilki maskotlu reaksiyonlar. */
const REACTIONS = [
  { key: "like", img: "/reactions/fox-like.webp", labelKey: "sup.news.reaction.like", base: 42 },
  { key: "love", img: "/reactions/fox-love.webp", labelKey: "sup.news.reaction.love", base: 28 },
  { key: "haha", img: "/reactions/fox-haha.webp", labelKey: "sup.news.reaction.haha", base: 13 },
  { key: "sad", img: "/reactions/fox-sad.webp", labelKey: "sup.news.reaction.sad", base: 4 },
  { key: "angry", img: "/reactions/fox-angry.webp", labelKey: "sup.news.reaction.angry", base: 2 },
];

type CommentEntry = { id: number; name: string; text: string };

/** slug'dan deterministik bir başlangıç sapması — her haberde sayılar farklı görünsün. */
function seedFromSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 97;
  return h;
}

export function NewsReactions({
  slug,
  userName = null,
}: {
  slug: string;
  userName?: string | null;
}) {
  const { t } = useI18n();
  const seed = seedFromSlug(slug);
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(REACTIONS.map((r, i) => [r.key, r.base + ((seed + i * 7) % 11)])),
  );
  const [picked, setPicked] = useState<string | null>(null);

  const [name, setName] = useState(userName ?? "");
  const [text, setText] = useState("");
  const [comments, setComments] = useState<CommentEntry[]>([]);

  function react(key: string) {
    setCounts((prev) => {
      const next = { ...prev };
      // önceki seçimi geri al
      if (picked) next[picked] = Math.max(0, next[picked] - 1);
      // yeni seçim (aynısına basıldıysa toggle-off)
      if (picked === key) {
        setPicked(null);
        return next;
      }
      next[key] = next[key] + 1;
      setPicked(key);
      return next;
    });
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setComments((c) => [
      {
        id: c.length + 1,
        name: name.trim() || userName || t("sup.news.guest"),
        text: trimmed,
      },
      ...c,
    ]);
    setText("");
  }

  return (
    <section className="mt-12 border-t border-ink-200 pt-10">
      {/* Reaksiyonlar */}
      <h2 className="text-xl font-bold text-ink-900">{t("sup.news.howWasIt")}</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {REACTIONS.map((r) => {
          const active = picked === r.key;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => react(r.key)}
              aria-pressed={active}
              title={t(r.labelKey)}
              className={`inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-all ${
                active
                  ? "border-brand-400 bg-brand-50 text-brand-700 shadow-soft"
                  : "border-ink-200 bg-white text-ink-600 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
              }`}
            >
              <Image
                src={r.img}
                alt={t(r.labelKey)}
                width={32}
                height={32}
                className={`h-8 w-8 object-contain transition-transform ${active ? "scale-110" : ""}`}
              />
              <span className="tabular-nums">{counts[r.key]}</span>
            </button>
          );
        })}
      </div>

      {/* Yorumlar */}
      <div className="mt-10">
        <h2 className="inline-flex items-center gap-2 text-xl font-bold text-ink-900">
          <ChatCircle size={22} weight="duotone" className="text-brand-600" />
          {t("sup.news.leaveComment")}
          {comments.length > 0 && (
            <span className="rounded-full bg-ink-100 px-2 py-0.5 text-sm font-bold text-ink-500">
              {comments.length}
            </span>
          )}
        </h2>

        <form
          onSubmit={submitComment}
          className="mt-4 rounded-2xl border border-ink-200 bg-white p-5 shadow-soft"
        >
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("sup.news.namePlaceholder")}
              className="w-full rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:bg-white focus:outline-none"
            />
            {userName && name === userName && (
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-600">
                {t("sup.news.you")}
              </span>
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("sup.news.commentPlaceholder")}
            rows={3}
            className="mt-3 w-full resize-none rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-2.5 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:bg-white focus:outline-none"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={!text.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PaperPlaneTilt size={16} weight="fill" />
              {t("sup.news.submit")}
            </button>
          </div>
        </form>

        {/* Yorum listesi */}
        {comments.length > 0 && (
          <ul className="mt-5 space-y-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="flex gap-3 rounded-2xl border border-ink-200 bg-white p-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                  {c.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink-900">{c.name}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-600">
                    {c.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
