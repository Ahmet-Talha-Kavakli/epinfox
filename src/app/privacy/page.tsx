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
  title: "Gizlilik & KVKK",
  description: `${SITE.name} gizlilik politikası ve KVKK aydınlatma metni.`,
};

export default async function PrivacyPage() {
  const t = await getServerT();

  return (
    <LegalLayout title={t("legal.priv.pageTitle")} updated="31.05.2026">
      <p>
        {SITE.legal.company} (“{SITE.name}”) {t("legal.priv.intro")}
      </p>

      <LegalH2>{t("legal.priv.s1.title")}</LegalH2>
      <LegalInfoTable
        rows={[
          [t("legal.priv.s1.row.title"), SITE.legal.company],
          [t("legal.priv.s1.row.address"), SITE.legal.address],
          [t("legal.priv.s1.row.email"), SITE.legal.email],
          [t("legal.priv.s1.row.kep"), SITE.legal.kep],
        ]}
      />

      <LegalH2>{t("legal.priv.s2.title")}</LegalH2>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>{t("legal.priv.s2.li1.label")}</strong> {t("legal.priv.s2.li1.text")}</li>
        <li><strong>{t("legal.priv.s2.li2.label")}</strong> {t("legal.priv.s2.li2.text")}</li>
        <li><strong>{t("legal.priv.s2.li3.label")}</strong> {t("legal.priv.s2.li3.text1")} {SITE.name} {t("legal.priv.s2.li3.text2")}</li>
        <li><strong>{t("legal.priv.s2.li4.label")}</strong> {t("legal.priv.s2.li4.text")}</li>
        <li><strong>{t("legal.priv.s2.li5.label")}</strong> {t("legal.priv.s2.li5.text")}</li>
        <li><strong>{t("legal.priv.s2.li6.label")}</strong> {t("legal.priv.s2.li6.text")}</li>
      </ul>

      <LegalH2>{t("legal.priv.s3.title")}</LegalH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>{t("legal.priv.s3.li1")}</li>
        <li>{t("legal.priv.s3.li2")}</li>
        <li>{t("legal.priv.s3.li3")}</li>
        <li>{t("legal.priv.s3.li4")}</li>
        <li>{t("legal.priv.s3.li5")}</li>
        <li>{t("legal.priv.s3.li6")}</li>
      </ul>

      <LegalH2>{t("legal.priv.s4.title")}</LegalH2>
      <p>{t("legal.priv.s4.body")}</p>

      <LegalH2>{t("legal.priv.s5.title")}</LegalH2>
      <p>{t("legal.priv.s5.body")}</p>

      <LegalH2>{t("legal.priv.s6.title")}</LegalH2>
      <p>{t("legal.priv.s6.body")}</p>
      <LegalH3>{t("legal.priv.s6.sub.title")}</LegalH3>
      <p>{t("legal.priv.s6.sub.body")}</p>

      <LegalH2>{t("legal.priv.s7.title")}</LegalH2>
      <p>{t("legal.priv.s7.body")}</p>

      <LegalH2>{t("legal.priv.s8.title")}</LegalH2>
      <p>{t("legal.priv.s8.body")}</p>

      <LegalH2>{t("legal.priv.s9.title")}</LegalH2>
      <p>{t("legal.priv.s9.body")}</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>{t("legal.priv.s9.li1.label")}</strong> {t("legal.priv.s9.li1.text")}</li>
        <li><strong>{t("legal.priv.s9.li2.label")}</strong> {t("legal.priv.s9.li2.text")}</li>
        <li><strong>{t("legal.priv.s9.li3.label")}</strong> {t("legal.priv.s9.li3.text")}</li>
      </ul>
      <p>{t("legal.priv.s9.note")}</p>

      <LegalH2>{t("legal.priv.s10.title")}</LegalH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>{t("legal.priv.s10.li1")}</li>
        <li>{t("legal.priv.s10.li2")}</li>
        <li>{t("legal.priv.s10.li3")}</li>
        <li>{t("legal.priv.s10.li4")}</li>
        <li>{t("legal.priv.s10.li5")}</li>
        <li>{t("legal.priv.s10.li6")}</li>
        <li>{t("legal.priv.s10.li7")}</li>
        <li>{t("legal.priv.s10.li8")}</li>
      </ul>

      <LegalH2>{t("legal.priv.s11.title")}</LegalH2>
      <p>
        {t("legal.priv.s11.body1")}{" "}
        <a href="/contact" className="text-brand-600 hover:underline">{t("legal.priv.s11.link")}</a>{" "}
        {t("legal.priv.s11.body2").replace("{email}", SITE.legal.email)}
      </p>

      <LegalH2>{t("legal.priv.s12.title")}</LegalH2>
      <p>{t("legal.priv.s12.body")}</p>
    </LegalLayout>
  );
}
