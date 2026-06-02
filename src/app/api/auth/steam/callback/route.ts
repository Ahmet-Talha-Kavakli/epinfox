import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Steam callback. node-steam-openid'in verifyAssertion'ı Next.js req objesiyle
 * uyumsuz (host header / realm sorunları); bu yüzden OpenID doğrulamasını
 * KENDİMİZ yapıyoruz: gelen openid.* parametrelerini Steam'e geri gönderip
 * (check_authentication) imzayı doğrularız, sonra steamid'yi claimed_id'den
 * parse edip Clerk'te kullanıcı bul/oluştur + sign-in token üretiriz.
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;

    // 1) Temel OpenID kontrolleri
    if (sp.get("openid.mode") !== "id_res") throw new Error("invalid_mode");
    const claimedId = sp.get("openid.claimed_id") || "";
    const m = claimedId.match(/^https?:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/);
    if (!m) throw new Error("invalid_claimed_id");
    const steamId = m[1];

    // 2) İmzayı Steam'e doğrulat (check_authentication)
    const verifyParams = new URLSearchParams();
    for (const [k, v] of sp.entries()) verifyParams.set(k, v);
    verifyParams.set("openid.mode", "check_authentication");
    const verifyRes = await fetch("https://steamcommunity.com/openid/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyParams.toString(),
    });
    const verifyText = await verifyRes.text();
    if (!/is_valid\s*:\s*true/.test(verifyText)) throw new Error("assertion_invalid");

    // 3) Steam profil bilgisi (isim/avatar) — opsiyonel, hata olsa da devam
    let steamName = "Steam";
    let steamAvatar = "";
    try {
      const apiKey = process.env.STEAM_API_KEY!;
      const pr = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`,
      );
      const pj = await pr.json();
      const player = pj?.response?.players?.[0];
      if (player) {
        steamName = player.personaname || steamName;
        steamAvatar = player.avatarmedium || "";
      }
    } catch {
      /* profil çekilemese de giriş devam eder */
    }

    // 4) Clerk: externalId ile bul/oluştur
    const externalId = `steam:${steamId}`;
    const clerk = await clerkClient();
    const existing = await clerk.users.getUserList({ externalId: [externalId], limit: 1 });
    let userId = existing.data[0]?.id;

    if (!userId) {
      const created = await clerk.users.createUser({
        externalId,
        username: `steam_${steamId}`.slice(0, 64),
        firstName: steamName,
        skipPasswordRequirement: true,
        unsafeMetadata: {
          steamId,
          steamName,
          steamAvatar,
          fullName: steamName,
        },
      });
      userId = created.id;
    }

    // 5) Sign-in token → frontend session açacak
    const token = await clerk.signInTokens.createSignInToken({
      userId,
      expiresInSeconds: 300,
    });

    const finish = new URL("/sign-in/steam-finish", SITE);
    finish.searchParams.set("token", token.token);
    return NextResponse.redirect(finish);
  } catch (e) {
    console.error("Steam callback error:", e);
    const msg = e instanceof Error ? e.message : "unknown";
    const url = new URL("/sign-in", SITE);
    url.searchParams.set("steam_error", "1");
    url.searchParams.set("reason", msg.slice(0, 120));
    return NextResponse.redirect(url);
  }
}
