"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  GameController,
  Check,
  Trash,
  PencilSimple,
  Plus,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { getPlayerPlatforms } from "@/lib/player-platforms";
import {
  savePlayerAccount,
  deletePlayerAccount,
  type PlayerAccount,
} from "@/lib/actions/player-accounts";

export function PlayerAccountsManager({
  accounts,
}: {
  accounts: PlayerAccount[];
}) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const platforms = getPlayerPlatforms(locale);
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Kayıtlı değerleri platform slug'a göre hızlı eşle.
  const byPlatform = new Map(accounts.map((a) => [a.platform, a]));

  function save(slug: string, label: string) {
    setError(null);
    const value = draft.trim();
    if (!value) {
      setError(t("acct.playerIds.enterValue"));
      return;
    }
    start(async () => {
      const res = await savePlayerAccount({ platform: slug, label, value });
      if (res.ok) {
        setEditing(null);
        setDraft("");
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  function remove(id: string) {
    start(async () => {
      await deletePlayerAccount(id);
      router.refresh();
    });
  }

  const savedCount = accounts.length;

  return (
    <div className="space-y-5">
      {/* Bilgi şeridi */}
      <Card className="flex items-center gap-3 border-ink-200 bg-brand-50/40 p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-600">
          <GameController size={22} weight="duotone" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink-900">
            {savedCount > 0
              ? t("acct.playerIds.savedCount").replace("{count}", String(savedCount))
              : t("acct.playerIds.noneSaved")}
          </p>
          <p className="text-xs text-ink-500">
            {t("acct.playerIds.infoDesc")}
          </p>
        </div>
      </Card>

      {error && (
        <p className="rounded-xl bg-danger-50 px-3 py-2 text-sm font-medium text-danger-600">
          {error}
        </p>
      )}

      {/* Platform listesi */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {platforms.map((p) => {
          const saved = byPlatform.get(p.slug);
          const isEditing = editing === p.slug;
          return (
            <Card
              key={p.slug}
              className={cn(
                "border-ink-200 p-4 transition-colors",
                saved && !isEditing && "border-success-200 bg-success-50/30",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-start gap-3">
                  <PlatformLogo slug={p.slug} label={p.label} />
                  <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink-900">
                    {p.label}
                    {saved && !isEditing && (
                      <Check size={14} weight="bold" className="text-success-600" />
                    )}
                  </p>
                  {saved && !isEditing ? (
                    <p className="mt-0.5 break-all text-xs text-ink-500">
                      {saved.value}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs text-ink-400">{p.hint}</p>
                  )}
                  </div>
                </div>
                {saved && !isEditing && (
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(p.slug);
                        setDraft(saved.value);
                        setError(null);
                      }}
                      aria-label={t("acct.common.edit")}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-brand-600"
                    >
                      <PencilSimple size={16} weight="bold" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(saved.id)}
                      disabled={pending}
                      aria-label={t("acct.common.delete")}
                      className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-danger-50 hover:text-danger-600"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  </div>
                )}
              </div>

              {/* Düzenleme / ekleme alanı */}
              {(isEditing || !saved) && (
                <div className="mt-3 flex gap-2">
                  <Input
                    value={isEditing ? draft : ""}
                    onFocus={() => {
                      if (!isEditing) {
                        setEditing(p.slug);
                        setDraft("");
                        setError(null);
                      }
                    }}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        save(p.slug, p.label);
                      }
                    }}
                    placeholder={p.placeholder}
                    className="h-10 flex-1"
                  />
                  {isEditing && (
                    <Button
                      type="button"
                      onClick={() => save(p.slug, p.label)}
                      disabled={pending}
                      className="h-10 shrink-0"
                    >
                      {pending ? "…" : saved ? t("acct.common.save") : <Plus size={16} weight="bold" />}
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/** Platform logosu — /brands/<slug>-banner.webp yuvarlak kırpılır; yoksa ikon. */
function PlatformLogo({ slug, label }: { slug: string; label: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600">
        <GameController size={20} weight="duotone" />
      </span>
    );
  }
  return (
    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-1 ring-ink-200">
      <Image
        src={`/brands/${slug}-banner.webp`}
        alt={label}
        fill
        sizes="40px"
        className="object-cover"
        onError={() => setOk(false)}
      />
    </span>
  );
}
