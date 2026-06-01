"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Tag,
  Plus,
  PencilSimple,
  Trash,
  CircleNotch,
  Check,
  X,
  Coins,
  Percent,
  Truck,
} from "@phosphor-icons/react";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { savePromoCode, togglePromoCode, deletePromoCode } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";
import type { PromoCode, PromoType } from "@/lib/supabase/types";

const TYPE_META: Record<PromoType, { label: string; icon: typeof Coins; unit: string }> = {
  bonus_balance: { label: "Bonus Bakiye", icon: Coins, unit: "₺" },
  percent: { label: "Yüzde İndirim", icon: Percent, unit: "%" },
  free_shipping: { label: "Ücretsiz Kargo", icon: Truck, unit: "" },
};

type Draft = {
  id?: string;
  code: string;
  type: PromoType;
  value: string;
  description: string;
  maxUses: string;
  expiresAt: string;
  isActive: boolean;
};

const EMPTY: Draft = {
  code: "",
  type: "bonus_balance",
  value: "",
  description: "",
  maxUses: "",
  expiresAt: "",
  isActive: true,
};

export function PromosManager({ promos }: { promos: PromoCode[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function open(p?: PromoCode) {
    setErr(null);
    setDraft(
      p
        ? {
            id: p.id,
            code: p.code,
            type: p.type,
            value: String(p.value),
            description: p.description ?? "",
            maxUses: p.max_uses ? String(p.max_uses) : "",
            expiresAt: p.expires_at ? p.expires_at.slice(0, 10) : "",
            isActive: p.is_active,
          }
        : { ...EMPTY },
    );
  }

  function save() {
    if (!draft) return;
    setErr(null);
    start(async () => {
      const r = await savePromoCode({
        id: draft.id,
        code: draft.code,
        type: draft.type,
        value: Number(draft.value) || 0,
        description: draft.description || null,
        maxUses: draft.maxUses ? Number(draft.maxUses) : null,
        expiresAt: draft.expiresAt || null,
        isActive: draft.isActive,
      });
      if (r.ok) {
        setDraft(null);
        router.refresh();
      } else setErr(r.error);
    });
  }

  function toggle(p: PromoCode) {
    start(async () => {
      await togglePromoCode({ id: p.id, active: !p.is_active });
      router.refresh();
    });
  }
  function remove(id: string) {
    start(async () => {
      await deletePromoCode({ id });
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => open()} size="sm">
          <Plus size={16} weight="bold" /> Yeni Promo Kod
        </Button>
      </div>

      {/* Form */}
      {draft && (
        <div className="animate-scale-in rounded-2xl border border-brand-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">{draft.id ? "Promo Kodu Düzenle" : "Yeni Promo Kod"}</h2>
            <button onClick={() => setDraft(null)} className="grid h-8 w-8 place-items-center rounded-full text-ink-500 hover:bg-ink-100">
              <X size={18} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Kod *</Label>
              <Input value={draft.code} onChange={(e) => setDraft((d) => d && { ...d, code: e.target.value.toUpperCase() })} placeholder="EPINFOX10" disabled={pending} />
            </div>
            <div>
              <Label>Tür</Label>
              <select
                value={draft.type}
                onChange={(e) => setDraft((d) => d && { ...d, type: e.target.value as PromoType })}
                disabled={pending}
                className="h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm focus:border-brand-400 focus:outline-none"
              >
                {(Object.keys(TYPE_META) as PromoType[]).map((t) => (
                  <option key={t} value={t}>{TYPE_META[t].label}</option>
                ))}
              </select>
            </div>
            {draft.type !== "free_shipping" && (
              <div>
                <Label>Değer ({TYPE_META[draft.type].unit})</Label>
                <Input type="number" value={draft.value} onChange={(e) => setDraft((d) => d && { ...d, value: e.target.value })} placeholder={draft.type === "percent" ? "10" : "25"} disabled={pending} />
              </div>
            )}
            <div>
              <Label>Maks. Kullanım</Label>
              <Input type="number" value={draft.maxUses} onChange={(e) => setDraft((d) => d && { ...d, maxUses: e.target.value })} placeholder="Sınırsız" disabled={pending} />
            </div>
            <div>
              <Label>Son Geçerlilik</Label>
              <Input type="date" value={draft.expiresAt} onChange={(e) => setDraft((d) => d && { ...d, expiresAt: e.target.value })} disabled={pending} />
            </div>
            <div className="sm:col-span-2">
              <Label>Açıklama</Label>
              <Input value={draft.description} onChange={(e) => setDraft((d) => d && { ...d, description: e.target.value })} placeholder="Kullanıcıya gösterilecek açıklama" disabled={pending} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDraft((d) => d && { ...d, isActive: !d.isActive })}
            className="mt-4 flex items-center gap-2 text-sm text-ink-700"
          >
            <span className={cn("grid h-5 w-5 place-items-center rounded-md border", draft.isActive ? "border-brand-600 bg-brand-600 text-white" : "border-ink-300")}>
              {draft.isActive && <Check size={13} weight="bold" />}
            </span>
            Aktif
          </button>
          {err && <p className="mt-3 text-sm font-medium text-danger-600">{err}</p>}
          <div className="mt-5 flex gap-2">
            <Button onClick={save} disabled={pending || !draft.code.trim()}>
              {pending ? <CircleNotch size={16} className="animate-spin" /> : <Check size={16} weight="bold" />}
              Kaydet
            </Button>
            <Button variant="ghost" onClick={() => setDraft(null)} disabled={pending}>Vazgeç</Button>
          </div>
        </div>
      )}

      {/* Liste */}
      {promos.length === 0 && !draft ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
          <Tag size={28} weight="duotone" className="mx-auto text-ink-300" />
          <p className="mt-2 text-sm text-ink-500">Henüz promo kod yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {promos.map((p) => {
            const meta = TYPE_META[p.type];
            return (
              <div key={p.id} className={cn("rounded-2xl border bg-white p-5", p.is_active ? "border-ink-200" : "border-ink-200 opacity-60")}>
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-200">
                    <meta.icon size={20} weight="duotone" />
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => open(p)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100" aria-label="Düzenle">
                      <PencilSimple size={15} />
                    </button>
                    <button onClick={() => remove(p.id)} disabled={pending} className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-danger-50 hover:text-danger-600" aria-label="Sil">
                      <Trash size={15} />
                    </button>
                  </div>
                </div>
                <p className="mt-3 font-mono text-lg font-extrabold tracking-wide text-ink-900">{p.code}</p>
                <p className="text-xs text-ink-500">
                  {meta.label}
                  {p.type !== "free_shipping" ? ` · ${p.value}${meta.unit}` : ""}
                </p>
                {p.description && <p className="mt-1 text-xs text-ink-400">{p.description}</p>}
                <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3">
                  <span className="text-xs text-ink-400">
                    {p.used_count}{p.max_uses ? `/${p.max_uses}` : ""} kullanım
                  </span>
                  <button
                    onClick={() => toggle(p)}
                    disabled={pending}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                      p.is_active ? "bg-success-50 text-success-700 hover:bg-success-100" : "bg-ink-100 text-ink-500 hover:bg-ink-200",
                    )}
                  >
                    {p.is_active ? "Aktif" : "Pasif"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
