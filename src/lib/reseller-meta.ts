import type { ResellerTier } from "@/lib/supabase/types";

/** Kademe → toptan indirim oranı (%). Onayda profile yazılır. */
export const TIER_DISCOUNT: Record<ResellerTier, number> = {
  bronze: 4,
  silver: 8,
  gold: 12,
  platinum: 18,
};

export const TIER_LABEL: Record<ResellerTier, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};
