import type { Metadata } from "next";
import {
  LegalLayout,
  LegalH2,
  LegalH3,
  LegalInfoTable,
} from "@/components/legal/legal-layout";
import { SITE } from "@/config/site";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description: `${SITE.name} mesafeli satış sözleşmesi ve satış koşulları.`,
};

export default async function DistanceSalesPage() {
  const t = await getServerT();
  return (
    <LegalLayout title={t("legal.dist.title")} updated={t("legal.dist.updated")}>
      <p>{t("legal.dist.intro")}</p>

      <LegalH2>{t("legal.dist.s1.title")}</LegalH2>
      <p className="font-semibold text-ink-800">{t("legal.dist.s1.seller")}</p>
      <LegalInfoTable
        rows={[
          [t("legal.dist.s1.row.company"), SITE.legal.company],
          [t("legal.dist.s1.row.address"), SITE.legal.address],
          [
            t("legal.dist.s1.row.tax"),
            `${SITE.legal.taxOffice} / ${SITE.legal.taxNumber}`,
          ],
          [t("legal.dist.s1.row.mersis"), SITE.legal.mersis],
          [t("legal.dist.s1.row.etbis"), SITE.legal.etbis],
          [t("legal.dist.s1.row.email"), SITE.legal.email],
          [t("legal.dist.s1.row.phone"), SITE.legal.phone],
        ]}
      />
      <p className="pt-2">
        <strong className="text-ink-800">{t("legal.dist.s1.buyer.strong")}</strong>
        {t("legal.dist.s1.buyer.body")}
      </p>

      <LegalH2>{t("legal.dist.s2.title")}</LegalH2>
      <p>
        {t("legal.dist.s2.body.1")}
        {SITE.name}
        {t("legal.dist.s2.body.2")}
      </p>

      <LegalH2>{t("legal.dist.s3.title")}</LegalH2>
      <p>
        {t("legal.dist.s3.body.1")}
        {SITE.name}
        {t("legal.dist.s3.body.2")}
      </p>

      <LegalH2>{t("legal.dist.s4.title")}</LegalH2>
      <ol className="list-decimal space-y-1 pl-5">
        <li>{t("legal.dist.s4.li1")}</li>
        <li>{t("legal.dist.s4.li2")}</li>
        <li>{t("legal.dist.s4.li3")}</li>
        <li>{t("legal.dist.s4.li4")}</li>
      </ol>

      <LegalH2>{t("legal.dist.s5.title")}</LegalH2>
      <p>
        {t("legal.dist.s5.body.1")}
        {SITE.name}
        {t("legal.dist.s5.body.2")}
        {SITE.name}
        {t("legal.dist.s5.body.3")}
      </p>

      <LegalH2>{t("legal.dist.s6.title")}</LegalH2>
      <p>{t("legal.dist.s6.body")}</p>
      <LegalH3>{t("legal.dist.s61.title")}</LegalH3>
      <p>{t("legal.dist.s61.body")}</p>

      <LegalH2>{t("legal.dist.s7.title")}</LegalH2>
      <p>
        {t("legal.dist.s7.body.1")}
        <a href="/refund" className="text-brand-600 hover:underline">
          {t("legal.dist.s7.link")}
        </a>
        {t("legal.dist.s7.body.2")}
      </p>

      <LegalH2>{t("legal.dist.s8.title")}</LegalH2>
      <p>{t("legal.dist.s8.body")}</p>

      <LegalH2>{t("legal.dist.s9.title")}</LegalH2>
      <p>{t("legal.dist.s9.body")}</p>

      <LegalH2>{t("legal.dist.s10.title")}</LegalH2>
      <p>
        {t("legal.dist.s10.body.1")}
        <a href="/privacy" className="text-brand-600 hover:underline">
          {t("legal.dist.s10.link")}
        </a>
        {t("legal.dist.s10.body.2")}
      </p>

      <LegalH2>{t("legal.dist.s11.title")}</LegalH2>
      <p>
        {SITE.name}
        {t("legal.dist.s11.body.2")}
      </p>

      <LegalH2>{t("legal.dist.s12.title")}</LegalH2>
      <p>{t("legal.dist.s12.body")}</p>

      <LegalH2>{t("legal.dist.s13.title")}</LegalH2>
      <p>{t("legal.dist.s13.body")}</p>
    </LegalLayout>
  );
}
