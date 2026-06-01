"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Check, ArrowRight, X, CircleNotch } from "@phosphor-icons/react";
import { useState, useTransition } from "react";
import { useI18n } from "@/lib/i18n/provider";

type Status = "idle" | "loading" | "success" | "error";

interface SlideButtonProps {
  label: string;
  successLabel?: string;
  errorLabel?: string;
  onConfirm: () => Promise<void>;
  tone?: "danger" | "accent" | "success";
  className?: string;
}

const TONE_STYLES = {
  danger: {
    track:
      "bg-linear-to-r from-danger-100 via-danger-50 to-danger-100 border-danger-300",
    thumb: "bg-linear-to-br from-danger-600 to-danger-700 text-white",
    fill: "bg-danger-200/60",
    text: "text-danger-800",
  },
  accent: {
    track:
      "bg-linear-to-r from-accent-100 via-accent-50 to-accent-100 border-accent-300",
    thumb: "bg-linear-to-br from-accent-600 to-accent-700 text-white",
    fill: "bg-accent-200/60",
    text: "text-accent-800",
  },
  success: {
    track:
      "bg-linear-to-r from-success-100 via-success-50 to-success-100 border-success-300",
    thumb: "bg-linear-to-br from-success-600 to-success-700 text-white",
    fill: "bg-success-200/60",
    text: "text-success-800",
  },
} as const;

const TRACK_WIDTH = 300;
const THUMB_SIZE = 52;
const MAX_DRAG = TRACK_WIDTH - THUMB_SIZE - 8;

export function SlideButton({
  label,
  successLabel,
  errorLabel,
  onConfirm,
  tone = "danger",
  className,
}: SlideButtonProps) {
  const { t: tr } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [, startTransition] = useTransition();
  const x = useMotionValue(0);
  const fillWidth = useTransform(x, [0, MAX_DRAG], [THUMB_SIZE + 8, TRACK_WIDTH]);
  const labelOpacity = useTransform(x, [0, MAX_DRAG * 0.7], [1, 0]);

  const t = TONE_STYLES[tone];

  const handleEnd = (_: unknown, info: PanInfo) => {
    if (status !== "idle") return;
    if (info.point.x === 0 && info.offset.x === 0) return;
    const dragged = x.get();
    if (dragged >= MAX_DRAG * 0.9) {
      setStatus("loading");
      x.set(MAX_DRAG);
      startTransition(async () => {
        try {
          await onConfirm();
          setStatus("success");
        } catch (err) {
          // Özel sinyal: onConfirm bir modal açtı → hata gösterme, sessizce sıfırla.
          if (err instanceof Error && err.message === "__open_modal__") {
            setStatus("idle");
            x.set(0);
            return;
          }
          setStatus("error");
          setTimeout(() => {
            setStatus("idle");
            x.set(0);
          }, 1800);
        }
      });
    } else {
      x.set(0);
    }
  };

  return (
    <div
      className={`relative h-[60px] select-none rounded-full border-2 overflow-hidden ${t.track} ${className ?? ""}`}
      style={{ width: TRACK_WIDTH }}
    >
      <motion.div
        className={`absolute inset-y-0 left-0 ${t.fill}`}
        style={{ width: fillWidth }}
      />
      <motion.span
        className={`absolute inset-0 flex items-center justify-center text-sm font-semibold uppercase tracking-wider ${t.text}`}
        style={{ opacity: labelOpacity }}
      >
        {label}
      </motion.span>
      {status === "loading" && (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink-700">
          <CircleNotch size={18} weight="bold" className="animate-spin mr-2" />
          {tr("c3.slide.sending")}
        </span>
      )}
      {status === "success" && (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-success-700">
          <Check size={18} weight="bold" className="mr-2" />
          {successLabel ?? tr("c3.slide.success")}
        </span>
      )}
      {status === "error" && (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-danger-700">
          <X size={18} weight="bold" className="mr-2" />
          {errorLabel ?? tr("c3.slide.error")}
        </span>
      )}

      <motion.div
        drag={status === "idle" ? "x" : false}
        dragConstraints={{ left: 0, right: MAX_DRAG }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleEnd}
        whileDrag={{ scale: 1.05 }}
        style={{
          x,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          touchAction: "none",
        }}
        className={`absolute top-1/2 -translate-y-1/2 left-1 rounded-full flex items-center justify-center shadow-card cursor-grab active:cursor-grabbing ${t.thumb}`}
      >
        {status === "success" ? (
          <Check size={22} weight="bold" />
        ) : status === "error" ? (
          <X size={22} weight="bold" />
        ) : status === "loading" ? (
          <CircleNotch size={22} weight="bold" className="animate-spin" />
        ) : (
          <ArrowRight size={22} weight="bold" />
        )}
      </motion.div>
    </div>
  );
}
