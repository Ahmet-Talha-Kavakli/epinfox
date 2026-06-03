import type { NextConfig } from "next";

// Tüm sayfalara uygulanan güvenlik başlıkları.
// NOT: Tam Content-Security-Policy (script-src/connect-src) Clerk + Supabase +
// dış servislerle titiz test gerektirir; yanlış CSP siteyi kırar. Bu yüzden
// burada güvenli ve kırmayan temel başlıklar + clickjacking koruması var.
// Tam CSP ayrı bir iş olarak (report-only ile başlanarak) eklenecek.
const securityHeaders = [
  // Clickjacking: sayfanın başka sitelerce iframe'lenmesini engelle.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  // MIME-sniffing kapalı.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer sızıntısını sınırla.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Hassas tarayıcı API'lerini kapat (kamera/mikrofon/konum istemiyoruz).
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // HTTPS zorunlu (1 yıl, alt alan adları dahil). Yalnız HTTPS'te etkin.
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // "X-Powered-By: Next.js" başlığını gizle (parmak izi azalt).
  poweredByHeader: false,
  images: {
    // Ürün görselleri ve dış kaynaklar için tüm HTTPS hostlara izin ver.
    // (İleride spesifik liste yapılabilir.)
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "32mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
