import { auth, clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail, emailTemplate } from "@/lib/email";
import { ADMIN_ROLES, type Profile } from "@/lib/supabase/types";

/**
 * Server component'larda oturum açmış kullanıcının profilini çeker.
 * Anonim ise null döner.
 *
 * Fallback: Webhook hiç gelmediyse Clerk'ten user fetch edip insert eder.
 * Race-safe: aynı session'dan paralel iki request gelirse, recheck + recovery
 * ile tek profile garantilenir.
 */
export async function getCurrentUser() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return null;

  const supabase = await createAdminClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  let p: Profile | null = profile as Profile | null;

  if (!p) {
    p = await ensureProfile(clerkUserId, supabase);
    // Yeni profil — davet kodu cookie'si varsa referans kaydını kur.
    if (p) await linkReferralIfPending(p, supabase);
  }

  if (!p) return null;

  const isAdmin = ADMIN_ROLES.includes(p.role);

  return {
    user: { id: p.id, clerkUserId },
    profile: p,
    email: p.email,
    nickname: p.nickname,
    balance: Number(p.balance ?? 0),
    avatarPath: p.avatar_path,
    isAdmin,
  };
}

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

type SupabaseAdmin = Awaited<ReturnType<typeof createAdminClient>>;

/**
 * Webhook gelmediyse Clerk user'ı çekip Supabase profile'ı yaratır.
 * Race-safe yaklaşım:
 *  1) clerk_user_id ile recheck (paralel request araya girmiş olabilir)
 *  2) Email collision olursa orphan recovery (eski profile'a clerk bağla)
 *  3) Nickname collision olursa suffix ekle
 *  4) Insert sonrası unique violation varsa recheck (race winner profile döner)
 */
async function ensureProfile(
  clerkUserId: string,
  supabase: SupabaseAdmin,
): Promise<Profile | null> {
  try {
    const clerk = await clerkClient();
    const cu = await clerk.users.getUser(clerkUserId);
    const email =
      cu.primaryEmailAddress?.emailAddress ??
      cu.emailAddresses[0]?.emailAddress ??
      "";
    const meta = cu.unsafeMetadata as Record<string, unknown> | undefined;
    // Steam kullanıcısında username "steam_<id>" olur; onun yerine Steam ismini
    // (metadata.nickname/steamName) tercih et. username steam_ ile başlıyorsa atla.
    const username = cu.username?.trim() ?? "";
    const baseNickname = sanitizeNickname(
      (typeof meta?.nickname === "string" && meta.nickname.trim()) ||
        (typeof meta?.steamName === "string" && meta.steamName.trim()) ||
        (username.startsWith("steam_") ? "" : username) ||
        email.split("@")[0] ||
        `kullanici-${clerkUserId.slice(-6)}`,
    );

    // 1) Race-safe recheck
    {
      const { data: existing } = await supabase
        .from("profiles")
        .select("*")
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle();
      if (existing) return existing as Profile;
    }

    // 2) Email collision recovery
    if (email) {
      const { data: byEmail } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .maybeSingle();
      if (byEmail) {
        const ep = byEmail as Profile;
        if (!ep.clerk_user_id) {
          await supabase
            .from("profiles")
            .update({ clerk_user_id: clerkUserId })
            .eq("id", ep.id);
          return { ...ep, clerk_user_id: clerkUserId };
        }
        if (ep.clerk_user_id === clerkUserId) return ep;
        console.error(
          `email collision: ${email} bound to ${ep.clerk_user_id}, attempt ${clerkUserId}`,
        );
        return null;
      }
    }

    // 3) Nickname çakışmasına karşı suffix denemesi
    for (let attempt = 0; attempt < 5; attempt++) {
      const nickname =
        attempt === 0 ? baseNickname : `${baseNickname}-${randomSuffix(3)}`;
      const id = randomUUID();
      const { data: inserted, error } = await supabase
        .from("profiles")
        .insert({
          id,
          clerk_user_id: clerkUserId,
          email,
          nickname,
          role: "member",
          balance: 0,
        })
        .select("*")
        .maybeSingle();

      if (!error && inserted) {
        // Hoş geldin e-postası (yeni profil). Sentetik (Steam, henüz mail
        // doğrulamamış) adreslere gönderme. Hata akışı kırmaz.
        if (email && !email.endsWith("@users.epinfox.com")) {
          const SITE_URL =
            process.env.NEXT_PUBLIC_SITE_URL || "https://epinfox.com";
          sendEmail({
            to: email,
            subject: "EpinFox'a hoş geldin! 🦊",
            text: `Merhaba ${nickname},\n\nEpinFox'a hoş geldin! Oyun bakiyesi, dijital kod ve aboneliklerde anında teslimat seni bekliyor. Cüzdanına yükle, saniyeler içinde satın al.\n\nMağazayı keşfet: ${SITE_URL}/store\n\nİyi oyunlar!\nEpinFox`,
            html: emailTemplate({
              heading: "EpinFox'a hoş geldin! 🦊",
              bodyHtml: `Merhaba <b>${nickname}</b>,<br><br>Oyun bakiyesi, dijital kod ve aboneliklerde <b>anında teslimat</b> seni bekliyor. Cüzdanına yükle, saniyeler içinde satın al.`,
              cta: { label: "Mağazayı Keşfet", href: `${SITE_URL}/store` },
            }),
          }).catch(() => {});
        }
        return inserted as Profile;
      }

      // Unique violation?
      if (error?.code === "23505") {
        const { data: byClerk } = await supabase
          .from("profiles")
          .select("*")
          .eq("clerk_user_id", clerkUserId)
          .maybeSingle();
        if (byClerk) return byClerk as Profile;
        continue; // nickname çakışması — suffix dene
      }

      console.error("profile insert failed:", error?.message);
      return null;
    }

    console.error(
      `profile insert: 5 attempts exhausted for clerk_user_id=${clerkUserId}`,
    );
    return null;
  } catch (err) {
    console.error("ensureProfile failed:", err);
    return null;
  }
}

/**
 * Yeni profile için ref_code cookie'si varsa referans kaydını kurar.
 * - Kendi kodunu kullanamaz, zaten bağlıysa atlanır, kod geçersizse sessiz geçer.
 * - Ödül burada VERİLMEZ; davet edilen ilk yüklemesini yapınca verilir (topUpBalance).
 */
async function linkReferralIfPending(
  newProfile: Profile,
  supabase: SupabaseAdmin,
): Promise<void> {
  try {
    if (newProfile.referred_by) return; // zaten bağlı
    const cookieStore = await cookies();
    const code = cookieStore.get("ref_code")?.value?.toUpperCase();
    if (!code) return;

    // Davet eden profili bul
    const { data: referrer } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", code)
      .maybeSingle();
    if (!referrer || referrer.id === newProfile.id) return; // geçersiz / kendi kodu

    // referred_by işaretle + referrals (pending) kaydı
    await supabase
      .from("profiles")
      .update({ referred_by: referrer.id })
      .eq("id", newProfile.id);
    await supabase.from("referrals").insert({
      referrer_id: referrer.id,
      referred_id: newProfile.id,
      status: "pending",
    });
  } catch (err) {
    console.error("linkReferral failed:", err);
  }
}

function sanitizeNickname(raw: string): string {
  const clean = raw
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  if (clean.length >= 3) return clean;
  return `kullanici-${randomSuffix(4)}`;
}

function randomSuffix(len: number): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z0-9]/g, "")
    .slice(0, len);
}
