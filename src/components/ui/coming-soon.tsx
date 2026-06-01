import Link from "next/link";
import type { Icon } from "@phosphor-icons/react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

/** Henüz içeriği hazır olmayan sayfalar için tutarlı "çok yakında" ekranı. */
export function ComingSoon({
  icon: Icon,
  badge,
  title,
  description,
  primary,
  secondary,
}: {
  icon: Icon;
  badge: string;
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
          <Icon size={32} weight="duotone" />
        </span>
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-sm font-medium text-accent-700">
          {badge}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-ink-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 leading-relaxed text-ink-500">{description}</p>

        {(primary || secondary) && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {primary && (
              <Link
                href={primary.href}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                {primary.label}
                <ArrowRight size={16} weight="bold" />
              </Link>
            )}
            {secondary && (
              <Link
                href={secondary.href}
                className="inline-flex items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
