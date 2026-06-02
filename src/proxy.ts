import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/wallet(.*)",
  "/orders(.*)",
  "/account(.*)",
]);

// needsEmail kilidi açıkken serbest bırakılacak yollar: mail doğrulama
// sayfasının kendisi (döngü olmasın), API rotaları (signOut + steam akışı),
// ve çıkış/giriş ekranları. Diğer HER yol steam-email'e yönlenir.
const isSteamEmailExempt = createRouteMatcher([
  "/sign-in/steam-email",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/trpc(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  if (isProtectedRoute(req)) {
    if (!userId) {
      const url = new URL("/sign-in", req.url);
      url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }
  }

  // Steam zorunlu mail doğrulama: needsEmail=true olan oturum, muaf yollar
  // dışında her yerden /sign-in/steam-email'e kilitlenir.
  // publicMetadata JWT'ye Clerk Dashboard'da "Customize session token" ile
  // eklenir: {"publicMetadata":"{{user.public_metadata}}"}. Hem publicMetadata
  // hem metadata claim adını kontrol ederiz (Dashboard'da hangisi tanımlandıysa).
  if (userId && !isSteamEmailExempt(req)) {
    const claims = sessionClaims as
      | { publicMetadata?: { needsEmail?: boolean }; metadata?: { needsEmail?: boolean } }
      | null;
    const needsEmail =
      claims?.publicMetadata?.needsEmail === true ||
      claims?.metadata?.needsEmail === true;
    if (needsEmail) {
      return NextResponse.redirect(new URL("/sign-in/steam-email", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
