import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getServerT } from "@/lib/i18n/server";

/**
 * "Düşük Komisyon" şerit banner'ı (Hipopotamya düzeni):
 * sol açık-gri kutu (DÜŞÜK KOMİSYON!) → eğik kesim → koyu bant (BANKA KOMİSYONU)
 * → sağ beyaz "ÖDEME YAP" butonu.
 */
export async function CommissionBanner() {
  const t = await getServerT();
  return (
    <Link
      href="/wallet"
      className="group relative flex h-[88px] items-stretch overflow-hidden rounded-2xl shadow-card transition-transform duration-300 hover:-translate-y-0.5"
    >
      {/* SOL — açık gri kutu, kesik kenar */}
      <div className="relative z-10 flex shrink-0 items-center rounded-l-2xl border-2 border-dashed border-ink-300 bg-ink-100 pl-5 pr-10">
        <span className="text-lg font-extrabold uppercase leading-none tracking-tight text-ink-700">
          <span className="block text-[11px]">{t("misc.commission.low")}</span>
          <span className="text-accent-500">
            {t("misc.commission.bankCommission")}
          </span>
        </span>
      </div>

      {/* Eğik kesim (sol kutuyu koyu banda bağlayan diyagonal) */}
      <div
        className="-ml-8 w-12 shrink-0 bg-ink-900"
        style={{ clipPath: "polygon(40% 0, 100% 0, 60% 100%, 0% 100%)" }}
      />

      {/* KOYU BANT — kayan başlık (soldan sağa) + sağ sabit buton */}
      <div className="flex flex-1 items-center justify-between gap-3 overflow-hidden bg-ink-900 pl-2 pr-4">
        {/* Soldan sağa kayan tekrarlı yazı */}
        <div className="marquee-pause flex-1 overflow-hidden">
          <div className="animate-marquee-rtl flex w-max">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="whitespace-nowrap px-6 text-xl font-extrabold italic uppercase tracking-wide text-white sm:text-2xl"
              >
                {t("misc.commission.lowCommission")}
              </span>
            ))}
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink-900 transition-colors group-hover:bg-ink-50">
          {t("misc.commission.pay")}
          <ArrowRight size={14} weight="bold" />
        </span>
      </div>
    </Link>
  );
}
