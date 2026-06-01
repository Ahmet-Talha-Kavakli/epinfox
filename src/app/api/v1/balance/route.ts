import { authenticateReseller, logRequest } from "@/lib/api/reseller-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/v1/balance — bayi cüzdan bakiyesi + kademe bilgisi
export async function GET(req: Request) {
  const auth = await authenticateReseller(req, "/api/v1/balance", "GET");
  if (!auth.ok) return auth.response;
  const { reseller, supabase } = auth;

  await logRequest(supabase, reseller.id, "/api/v1/balance", "GET", 200, req);

  return NextResponse.json({
    balance: reseller.balance,
    currency: "TRY",
    tier: reseller.tier,
    discount_pct: reseller.discountPct,
  });
}
