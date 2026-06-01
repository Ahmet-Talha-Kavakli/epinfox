import { createAdminClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PublisherReview } from "@/components/admin/publisher-review";

export const dynamic = "force-dynamic";

interface AppRow {
  id: string;
  user_id: string;
  platform: string;
  tier: string;
  stream_url: string;
  page_title: string;
  min_donation: number;
  alert_provider: string | null;
  status: string;
  reject_reason: string | null;
  created_at: string;
  profile: { nickname: string; email: string } | null;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-warning-50 text-warning-700",
  approved: "bg-success-50 text-success-700",
  rejected: "bg-danger-50 text-danger-600",
};

const PLATFORM_LABEL: Record<string, string> = {
  youtube: "YouTube",
  twitch: "Twitch",
  kick: "Kick",
  tiktok: "TikTok",
  instagram: "Instagram",
};

function fmt(d: string) {
  return new Date(d).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPublishersPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("publisher_applications")
    .select(
      "*, profile:profiles!publisher_applications_user_id_fkey(nickname, email)",
    )
    .order("created_at", { ascending: false });

  const apps = (data as AppRow[]) ?? [];
  const pending = apps.filter((a) => a.status === "pending");
  const history = apps.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-6">
      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>Bekleyen Yayıncı Başvuruları ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <EmptyState
              title="Bekleyen başvuru yok"
              description="Yeni yayıncı başvuruları geldikçe burada onay için listelenir."
            />
          ) : (
            <div className="space-y-4">
              {pending.map((a) => (
                <ApplicationCard key={a.id} app={a} review />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card className="border-ink-200">
          <CardHeader>
            <CardTitle>Geçmiş ({history.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((a) => (
                <ApplicationCard key={a.id} app={a} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ApplicationCard({ app, review }: { app: AppRow; review?: boolean }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-ink-900">{app.page_title}</p>
            <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-600">
              {PLATFORM_LABEL[app.platform] ?? app.platform}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[app.status]}`}
            >
              {app.status === "pending"
                ? "Bekliyor"
                : app.status === "approved"
                  ? "Onaylı"
                  : "Reddedildi"}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-600">
            <a href={app.stream_url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
              {app.stream_url}
            </a>
          </p>
          <p className="mt-0.5 text-xs text-ink-400">
            {app.profile?.nickname ?? "—"} ({app.profile?.email ?? "—"}) · {fmt(app.created_at)}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
            <span>Min. bağış: {app.min_donation}₺</span>
            {app.alert_provider && <span>Alert: {app.alert_provider}</span>}
          </div>
          {app.status === "rejected" && app.reject_reason && (
            <p className="mt-2 text-xs text-danger-600">Red gerekçesi: {app.reject_reason}</p>
          )}
        </div>

        {review && (
          <div className="shrink-0">
            <PublisherReview applicationId={app.id} />
          </div>
        )}
      </div>
    </div>
  );
}
