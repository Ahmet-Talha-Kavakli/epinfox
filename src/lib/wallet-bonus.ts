// Kademeli yükleme bonusu — saf fonksiyon (hem client UI hem server action kullanır).

export const BONUS_TIERS = [
  { min: 500, pct: 6 },
  { min: 250, pct: 4 },
  { min: 100, pct: 2 },
] as const;

export function bonusFor(amount: number): { pct: number; bonus: number } {
  const tier = BONUS_TIERS.find((t) => amount >= t.min);
  const pct = tier?.pct ?? 0;
  const bonus = Math.round(((amount * pct) / 100) * 100) / 100;
  return { pct, bonus };
}
