"use client";

import { useEffect } from "react";
import { CircleNotch, Warning } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Onay penceresi (satın alma vb. geri alınamaz işlemler için).
 * open=true iken ekranda modal gösterir.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  pending = false,
  onConfirm,
  onCancel,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}) {
  const { t } = useI18n();
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !pending) onCancel();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !pending) onCancel();
      }}
    >
      <div className="w-full max-w-sm animate-scale-in rounded-t-3xl border border-ink-200 bg-white p-6 shadow-float sm:rounded-3xl">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-warning-50 text-warning-600 ring-1 ring-warning-200">
            <Warning size={20} weight="fill" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-ink-900">{title}</h2>
            {description && (
              <p className="mt-1 text-sm text-ink-600">{description}</p>
            )}
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex gap-2">
          <Button
            onClick={onConfirm}
            disabled={pending}
            className="flex-1"
            variant="accent"
          >
            {pending ? (
              <CircleNotch size={18} className="animate-spin" />
            ) : (
              (confirmLabel ?? t("c3.confirm.ok"))
            )}
          </Button>
          <Button
            onClick={onCancel}
            disabled={pending}
            variant="ghost"
            className="flex-1"
          >
            {cancelLabel ?? t("c3.confirm.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
