"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  CircleNotch,
  Eye,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { decideKyc, getKycDocUrls } from "@/lib/actions/kyc";

export function KycReview({ userId }: { userId: string }) {
  const router = useRouter();
  const [reject, setReject] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  // Belge görselleri — lazy (signed URL, 5 dk geçerli)
  const [docs, setDocs] = useState<{ front: string | null; back: string | null } | null>(null);
  const [loadingDocs, setLoadingDocs] = useState(false);

  function loadDocs() {
    setErr(null);
    setLoadingDocs(true);
    getKycDocUrls(userId)
      .then((d) => setDocs(d))
      .catch(() => setErr("Belgeler yüklenemedi."))
      .finally(() => setLoadingDocs(false));
  }

  function decide(approve: boolean) {
    setErr(null);
    start(async () => {
      const r = await decideKyc({
        userId,
        approve,
        rejectReason: approve ? undefined : reason || undefined,
      });
      if (r.ok) router.refresh();
      else setErr(r.error);
    });
  }

  return (
    <div className="space-y-3">
      {/* Belge önizleme */}
      {docs ? (
        <div className="flex flex-wrap gap-3">
          {(["front", "back"] as const).map((side) => (
            <div key={side} className="space-y-1">
              <p className="text-[11px] font-medium text-ink-400">
                {side === "front" ? "Ön yüz" : "Arka yüz"}
              </p>
              {docs[side] ? (
                <a href={docs[side]!} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={docs[side]!}
                    alt={`KYC ${side}`}
                    className="h-32 w-48 rounded-lg border border-ink-200 object-cover transition-opacity hover:opacity-90"
                  />
                </a>
              ) : (
                <div className="grid h-32 w-48 place-items-center rounded-lg border border-dashed border-ink-200 text-xs text-ink-400">
                  Belge yok
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Button
          onClick={loadDocs}
          disabled={loadingDocs}
          size="sm"
          variant="ghost"
        >
          {loadingDocs ? (
            <CircleNotch size={15} className="animate-spin" />
          ) : (
            <Eye size={15} weight="duotone" />
          )}
          Belgeleri Gör
        </Button>
      )}

      {/* Karar */}
      {reject ? (
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
              {pending ? (
                <CircleNotch size={15} className="animate-spin" />
              ) : (
                <XCircle size={15} weight="fill" />
              )}
              Reddet
            </Button>
            <Button
              onClick={() => setReject(false)}
              disabled={pending}
              size="sm"
              variant="ghost"
            >
              Vazgeç
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={() => decide(true)} disabled={pending} size="sm">
            {pending ? (
              <CircleNotch size={15} className="animate-spin" />
            ) : (
              <CheckCircle size={15} weight="fill" />
            )}
            Onayla
          </Button>
          <Button
            onClick={() => setReject(true)}
            disabled={pending}
            size="sm"
            variant="ghost"
            className="text-danger-600 hover:bg-danger-50"
          >
            <XCircle size={15} weight="fill" />
            Reddet
          </Button>
        </div>
      )}
      {err && <p className="text-xs font-medium text-danger-600">{err}</p>}
    </div>
  );
}
