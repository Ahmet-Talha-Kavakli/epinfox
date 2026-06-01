import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { getSteamAuth } from "@/lib/auth/steam";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Steam callback: Steam'den dönen kullanıcıyı çözer, Clerk'te externalId =
 * "steam:<steamid>" ile bul/oluştur, sign-in token üretip frontend'e döner.
 * Frontend (/sign-in/steam-finish) bu token ile Clerk session'ı açar.
 */
export async function GET(req: NextRequest) {
  try {
    const steam = getSteamAuth();
    const user = await steam.authenticate({
      url: req.url,
      headers: Object.fromEntries(req.headers),
    });
    // user: { steamid, username, name, profile, avatar: {small,medium,large} }
    const steamId = user.steamid;
    const externalId = `steam:${steamId}`;

    const clerk = await clerkClient();

    // 1) Mevcut kullanıcı var mı (externalId ile)
    const existing = await clerk.users.getUserList({ externalId: [externalId], limit: 1 });
    let userId = existing.data[0]?.id;

    // 2) Yoksa oluştur (Steam email vermez → sentetik, şifre yok/skip)
    if (!userId) {
      const created = await clerk.users.createUser({
        externalId,
        username: `steam_${steamId}`.slice(0, 64),
        firstName: user.username || user.name || "Steam",
        skipPasswordRequirement: true,
        unsafeMetadata: {
          steamId,
          steamName: user.username || user.name || "",
          steamAvatar: user.avatar?.medium || "",
          fullName: user.username || user.name || "",
        },
      });
      userId = created.id;
    }

    // 3) Sign-in token üret → frontend session açacak
    const token = await clerk.signInTokens.createSignInToken({
      userId,
      expiresInSeconds: 300,
    });

    // 4) Frontend finish sayfasına token ile yönlendir
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
