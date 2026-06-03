import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/**
 * Arama motoru tarayıcı kuralları.
 * Özel / kişisel / işlemsel sayfalar dizine eklenmez; halka açık katalog serbest.
 */
export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/account",
        "/api",
        "/cart",
        "/wallet",
        "/orders",
        "/invoices",
        "/messages",
        "/notifications",
        "/onboarding",
        "/sign-in",
        "/sign-up",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
