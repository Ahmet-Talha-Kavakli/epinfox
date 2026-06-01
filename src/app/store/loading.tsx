export default function StoreLoading() {
  return (
    <section className="container-page py-10" aria-hidden>
      {/* Brand strip */}
      <div className="mb-8 flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 w-28 shrink-0 animate-pulse rounded-2xl bg-ink-100"
          />
        ))}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 space-y-3 lg:block">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-9 animate-pulse rounded-lg bg-ink-100"
            />
          ))}
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="mb-6 h-11 w-full animate-pulse rounded-full bg-ink-100" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] animate-pulse rounded-2xl bg-ink-100" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-ink-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-ink-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
