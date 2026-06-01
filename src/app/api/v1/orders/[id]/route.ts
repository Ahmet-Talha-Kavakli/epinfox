import { NextResponse } from "next/server";
import { authenticateReseller, logRequest } from "@/lib/api/reseller-auth";
import { serializeOrder, fetchOrderCode } from "@/lib/api/order-serialize";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET /api/v1/orders/:id — bayinin kendi siparişinin detayı (kod dahil)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const endpoint = "/api/v1/orders/:id";

  const auth = await authenticateReseller(req, endpoint, "GET");
  if (!auth.ok) return auth.response;
  const { reseller, supabase } = auth;

  if (!UUID_RE.test(id)) {
    await logRequest(supabase, reseller.id, endpoint, "GET", 400, req);
    return NextResponse.json(
      { error: { code: "bad_request", message: "Geçersiz sipariş kimliği." } },
      { status: 400 },
    );
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, product_name, price, status, created_at, reseller_ref")
    .eq("id", id)
    .eq("user_id", reseller.id) // sahiplik kontrolü
    .maybeSingle();

  if (!order) {
    await logRequest(supabase, reseller.id, endpoint, "GET", 404, req);
    return NextResponse.json(
      { error: { code: "not_found", message: "Sipariş bulunamadı." } },
      { status: 404 },
    );
  }

  const code = await fetchOrderCode(supabase, reseller.id, order.id);

  await logRequest(supabase, reseller.id, endpoint, "GET", 200, req);
  return NextResponse.json({ order: serializeOrder(order, code) });
}
