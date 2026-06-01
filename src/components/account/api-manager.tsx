"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Key,
  ArrowRight,
  ArrowsClockwise,
  Trash,
  CircleNotch,
  Check,
  Plugs,
  Eye,
  EyeSlash,
  Warning,
  ChartLineUp,
  ShieldCheck,
  Plus,
  X,
  PaperPlaneTilt,
  CheckCircle,
  XCircle,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  regenerateApiKey,
  revokeApiKey,
  updateWebhook,
  updateWebhookIps,
  sendTestWebhook,
} from "@/lib/actions/reseller";
import { useI18n } from "@/lib/i18n/provider";
import { cn, intlLocale } from "@/lib/utils";
import type { WebhookDelivery } from "@/lib/supabase/types";

export function ApiManager({
  keyHint,
  webhook,
  allowedIps,
  deliveries,
}: {
  keyHint: string | null; // mevcut anahtarın maskesi (tam anahtar DB'de yok)
  webhook: string | null;
  allowedIps: string[];
  deliveries: WebhookDelivery[];
}) {
  const router = useRouter();
  const { t, locale } = useI18n();

  const ENDPOINTS = [
    { method: "GET", path: "/api/v1/balance", desc: t("acct.api.endpoint.balance") },
    { method: "GET", path: "/api/v1/products", desc: t("acct.api.endpoint.products") },
    { method: "POST", path: "/api/v1/orders", desc: t("acct.api.endpoint.createOrder") },
    { method: "GET", path: "/api/v1/orders/:id", desc: t("acct.api.endpoint.orderStatus") },
  ];

  const [freshKey, setFreshKey] = useState<string | null>(null); // yeni üretilen, tam gösterilir
  const [reveal, setReveal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(webhook ?? "");
  const [ips, setIps] = useState<string[]>(allowedIps);
  const [ipInput, setIpInput] = useState("");
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<
    "gen" | "revoke" | "hook" | "ips" | "test" | null
  >(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function addIp() {
    const v = ipInput.trim();
    if (!v || ips.includes(v)) return;
    setIps((arr) => [...arr, v]);
    setIpInput("");
  }

  function saveIps(next: string[]) {
    setBusy("ips");
    setMsg(null);
    start(async () => {
      const r = await updateWebhookIps({ ips: next });
      if (r.ok) {
        setIps(next);
        router.refresh();
        setMsg({ ok: true, text: t("acct.api.ips.saved") });
      } else {
        setMsg({ ok: false, text: r.error });
      }
      setBusy(null);
    });
  }

  function testWebhook() {
    setBusy("test");
    setMsg(null);
    start(async () => {
      const r = await sendTestWebhook();
      if (r.ok) {
        setMsg({
          ok: r.status === "success",
          text:
            r.status === "success"
              ? t("acct.api.webhook.testOk")
                  .replace("{code}", String(r.statusCode))
                  .replace("{ms}", String(r.durationMs))
              : t("acct.api.webhook.testFail")
                  .replace("{code}", String(r.statusCode ?? t("acct.api.webhook.noResponse")))
                  .replace("{ms}", String(r.durationMs)),
        });
        router.refresh();
      } else {
        setMsg({ ok: false, text: r.error });
      }
      setBusy(null);
    });
  }

  const hasKey = Boolean(keyHint) || Boolean(freshKey);

  function generate() {
    setBusy("gen");
    setMsg(null);
    start(async () => {
      const r = await regenerateApiKey();
      if (r.ok) {
        setFreshKey(r.apiKey);
        setReveal(true);
        router.refresh();
      } else {
        setMsg({ ok: false, text: r.error });
      }
      setBusy(null);
    });
  }

  function revoke() {
    setBusy("revoke");
    setMsg(null);
    start(async () => {
      const r = await revokeApiKey();
      if (r.ok) {
        setFreshKey(null);
        router.refresh();
        setMsg({ ok: true, text: t("acct.api.key.revoked") });
      } else {
        setMsg({ ok: false, text: r.error });
      }
      setBusy(null);
    });
  }

  function saveHook() {
    setBusy("hook");
    setMsg(null);
    start(async () => {
      const r = await updateWebhook({ url: webhookUrl.trim() || null });
      setMsg(
        r.ok
          ? { ok: true, text: t("acct.api.webhook.saved") }
          : { ok: false, text: r.error },
      );
      if (r.ok) router.refresh();
      setBusy(null);
    });
  }

  return (
    <div className="space-y-6">
      {/* API anahtarı */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
            <Key size={20} weight="duotone" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-ink-900">{t("acct.api.key.title")}</h2>
            <p className="text-xs text-ink-500">
              {t("acct.api.key.signHint")} <code className="rounded bg-ink-100 px-1">Authorization: Bearer …</code> {t("acct.api.key.signHintTail")}
            </p>
          </div>
        </div>

        {hasKey ? (
          <div className="mt-5">
            {freshKey ? (
              /* Taze üretilen anahtar — yalnızca şimdi tam görünür + kopyalanır. */
              <>
                <div className="mb-3 flex items-start gap-2 rounded-xl border border-warning-200 bg-warning-50/60 px-3 py-2.5 text-sm text-warning-700">
                  <Warning size={16} weight="fill" className="mt-0.5 shrink-0" />
                  {t("acct.api.key.warnTitle")}
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 select-all truncate rounded-xl border border-ink-200 bg-ink-50 px-3 py-2.5 font-mono text-sm text-ink-900">
                    {reveal ? freshKey : "epf_live_" + "•".repeat(24)}
                  </code>
                  <button
                    onClick={() => setReveal((v) => !v)}
                    aria-label={t("acct.api.key.showHide")}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-ink-100 text-ink-700 transition-colors hover:bg-ink-200"
                  >
                    {reveal ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                  <CopyButton value={freshKey} className="h-11 w-11 shrink-0" />
                </div>
              </>
            ) : (
              /* Mevcut anahtar — yalnızca maske; tam hali DB'de yok, açılamaz. */
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-xl border border-ink-200 bg-ink-50 px-3 py-2.5 font-mono text-sm text-ink-500">
                  {keyHint}
                </code>
                <span className="rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700">
                  {t("acct.api.key.active")}
                </span>
              </div>
            )}

            {!freshKey && (
              <p className="mt-2 text-xs text-ink-400">
                {t("acct.api.key.maskNote")}
              </p>
            )}

            <div className="mt-4 flex gap-2">
              <Button onClick={generate} disabled={pending} variant="outline" size="sm">
                {busy === "gen" ? (
                  <CircleNotch size={16} className="animate-spin" />
                ) : (
                  <ArrowsClockwise size={16} weight="bold" />
                )}
                {t("acct.api.key.regenerate")}
              </Button>
              <Button onClick={revoke} disabled={pending} variant="ghost" size="sm" className="text-danger-600 hover:bg-danger-50">
                {busy === "revoke" ? (
                  <CircleNotch size={16} className="animate-spin" />
                ) : (
                  <Trash size={16} />
                )}
                {t("acct.api.key.revoke")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-ink-200 p-6 text-center">
            <p className="text-sm text-ink-500">
              {t("acct.api.key.empty")}
            </p>
            <Button onClick={generate} disabled={pending} className="mt-3">
              {busy === "gen" ? (
                <CircleNotch size={16} className="animate-spin" />
              ) : (
                <Key size={16} weight="fill" />
              )}
              {t("acct.api.key.generate")}
            </Button>
          </div>
        )}
      </div>

      {/* Webhook */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-50 text-accent-600 ring-1 ring-accent-200">
            <Plugs size={20} weight="duotone" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-ink-900">{t("acct.api.webhook.title")}</h2>
            <p className="text-xs text-ink-500">
              {t("acct.api.webhook.desc")}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="hook">{t("acct.api.webhook.urlLabel")}</Label>
          <div className="flex gap-2">
            <Input
              id="hook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://siteniz.com/webhook"
              disabled={pending}
            />
            <Button onClick={saveHook} disabled={pending} size="sm">
              {busy === "hook" ? (
                <CircleNotch size={16} className="animate-spin" />
              ) : (
                <Check size={16} weight="bold" />
              )}
              {t("acct.common.save")}
            </Button>
          </div>
          {/* Test gönder */}
          <Button
            onClick={testWebhook}
            disabled={pending || !webhook}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            {busy === "test" ? (
              <CircleNotch size={16} className="animate-spin" />
            ) : (
              <PaperPlaneTilt size={16} weight="duotone" />
            )}
            {t("acct.api.webhook.test")}
          </Button>
          {!webhook && (
            <p className="mt-1.5 text-xs text-ink-400">
              {t("acct.api.webhook.testFirst")}
            </p>
          )}
        </div>
      </div>

      {/* İzin verilen IP'ler */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-success-50 text-success-600 ring-1 ring-success-200">
            <ShieldCheck size={20} weight="duotone" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-ink-900">
              {t("acct.api.ips.title")}
            </h2>
            <p className="text-xs text-ink-500">
              {t("acct.api.ips.desc")}
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Input
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIp())}
            placeholder={t("acct.api.ips.placeholder")}
            disabled={pending}
          />
          <Button onClick={addIp} disabled={pending || !ipInput.trim()} size="sm" variant="outline">
            <Plus size={16} weight="bold" /> {t("acct.common.add")}
          </Button>
        </div>

        {ips.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {ips.map((ip) => (
              <span
                key={ip}
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200 bg-ink-50 px-2.5 py-1 font-mono text-sm text-ink-700"
              >
                {ip}
                <button
                  onClick={() => setIps((arr) => arr.filter((x) => x !== ip))}
                  disabled={pending}
                  aria-label={t("acct.common.remove")}
                  className="text-ink-400 hover:text-danger-600"
                >
                  <X size={14} weight="bold" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-400">
            {t("acct.api.ips.empty")}
          </p>
        )}

        <Button
          onClick={() => saveIps(ips)}
          disabled={pending}
          size="sm"
          className="mt-4"
        >
          {busy === "ips" ? (
            <CircleNotch size={16} className="animate-spin" />
          ) : (
            <Check size={16} weight="bold" />
          )}
          {t("acct.api.ips.save")}
        </Button>
      </div>

      {/* Webhook geçmişi */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-100 text-ink-500 ring-1 ring-ink-200">
            <ClockCounterClockwise size={20} weight="duotone" />
          </span>
          <h2 className="text-lg font-semibold text-ink-900">{t("acct.api.history.title")}</h2>
        </div>

        {deliveries.length === 0 ? (
          <p className="mt-4 text-sm text-ink-400">
            {t("acct.api.history.empty")}
          </p>
        ) : (
          <div className="mt-4 divide-y divide-ink-100">
            {deliveries.map((d) => (
              <div key={d.id} className="flex items-center gap-3 py-3">
                {d.status === "success" ? (
                  <CheckCircle size={20} weight="fill" className="shrink-0 text-success-500" />
                ) : (
                  <XCircle size={20} weight="fill" className="shrink-0 text-danger-500" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-medium text-ink-900">
                    <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-600">
                      {d.event}
                    </span>
                    <span className="truncate text-ink-500">{d.target_url}</span>
                  </p>
                  <p className="text-xs text-ink-400">
                    {new Date(d.created_at).toLocaleString(intlLocale(locale), {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {d.error ? ` · ${d.error}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      d.status === "success" ? "text-success-700" : "text-danger-600",
                    )}
                  >
                    {d.status_code ?? "—"}
                  </p>
                  <p className="text-[11px] text-ink-400">{d.duration_ms ?? "—"}ms</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Kullanım göstergesi (şimdilik örnek) */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-success-50 text-success-600 ring-1 ring-success-200">
            <ChartLineUp size={20} weight="duotone" />
          </span>
          <h2 className="text-lg font-semibold text-ink-900">{t("acct.api.usage.title")}</h2>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-ink-50 p-3">
            <p className="text-xl font-extrabold text-ink-900">0</p>
            <p className="text-xs text-ink-500">{t("acct.api.usage.monthReq")}</p>
          </div>
          <div className="rounded-xl bg-ink-50 p-3">
            <p className="text-xl font-extrabold text-ink-900">60/dk</p>
            <p className="text-xs text-ink-500">{t("acct.api.usage.rateLimit")}</p>
          </div>
          <div className="rounded-xl bg-ink-50 p-3">
            <p className="text-xl font-extrabold text-ink-900">%100</p>
            <p className="text-xs text-ink-500">{t("acct.api.usage.uptime")}</p>
          </div>
        </div>
      </div>

      {/* Döküman */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink-900">{t("acct.api.docs.title")}</h2>
          <Link
            href="/api-docs"
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100"
          >
            {t("acct.api.docs.fullDocs")}
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
        <p className="mt-1 text-xs text-ink-500">
          {t("acct.api.docs.desc")}
        </p>
        <div className="mt-4 divide-y divide-ink-100">
          {ENDPOINTS.map((e) => (
            <div key={e.path} className="flex items-center gap-3 py-2.5">
              <span
                className={cn(
                  "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-bold",
                  e.method === "GET"
                    ? "bg-success-50 text-success-700"
                    : "bg-brand-50 text-brand-700",
                )}
              >
                {e.method}
              </span>
              <code className="shrink-0 font-mono text-sm text-ink-800">{e.path}</code>
              <span className="ml-auto truncate text-xs text-ink-400">{e.desc}</span>
            </div>
          ))}
        </div>

        {/* Örnek istek */}
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-medium text-ink-500">{t("acct.api.docs.example")}</p>
          <pre className="overflow-x-auto rounded-xl bg-ink-900 p-4 text-xs leading-relaxed text-ink-100">
{`curl https://epinfox.com/api/v1/balance \\
  -H "Authorization: Bearer epf_live_••••••"`}
          </pre>
        </div>
      </div>

      {msg && (
        <p
          className={cn(
            "text-sm font-medium",
            msg.ok ? "text-success-600" : "text-danger-600",
          )}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
