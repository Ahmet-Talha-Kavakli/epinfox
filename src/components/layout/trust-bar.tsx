import {
  Lightning,
  ShieldCheck,
  Headset,
  CreditCard,
} from "@phosphor-icons/react/dist/ssr";
import { getServerT } from "@/lib/i18n/server";

const ITEMS = [
  { icon: Lightning, title: "trust.instant", desc: "trust.instant.sub" },
  { icon: ShieldCheck, title: "trust.secure", desc: "trust.secure.sub" },
  { icon: CreditCard, title: "trust.payment", desc: "trust.payment.sub" },
  { icon: Headset, title: "trust.support", desc: "trust.support.sub" },
];

export async function TrustBar() {
  const t = await getServerT();
  return (
    <section className="border-t border-ink-200 bg-ink-100/40">
      <div className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-500">
              <it.icon size={22} weight="duotone" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">{t(it.title)}</p>
              <p className="text-xs text-ink-500">{t(it.desc)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
