import { getServerT } from "@/lib/i18n/server";
import { isPlaceholder } from "@/config/site";

export async function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  const t = await getServerT();
  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">{title}</h1>
        {updated && (
          <p className="mt-1 text-sm text-ink-400">
            {t("legal.updatedLabel")}: {updated}
          </p>
        )}

        <div className="legal-body mt-8 space-y-5 text-[15px] leading-relaxed text-ink-600">
          {children}
        </div>
      </div>
    </section>
  );
}

/** Yasal sayfa ana başlığı (numaralı madde başlıkları için). */
export function LegalH2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="pt-4 text-lg font-bold text-ink-900">{children}</h2>
  );
}

/** Yasal sayfa alt başlığı. */
export function LegalH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="pt-2 text-base font-semibold text-ink-800">{children}</h3>
  );
}

/**
 * Şirket/taraf bilgileri tablosu — sol etiket, sağ değer.
 * rows: [["Unvan", "..."], ["Adres", "..."], ...]
 */
export function LegalInfoTable({ rows }: { rows: [string, string][] }) {
  // Henüz doldurulmamış (placeholder) değerli satırları gizle — sahte/yanıltıcı
  // yasal bilgi gösterme. Değer girilince satır otomatik görünür.
  const visible = rows.filter(([, value]) => !isPlaceholder(value));
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
      <dl className="divide-y divide-ink-100">
        {visible.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
          >
            <dt className="text-sm font-semibold text-ink-500">{label}</dt>
            <dd className="text-sm text-ink-800">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
