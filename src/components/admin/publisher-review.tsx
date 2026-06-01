"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { decidePublisherApplication } from "@/lib/actions/publisher";

export function PublisherReview({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [reject, setReject] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function decide(decision: "approve" | "reject") {
    setErr(null);
    start(async () => {
      const r = await decidePublisherApplication({
        applicationId,
        decision,
        rejectReason: decision === "reject" ? reason || undefined : undefined,
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
            onClick={() => decide("reject")}
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
      <div className="flex gap-2">
        <Button onClick={() => decide("approve")} disabled={pending} size="sm">
          {pending ? <CircleNotch size={15} className="animate-spin" /> : <CheckCircle size={15} weight="fill" />}
          Onayla
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
