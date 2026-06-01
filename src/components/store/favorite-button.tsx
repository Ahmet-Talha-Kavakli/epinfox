"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "@phosphor-icons/react";
import { toggleFavorite } from "@/lib/actions/favorites";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";

/**
 * Ürün kartı sağ üst köşesindeki favori kalp butonu.
 * - Favori ise dolu turuncu kalp, değilse boş kalp.
 * - Optimistic toggle; sonuç gelince server ile senkronlanır.
 * - Giriş yapılmamışsa toggleFavorite içindeki requireMember /sign-in'e yönlendirir;
 *   ayrıca isSignedIn=false ise tıklamada doğrudan /sign-in'e gideriz (daha hızlı UX).
 */
export function FavoriteButton({
  productId,
  initialFavorited = false,
  isSignedIn = false,
}: {
  productId: string;
  initialFavorited?: boolean;
  isSignedIn?: boolean;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();

  function onClick(e: React.MouseEvent) {
    // Kart bir <Link>; butona tıklayınca ürüne gitmesin.
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const next = !favorited;
    setFavorited(next); // optimistic
    startTransition(async () => {
      const res = await toggleFavorite(productId);
      if (res.ok) {
        setFavorited(res.favorited);
      } else {
        setFavorited(!next); // geri al
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={favorited}
      aria-label={
        favorited ? t("c3.favorite.remove") : t("c3.favorite.add")
      }
      title={favorited ? t("c3.favorite.remove") : t("c3.favorite.add")}
      className={cn(
        "absolute right-2.5 top-2.5 z-10 grid h-9 w-9 place-items-center rounded-full bg-white shadow-soft ring-1 ring-ink-200/80 transition-all duration-200 hover:scale-105",
        favorited ? "text-accent-600" : "text-ink-400 hover:text-accent-600",
        pending && "opacity-70",
      )}
    >
      <Heart size={18} weight={favorited ? "fill" : "regular"} />
    </button>
  );
}
