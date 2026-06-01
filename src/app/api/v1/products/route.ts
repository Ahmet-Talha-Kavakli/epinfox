import { authenticateReseller, logRequest, resellerPrice } from "@/lib/api/reseller-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/v1/products — satılabilir ürünler + varyantlar (bayi indirimli fiyat)
export async function GET(req: Request) {
  const auth = await authenticateReseller(req, "/api/v1/products", "GET");
  if (!auth.ok) return auth.response;
  const { reseller, supabase } = auth;

  const { data: products } = await supabase
    .from("products")
    .select(
      "slug, name, delivery_type, category:categories(slug), variants:product_variants(id, label, price, is_active)",
    )
    .eq("is_active", true)
    .order("position", { ascending: true });

  const out = (products ?? []).map((p: Record<string, unknown>) => {
    const variants = ((p.variants as Record<string, unknown>[]) ?? [])
      .filter((v) => v.is_active)
      .map((v) => {
        const list = Number(v.price ?? 0);
        return {
          id: v.id,
          label: v.label,
          list_price: list,
          reseller_price: resellerPrice(list, reseller.discountPct),
        };
      });
    return {
      slug: p.slug,
      name: p.name,
      category: (p.category as { slug?: string } | null)?.slug ?? null,
      delivery_type: p.delivery_type,
      variants,
    };
  });

  await logRequest(supabase, reseller.id, "/api/v1/products", "GET", 200, req);

  return NextResponse.json({ products: out, discount_pct: reseller.discountPct });
}
