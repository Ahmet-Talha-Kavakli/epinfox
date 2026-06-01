"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CircleNotch,
  CheckCircle,
  XCircle,
  User,
} from "@phosphor-icons/react";
import { Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  deliverPendingOrder,
  cancelPendingOrder,
  type PendingDeliveryRow,
} from "@/lib/actions/admin-codes";
import { formatTL } from "@/lib/format";
import { formatDateTime } from "@/lib/utils";

function shortRef(id: string) {
  return "#" + id.replace(/-/g, "").slice(0, 6).toUpperCase();
}

export function PendingDeliveryRowCard({ order }: { order: PendingDeliveryRow }) {
  const router = useRouter();
  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const isCode = order.delivery_type === "code";

  function deliver() {
    setError(null);
    if (payload.trim().length === 0) {
      setError(isCode ? "En az bir kod girin." : "Teslim notu girin.");
      return;
    }
    startTransition(async () => {
      const res = await deliverPendingOrder({ orderId: order.id, payload });
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  function cancel() {
    setError(null);
    if (!confirm("Siparişi iptal edip tutarı iade etmek istediğine emin misin?"))
      return;
    startTransition(async () => {
      const res = await cancelPendingOrder({ orderId: order.id });
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink-900">{order.product_name}</span>
            {order.variant_label && (
              <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-xs font-medium text-ink-600">
                {order.variant_label}
              </span>
            )}
            <span
              className={
                "rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide " +
                (isCode
                  ? "bg-brand-50 text-brand-700"
                  : "bg-accent-50 text-accent-700")
              }
            >
              {isCode ? "Kod" : "Top-up"}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-400">
            <span className="font-mono">{shortRef(order.id)}</span>
            <span aria-hidden>·</span>
            <span>{formatDateTime(order.created_at)}</span>
            <span aria-hidden>·</span>
            <span>{order.user_nickname ?? order.user_email ?? "?"}</span>
          </div>
          {order.delivery_type === "topup" && order.player_id && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-ink-50 px-2.5 py-1.5 text-sm text-ink-700">
              <User size={15} weight="duotone" />
              Oyuncu ID:{" "}
              <span className="select-all font-mono font-medium">
                {order.player_id}
              </span>
            </div>
          )}
        </div>
        <span className="shrink-0 font-semibold text-ink-900">
          {formatTL(order.price)}
        </span>
      </div>

      <div className="mt-4">
        <Label htmlFor={`payload-${order.id}`}>
          {isCode ? "Teslim edilecek kod(lar) — her satır bir kod" : "Teslim notu"}
        </Label>
        <Textarea
          id={`payload-${order.id}`}
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          rows={isCode ? 3 : 2}
          placeholder={
            isCode
              ? "ABCD-EFGH-IJKL\nMNOP-QRST-UVWX"
              : "Örn. 5000 UC oyuncu hesabına yüklendi."
          }
          className="mt-1.5 font-mono"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm font-medium text-danger-600">{error}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={deliver} disabled={pending} size="sm">
          {pending ? (
            <CircleNotch size={16} className="animate-spin" />
          ) : (
            <CheckCircle size={16} weight="duotone" />
          )}
          Teslim Et
        </Button>
        <Button
          onClick={cancel}
          disabled={pending}
          variant="outline"
          size="sm"
          className="text-danger-600"
        >
          <XCircle size={16} weight="duotone" />
          İptal / İade
        </Button>
      </div>
    </div>
  );
}
