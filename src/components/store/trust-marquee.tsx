import {
  Headset,
  Truck,
  Briefcase,
  Envelope,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { getServerT } from "@/lib/i18n/server";

interface TrustItem {
  icon: Icon;
  title: string;
  desc: string;
}

function buildItems(t: (key: string) => string): TrustItem[] {
  return [
    { icon: Headset, title: t("misc.trust.supportTitle"), desc: t("misc.trust.supportDesc") },
    { icon: Truck, title: t("misc.trust.deliveryTitle"), desc: t("misc.trust.deliveryDesc") },
    { icon: Briefcase, title: t("misc.trust.paymentTitle"), desc: t("misc.trust.paymentDesc") },
    { icon: Envelope, title: t("misc.trust.withdrawTitle"), desc: t("misc.trust.withdrawDesc") },
  ];
}

function TrustCell({ item }: { item: TrustItem }) {
  return (
    <div className="flex w-[300px] shrink-0 items-center gap-3 px-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center text-ink-700">
        <item.icon size={28} weight="regular" />
      </span>
      <div>
        <p className="text-sm font-bold text-ink-900">{item.title}</p>
        <p className="text-xs text-ink-500">{item.desc}</p>
      </div>
    </div>
  );
}

/**
 * Hareketli güven şeridi (Hipopotamya düzeni): Müşteri Desteği / Hızlı Teslimat /
 * Güvenli Ödeme / Para Çekme. Logo şeridi gibi sürekli sola kayar, hover'da durur.
 * İçerik 2x kopyalanıp %50 kaydırılarak kesintisiz döngü sağlanır.
 */
export async function TrustMarquee() {
  const t = await getServerT();
  const items = buildItems(t);
  const loop = [...items, ...items, ...items]; // geniş ekranda boşluk kalmasın
  return (
    <div className="container-page py-3">
      <div className="marquee-pause overflow-hidden rounded-2xl border border-ink-200 bg-white py-4 shadow-soft">
        <div className="animate-marquee flex w-max">
          {loop.map((it, i) => (
            <TrustCell key={`${it.title}-${i}`} item={it} />
          ))}
        </div>
      </div>
    </div>
  );
}
