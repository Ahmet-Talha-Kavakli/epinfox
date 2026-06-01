import type { Metadata } from "next";
import { Suspense } from "react";
import { getServerT } from "@/lib/i18n/server";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { RefCapture } from "@/components/auth/ref-capture";

export const metadata: Metadata = { title: "Üye Ol" };

export default async function KayitPage() {
  const t = await getServerT();
  return (
    <>
      <Suspense fallback={null}>
        <RefCapture />
      </Suspense>
      <AuthShell
        title={t("auth.signUp.title")}
        subtitle={t("auth.signUp.subtitle")}
        heroImage="/auth/auth-signup.webp"
      >
        <SignUpForm />
      </AuthShell>
    </>
  );
}
