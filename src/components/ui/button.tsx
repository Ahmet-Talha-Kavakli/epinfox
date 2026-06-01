import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white shadow-soft hover:bg-brand-700 active:scale-[0.98]",
        secondary:
          "bg-ink-100 text-ink-900 hover:bg-ink-200 active:scale-[0.98]",
        outline:
          "border border-ink-200 bg-white text-ink-900 hover:bg-ink-50 active:scale-[0.98]",
        ghost: "text-ink-700 hover:bg-ink-100 active:scale-[0.98]",
        danger:
          "bg-danger-600 text-white hover:bg-danger-700 active:scale-[0.98]",
        accent:
          "bg-accent-600 text-white shadow-soft hover:bg-accent-700 active:scale-[0.98]",
        success:
          "bg-success-600 text-white shadow-soft hover:bg-success-700 active:scale-[0.98]",
        warning:
          "bg-warning-500 text-white shadow-soft hover:bg-warning-600 active:scale-[0.98]",
        link: "text-brand-600 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-[15px]",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
