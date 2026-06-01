// Oyuncu ID / Kayıtlı Hesap platformları — brand.slug ile eşleşir.
// Kullanıcı bu platformlar için hesap bilgisini bir kez kaydeder; sipariş
// ekranında ürünün markasına göre otomatik dolar.
//
// SAF VERİ — server-only/next-headers İMPORT ETME (client + server'dan import
// ediliyor). Locale'i ÇAĞIRAN geçer; çeviri yoksa TR fallback uygulanır.

import { type Locale, DEFAULT_LOCALE } from "@/lib/i18n/config";

export interface PlayerPlatform {
  slug: string; // brand.slug
  label: string;
  /** Beklenen değer türü — kullanıcıya doğru yönlendirme için. */
  kind: "id" | "url" | "username";
  placeholder: string;
  hint: string;
}

export const PLAYER_PLATFORMS: PlayerPlatform[] = [
  // ── Oyunlar (hesap ID / oyuncu kimliği) ──
  { slug: "mobile-legends", label: "Mobile Legends", kind: "id", placeholder: "Kullanıcı ID (Sunucu ID)", hint: "Profil > sol üstteki ID ve sunucu numaran." },
  { slug: "pubg-mobile", label: "PUBG Mobile", kind: "id", placeholder: "Karakter ID", hint: "Oyun içi profilindeki karakter ID'n." },
  { slug: "free-fire", label: "Free Fire", kind: "id", placeholder: "Oyuncu ID", hint: "Profilindeki oyuncu ID numaran." },
  { slug: "genshin-impact", label: "Genshin Impact", kind: "id", placeholder: "UID", hint: "Oyun içi UID'in (sunucu ile birlikte)." },
  { slug: "roblox", label: "Roblox", kind: "username", placeholder: "Kullanıcı adı", hint: "Roblox kullanıcı adın." },
  { slug: "valorant", label: "Valorant", kind: "username", placeholder: "Riot ID #TAG", hint: "Riot ID'in ve tag'in (örn. Oyuncu#TR1)." },
  { slug: "league-of-legends", label: "League of Legends", kind: "username", placeholder: "Riot ID #TAG", hint: "Riot ID'in ve tag'in." },
  { slug: "brawl-stars", label: "Brawl Stars", kind: "id", placeholder: "Oyuncu etiketi (#...)", hint: "Profilindeki oyuncu etiketi." },
  { slug: "clash-of-clans", label: "Clash of Clans", kind: "id", placeholder: "Oyuncu etiketi (#...)", hint: "Profilindeki oyuncu etiketi." },

  // ── Sosyal medya (profil/hesap linki ya da kullanıcı adı) ──
  { slug: "instagram", label: "Instagram", kind: "url", placeholder: "https://instagram.com/kullanici", hint: "Profil linkin (hesabın herkese açık olmalı)." },
  { slug: "tiktok", label: "TikTok", kind: "url", placeholder: "https://tiktok.com/@kullanici", hint: "Profil linkin." },
  { slug: "youtube", label: "YouTube", kind: "url", placeholder: "https://youtube.com/@kanal", hint: "Kanal linkin." },
  { slug: "twitter", label: "Twitter / X", kind: "url", placeholder: "https://x.com/kullanici", hint: "Profil linkin." },
  { slug: "telegram", label: "Telegram", kind: "username", placeholder: "@kullaniciadi", hint: "Kullanıcı adın." },
  { slug: "steam", label: "Steam", kind: "url", placeholder: "https://steamcommunity.com/id/...", hint: "Profil linkin." },
];

// ── Locale overlay ──────────────────────────────────────────────────────────
// TR taban PLAYER_PLATFORMS içinde. Bu sözlük placeholder/hint çevirilerini
// slug bazında verir. `label` MARKA ADI → çevrilmez. Çeviri yoksa TR fallback.
type PlatformText = { placeholder?: string; hint?: string };

const PLATFORM_I18N: Partial<Record<Locale, Record<string, PlatformText>>> = {
  en: {
    "mobile-legends": { placeholder: "User ID (Server ID)", hint: "Your ID and server number from the top-left of your profile." },
    "pubg-mobile": { placeholder: "Character ID", hint: "Your character ID from your in-game profile." },
    "free-fire": { placeholder: "Player ID", hint: "Your player ID number from your profile." },
    "genshin-impact": { placeholder: "UID", hint: "Your in-game UID (together with the server)." },
    "roblox": { placeholder: "Username", hint: "Your Roblox username." },
    "valorant": { placeholder: "Riot ID #TAG", hint: "Your Riot ID and tag (e.g. Player#TR1)." },
    "league-of-legends": { placeholder: "Riot ID #TAG", hint: "Your Riot ID and tag." },
    "brawl-stars": { placeholder: "Player tag (#...)", hint: "The player tag from your profile." },
    "clash-of-clans": { placeholder: "Player tag (#...)", hint: "The player tag from your profile." },
    "instagram": { placeholder: "https://instagram.com/username", hint: "Your profile link (account must be public)." },
    "tiktok": { placeholder: "https://tiktok.com/@username", hint: "Your profile link." },
    "youtube": { placeholder: "https://youtube.com/@channel", hint: "Your channel link." },
    "twitter": { placeholder: "https://x.com/username", hint: "Your profile link." },
    "telegram": { placeholder: "@username", hint: "Your username." },
    "steam": { placeholder: "https://steamcommunity.com/id/...", hint: "Your profile link." },
  },
  de: {
    "mobile-legends": { placeholder: "Benutzer-ID (Server-ID)", hint: "Deine ID und Servernummer oben links in deinem Profil." },
    "pubg-mobile": { placeholder: "Charakter-ID", hint: "Deine Charakter-ID aus deinem Spielprofil." },
    "free-fire": { placeholder: "Spieler-ID", hint: "Deine Spieler-ID-Nummer aus deinem Profil." },
    "genshin-impact": { placeholder: "UID", hint: "Deine UID im Spiel (zusammen mit dem Server)." },
    "roblox": { placeholder: "Benutzername", hint: "Dein Roblox-Benutzername." },
    "valorant": { placeholder: "Riot ID #TAG", hint: "Deine Riot-ID und dein Tag (z. B. Spieler#TR1)." },
    "league-of-legends": { placeholder: "Riot ID #TAG", hint: "Deine Riot-ID und dein Tag." },
    "brawl-stars": { placeholder: "Spieler-Tag (#...)", hint: "Der Spieler-Tag aus deinem Profil." },
    "clash-of-clans": { placeholder: "Spieler-Tag (#...)", hint: "Der Spieler-Tag aus deinem Profil." },
    "instagram": { placeholder: "https://instagram.com/benutzername", hint: "Dein Profillink (Konto muss öffentlich sein)." },
    "tiktok": { placeholder: "https://tiktok.com/@benutzername", hint: "Dein Profillink." },
    "youtube": { placeholder: "https://youtube.com/@kanal", hint: "Dein Kanallink." },
    "twitter": { placeholder: "https://x.com/benutzername", hint: "Dein Profillink." },
    "telegram": { placeholder: "@benutzername", hint: "Dein Benutzername." },
    "steam": { placeholder: "https://steamcommunity.com/id/...", hint: "Dein Profillink." },
  },
  ar: {
    "mobile-legends": { placeholder: "معرّف المستخدم (معرّف الخادم)", hint: "معرّفك ورقم الخادم من أعلى يسار ملفك الشخصي." },
    "pubg-mobile": { placeholder: "معرّف الشخصية", hint: "معرّف شخصيتك من ملفك داخل اللعبة." },
    "free-fire": { placeholder: "معرّف اللاعب", hint: "رقم معرّف اللاعب الخاص بك من ملفك الشخصي." },
    "genshin-impact": { placeholder: "UID", hint: "معرّف UID داخل اللعبة (مع الخادم)." },
    "roblox": { placeholder: "اسم المستخدم", hint: "اسم مستخدمك في Roblox." },
    "valorant": { placeholder: "Riot ID ‎#TAG", hint: "معرّف Riot ID والوسم الخاص بك (مثال: Player#TR1)." },
    "league-of-legends": { placeholder: "Riot ID ‎#TAG", hint: "معرّف Riot ID والوسم الخاص بك." },
    "brawl-stars": { placeholder: "وسم اللاعب (‎#...)", hint: "وسم اللاعب من ملفك الشخصي." },
    "clash-of-clans": { placeholder: "وسم اللاعب (‎#...)", hint: "وسم اللاعب من ملفك الشخصي." },
    "instagram": { placeholder: "https://instagram.com/username", hint: "رابط ملفك الشخصي (يجب أن يكون الحساب عامًا)." },
    "tiktok": { placeholder: "https://tiktok.com/@username", hint: "رابط ملفك الشخصي." },
    "youtube": { placeholder: "https://youtube.com/@channel", hint: "رابط قناتك." },
    "twitter": { placeholder: "https://x.com/username", hint: "رابط ملفك الشخصي." },
    "telegram": { placeholder: "@username", hint: "اسم المستخدم الخاص بك." },
    "steam": { placeholder: "https://steamcommunity.com/id/...", hint: "رابط ملفك الشخصي." },
  },
  ru: {
    "mobile-legends": { placeholder: "ID пользователя (ID сервера)", hint: "Ваш ID и номер сервера в левом верхнем углу профиля." },
    "pubg-mobile": { placeholder: "ID персонажа", hint: "Ваш ID персонажа из профиля в игре." },
    "free-fire": { placeholder: "ID игрока", hint: "Номер вашего игрового ID из профиля." },
    "genshin-impact": { placeholder: "UID", hint: "Ваш игровой UID (вместе с сервером)." },
    "roblox": { placeholder: "Имя пользователя", hint: "Ваше имя пользователя в Roblox." },
    "valorant": { placeholder: "Riot ID #TAG", hint: "Ваш Riot ID и тег (напр. Player#TR1)." },
    "league-of-legends": { placeholder: "Riot ID #TAG", hint: "Ваш Riot ID и тег." },
    "brawl-stars": { placeholder: "Тег игрока (#...)", hint: "Тег игрока из вашего профиля." },
    "clash-of-clans": { placeholder: "Тег игрока (#...)", hint: "Тег игрока из вашего профиля." },
    "instagram": { placeholder: "https://instagram.com/username", hint: "Ссылка на ваш профиль (аккаунт должен быть публичным)." },
    "tiktok": { placeholder: "https://tiktok.com/@username", hint: "Ссылка на ваш профиль." },
    "youtube": { placeholder: "https://youtube.com/@channel", hint: "Ссылка на ваш канал." },
    "twitter": { placeholder: "https://x.com/username", hint: "Ссылка на ваш профиль." },
    "telegram": { placeholder: "@username", hint: "Ваше имя пользователя." },
    "steam": { placeholder: "https://steamcommunity.com/id/...", hint: "Ссылка на ваш профиль." },
  },
};

/** TR taban platforma locale çevirisini uygular (yoksa TR olduğu gibi kalır). */
function localizePlatform(p: PlayerPlatform, locale: Locale): PlayerPlatform {
  if (locale === DEFAULT_LOCALE) return p;
  const overlay = PLATFORM_I18N[locale]?.[p.slug];
  if (!overlay) return p;
  return {
    ...p,
    placeholder: overlay.placeholder ?? p.placeholder,
    hint: overlay.hint ?? p.hint,
  };
}

/** Tüm platform listesini locale uygulanmış döndürür. */
export function getPlayerPlatforms(
  locale: Locale = DEFAULT_LOCALE,
): PlayerPlatform[] {
  if (locale === DEFAULT_LOCALE) return PLAYER_PLATFORMS;
  return PLAYER_PLATFORMS.map((p) => localizePlatform(p, locale));
}

export function getPlatformMeta(
  slug: string | null | undefined,
  locale: Locale = DEFAULT_LOCALE,
): PlayerPlatform | null {
  if (!slug) return null;
  const found = PLAYER_PLATFORMS.find((p) => p.slug === slug);
  if (!found) return null;
  return localizePlatform(found, locale);
}
