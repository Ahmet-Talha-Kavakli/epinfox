"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

const SYNTHETIC_DOMAIN = "@users.epinfox.com";

export type SteamEmailResult = { ok: true } | { ok: false; error: string };

/**
 * Steam kullanıcısı gerçek e-postasını client'ta (useUser) ekleyip doğruladıktan
 * ve primary yaptıktan SONRA çağrılır. Sunucu tarafında:
 *  1) Sentetik steam_<id>@users.epinfox.com adresini sil (artık primary değil).
 *  2) publicMetadata.needsEmail = false yap → proxy.ts kilidi kalkar.
 *
 * Idempotent: zaten silinmiş / zaten false ise sorunsuz geçer.
 */
export async function completeSteamEmail(): Promise<SteamEmailResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, error: "unauthorized" };

  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    // Primary artık gerçek mail olmalı (client setlemiş olmalı). Güvenlik:
    // primary hâlâ sentetikse needsEmail'i kapatma — kullanıcı doğrulamamış demektir.
    const primaryId = user.primaryEmailAddressId;
    const primary = user.emailAddresses.find((e) => e.id === primaryId);
    if (!primary || primary.emailAddress.endsWith(SYNTHETIC_DOMAIN)) {
      return { ok: false, error: "email_not_verified" };
    }

    // Sentetik adresi temizle (varsa)
    const synthetic = user.emailAddresses.find((e) =>
      e.emailAddress.endsWith(SYNTHETIC_DOMAIN),
    );
    if (synthetic && synthetic.id !== primaryId) {
      try {
        await clerk.emailAddresses.deleteEmailAddress(synthetic.id);
      } catch (e) {
        // Silme başarısız olsa da akışı bloklamayalım — needsEmail'i kapatmak yeterli.
        console.error("synthetic email delete failed:", e);
      }
    }

    // needsEmail kilidini kaldır
    await clerk.users.updateUser(userId, {
      publicMetadata: { ...(user.publicMetadata ?? {}), needsEmail: false },
    });

    return { ok: true };
  } catch (e) {
    console.error("completeSteamEmail failed:", e);
    return { ok: false, error: "server_error" };
  }
}
