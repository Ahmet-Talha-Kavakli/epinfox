"use client";

/**
 * Nav çubuğunun üst kenarında yürüyen tilki maskotu (Hipopotam tarzı, kodla
 * çizili minimal SVG — PNG yok). Wrapper yatay gidip gelir, yön dönüşünde
 * aynalanır; bacaklar ve kuyruk CSS ile gerçek adım/sallanma animasyonu yapar.
 * Renkler markaya uygun: turuncu gövde (accent), koyu detaylar (ink).
 */
export function NavMascot() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-full z-20 h-0"
    >
      {/* Yatay yürüyen kapsayıcı — kapsayıcının üst kenarına hafif binsin */}
      <div className="mascot-walker absolute bottom-[-4px] -translate-x-1/2">
        {/* Yön çevirme */}
        <div className="mascot-flipper">
          {/* Yürüme zıplaması */}
          <div className="mascot-bobber">
            <FoxSvg />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Minimal yan-profil tilki — sağa bakar. Bacaklar/kuyruk ayrı gruplarda. */
function FoxSvg() {
  return (
    <svg
      width="38"
      height="30"
      viewBox="0 0 116 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block select-none drop-shadow-sm"
    >
      {/* Kuyruk (sallanır) */}
      <g className="mascot-tail">
        <path
          d="M16 50c-12 2-16 14-13 24 4-2 9-3 14-2 6-10 8-16 6-22-2-4-5-2-7 0z"
          fill="#f97316"
        />
        <path
          d="M11 70c-1 4 0 7 1 9 2-1 4-1 6-1 0-4-1-6-3-8-2 0-3 0-4 0z"
          fill="#fed7aa"
        />
      </g>

      {/* Arka bacaklar — kalçadan makaslar (pati uçlu) */}
      <g className="mascot-leg-b">
        <rect x="33" y="58" width="8" height="24" rx="4" fill="#ea580c" />
        <ellipse cx="37" cy="82" rx="5.5" ry="3.5" fill="#c2410c" />
      </g>
      <g className="mascot-leg-a">
        <rect x="49" y="58" width="8" height="24" rx="4" fill="#f97316" />
        <ellipse cx="53" cy="82" rx="5.5" ry="3.5" fill="#ea580c" />
      </g>

      {/* Gövde */}
      <ellipse cx="52" cy="52" rx="32" ry="22" fill="#f97316" />
      <path d="M30 56c10 6 34 6 44 0-4 10-40 10-44 0z" fill="#fb923c" />

      {/* Ön bacaklar — zıt faz (pati uçlu) */}
      <g className="mascot-leg-a">
        <rect x="70" y="58" width="8" height="24" rx="4" fill="#ea580c" />
        <ellipse cx="74" cy="82" rx="5.5" ry="3.5" fill="#c2410c" />
      </g>
      <g className="mascot-leg-b">
        <rect x="83" y="58" width="8" height="24" rx="4" fill="#f97316" />
        <ellipse cx="87" cy="82" rx="5.5" ry="3.5" fill="#ea580c" />
      </g>

      {/* Kafa */}
      <g>
        {/* Kulaklar */}
        <path d="M84 18l-6 18 16-4-2-16c-3 0-6 1-8 2z" fill="#ea580c" />
        <path d="M104 20l8 14-14 2 1-16c2-1 4-1 5 0z" fill="#ea580c" />
        <path d="M86 24l-3 9 8-2-1-8c-2 0-3 0-4 1z" fill="#fed7aa" />
        <path d="M104 26l4 7-7 1 1-8c1 0 1 0 2 0z" fill="#fed7aa" />
        {/* Yüz */}
        <ellipse cx="94" cy="44" rx="20" ry="17" fill="#f97316" />
        {/* Beyaz burun bölgesi */}
        <path
          d="M94 38c8 0 16 3 19 8-3 6-12 9-19 9s-16-3-19-9c3-5 11-8 19-8z"
          fill="#fff7ed"
        />
        {/* Burun ucu */}
        <circle cx="113" cy="46" r="3.5" fill="#1c1f26" />
        {/* Göz */}
        <circle cx="98" cy="40" r="3.2" fill="#1c1f26" />
        <circle cx="99" cy="39" r="1" fill="#fff" />
      </g>
    </svg>
  );
}
