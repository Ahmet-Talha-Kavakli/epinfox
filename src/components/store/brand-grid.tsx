import Link from "next/link";

// Hızlı erişim: popüler oyun/platformlar. Görsel gelene kadar renkli harf rozeti.
const BRANDS = [
  { name: "PUBG Mobile", q: "PUBG", from: "from-amber-400", to: "to-orange-500", short: "P" },
  { name: "Valorant", q: "Valorant", from: "from-rose-400", to: "to-red-500", short: "V" },
  { name: "League of Legends", q: "League", from: "from-sky-400", to: "to-blue-600", short: "LoL" },
  { name: "Free Fire", q: "Free Fire", from: "from-orange-400", to: "to-amber-500", short: "FF" },
  { name: "Steam", q: "Steam", from: "from-slate-600", to: "to-slate-800", short: "S" },
  { name: "Google Play", q: "Google Play", from: "from-emerald-400", to: "to-green-600", short: "G" },
  { name: "PlayStation", q: "PlayStation", from: "from-blue-500", to: "to-indigo-700", short: "PS" },
  { name: "Discord", q: "Discord", from: "from-indigo-400", to: "to-violet-600", short: "D" },
  { name: "Spotify", q: "Spotify", from: "from-green-400", to: "to-emerald-600", short: "Sp" },
  { name: "Xbox", q: "Game Pass", from: "from-lime-500", to: "to-green-700", short: "X" },
  { name: "Netflix", q: "Netflix", from: "from-red-500", to: "to-red-700", short: "N" },
  { name: "Windows", q: "Windows", from: "from-cyan-400", to: "to-sky-600", short: "W" },
];

export function BrandGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {BRANDS.map((b) => (
        <Link
          key={b.name}
          href={`/store?q=${encodeURIComponent(b.q)}`}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-ink-200 bg-white p-4 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
        >
          <span
            className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${b.from} ${b.to} text-sm font-bold text-white shadow-soft transition-transform group-hover:scale-110`}
          >
            {b.short}
          </span>
          <span className="text-center text-xs font-medium text-ink-700">
            {b.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
