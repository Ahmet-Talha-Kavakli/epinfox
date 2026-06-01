"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveProduct } from "@/lib/actions/admin-products";
import type { Category, Product } from "@/lib/supabase/types";

const TONES = ["brand", "accent", "success", "danger", "warning", "info", "neutral"];

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setDone(false);
    const fd = new FormData(e.currentTarget);
    const input = {
      id: product?.id,
      category_id: fd.get("category_id"),
      slug: fd.get("slug"),
      name: fd.get("name"),
      description: fd.get("description"),
      price: fd.get("price"),
      tone: fd.get("tone"),
      is_active: fd.get("is_active") === "on",
      position: fd.get("position") || 100,
      delivery_type: fd.get("delivery_type"),
      supply_source: fd.get("supply_source"),
      how_to: fd.get("how_to"),
      requirements: fd.get("requirements"),
      faq: fd.get("faq"),
    };
    startTransition(async () => {
      const res = await saveProduct(input);
      if (!res.ok) setError(res.error);
      else {
        setDone(true);
        router.refresh();
        if (!product) (e.target as HTMLFormElement).reset();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Ürün adı</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            placeholder="pubg-660-uc"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Fiyat (₺)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.price}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category_id">Kategori</Label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={product?.category_id}
            required
            className="flex h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="tone">Ton (kart rengi)</Label>
          <select
            id="tone"
            name="tone"
            defaultValue={product?.tone ?? "brand"}
            className="flex h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
          className="min-h-[80px]"
        />
      </div>

      {/* Tedarik */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="delivery_type">Teslim tipi</Label>
          <select
            id="delivery_type"
            name="delivery_type"
            defaultValue={product?.delivery_type ?? "code"}
            className="flex h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="code">Kod teslim (Steam/Google Play vb.)</option>
            <option value="topup">Direct top-up (oyuncu ID'sine yükleme)</option>
            <option value="service">Sosyal medya hizmeti (SMM — link)</option>
          </select>
        </div>
        <div>
          <Label htmlFor="supply_source">Tedarik kaynağı</Label>
          <select
            id="supply_source"
            name="supply_source"
            defaultValue={product?.supply_source ?? "manual"}
            className="flex h-11 w-full rounded-xl border border-ink-200 bg-white px-4 text-[15px] text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="manual">Manuel (DB stoğundan)</option>
            <option value="manual_pending">Manuel köprü (elle teslim)</option>
            <option value="mock">Mock (test sağlayıcı)</option>
            <option value="seagm">SEAGM (oyun e-pin/top-up)</option>
            <option value="smm">SMM (sosyal medya paneli)</option>
          </select>
        </div>
      </div>
      <p className="-mt-2 text-xs text-ink-400">
        Manuel: kodları sen yüklersin. Mock/API: sağlayıcıdan otomatik teslim
        (stok tutmaz). Top-up: kod yerine oyuncu ID'sine yükleme. Sosyal medya
        (SMM): hedef link + supply_source=smm; varyantlara panel servis id&apos;si
        eşlenir, teslim asenkron tamamlanır.
      </p>

      {/* Ürüne özel içerik (opsiyonel — boşsa generic gösterilir) */}
      <div className="space-y-4 rounded-xl border border-ink-200 bg-ink-50/40 p-4">
        <p className="text-sm font-semibold text-ink-800">
          Ürüne Özel İçerik{" "}
          <span className="font-normal text-ink-400">(opsiyonel)</span>
        </p>
        <div>
          <Label htmlFor="how_to">Nasıl Kullanılır — adımlar</Label>
          <Textarea
            id="how_to"
            name="how_to"
            defaultValue={(product?.how_to ?? []).join("\n")}
            placeholder={"Her satıra bir adım yaz:\nSteam istemcisini aç\nCüzdana kod ekle'ye tıkla\nKodu yapıştır ve onayla"}
            className="min-h-[100px]"
          />
          <p className="mt-1 text-xs text-ink-400">
            Her satır bir adımdır. Boş bırakırsan genel adımlar gösterilir.
          </p>
        </div>
        <div>
          <Label htmlFor="requirements">Önemli notlar / gereksinimler</Label>
          <Textarea
            id="requirements"
            name="requirements"
            defaultValue={product?.requirements ?? ""}
            placeholder="Örn. Yalnızca TR bölgesi Steam hesaplarında geçerlidir. Kod tek kullanımlıktır."
            className="min-h-[70px]"
          />
          <p className="mt-1 text-xs text-ink-400">
            Detaydaki “Önemli” kutusunda gösterilir. Boşsa genel uyarı çıkar.
          </p>
        </div>
        <div>
          <Label htmlFor="faq">Sık Sorulan Sorular</Label>
          <Textarea
            id="faq"
            name="faq"
            defaultValue={(product?.faq ?? [])
              .map((f) => `${f.q} | ${f.a}`)
              .join("\n")}
            placeholder={"Her satır: soru | cevap\nKod ne zaman gelir? | Ödeme sonrası anında.\nİade var mı? | Görüntülenmemiş kodlarda evet."}
            className="min-h-[90px]"
          />
          <p className="mt-1 text-xs text-ink-400">
            Her satır <code className="rounded bg-ink-100 px-1">soru | cevap</code>{" "}
            biçimindedir. Boşsa genel SSS gösterilir.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="position">Sıra</Label>
          <Input
            id="position"
            name="position"
            type="number"
            defaultValue={product?.position ?? 100}
          />
        </div>
        <label className="flex items-end gap-2 pb-3">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product?.is_active ?? true}
            className="h-4 w-4 rounded border-ink-300 text-brand-600"
          />
          <span className="text-sm text-ink-800">Aktif (satışta)</span>
        </label>
      </div>

      {error && <p className="text-sm font-medium text-danger-600">{error}</p>}
      {done && (
        <p className="text-sm font-medium text-success-600">Kaydedildi.</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Kaydediliyor…" : product ? "Güncelle" : "Ürün Ekle"}
      </Button>
    </form>
  );
}
