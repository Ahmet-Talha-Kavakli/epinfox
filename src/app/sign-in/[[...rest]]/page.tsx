import type { Metadata } from "next";
import { getServerT } from "@/lib/i18n/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = { title: "Giriş Yap" };

export default async function GirisPage() {
  const t = await getServerT();
  return (
    <AuthShell title={t("auth.signIn.title")} subtitle={t("auth.signIn.subtitle")}>
      <SignInForm />
    </AuthShell>
  );
}
