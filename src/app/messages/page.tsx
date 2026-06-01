import type { Metadata } from "next";
import { requireMember } from "@/lib/auth/require-admin";
import { MessagesView } from "@/components/messages/messages-view";
import { getServerT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Mesajlar" };

export default async function MessagesPage() {
  const current = await requireMember();
  const t = await getServerT();

  return (
    <section className="container-page py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-ink-900">{t("sup.messages.pageTitle")}</h1>
        <p className="mt-1 text-sm text-ink-500">
          {t("sup.messages.pageDesc")}
        </p>
      </div>
      <MessagesView nickname={current.nickname} />
    </section>
  );
}
