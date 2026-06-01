import type { Metadata } from "next";
import { LegalLayout, LegalH2, LegalH3 } from "@/components/legal/legal-layout";
import { SITE } from "@/config/site";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Kullanıcı Sözleşmesi",
  description: `${SITE.name} kullanıcı sözleşmesi ve platform kullanım koşulları.`,
};

export default async function TermsPage() {
  const t = await getServerT();

  return (
    <LegalLayout title={t("legal.terms.pageTitle")} updated="31.05.2026">
      <p>
        {t("legal.terms.intro1")} {SITE.name} {t("legal.terms.intro2")}{" "}
        {SITE.legal.company} (“{SITE.name}”) {t("legal.terms.intro3")}
      </p>

      <LegalH2>{t("legal.terms.s1.title")}</LegalH2>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>{t("legal.terms.s1.li1.label")}</strong> {SITE.name} {t("legal.terms.s1.li1.text")}</li>
        <li><strong>{t("legal.terms.s1.li2.label")}</strong> {t("legal.terms.s1.li2.text")}</li>
        <li><strong>{t("legal.terms.s1.li3.label")}</strong> {t("legal.terms.s1.li3.text")}</li>
        <li><strong>{t("legal.terms.s1.li4.label")}</strong> {t("legal.terms.s1.li4.text")}</li>
        <li><strong>{t("legal.terms.s1.li5.label")}</strong> {t("legal.terms.s1.li5.text")}</li>
        <li><strong>{t("legal.terms.s1.li6.label")}</strong> {t("legal.terms.s1.li6.text")}</li>
      </ul>

      <LegalH2>{t("legal.terms.s2.title")}</LegalH2>
      <p>{t("legal.terms.s2.body")}</p>
      <LegalH3>{t("legal.terms.s2.sub1.title")}</LegalH3>
      <p>
        {t("legal.terms.s2.sub1.body1")} {SITE.name}
        {t("legal.terms.s2.sub1.body2")} {SITE.name}
        {", "}
        {t("legal.terms.s2.sub1.body3")}
      </p>
      <LegalH3>{t("legal.terms.s2.sub2.title")}</LegalH3>
      <p>{t("legal.terms.s2.sub2.body")}</p>

      <LegalH2>{t("legal.terms.s3.title")}</LegalH2>
      <ul className="list-disc space-y-1 pl-5">
        <li>{t("legal.terms.s3.li1.text1")} <a href="/refund" className="text-brand-600 hover:underline">{t("legal.terms.s3.li1.link")}</a> {t("legal.terms.s3.li1.text2")}</li>
        <li>{t("legal.terms.s3.li2")}</li>
        <li>{t("legal.terms.s3.li3")}</li>
        <li>{t("legal.terms.s3.li4")}</li>
        <li>{t("legal.terms.s3.li5")}</li>
      </ul>

      <LegalH2>{t("legal.terms.s4.title")}</LegalH2>
      <p>
        {t("legal.terms.s4.body1")} {SITE.name} {t("legal.terms.s4.body2")}{" "}
        {SITE.name} {t("legal.terms.s4.body3")}
      </p>
      <LegalH3>{t("legal.terms.s4.sub1.title")}</LegalH3>
      <p>
        {t("legal.terms.s4.sub1.body1")} {SITE.name}{" "}
        {t("legal.terms.s4.sub1.body2")}
      </p>

      <LegalH2>{t("legal.terms.s5.title")}</LegalH2>
      <p>
        {t("legal.terms.s5.body1")} {SITE.name}
        {t("legal.terms.s5.body2")}
      </p>

      <LegalH2>{t("legal.terms.s6.title")}</LegalH2>
      <p>
        {t("legal.terms.s6.body1")} {SITE.name} {t("legal.terms.s6.body2")}{" "}
        <a href="/privacy" className="text-brand-600 hover:underline">{t("legal.terms.s6.link")}</a>
        {t("legal.terms.s6.body3")}
      </p>

      <LegalH2>{t("legal.terms.s7.title")}</LegalH2>
      <p>
        {t("legal.terms.s7.body1")} {SITE.name}
        {t("legal.terms.s7.body2")}
      </p>

      <LegalH2>{t("legal.terms.s8.title")}</LegalH2>
      <p>
        {t("legal.terms.s8.body1")} {SITE.name}
        {t("legal.terms.s8.body2")}
      </p>

      <LegalH2>{t("legal.terms.s9.title")}</LegalH2>
      <p>
        {SITE.name} {t("legal.terms.s9.body1")} {SITE.name}{" "}
        {t("legal.terms.s9.body2")}
      </p>

      <LegalH2>{t("legal.terms.s10.title")}</LegalH2>
      <p>{t("legal.terms.s10.body")}</p>

      <LegalH2>{t("legal.terms.s11.title")}</LegalH2>
      <p>
        {t("legal.terms.s11.body1")} {SITE.name}{" "}
        {t("legal.terms.s11.body2")}
      </p>

      <LegalH2>{t("legal.terms.s12.title")}</LegalH2>
      <p>
        {t("legal.terms.s12.body1")} {SITE.name}
        {t("legal.terms.s12.body2")}
      </p>

      <LegalH2>{t("legal.terms.s13.title")}</LegalH2>
      <p>
        {SITE.name} {t("legal.terms.s13.body1")}
      </p>

      <LegalH2>{t("legal.terms.s14.title")}</LegalH2>
      <p>
        {SITE.name} {t("legal.terms.s14.body1")}
      </p>

      <LegalH2>{t("legal.terms.s15.title")}</LegalH2>
      <p>{t("legal.terms.s15.body")}</p>

      <LegalH2>{t("legal.terms.s16.title")}</LegalH2>
      <p>
        {t("legal.terms.s16.body1")}{" "}
        <a href="/contact" className="text-brand-600 hover:underline">{t("legal.terms.s16.link")}</a>{" "}
        {t("legal.terms.s16.body2").replace("{email}", SITE.legal.email)}
      </p>
    </LegalLayout>
  );
}
