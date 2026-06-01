import type { Metadata } from "next";
import Link from "next/link";
import {
  IdentificationCard,
  EnvelopeSimple,
  CalendarBlank,
  WarningOctagon,
} from "@phosphor-icons/react/dist/ssr";
import { requireMember } from "@/lib/auth/require-admin";
import { getServerT, getServerLocale } from "@/lib/i18n/server";
import { AccountShell } from "@/components/account/account-shell";
import { SettingsForm, ProfileFieldsForm } from "@/components/account/account-forms";
import { KycSection } from "@/components/account/kyc-section";
import { ContactVerification } from "@/components/account/contact-verification";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Hesap Ayarlarım" };

/** Bölüm başlığı — ilk başlık üst boşluksuz, sonrakiler ayrımlı. */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-400 first:mt-0">
      <span className="h-4 w-1 rounded-full bg-brand-500" />
      {children}
    </h2>
  );
}

export default async function AccountSettingsPage() {
  const current = await requireMember();
  const t = await getServerT();
  const locale = await getServerLocale();
  const p = current.profile;

  const summary = [
    {
      icon: IdentificationCard,
      label: t("acct.settings.summary.memberNo"),
      value: "#" + current.user.id.slice(0, 8).toUpperCase(),
    },
    { icon: EnvelopeSimple, label: t("acct.settings.summary.email"), value: current.email },
    {
      icon: CalendarBlank,
      label: t("acct.settings.summary.memberSince"),
      value: formatDate(p.joined_at, locale),
    },
  ];

  return (
    <AccountShell
      user={{
        nickname: current.nickname,
        email: current.email,
        avatarPath: current.avatarPath,
      }}
      title={t("acct.settings.title")}
      description={t("acct.settings.desc")}
    >
      {/* Profil + kişisel bilgiler */}
      <SectionTitle>{t("acct.settings.section.profile")}</SectionTitle>
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
        <SettingsForm
          initialNickname={current.nickname}
          initialAvatar={current.avatarPath}
        />
        <ProfileFieldsForm
          initial={{
            fullName: p.full_name,
            phone: p.phone,
            birthDate: p.birth_date,
            marketingOptIn: p.marketing_opt_in,
          }}
        />
      </div>

      {/* Kimlik doğrulama + iletişim doğrulama */}
      <SectionTitle>{t("acct.settings.section.verification")}</SectionTitle>
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
        <KycSection
          status={p.kyc_status}
          fullName={p.kyc_full_name}
          rejectReason={p.kyc_reject_reason}
        />
        <ContactVerification phone={p.phone} />
      </div>

      {/* Hesap özeti */}
      <SectionTitle>{t("acct.settings.section.summary")}</SectionTitle>
      <Card className="border-ink-200 p-6">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {summary.map((s) => (
            <div key={s.label} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-500 ring-1 ring-ink-200">
                <s.icon size={18} weight="duotone" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs text-ink-500">{s.label}</dt>
                <dd className="truncate text-sm font-medium text-ink-900">
                  {s.value}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </Card>

      {/* Tehlike bölgesi */}
      <div className="mt-8" />
      <Card className="border-danger-200 bg-danger-50/40 p-6">
        <div className="flex items-center gap-2 text-danger-700">
          <WarningOctagon size={20} weight="fill" />
          <h2 className="font-semibold">{t("acct.settings.danger.title")}</h2>
        </div>
        <p className="mt-2 text-sm text-ink-600">
          {t("acct.settings.danger.desc")}
        </p>
        <Link
          href="/support"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-danger-300 bg-white px-4 py-2 text-sm font-medium text-danger-700 transition-colors hover:bg-danger-50"
        >
          <WarningOctagon size={15} weight="fill" />
          {t("acct.settings.danger.cta")}
        </Link>
      </Card>
    </AccountShell>
  );
}
