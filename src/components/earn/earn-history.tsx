import {
  Clock,
  CheckCircle,
  XCircle,
  ListChecks,
} from "@phosphor-icons/react/dist/ssr";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

export interface EarnRow {
  id: string;
  platform: string;
  content_url: string;
  status: "pending" | "approved" | "rejected";
  reward: number | string;
  reject_reason: string | null;
  created_at: string;
}

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
};

const STATUS = {
  pending: { key: "pending", cls: "bg-warning-50 text-warning-700", icon: Clock },
  approved: { key: "approved", cls: "bg-success-50 text-success-700", icon: CheckCircle },
  rejected: { key: "rejected", cls: "bg-danger-50 text-danger-600", icon: XCircle },
} as const;

export function EarnHistory({
  submissions,
  isLoggedIn,
  t,
  locale = DEFAULT_LOCALE,
}: {
  submissions: EarnRow[];
  isLoggedIn: boolean;
  t: (key: string) => string;
  locale?: Locale;
}) {
  const totalEarned = submissions
    .filter((s) => s.status === "approved")
    .reduce((sum, s) => sum + Number(s.reward), 0);

  return (
    <Card className="border-ink-200 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink-900">
          {t("pages.earn.history.title")}
        </h3>
        {totalEarned > 0 && (
          <span className="rounded-full bg-success-50 px-3 py-1 text-sm font-bold text-success-700">
            +
            {new Intl.NumberFormat("tr-TR", {
              style: "currency",
              currency: "TRY",
              maximumFractionDigits: 0,
            }).format(totalEarned)}{" "}
            {t("pages.earn.history.earnedSuffix")}
          </span>
        )}
      </div>

      <div className="mt-4">
        {!isLoggedIn ? (
          <EmptyState
            title={t("pages.earn.history.loginTitle")}
            description={t("pages.earn.history.loginDesc")}
          />
        ) : submissions.length === 0 ? (
          <EmptyState
            title={t("pages.earn.history.emptyTitle")}
            description={t("pages.earn.history.emptyDesc")}
          />
        ) : (
          <ul className="divide-y divide-ink-100">
            {submissions.map((s) => {
              const st = STATUS[s.status];
              const Ico = st.icon;
              return (
                <li key={s.id} className="flex items-start gap-3 py-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink-50 text-ink-400">
                    <ListChecks size={18} weight="duotone" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-900">
                      {PLATFORM_LABEL[s.platform] ?? s.platform}
                    </p>
                    <a
                      href={s.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-xs text-brand-600 hover:underline"
                    >
                      {s.content_url}
                    </a>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {formatDate(s.created_at, locale)}
                    </p>
                    {s.status === "rejected" && s.reject_reason && (
                      <p className="mt-1 text-xs text-danger-500">
                        {s.reject_reason}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${st.cls}`}
                    >
                      <Ico size={13} weight="fill" />{" "}
                      {t(`pages.earn.status.${st.key}`)}
                    </span>
                    {s.status === "approved" && Number(s.reward) > 0 && (
                      <span className="text-sm font-bold text-success-700">
                        +
                        {new Intl.NumberFormat("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                          maximumFractionDigits: 0,
                        }).format(Number(s.reward))}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
