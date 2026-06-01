import Link from "next/link";
import { getAdminCategories, getAdminProducts } from "@/lib/actions/admin-products";
import { ProductForm } from "@/components/admin/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTL } from "@/lib/format";

export default async function AdminProductsPage() {
  const [categories, products] = await Promise.all([
    getAdminCategories(),
    getAdminProducts(),
  ]);
  const catName = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Yeni ürün formu */}
      <Card className="border-ink-200 lg:col-span-2">
        <CardHeader>
          <CardTitle>Yeni Ürün</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm categories={categories} />
        </CardContent>
      </Card>

      {/* Ürün listesi */}
      <Card className="border-ink-200 lg:col-span-3">
        <CardHeader>
          <CardTitle>Ürünler ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-ink-100">
            {products.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">
                    {p.name}
                  </p>
                  <p className="text-xs text-ink-400">
                    {catName.get(p.category_id)} · {formatTL(p.price)} ·{" "}
                    {p.is_active ? (
                      <span className="text-success-600">aktif</span>
                    ) : (
                      <span className="text-ink-400">pasif</span>
                    )}
                  </p>
                </div>
                <Link
                  href={`/admin/products/${p.id}`}
                  className="shrink-0 rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50"
                >
                  Düzenle
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
