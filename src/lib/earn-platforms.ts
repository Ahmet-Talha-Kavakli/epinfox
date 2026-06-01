// Para Kazan platformları — server action dosyasından AYRI tutulur, çünkü
// "use server" modülünden yalnız async fonksiyon export edilebilir (sabitler
// client'a düzgün geçmez). Hem client form hem server action bunu kullanır.

export const EARN_PLATFORMS = [
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "other",
] as const;

export type EarnPlatform = (typeof EARN_PLATFORMS)[number];
