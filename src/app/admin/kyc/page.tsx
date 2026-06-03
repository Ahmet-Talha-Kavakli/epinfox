import { createAdminClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { KycReview } from "@/components/admin/kyc-review";
import type { KycStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface KycRow {
  id: string;
  nickname: string;
  email: string;
  kyc_status: KycStatus;
  kyc_full_name: string | null;
  kyc_national_id: string | null;
  kyc_birth_date: string | null;
  kyc_submitted_at: string | null;
  kyc_reviewed_at: string | null;
  kyc_reject_reason: string | null;
}

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-warning-50 text-warning-700",
  approved: "bg-success-50 text-success-700",
  rejected: "bg-danger-50 text-danger-600",
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Bekliyor",
  approved: "Onaylı",
  rejected: "Reddedildi",
};

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** TC kimlik no maskele — son 4 hane gizli (PII koruması). */
function maskTc(tc: string | null) {
  if (!tc || tc.length < 11) return tc ?? "—";
  return `${tc.slice(0, 3)}****${tc.slice(7)}`;
}

export default async function AdminKycPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, nickname, email, kyc_status, kyc_full_name, kyc_national_id, kyc_birth_date, kyc_submitted_at, kyc_reviewed_at, kyc_reject_reason",
    )
    .in("kyc_status", ["pending", "approved", "rejected"])
    .order("kyc_submitted_at", { ascending: false });

  const rows = (data as KycRow[]) ?? [];
  const pending = rows.filter((r) => r.kyc_status === "pending");
  const history = rows.filter((r) => r.kyc_status !== "pending");

  return (
    <div className="space-y-6">
      <Card className="border-ink-200">
        <CardHeader>
          <CardTitle>Bekleyen Kimlik Doğrulamaları ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <EmptyState
              title="Bekleyen başvuru yok"
              description="Yeni KYC başvuruları geldikçe burada incelemeniz için listelenir."
            />
          ) : (
            <div className="space-y-4">
              {pending.map((r) => (
                <KycCard key={r.id} row={r} review />
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
              {history.map((r) => (
                <KycCard key={r.id} row={r} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function KycCard({ row, review }: { row: KycRow; review?: boolean }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-ink-900">
              {row.kyc_full_name ?? row.nickname}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_BADGE[row.kyc_status]}`}
            >
              {STATUS_LABEL[row.kyc_status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-600">
            TC: {maskTc(row.kyc_national_id)}
            {row.kyc_birth_date ? ` · Doğum: ${row.kyc_birth_date}` : ""}
          </p>
          <p className="mt-0.5 text-xs text-ink-400">
            {row.nickname} ({row.email}) · Başvuru: {fmt(row.kyc_submitted_at)}
          </p>
          {row.kyc_status !== "pending" && (
            <p className="mt-0.5 text-xs text-ink-400">
              İncelendi: {fmt(row.kyc_reviewed_at)}
            </p>
          )}
          {row.kyc_status === "rejected" && row.kyc_reject_reason && (
            <p className="mt-2 text-xs text-danger-600">
              Red gerekçesi: {row.kyc_reject_reason}
            </p>
          )}
        </div>

        {review && (
          <div className="shrink-0">
            <KycReview userId={row.id} />
          </div>
        )}
      </div>
    </div>
  );
}
