export default function ProductLoading() {
  return (
    <section className="container-page py-8" aria-hidden>
      {/* Breadcrumb */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-ink-100" />
        <div className="h-4 w-20 animate-pulse rounded bg-ink-100" />
        <div className="h-4 w-24 animate-pulse rounded bg-ink-100" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main */}
        <div className="space-y-6">
          <div className="aspect-[16/9] animate-pulse rounded-3xl bg-ink-100" />
          <div className="space-y-3">
            <div className="h-7 w-2/3 animate-pulse rounded bg-ink-100" />
            <div className="h-4 w-full animate-pulse rounded bg-ink-100" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-ink-100" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl bg-ink-100"
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="h-64 animate-pulse rounded-3xl bg-ink-100" />
          <div className="h-12 animate-pulse rounded-full bg-ink-100" />
        </aside>
      </div>
    </section>
  );
}
