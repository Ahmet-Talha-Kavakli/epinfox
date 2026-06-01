import type { Metadata } from "next";
import Link from "next/link";
import { Plugs, Lock, Lightning, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { CodeBlock } from "@/components/docs/code-block";
import { SITE } from "@/config/site";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "API Dökümanı",
  description: `${SITE.name} bayi API referansı — kimlik doğrulama, sipariş, bakiye ve webhook entegrasyonu.`,
};

const BASE = SITE.url.replace(/\/$/, "");

function Endpoint({ method, path }: { method: string; path: string }) {
  const c =
    method === "GET"
      ? "bg-success-50 text-success-700"
      : "bg-brand-50 text-brand-700";
  return (
    <p className="flex items-center gap-2 font-mono text-sm">
      <span className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${c}`}>
        {method}
      </span>
      <span className="text-ink-800">{path}</span>
    </p>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-bold text-ink-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-600">
        {children}
      </div>
    </section>
  );
}

export default async function ApiDocsPage() {
  const t = await getServerT();

  const TOC = [
    { id: "giris", label: t("apidocs.toc.intro") },
    { id: "kimlik", label: t("apidocs.toc.auth") },
    { id: "rate-limit", label: t("apidocs.toc.rate") },
    { id: "balance", label: t("apidocs.toc.balance") },
    { id: "products", label: t("apidocs.toc.products") },
    { id: "orders-create", label: t("apidocs.toc.ordersCreate") },
    { id: "orders-get", label: t("apidocs.toc.ordersGet") },
    { id: "webhooks", label: t("apidocs.toc.webhooks") },
    { id: "errors", label: t("apidocs.toc.errors") },
  ];

  const ERRORS = [
    { code: "400", name: "bad_request", desc: t("apidocs.errors.e400") },
    { code: "401", name: "unauthorized", desc: t("apidocs.errors.e401") },
    { code: "403", name: "ip_not_allowed", desc: t("apidocs.errors.e403") },
    { code: "402", name: "purchase_failed", desc: t("apidocs.errors.e402") },
    { code: "404", name: "not_found", desc: t("apidocs.errors.e404") },
    { code: "409", name: "inactive / out_of_stock", desc: t("apidocs.errors.e409") },
    { code: "422", name: "validation_error / unsupported_product", desc: t("apidocs.errors.e422") },
    { code: "429", name: "rate_limited", desc: t("apidocs.errors.e429") },
    { code: "500", name: "purchase_failed", desc: t("apidocs.errors.e500") },
  ];

  const features = [
    { icon: Lock, t: t("apidocs.intro.f1.t"), d: t("apidocs.intro.f1.d") },
    { icon: Lightning, t: t("apidocs.intro.f2.t"), d: t("apidocs.intro.f2.d") },
    { icon: Plugs, t: t("apidocs.intro.f3.t"), d: t("apidocs.intro.f3.d") },
  ];

  const heroDesc = t("apidocs.hero.desc").split("{base}");

  return (
    <section className="container-page py-10">
      {/* Hero */}
      <div className="rounded-3xl border border-ink-200 bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
          <Plugs size={26} weight="duotone" />
        </span>
        <h1 className="mt-4 text-3xl font-extrabold">
          {t("apidocs.hero.title").replace("{name}", SITE.name)}
        </h1>
        <p className="mt-2 max-w-2xl text-white/80">
          {heroDesc[0]?.replace("{name}", SITE.name)}
          <code className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-sm">
            {BASE}
          </code>
          {heroDesc[1]?.replace("{name}", SITE.name)}
        </p>
        <Link
          href="/account/api"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-white/90"
        >
          {t("apidocs.hero.cta")} <ArrowRight size={16} weight="bold" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[200px_1fr]">
        {/* Sol içindekiler */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">
            {t("apidocs.toc.title")}
          </p>
          <nav className="flex flex-col gap-0.5 text-sm">
            {TOC.map((tt) => (
              <a
                key={tt.id}
                href={`#${tt.id}`}
                className="rounded-lg px-2.5 py-1.5 text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900"
              >
                {tt.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* İçerik */}
        <div className="min-w-0 space-y-10">
          <Section id="giris" title={t("apidocs.intro.title")}>
            <p>{t("apidocs.intro.body").replace("{name}", SITE.name)}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {features.map((f) => (
                <div key={f.t} className="rounded-xl border border-ink-200 bg-white p-4">
                  <f.icon size={20} weight="duotone" className="text-brand-600" />
                  <p className="mt-2 font-semibold text-ink-900">{f.t}</p>
                  <p className="text-xs text-ink-500">{f.d}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="kimlik" title={t("apidocs.auth.title")}>
            <p>
              {t("apidocs.auth.body1")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">Authorization</code>{" "}
              {t("apidocs.auth.body2")}{" "}
              <Link href="/account/api" className="font-medium text-brand-600 hover:underline">
                {t("apidocs.auth.link")}
              </Link>{" "}
              {t("apidocs.auth.body3")}
            </p>
            <CodeBlock
              code={`curl ${BASE}/api/v1/balance \\
  -H "Authorization: Bearer epf_live_xxxxxxxxxxxx"`}
            />
            <p className="text-xs text-ink-500">
              {t("apidocs.auth.alt1")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">X-API-Key: epf_live_xxxx</code>{" "}
              {t("apidocs.auth.alt2")}
            </p>
          </Section>

          <Section id="rate-limit" title={t("apidocs.rate.title")}>
            <p>
              {t("apidocs.rate.body1")}{" "}
              <strong>{t("apidocs.rate.body1b")}</strong>
              {t("apidocs.rate.body2")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">429 rate_limited</code>{" "}
              {t("apidocs.rate.body3")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">Retry-After</code>{" "}
              {t("apidocs.rate.body4")}
            </p>
            <CodeBlock
              lang="http"
              code={`HTTP/1.1 429 Too Many Requests
Retry-After: 60`}
            />
          </Section>

          <Section id="balance" title={t("apidocs.balance.title")}>
            <Endpoint method="GET" path="/api/v1/balance" />
            <p>{t("apidocs.balance.body")}</p>
            <CodeBlock
              lang="json"
              code={`{
  "balance": 12450.75,
  "currency": "TRY",
  "tier": "silver",        // bayilik kademen (null olabilir)
  "discount_pct": 12       // kademe indirimi (%)
}`}
            />
          </Section>

          <Section id="products" title={t("apidocs.products.title")}>
            <Endpoint method="GET" path="/api/v1/products" />
            <p>
              {t("apidocs.products.body1")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">id</code>{" "}
              {t("apidocs.products.body2")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">variant_id</code>{" "}
              {t("apidocs.products.body3")}{" "}
              (<code className="rounded bg-ink-100 px-1 font-mono">reseller_price</code>).
            </p>
            <CodeBlock
              lang="json"
              code={`{
  "products": [
    {
      "slug": "pubg-mobile-uc",
      "name": "PUBG Mobile UC",
      "category": "oyun",
      "delivery_type": "code",   // yalnız "code" olanlar API'den satılabilir
      "variants": [
        {
          "id": "9f8c2e1a-...",   // ← sipariş için variant_id
          "label": "60 UC",
          "list_price": 49.90,
          "reseller_price": 43.91
        }
      ]
    }
  ],
  "discount_pct": 12
}`}
            />
          </Section>

          <Section id="orders-create" title={t("apidocs.ordersCreate.title")}>
            <Endpoint method="POST" path="/api/v1/orders" />
            <p>
              {t("apidocs.ordersCreate.body1")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">variant_id</code>{" "}
              {t("apidocs.ordersCreate.body2")}{" "}
              <a href="#products" className="font-medium text-brand-600 hover:underline">
                {t("apidocs.ordersCreate.link")}
              </a>{" "}
              {t("apidocs.ordersCreate.body3")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">reseller_ref</code>{" "}
              {t("apidocs.ordersCreate.body4")}{" "}
              <strong>{t("apidocs.ordersCreate.body4b")}</strong>{" "}
              {t("apidocs.ordersCreate.body5")}
            </p>
            <div className="rounded-xl border border-warning-200 bg-warning-50 p-3 text-xs text-warning-800">
              <strong>{t("apidocs.ordersCreate.warnLabel")}</strong>{" "}
              {t("apidocs.ordersCreate.warn1")}{" "}
              <em>{t("apidocs.ordersCreate.warnEm")}</em>{" "}
              {t("apidocs.ordersCreate.warn2")}{" "}
              <code className="rounded bg-warning-100 px-1 font-mono">422 unsupported_product</code>{" "}
              {t("apidocs.ordersCreate.warn3")}
            </div>
            <CodeBlock
              lang="json"
              code={`// İstek gövdesi
{
  "variant_id": "9f8c2e1a-4b6d-4a2f-9c1e-7d3b5a8e0f12",
  "reseller_ref": "siparis-1234"   // opsiyonel — idempotency anahtarı
}`}
            />
            <CodeBlock
              lang="json"
              code={`// Yanıt — 201 Created
{
  "order": {
    "id": "a1b2c3d4-...",
    "product_name": "PUBG Mobile 60 UC",
    "price": 43.91,
    "status": "completed",
    "reseller_ref": "siparis-1234",
    "created_at": "2026-05-30T18:53:00Z",
    "code": "XXXX-XXXX-XXXX"
  }
}`}
            />
            <p className="text-xs text-ink-500">
              {t("apidocs.ordersCreate.idem1")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">reseller_ref</code>{" "}
              {t("apidocs.ordersCreate.idem2")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">200</code>{" "}
              {t("apidocs.ordersCreate.idem3")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">&quot;idempotent&quot;: true</code>{" "}
              {t("apidocs.ordersCreate.idem4")}
            </p>
          </Section>

          <Section id="orders-get" title={t("apidocs.ordersGet.title")}>
            <Endpoint method="GET" path="/api/v1/orders/:id" />
            <p>{t("apidocs.ordersGet.body1")}</p>
            <CodeBlock
              lang="json"
              code={`{
  "order": {
    "id": "a1b2c3d4-...",
    "product_name": "PUBG Mobile 60 UC",
    "price": 43.91,
    "status": "completed",   // pending | processing | completed | failed | refunded
    "reseller_ref": "siparis-1234",
    "created_at": "2026-05-30T18:53:00Z",
    "code": "XXXX-XXXX-XXXX"
  }
}`}
            />

            <div className="mt-5">
              <Endpoint method="GET" path="/api/v1/orders" />
            </div>
            <p>
              {t("apidocs.ordersGet.body2a")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">limit</code>{" "}
              {t("apidocs.ordersGet.body2b")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">offset</code>{" "}
              {t("apidocs.ordersGet.body2c")}
            </p>
            <CodeBlock
              code={`curl "${BASE}/api/v1/orders?limit=20&offset=0" \\
  -H "Authorization: Bearer epf_live_xxxxxxxxxxxx"`}
            />
            <CodeBlock
              lang="json"
              code={`{
  "orders": [
    {
      "id": "a1b2c3d4-...",
      "product_name": "PUBG Mobile 60 UC",
      "price": 43.91,
      "status": "completed",
      "reseller_ref": "siparis-1234",
      "created_at": "2026-05-30T18:53:00Z"
    }
  ],
  "limit": 20,
  "offset": 0,
  "discount_pct": 12,
  "has_more": false
}`}
            />
          </Section>

          <Section id="webhooks" title={t("apidocs.webhooks.title")}>
            <p>
              {t("apidocs.webhooks.body1a")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">POST</code>{" "}
              {t("apidocs.webhooks.body1b")}{" "}
              <Link href="/account/api" className="font-medium text-brand-600 hover:underline">
                {t("apidocs.webhooks.link")}
              </Link>
              {t("apidocs.webhooks.body1c")}
            </p>
            <p>{t("apidocs.webhooks.body2")}</p>
            <CodeBlock
              lang="json"
              code={`// Başlıklar
X-${SITE.name}-Event: order.completed
Content-Type: application/json

// Gövde
{
  "event": "order.completed",
  "sent_at": "2026-05-30T18:53:00Z",
  "data": {
    "order_id": "a1b2c3d4-...",
    "reseller_ref": "siparis-1234",
    "product_name": "PUBG Mobile 60 UC",
    "price": 43.91
  }
}`}
            />
            <p className="text-xs text-ink-500">
              {t("apidocs.webhooks.note1")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">200</code>{" "}
              {t("apidocs.webhooks.note2")}
            </p>
          </Section>

          <Section id="errors" title={t("apidocs.errors.title")}>
            <p>
              {t("apidocs.errors.body1")}{" "}
              <code className="rounded bg-ink-100 px-1 font-mono">error</code>{" "}
              {t("apidocs.errors.body2")}
            </p>
            <div className="overflow-x-auto rounded-xl border border-ink-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-200 bg-ink-50 text-left text-xs text-ink-500">
                    <th className="px-4 py-2 font-medium">{t("apidocs.errors.th.code")}</th>
                    <th className="px-4 py-2 font-medium">{t("apidocs.errors.th.type")}</th>
                    <th className="px-4 py-2 font-medium">{t("apidocs.errors.th.desc")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {ERRORS.map((e) => (
                    <tr key={e.code}>
                      <td className="px-4 py-2.5 font-mono font-bold text-ink-900">
                        {e.code}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-ink-600">{e.name}</td>
                      <td className="px-4 py-2.5 text-ink-500">{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      </div>
    </section>
  );
}
