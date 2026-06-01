"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { syncSmmOrders } from "@/lib/actions/admin-smm";

export function SmmSyncButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function run() {
    setMsg(null);
    setErr(null);
    startTransition(async () => {
      const res = await syncSmmOrders();
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      const r = res.result;
      setMsg(
        `Kontrol edilen: ${r.checked} · Tamamlanan: ${r.completed} · İade: ${r.failed} · Sürüyor: ${r.stillPending}${r.errors ? ` · Hata: ${r.errors}` : ""}`,
      );
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={run} disabled={pending} variant="outline" size="sm">
        <ArrowsClockwise size={16} className={pending ? "animate-spin" : ""} />
        {pending ? "Senkronize ediliyor…" : "Durumları Senkronla"}
      </Button>
      {msg && <p className="text-xs text-success-600">{msg}</p>}
      {err && <p className="text-xs text-danger-600">{err}</p>}
    </div>
  );
}
