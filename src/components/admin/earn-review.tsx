"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { decideEarn } from "@/lib/actions/earn";

// Hızlı ödül önerileri (₺) — admin tek tıkla seçebilir, yine de düzenleyebilir.
const QUICK = [10, 25, 50, 100];

export function EarnReview({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [reward, setReward] = useState("25");
  const [reject, setReject] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function decide(approve: boolean) {
    setError(null);
    start(async () => {
      const res = await decideEarn({
        submissionId,
        approve,
        reward: approve ? Number(reward) || 0 : undefined,
        rejectReason: approve ? undefined : reason || undefined,
      });
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  }

  return (
    <div className="mt-3 border-t border-ink-100 pt-3">
      {!reject ? (
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-500">
              Ödül (₺)
            </label>
            <div className="flex items-center gap-1.5">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setReward(String(q))}
                  className={
                    "rounded-lg px-2 py-1 text-xs font-semibold transition-colors " +
                    (reward === String(q)
                      ? "bg-brand-600 text-white"
                      : "bg-ink-100 text-ink-600 hover:bg-ink-200")
                  }
                >
                  {q}
                </button>
              ))}
              <Input
                type="number"
                min="0"
                step="0.01"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                className="h-9 w-24"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={() => decide(true)}
            disabled={pending}
            className="bg-success-600 hover:bg-success-700"
          >
            <CheckCircle size={16} weight="fill" />
            {pending ? "…" : "Onayla & Öde"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setReject(true)}
            disabled={pending}
          >
            <XCircle size={16} weight="bold" /> Reddet
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            placeholder="Red sebebi (kullanıcıya iletilir)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => decide(false)}
              disabled={pending}
              className="bg-danger-600 hover:bg-danger-700"
            >
              {pending ? "…" : "Reddet"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReject(false)}
              disabled={pending}
            >
              Vazgeç
            </Button>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-danger-600">{error}</p>}
    </div>
  );
}
