import { notFound } from "next/navigation";
import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { getAdminCategories } from "@/lib/actions/admin-products";
import { createAdminClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { CodeBulkForm } from "@/components/admin/code-bulk-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/supabase/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();

  const [categories, { data: product }, { count: available }, { count: sold }] =
    await Promise.all([
      getAdminCategories(),
      supabase.from("products").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("product_codes")
        .select("id", { count: "exact", head: true })
        .eq("product_id", id)
        .eq("status", "available"),
      supabase
        .from("product_codes")
        .select("id", { count: "exact", head: true })
        .eq("product_id", id)
        .eq("status", "sold"),
    ]);

  if (!product) notFound();
  const p = product as Product;

  return (
    <div>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-600"
      >
        <CaretLeft size={15} /> Ürünlere dön
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-ink-200">
          <CardHeader>
            <CardTitle>Ürünü Düzenle</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm categories={categories} product={p} />
          </CardContent>
        </Card>

        <Card className="border-ink-200">
          <CardHeader>
            <CardTitle>Kod Stoğu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl bg-success-50 p-3 text-center">
                <p className="text-2xl font-bold text-success-700">
                  {available ?? 0}
                </p>
                <p className="text-xs text-success-600">Stokta</p>
              </div>
              <div className="flex-1 rounded-xl bg-ink-100 p-3 text-center">
                <p className="text-2xl font-bold text-ink-700">{sold ?? 0}</p>
                <p className="text-xs text-ink-500">Satıldı</p>
              </div>
            </div>
            <CodeBulkForm products={[{ id: p.id, name: p.name }]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
