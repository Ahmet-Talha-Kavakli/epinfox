// Ödeme yöntemleri — tek kaynak. Hem cüzdan yükleme akışı hem keşif grid'i
// bu listeyi kullanır. Talimat (instruction) alanı: yöntem seçilince gösterilir.
//
// i18n: Metinler doğrudan dize değil, çeviri anahtarı (*Key) tutar. Tüketen
// yer (client comp veya server action) t() ile çevirir. comp pattern ile aynı.
// Kopyalanabilir detay (IBAN, cüzdan adresi) gibi nötr veriler ham kalır.

export interface PaymentMethodDef {
  key: string;
  /** Başlık çeviri anahtarı (keşif kartı + seçili başlık). */
  titleKey: string;
  /** Kısa açıklama çeviri anahtarı (keşif kartı). */
  descKey: string;
  image: string;
  regions: ("TR" | "GLOBAL")[];
  /** Seçilince gösterilecek talimat tipi. */
  instruction: {
    kind: "card" | "iban" | "crypto" | "manual";
    /** Talimat başlığı çeviri anahtarı. */
    titleKey: string;
    /** Açıklayıcı metin çeviri anahtarı. */
    noteKey: string;
    /** Kopyalanabilir değer (IBAN, cüzdan adresi vb.) — varsa. */
    detail?: { label: string; value: string }[];
  };
}

export const PAYMENT_METHODS: PaymentMethodDef[] = [
  {
    key: "bank-transfer-tr",
    titleKey: "srv.pay.bankTr.title",
    descKey: "srv.pay.bankTr.desc",
    image: "/payment-methods/bank-transfer.png",
    regions: ["TR"],
    instruction: {
      kind: "iban",
      titleKey: "srv.pay.bankTr.insTitle",
      noteKey: "srv.pay.bankTr.insNote",
      detail: [
        { label: "Alıcı", value: "EpinFox Dijital Hizmetler" },
        { label: "IBAN", value: "TR00 0000 0000 0000 0000 0000 00" },
        { label: "Banka", value: "Demo Bank" },
      ],
    },
  },
  {
    key: "card",
    titleKey: "srv.pay.card.title",
    descKey: "srv.pay.card.desc",
    image: "/payment-methods/card.png",
    regions: ["TR", "GLOBAL"],
    instruction: {
      kind: "card",
      titleKey: "srv.pay.card.insTitle",
      noteKey: "srv.pay.card.insNote",
    },
  },
  {
    key: "wallets",
    titleKey: "srv.pay.wallets.title",
    descKey: "srv.pay.wallets.desc",
    image: "/payment-methods/wallets.png",
    regions: ["TR", "GLOBAL"],
    instruction: {
      kind: "manual",
      titleKey: "srv.pay.wallets.insTitle",
      noteKey: "srv.pay.wallets.insNote",
    },
  },
  {
    key: "crypto",
    titleKey: "srv.pay.crypto.title",
    descKey: "srv.pay.crypto.desc",
    image: "/payment-methods/crypto.png",
    regions: ["TR", "GLOBAL"],
    instruction: {
      kind: "crypto",
      titleKey: "srv.pay.crypto.insTitle",
      noteKey: "srv.pay.crypto.insNote",
      detail: [
        { label: "Ağ", value: "Tether USDT — TRC-20" },
        { label: "Cüzdan adresi", value: "TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" },
      ],
    },
  },
  {
    key: "local-bank",
    titleKey: "srv.pay.localBank.title",
    descKey: "srv.pay.localBank.desc",
    image: "/payment-methods/local-bank.png",
    regions: ["GLOBAL"],
    instruction: {
      kind: "manual",
      titleKey: "srv.pay.localBank.insTitle",
      noteKey: "srv.pay.localBank.insNote",
    },
  },
  {
    key: "cash",
    titleKey: "srv.pay.cash.title",
    descKey: "srv.pay.cash.desc",
    image: "/payment-methods/cash.png",
    regions: ["TR", "GLOBAL"],
    instruction: {
      kind: "manual",
      titleKey: "srv.pay.cash.insTitle",
      noteKey: "srv.pay.cash.insNote",
    },
  },
  {
    key: "gift-card",
    titleKey: "srv.pay.giftCard.title",
    descKey: "srv.pay.giftCard.desc",
    image: "/payment-methods/gift-card.png",
    regions: ["TR", "GLOBAL"],
    instruction: {
      kind: "manual",
      titleKey: "srv.pay.giftCard.insTitle",
      noteKey: "srv.pay.giftCard.insNote",
    },
  },
  {
    key: "steam",
    titleKey: "srv.pay.steam.title",
    descKey: "srv.pay.steam.desc",
    image: "/payment-methods/steam.png",
    regions: ["TR", "GLOBAL"],
    instruction: {
      kind: "manual",
      titleKey: "srv.pay.steam.insTitle",
      noteKey: "srv.pay.steam.insNote",
    },
  },
];

/**
 * payment_ref / method anahtarından okunabilir etiket. Çeviri için `t`
 * (client'ta useI18n().t, server'da getServerT) geçilir.
 */
export function paymentMethodLabel(
  key: string | null,
  t: (k: string) => string,
): string {
  if (!key || key === "mock") return t("srv.pay.fallbackLabel");
  const found = PAYMENT_METHODS.find((m) => m.key === key);
  return found ? t(found.titleKey) : t("srv.pay.fallbackLabel");
}
