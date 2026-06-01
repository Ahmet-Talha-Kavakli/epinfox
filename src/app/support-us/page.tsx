import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/current-user";
import { createAdminClient } from "@/lib/supabase/server";
import { SupportUsForm } from "@/components/support-us/support-us-form";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Destek Ol",
  description: `${SITE.name}'a karşılıksız destek ol, özel destekçi rozetleri kazan.`,
};

const PLATFORM_SLUG = "epinfox-platform";

export default async function SupportUsPage() {
  const current = await getCurrentUser();

  let totalSupport = 0;
  if (current) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from("donations")
      .select("amount")
      .eq("user_id", current.user.id)
      .eq("publisher_slug", PLATFORM_SLUG);
    totalSupport = ((data as { amount: number }[]) ?? []).reduce(
      (s, d) => s + Number(d.amount),
      0,
    );
  }

  return (
    <section className="container-page py-8">
      <SupportUsForm
        loggedIn={Boolean(current)}
        balance={current?.balance ?? 0}
        totalSupport={totalSupport}
      />
    </section>
  );
}
