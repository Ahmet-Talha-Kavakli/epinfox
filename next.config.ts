import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
