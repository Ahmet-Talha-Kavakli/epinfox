import { createAdminClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ResellerReview } from "@/components/admin/reseller-review";
import { TIER_LABEL } from "@/lib/reseller-meta";
import type { ResellerApplication, ResellerTier } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface AppRow extends ResellerApplication {
  profile: { nickname: string; email: string; reseller_tier: ResellerTier | null } | null;
}

const CHANNEL_LABEL: Record<string, string> = {
  web: "Web / e-ticaret",
  social: "Sosyal medya",
  physical: "Fiziksel mağaza",
  other: "Diğer",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-warning-50 text-warning-700",
  approved: "bg-success-50 text-success-700",
  rejected: "bg-danger-50 text-danger-600",
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

export default async function AdminResellersPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("reseller_applications")
    .select(
      "*, profile:profiles!reseller_applications_user_id_fkey(nickname, email, reseller_tier)",
    )
    .order("created_at", { ascending: false });

  const apps = (data as AppRow[]) ?? [];
  const pending = apps.filter((a) => a.status === "pending");
  const history = apps.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-6">
      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>Bekleyen Başvurular ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <EmptyState
              title="Bekleyen başvuru yok"
              description="Yeni bayilik başvuruları geldikçe burada onay için listelenir."
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
            <p className="font-bold text-ink-900">{app.company_name}</p>
            <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-600">
              {app.company_type === "company" ? "Firma" : "Şahıs"}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[app.status]}`}
            >
              {app.status === "pending"
                ? "Bekliyor"
                : app.status === "approved"
                  ? `Onaylı${app.profile?.reseller_tier ? ` · ${TIER_LABEL[app.profile.reseller_tier]}` : ""}`
                  : "Reddedildi"}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-600">
            {app.contact_name} · {app.phone}
            {app.tax_number ? ` · VKN/TC: ${app.tax_number}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-ink-400">
            {app.profile?.nickname ?? "—"} ({app.profile?.email ?? "—"}) ·{" "}
            {fmt(app.created_at)}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
            <span>Kanal: {CHANNEL_LABEL[app.channel] ?? app.channel}</span>
            {app.monthly_volume && <span>Aylık hacim: {app.monthly_volume}</span>}
          </div>
          {app.message && (
            <p className="mt-2 rounded-lg bg-ink-50 px-3 py-2 text-sm text-ink-600">
              “{app.message}”
            </p>
          )}
          {app.status === "rejected" && app.reject_reason && (
            <p className="mt-2 text-xs text-danger-600">
              Red gerekçesi: {app.reject_reason}
            </p>
          )}
        </div>

        {review && (
          <div className="shrink-0">
            <ResellerReview applicationId={app.id} />
          </div>
        )}
      </div>
    </div>
  );
}
