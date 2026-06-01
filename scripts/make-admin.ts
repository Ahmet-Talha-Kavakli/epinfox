// Bir profili admin yapar.
// Çalıştır: npm run make-admin -- <email>
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Kullanım: npm run make-admin -- <email>");
    process.exit(1);
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("email", email)
    .select("id, email, role, nickname")
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    console.error(`Profil bulunamadı: ${email}. Önce siteye kayıt olup giriş yapın.`);
    process.exit(1);
  }
  console.log(`Admin yapıldı:`, data);
}

main().catch((e) => {
  console.error("Hata:", e.message ?? e);
  process.exit(1);
});
