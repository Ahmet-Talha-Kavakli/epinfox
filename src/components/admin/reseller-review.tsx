"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { decideResellerApplication } from "@/lib/actions/reseller";
import { TIER_DISCOUNT, TIER_LABEL } from "@/lib/reseller-meta";
import { cn } from "@/lib/utils";
import type { ResellerTier } from "@/lib/supabase/types";

const TIERS: ResellerTier[] = ["bronze", "silver", "gold", "platinum"];

export function ResellerReview({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [tier, setTier] = useState<ResellerTier>("bronze");
  const [reject, setReject] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function decide(approve: boolean) {
    setErr(null);
    start(async () => {
      const r = await decideResellerApplication({
        applicationId,
        approve,
        tier: approve ? tier : undefined,
        rejectReason: approve ? undefined : reason || undefined,
      });
      if (r.ok) router.refresh();
      else setErr(r.error);
    });
  }

  if (reject) {
    return (
      <div className="space-y-2">
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Red gerekçesi (opsiyonel)"
          disabled={pending}
        />
        <div className="flex gap-2">
          <Button
            onClick={() => decide(false)}
            disabled={pending}
            size="sm"
            variant="ghost"
            className="text-danger-600 hover:bg-danger-50"
          >
            {pending ? <CircleNotch size={15} className="animate-spin" /> : <XCircle size={15} weight="fill" />}
            Reddet
          </Button>
          <Button onClick={() => setReject(false)} disabled={pending} size="sm" variant="ghost">
            Vazgeç
          </Button>
        </div>
        {err && <p className="text-xs font-medium text-danger-600">{err}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Kademe seçimi */}
      <div className="flex flex-wrap gap-1.5">
        {TIERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTier(t)}
            className={cn(
              "rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors",
              tier === t
                ? "border-brand-400 bg-brand-50 text-brand-700"
                : "border-ink-200 text-ink-600 hover:bg-ink-50",
            )}
          >
            {TIER_LABEL[t]} %{TIER_DISCOUNT[t]}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => decide(true)} disabled={pending} size="sm">
          {pending ? <CircleNotch size={15} className="animate-spin" /> : <CheckCircle size={15} weight="fill" />}
          Onayla ({TIER_LABEL[tier]})
        </Button>
        <Button onClick={() => setReject(true)} disabled={pending} size="sm" variant="ghost" className="text-danger-600 hover:bg-danger-50">
          <XCircle size={15} weight="fill" />
          Reddet
        </Button>
      </div>
      {err && <p className="text-xs font-medium text-danger-600">{err}</p>}
    </div>
  );
}
