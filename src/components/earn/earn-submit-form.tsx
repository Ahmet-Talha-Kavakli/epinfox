"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  InstagramLogo,
  TiktokLogo,
  YoutubeLogo,
  XLogo,
  DotsThreeCircle,
  Paperclip,
  PaperPlaneRight,
  CheckCircle,
  SignIn,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitEarn } from "@/lib/actions/earn";
import { EARN_PLATFORMS, type EarnPlatform } from "@/lib/earn-platforms";
import { useI18n } from "@/lib/i18n/provider";

const PLATFORM_ICON: Record<EarnPlatform, Icon> = {
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  youtube: YoutubeLogo,
  x: XLogo,
  other: DotsThreeCircle,
};

const PLATFORM_LABEL: Record<EarnPlatform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  other: "",
};

export function EarnSubmitForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [platform, setPlatform] = useState<EarnPlatform>("instagram");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, start] = useTransition();

  if (!isLoggedIn) {
    return (
      <Card className="flex flex-col items-center justify-center border-ink-200 p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <SignIn size={28} weight="duotone" />
        </span>
        <h3 className="mt-4 text-lg font-bold text-ink-900">
          {t("pages.earn.form.title")}
        </h3>
        <p className="mt-1.5 text-sm text-ink-500">
          {t("pages.earn.form.loginDesc")}
        </p>
        <Link
          href="/sign-in?next=/earn"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
        >
          <SignIn size={16} weight="bold" /> {t("pages.earn.form.loginCta")}
        </Link>
      </Card>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setDone(false);
    const fd = new FormData(e.currentTarget);
    fd.set("platform", platform);
    start(async () => {
      const res = await submitEarn(fd);
      if (!res.ok) {
        setError(res.error);
      } else {
        setDone(true);
        formRef.current?.reset();
        setFileNames([]);
        router.refresh();
      }
    });
  }

  return (
    <Card className="border-ink-200 p-5 sm:p-6">
      <h3 className="text-lg font-bold text-ink-900">{t("pages.earn.form.title")}</h3>
      <p className="mt-1 text-sm text-ink-500">{t("pages.earn.form.subtitle")}</p>

      <form ref={formRef} onSubmit={onSubmit} className="mt-5 space-y-4">
        {/* Platform seçimi */}
        <div>
          <Label>{t("pages.earn.form.platform")}</Label>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {EARN_PLATFORMS.map((p) => {
              const Ico = PLATFORM_ICON[p];
              const label = PLATFORM_LABEL[p] || t("pages.earn.platform.other");
              const active = platform === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "border-brand-400 bg-brand-50 text-brand-700"
                      : "border-ink-200 bg-white text-ink-600 hover:border-brand-300",
                  )}
                >
                  <Ico size={16} weight={active ? "fill" : "regular"} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Link */}
        <div>
          <Label htmlFor="contentUrl">{t("pages.earn.form.linkLabel")}</Label>
          <Input
            id="contentUrl"
            name="contentUrl"
            type="url"
            placeholder="https://instagram.com/p/..."
            required
          />
        </div>

        {/* Not */}
        <div>
          <Label htmlFor="note">{t("pages.earn.form.noteLabel")}</Label>
          <Textarea
            id="note"
            name="note"
            placeholder={t("pages.earn.form.notePlaceholder")}
            className="min-h-[70px]"
          />
        </div>

        {/* Kanıt görselleri */}
        <div>
          <Label>{t("pages.earn.form.proofLabel")}</Label>
          <label className="mt-1.5 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ink-300 bg-ink-50/50 px-4 py-3 text-sm text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50/40">
            <Paperclip size={18} weight="duotone" className="text-brand-600" />
            {fileNames.length
              ? `${fileNames.length} ${t("pages.earn.form.filesSelected")}`
              : t("pages.earn.form.addScreenshot")}
            <input
              type="file"
              name="files"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) =>
                setFileNames(Array.from(e.target.files ?? []).map((f) => f.name))
              }
            />
          </label>
        </div>

        {error && (
          <p className="rounded-xl bg-danger-50 px-3 py-2 text-sm font-medium text-danger-600">
            {error}
          </p>
        )}
        {done && (
          <p className="flex items-center gap-1.5 rounded-xl bg-success-50 px-3 py-2 text-sm font-medium text-success-700">
            <CheckCircle size={16} weight="fill" /> {t("pages.earn.form.success")}
          </p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          <PaperPlaneRight size={16} weight="bold" />
          {pending ? t("pages.earn.form.submitting") : t("pages.earn.form.submit")}
        </Button>
      </form>
    </Card>
  );
}
