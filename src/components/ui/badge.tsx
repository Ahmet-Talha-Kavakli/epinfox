import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 21st.dev (shugar/badge-1) yapısından esinlenip EpinFox paletine uyarlandı:
// zengin renk varyantları (solid + subtle) + 3 boyut + ikon desteği.
const badgeVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-tight whitespace-nowrap tabular-nums",
  {
    variants: {
      variant: {
        // solid
        default: "bg-ink-100 text-ink-700",
        brand: "bg-brand-600 text-white",
        accent: "bg-accent-600 text-white",
        success: "bg-success-600 text-white",
        warning: "bg-warning-500 text-black",
        danger: "bg-danger-600 text-white",
        info: "bg-info-600 text-white",
        // subtle (yumuşak zemin)
        "brand-subtle": "bg-brand-50 text-brand-700",
        "accent-subtle": "bg-accent-50 text-accent-700",
        "success-subtle": "bg-success-50 text-success-700",
        "warning-subtle": "bg-warning-50 text-warning-600 ring-1 ring-warning-500/20",
        "danger-subtle": "bg-danger-50 text-danger-600 ring-1 ring-danger-500/20",
        "info-subtle": "bg-info-50 text-info-700",
        // çerçeveli
        outline: "border border-ink-200 text-ink-700",
      },
      size: {
        sm: "h-5 px-1.5 text-[11px] gap-[3px] [&_svg]:size-3",
        md: "h-6 px-2.5 text-xs gap-1 [&_svg]:size-3.5",
        lg: "h-8 px-3 text-sm gap-1.5 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Metnin solunda gösterilecek ikon (Phosphor/lucide/svg). */
  icon?: React.ReactNode;
}

export function Badge({
  className,
  variant,
  size,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
}
