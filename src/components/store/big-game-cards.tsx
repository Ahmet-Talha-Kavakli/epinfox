import type { Brand } from "@/lib/supabase/types";
import { GameCard } from "./game-card";

/**
 * Büyük dikey oyun kartları gridi (Hipopotamya düzeni): üstte dim key-art,
 * altta ayrı koyu bant + isim. Hover'da spotlight + 3D tilt (GameCard).
 */
export function BigGameCards({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {brands.map((b) => (
        <GameCard key={b.id} brand={b} />
      ))}
    </div>
  );
}
