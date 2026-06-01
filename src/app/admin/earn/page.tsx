import { CurrencyCircleDollar } from "@phosphor-icons/react/dist/ssr";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { EarnReview } from "@/components/admin/earn-review";
import { formatDate } from "@/lib/utils";

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  other: "Diğer",
};

const EARN_BUCKET = "earn-attachments";

type AppRow = {
  id: string;
  user_id: string;
  platform: string;
  content_url: string;
  note: string | null;
  attachments: { path: string; name: string; mime: string; size: number }[] | null;
  status: "pending" | "approved" | "rejected";
  reward: number | string;
  reject_reason: string | null;
  created_at: string;
  profile: { nickname: string; email: string } | null;
};

export default async function AdminEarnPage() {
  await requireAdmin();
  const supabase = await createAdminClient();

  const { data } = await supabase
    .from("earn_submissions")
    .select(
      "*, profile:profiles!earn_submissions_user_id_fkey(nickname, email)",
    )
    .order("created_at", { ascending: false });
  const apps = (data as AppRow[]) ?? [];

  // Kanıt görselleri için imzalı URL (1 saat).
  for (const a of apps) {
    if (!a.attachments?.length) continue;
    for (const att of a.attachments) {
      const { data: signed } = await supabase.storage
        .from(EARN_BUCKET)
        .createSignedUrl(att.path, 3600);
      (att as { url?: string }).url = signed?.signedUrl;
    }
  }

  const pending = apps.filter((a) => a.status === "pending");
  const history = apps.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-ink-900">
          <CurrencyCircleDollar size={22} weight="duotone" className="text-brand-600" />
          Para Kazan Başvuruları
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Sosyal medya paylaşımlarını incele, onayla (ödül ver) veya reddet.
        </p>
      </div>

      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>Bekleyen ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pending.length === 0 ? (
            <EmptyState
              title="Bekleyen başvuru yok"
              description="Yeni paylaşım başvuruları burada görünür."
            />
          ) : (
            pending.map((a) => (
              <AppCard key={a.id} app={a} review />
            ))
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card className="border-ink-200">
          <CardHeader>
            <CardTitle>Geçmiş ({history.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {history.map((a) => (
              <AppCard key={a.id} app={a} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AppCard({ app, review = false }: { app: AppRow; review?: boolean }) {
  return (
    <div className="rounded-2xl border border-ink-200 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink-900">
            {app.profile?.nickname ?? "Kullanıcı"}{" "}
            <span className="font-normal text-ink-400">· {app.profile?.email}</span>
          </p>
          <p className="mt-0.5 text-xs text-ink-400">
            {PLATFORM_LABEL[app.platform] ?? app.platform} · {formatDate(app.created_at)}
          </p>
          <a
            href={app.content_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all text-sm text-brand-600 hover:underline"
          >
            {app.content_url}
          </a>
          {app.note && (
            <p className="mt-1 text-sm text-ink-600">“{app.note}”</p>
          )}
          {/* Kanıt görselleri */}
          {app.attachments && app.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {app.attachments.map((att, i) =>
                (att as { url?: string }).url ? (
                  <a
                    key={i}
                    href={(att as { url?: string }).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-brand-600 underline"
                  >
                    Kanıt {i + 1}
                  </a>
                ) : null,
              )}
            </div>
          )}
        </div>

        {!review && (
          <span
            className={
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium " +
              (app.status === "approved"
                ? "bg-success-50 text-success-700"
                : "bg-danger-50 text-danger-600")
            }
          >
            {app.status === "approved"
              ? `Onaylandı · +${Number(app.reward).toLocaleString("tr-TR")}₺`
              : "Reddedildi"}
          </span>
        )}
      </div>

      {!review && app.status === "rejected" && app.reject_reason && (
        <p className="mt-2 text-xs text-ink-500">Sebep: {app.reject_reason}</p>
      )}

      {review && <EarnReview submissionId={app.id} />}
    </div>
  );
}
