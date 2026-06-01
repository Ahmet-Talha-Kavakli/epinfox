import type { Metadata } from "next";
import { LegalLayout, LegalH2, LegalH3 } from "@/components/legal/legal-layout";
import { SITE } from "@/config/site";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "İade & Cayma Hakkı",
  description: `${SITE.name} iade, cayma hakkı ve geri ödeme politikası.`,
};

export default async function RefundPage() {
  const t = await getServerT();
  return (
    <LegalLayout title={t("legal.refund.title")} updated={t("legal.refund.updated")}>
      <p>
        {SITE.name}
        {t("legal.refund.intro.1")}
        <a href="/distance-sales" className="text-brand-600 hover:underline">
          {t("legal.refund.intro.link")}
        </a>
        {t("legal.refund.intro.2")}
      </p>

      <LegalH2>{t("legal.refund.s1.title")}</LegalH2>
      <p>{t("legal.refund.s1.body")}</p>

      <LegalH2>{t("legal.refund.s2.title")}</LegalH2>
      <p>
        {t("legal.refund.s2.lead.1")}
        <strong>{t("legal.refund.s2.lead.strong")}</strong>
        {t("legal.refund.s2.lead.2")}
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>{t("legal.refund.s2.li1")}</li>
        <li>{t("legal.refund.s2.li2")}</li>
        <li>{t("legal.refund.s2.li3")}</li>
        <li>{t("legal.refund.s2.li4")}</li>
        <li>{t("legal.refund.s2.li5")}</li>
      </ul>
      <LegalH3>{t("legal.refund.s21.title")}</LegalH3>
      <p>{t("legal.refund.s21.body")}</p>

      <LegalH2>{t("legal.refund.s3.title")}</LegalH2>
      <p>
        {t("legal.refund.s3.lead.1")}
        <strong>{t("legal.refund.s3.lead.strong")}</strong>
        {t("legal.refund.s3.lead.2")}
        <a href="/support" className="text-brand-600 hover:underline">
          {t("legal.refund.s3.lead.link1")}
        </a>
        {t("legal.refund.s3.lead.3")}
        <a href="/contact" className="text-brand-600 hover:underline">
          {t("legal.refund.s3.lead.link2")}
        </a>
        {t("legal.refund.s3.lead.4")}
      </p>
      <ul className="list-disc space-y-1 pl-5">
        <li>{t("legal.refund.s3.li1")}</li>
        <li>{t("legal.refund.s3.li2")}</li>
        <li>{t("legal.refund.s3.li3")}</li>
      </ul>

      <LegalH2>{t("legal.refund.s4.title")}</LegalH2>
      <p>
        {t("legal.refund.s4.body.1")}
        <strong>{t("legal.refund.s4.body.strong")}</strong>
        {t("legal.refund.s4.body.2")}
      </p>

      <LegalH2>{t("legal.refund.s5.title")}</LegalH2>
      <p>{t("legal.refund.s5.body")}</p>

      <LegalH2>{t("legal.refund.s6.title")}</LegalH2>
      <p>{t("legal.refund.s6.body")}</p>

      <LegalH2>{t("legal.refund.s7.title")}</LegalH2>
      <p>{t("legal.refund.s7.body")}</p>

      <LegalH2>{t("legal.refund.s8.title")}</LegalH2>
      <p>{t("legal.refund.s8.body")}</p>

      <LegalH2>{t("legal.refund.s9.title")}</LegalH2>
      <p>
        {t("legal.refund.s9.body.1")}
        {SITE.legal.email}
        {t("legal.refund.s9.body.2")}
      </p>
    </LegalLayout>
  );
}
