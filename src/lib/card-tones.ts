// Premium kart tone sistemi — FairPlay indigo/violet paletine adapte.
//
// Tone listesi:
//   brand   → indigo (ana marka, primary CTA, info kartlar)
//   accent  → violet (premium, lobi yöneticisi, öne çıkan)
//   success → emerald (onaylı, aktif, açık lobi)
//   danger  → red (ban, kapalı lobi, uyarı)
//   warning → amber (bekleyen başvuru, dolu lobi)
//   info    → sky (genel bilgi kartı)
//   neutral → ink (sade kartlar)

export type Tone =
  | "brand"
  | "accent"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral";

export interface ToneStyle {
  stripe: string;
  iconBg: string;
  iconRing: string;
  iconColor: string;
  hoverShadow: string;
  cornerGlow: string;
  bigNumber: string;
  texture: string;
}

// Indigo watercolor — soft purple-blue
const BRAND_TEXTURE = `
  radial-gradient(ellipse 70% 55% at 28% 25%, rgba(199, 210, 254, 0.32) 0%, rgba(199, 210, 254, 0.08) 45%, transparent 75%),
  radial-gradient(ellipse 45% 38% at 82% 78%, rgba(196, 181, 253, 0.22) 0%, transparent 70%),
  radial-gradient(ellipse 30% 25% at 90% 18%, rgba(233, 213, 255, 0.14) 0%, transparent 75%)
`;

// Violet pastel — premium aksan
const ACCENT_TEXTURE = `
  radial-gradient(ellipse 65% 50% at 25% 28%, rgba(216, 180, 254, 0.30) 0%, rgba(216, 180, 254, 0.08) 45%, transparent 75%),
  radial-gradient(ellipse 50% 40% at 82% 78%, rgba(192, 132, 252, 0.18) 0%, transparent 72%),
  radial-gradient(ellipse 28% 22% at 92% 20%, rgba(233, 213, 255, 0.16) 0%, transparent 75%)
`;

// Mint watercolor — başarı/aktif
const SUCCESS_TEXTURE = `
  radial-gradient(ellipse 70% 55% at 28% 25%, rgba(167, 243, 208, 0.32) 0%, rgba(167, 243, 208, 0.08) 45%, transparent 75%),
  radial-gradient(ellipse 45% 38% at 82% 78%, rgba(190, 219, 200, 0.22) 0%, transparent 70%),
  radial-gradient(ellipse 30% 25% at 90% 18%, rgba(220, 252, 231, 0.14) 0%, transparent 75%)
`;

// Dağılmış peach-rose noktalar — danger
const DANGER_TEXTURE = `
  radial-gradient(circle 60px at 18% 28%, rgba(254, 215, 196, 0.34) 0%, transparent 70%),
  radial-gradient(circle 45px at 78% 22%, rgba(252, 198, 200, 0.28) 0%, transparent 70%),
  radial-gradient(circle 80px at 88% 75%, rgba(254, 207, 196, 0.22) 0%, transparent 75%),
  radial-gradient(circle 50px at 25% 78%, rgba(252, 218, 220, 0.20) 0%, transparent 70%),
  radial-gradient(circle 35px at 55% 50%, rgba(254, 215, 196, 0.14) 0%, transparent 75%)
`;

// Cream-amber blob — warning
const WARNING_TEXTURE = `
  radial-gradient(ellipse 80% 50% at 20% 78%, rgba(254, 240, 180, 0.34) 0%, rgba(254, 230, 180, 0.10) 45%, transparent 75%),
  radial-gradient(ellipse 55% 40% at 82% 22%, rgba(254, 224, 175, 0.28) 0%, transparent 70%),
  radial-gradient(ellipse 35% 28% at 50% 50%, rgba(254, 215, 160, 0.12) 0%, transparent 75%)
`;

// Soft blue halkalar — info
const INFO_TEXTURE = `
  radial-gradient(ellipse 60% 50% at 78% 22%, rgba(186, 219, 234, 0.30) 0%, rgba(186, 219, 234, 0.08) 45%, transparent 75%),
  radial-gradient(circle 100px at 20% 75%, rgba(207, 226, 232, 0.26) 0%, transparent 70%),
  radial-gradient(ellipse 40% 30% at 50% 50%, rgba(196, 222, 232, 0.10) 0%, transparent 75%)
`;

// Çok soluk warm wash — neutral
const NEUTRAL_TEXTURE = `
  radial-gradient(ellipse 65% 50% at 30% 30%, rgba(228, 220, 208, 0.22) 0%, transparent 72%),
  radial-gradient(ellipse 50% 40% at 78% 78%, rgba(218, 210, 200, 0.18) 0%, transparent 72%)
`;

export const TONE_STYLES: Record<Tone, ToneStyle> = {
  brand: {
    stripe: "border-l-brand-500",
    iconBg: "from-brand-100 via-brand-50 to-white",
    iconRing: "ring-brand-200/60",
    iconColor: "text-brand-700",
    hoverShadow: "hover:shadow-[0_12px_32px_-8px_rgba(79,70,229,0.22)]",
    cornerGlow: "from-brand-100/40",
    bigNumber: "text-brand-50",
    texture: BRAND_TEXTURE,
  },
  accent: {
    stripe: "border-l-accent-500",
    iconBg: "from-accent-100 via-accent-50 to-white",
    iconRing: "ring-accent-200/60",
    iconColor: "text-accent-700",
    hoverShadow: "hover:shadow-[0_12px_32px_-8px_rgba(168,85,247,0.22)]",
    cornerGlow: "from-accent-100/40",
    bigNumber: "text-accent-50",
    texture: ACCENT_TEXTURE,
  },
  success: {
    stripe: "border-l-success-500",
    iconBg: "from-success-100 via-success-50 to-white",
    iconRing: "ring-success-200/60",
    iconColor: "text-success-700",
    hoverShadow: "hover:shadow-[0_12px_32px_-8px_rgba(16,185,129,0.22)]",
    cornerGlow: "from-success-100/40",
    bigNumber: "text-success-50",
    texture: SUCCESS_TEXTURE,
  },
  danger: {
    stripe: "border-l-danger-500",
    iconBg: "from-danger-100 via-danger-50 to-white",
    iconRing: "ring-danger-200/60",
    iconColor: "text-danger-600",
    hoverShadow: "hover:shadow-[0_12px_32px_-8px_rgba(239,68,68,0.22)]",
    cornerGlow: "from-danger-100/40",
    bigNumber: "text-danger-50",
    texture: DANGER_TEXTURE,
  },
  warning: {
    stripe: "border-l-warning-500",
    iconBg: "from-warning-100 via-warning-50 to-white",
    iconRing: "ring-warning-200/60",
    iconColor: "text-warning-600",
    hoverShadow: "hover:shadow-[0_12px_32px_-8px_rgba(245,158,11,0.22)]",
    cornerGlow: "from-warning-100/40",
    bigNumber: "text-warning-50",
    texture: WARNING_TEXTURE,
  },
  info: {
    stripe: "border-l-sky-500",
    iconBg: "from-sky-100 via-sky-50 to-white",
    iconRing: "ring-sky-200/60",
    iconColor: "text-sky-700",
    hoverShadow: "hover:shadow-[0_12px_32px_-8px_rgba(14,165,233,0.22)]",
    cornerGlow: "from-sky-100/40",
    bigNumber: "text-sky-50",
    texture: INFO_TEXTURE,
  },
  neutral: {
    stripe: "border-l-ink-400",
    iconBg: "from-ink-100 via-ink-50 to-white",
    iconRing: "ring-ink-200/60",
    iconColor: "text-ink-700",
    hoverShadow: "hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]",
    cornerGlow: "from-ink-100/40",
    bigNumber: "text-ink-100",
    texture: NEUTRAL_TEXTURE,
  },
};

export function getToneTextureStyle(tone: Tone): { backgroundImage: string } {
  return {
    backgroundImage: TONE_STYLES[tone].texture,
  };
}
