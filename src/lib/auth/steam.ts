import "server-only";
import SteamAuth from "node-steam-openid";

/**
 * Steam OpenID 2.0 entegrasyonu. Steam OAuth/OIDC sağlamadığı için Clerk'in
 * custom provider'ıyla bağlanamaz; kendi akışımız: /api/auth/steam başlatır,
 * /api/auth/steam/callback Steam'den dönen kullanıcıyı çözer.
 *
 * Gerekli env: STEAM_API_KEY (https://steamcommunity.com/dev/apikey)
 */
export function getSteamAuth() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) throw new Error("STEAM_API_KEY missing");
  return new SteamAuth({
    realm: base,
    returnUrl: `${base}/api/auth/steam/callback`,
    apiKey,
  });
}
