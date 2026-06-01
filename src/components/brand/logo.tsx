import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SITE } from "@/config/site";

export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  /** "light": koyu zeminler (footer) için açık renk yazı. */
  variant?: "default" | "light";
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={SITE.name}
    >
      <Image
        src="/brand/logo-fox.png"
        alt={SITE.name}
        width={40}
        height={40}
        priority
        className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
      />
      <span
        className={cn(
          "text-[17px] font-bold tracking-tight",
          variant === "light" ? "text-white" : "text-ink-900",
        )}
      >
        Epin<span className="text-accent-500">Fox</span>
      </span>
    </Link>
  );
}
