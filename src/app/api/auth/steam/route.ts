import { NextResponse } from "next/server";
import { getSteamAuth } from "@/lib/auth/steam";

/** Steam ile giriş başlat → kullanıcıyı Steam onay sayfasına yönlendir. */
export async function GET() {
  try {
    const steam = getSteamAuth();
    const url = await steam.getRedirectUrl();
    return NextResponse.redirect(url);
  } catch (e) {
    console.error("Steam auth start error:", e);
    return NextResponse.redirect(
      new URL("/sign-in?steam_error=1", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    );
  }
}
