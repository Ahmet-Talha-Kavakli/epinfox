"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addProductCodes,
  getProductVariantsForCodes,
} from "@/lib/actions/admin-codes";

interface VariantOpt {
  id: string;
  label: string;
  available: number;
}

const selectCls =
  "flex h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

export function CodeBulkForm({
  products,
}: {
  products: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [variants, setVariants] = useState<VariantOpt[]>([]);
  const [variantId, setVariantId] = useState("");
  const [codesText, setCodesText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingVariants, startLoad] = useTransition();
  const [pending, startSubmit] = useTransition();

  function onProductChange(id: string) {
    setProductId(id);
    setVariantId("");
    setVariants([]);
    setMsg(null);
    setError(null);
    if (!id) return;
    startLoad(async () => {
      const v = await getProductVariantsForCodes(id);
      setVariants(v);
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    if (!variantId) {
      setError("Önce varyant seçin.");
      return;
    }
    startSubmit(async () => {
      const res = await addProductCodes({ variantId, codesText });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setMsg(`${res.added} kod eklendi.`);
      setCodesText("");
      onProductChange(productId); // stok sayılarını tazele
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="productId">Ürün</Label>
        <select
          id="productId"
          value={productId}
          onChange={(e) => onProductChange(e.target.value)}
          required
          className={selectCls}
        >
          <option value="">Ürün seçin…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="variantId">Varyant</Label>
        <select
          id="variantId"
          value={variantId}
          onChange={(e) => setVariantId(e.target.value)}
          required
          disabled={!productId || loadingVariants}
          className={selectCls}
        >
          <option value="">
            {!productId
              ? "Önce ürün seçin"
              : loadingVariants
                ? "Yükleniyor…"
                : variants.length === 0
                  ? "Varyant yok"
                  : "Varyant seçin…"}
          </option>
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label} — stok: {v.available}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="codesText">Kodlar (her satır bir kod)</Label>
        <Textarea
          id="codesText"
          value={codesText}
          onChange={(e) => setCodesText(e.target.value)}
          required
          placeholder={"ABCD-1234-EFGH\nIJKL-5678-MNOP\n…"}
          className="font-mono text-sm"
        />
      </div>

      {error && <p className="text-sm font-medium text-danger-600">{error}</p>}
      {msg && <p className="text-sm font-medium text-success-600">{msg}</p>}

      <Button type="submit" disabled={pending || !variantId || !codesText.trim()}>
        {pending ? "Ekleniyor…" : "Kodları Ekle"}
      </Button>
    </form>
  );
}
