"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/** Döküman kod bloğu — köşede kopyala butonu. */
export function CodeBlock({
  code,
  lang = "bash",
}: {
  code: string;
  lang?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative">
      <pre className="overflow-x-auto rounded-xl bg-ink-900 p-4 pr-12 text-xs leading-relaxed text-ink-100">
        <code data-lang={lang}>{code}</code>
      </pre>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* no-op */
          }
        }}
        aria-label="Kopyala"
        className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
      >
        {copied ? <Check className="h-4 w-4 text-success-400" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
