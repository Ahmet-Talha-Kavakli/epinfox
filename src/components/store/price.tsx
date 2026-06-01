"use client";

import { useI18n } from "@/lib/i18n/provider";

/** TRY tabanlı tutarı seçili para biriminde gösterir. */
export function Price({
  amountTRY,
  className,
}: {
  amountTRY: number;
  className?: string;
}) {
  const { money } = useI18n();
  return <span className={className}>{money(amountTRY)}</span>;
}
