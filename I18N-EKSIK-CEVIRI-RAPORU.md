# EpinFox — Eksik Çeviri Tam Teşhis Raporu

**Tarih:** 2026-06-01 · **Yöntem:** Otomatik tarama (`scripts/i18n-audit.cjs` + `scripts/i18n-hardcoded.cjs`) + 3 paralel ajan dosya dosya okudu.

---

## 0. ÖNEMLİ: Anahtar altyapısı TERTEMİZ

`t("...")` ile sarılmış **statik anahtarların hepsi 5 dilde tam** (tr/en/de/ar/ru her biri **1112 anahtar**, dengeli):

- 🔴 **Raw-key bug (ekranda ham anahtar): 0** — yani senin gördüğün "garip şeyler" eksik *anahtar* değil.
- 🟡 **Locale eksiği (tr'de var, başka dilde yok): 0**
- 🟢 Dinamik `t(\`...\${x}\`)` çağrıları (raffles status, earn status) → tüm olası değerleri dict'te mevcut.

**Sonuç:** Senin gördüğün şey = **`t()` ile hiç sarılmamış, düz hardcoded Türkçe UI metni.** Bunlar İngilizce'ye geçince TR kalıyor. Aşağıda A'dan Z'ye tamamı.

---

## 1. 🔴 KULLANICIYA GÖRÜNEN BİLEŞENLER — en yüksek öncelik (~95 string)

Bunlar her sayfada / sık görülen, kullanıcının doğrudan etkileşime girdiği yerler. `t()` hiç uygulanmamış.

| Dosya | Gap | Örnekler |
|---|---|---|
| `components/support/support-chat.tsx` | ~16 | Karşılama mesajı, öneri çipleri ("Kodumu nasıl görürüm?"), tüm hata mesajları, "Çevrimiçi", "Yazıyor…", tüm aria-label/placeholder |
| `components/account/kyc-section.tsx` | ~18 | Durum rozetleri (Doğrulanmadı/İnceleniyor/Onaylandı/Reddedildi), form label+placeholder, açıklama metinleri, başarı toast'ı |
| `components/layout/notification-bell.tsx` | ~12 | Tür label'ları (Sipariş/Cüzdan/İade/Kampanya/Favori/Sistem), "Bildirimler", "Tümünü okundu işaretle", "Henüz bildirimin yok", göreli zaman ("az önce/dk önce/sa önce/gün önce") + `tr-TR` tarih hardcode |
| `components/store/review-section.tsx` | ~15 | "Değerlendirmeler", "Henüz değerlendirme yok", "Senin yorumun", Düzenle/Sil/Gönder/İptal, placeholder, "Doğrulanmış alıcı", "Kullanıcı" fallback |
| `components/layout/promo-code-button.tsx` | ~8 | "Promo Kod", "Kodunu gir…", placeholder, "Kodu Uygula", hint metni, aria-label'lar |
| `components/layout/promo-popup.tsx` | ~7 | Bonus/indirim başlıkları, "Sana özel fırsat 🎁", Kopyala/Kopyalandı, "Hemen Kullan", not metni |
| `components/layout/satisfaction-popup.tsx` | ~10 | Puan label'ları (Çok kötü…Harika), "Teşekkürler!", "Bizi nasıl buldun?", placeholder, Gönder, aria-label'lar |
| `components/onboarding/onboarding-widget.tsx` | ~7 | "Her şey hazır!", "Başlangıç rehberi", "X/Y adım tamamlandı", "Rehberi kapat", "Tamamlandı", aria-label'lar |
| `components/layout/locale-switcher.tsx` | ~5 | Para birimi adları (Türk Lirası/ABD Doları…), "Dil", "Para Birimi", "Dil ve Para Birimi", aria-label |
| `components/account/contact-verification.tsx` | ~7 | "E-posta"/"Telefon" label, "Eklenmedi", "İletişim Doğrulama", Doğrulandı/Doğrulanmadı |
| `components/account/referral-share.tsx` | ~6 | Paylaşım mesajı metni (WhatsApp/X/Telegram), "Davet Kodun", aria-label, alt |
| `components/layout/trust-bar.tsx` | 4 | Anında Teslimat / Güvenli & Şifreli / Güvenli Ödeme / 7/24 Destek + alt açıklamaları |
| `components/raffles/raffle-countdown.tsx` | ~2 | Birim label'ları (Gün/Saat/Dk/Sn), kompakt "g" eki |
| `components/store/search-bar.tsx` | 3 | placeholder "Oyun, ürün veya platform ara…", "Ara", "Popüler:" + ⚠️ `?ara=` query param TR |
| `components/store/favorite-button.tsx` | 2 | "Favorilere ekle / Favorilerden çıkar" (aria+title) |
| `components/ui/star-rating.tsx` | 1 | aria-label "{i} yıldız" |

**⚠️ Tekrar eden anti-pattern — TR-hardcoded DEFAULT PROP'lar** (çağıran çevirmezse TR sızar):
- `components/ui/confirm-dialog.tsx` → `"Onayla" / "Vazgeç"`
- `components/ui/slide-button.tsx` → `"Onaylandı" / "Başarısız" / "Gönderiliyor..."` (sonuncu her zaman TR, prop bile değil)
- `components/layout/store-mega-menu.tsx` → `label = "Mağaza"` default

**⚠️ Sabit locale/para birimi** (seçili dili yok sayıyor): `command-palette.tsx` ve `notification-bell.tsx` → `Intl.NumberFormat("tr-TR", … TRY)` / `toLocaleDateString("tr-TR")`.

**⚠️ Belge/e-posta gövdesi (UI mi değil mi tartışmalı):** `components/orders/order-row.tsx` → indirilen `.txt` fiş ("EpinFox — Sipariş", "Ürün:", "Bu belge yasal e-fatura değildir."), destek talebi konu/gövde şablonu.

---

## 2. 🟠 KULLANICIYA GÖRÜNEN SAYFALAR (~30 string)

| Dosya | Gap | Durum |
|---|---|---|
| `app/referral/page.tsx` | ~24 | `getServerT` import edilmiş ama HİÇ kullanılmamış. Metrik label'ları (Toplam Davet/Tamamlanan/Toplam Kazanç), kademe sistemi, "Nasıl çalışır?" adımları, EmptyState, durum rozetleri (Bonus verildi/Yükleme bekleniyor), "Kullanıcı" fallback — tümü TR sabit |
| `app/brand/[slug]/page.tsx` | ~6 | **i18n'e hiç dokunulmamış** (`getServerT` yok). Breadcrumb "Mağaza", "{n} ürün çeşidi", "Ürün Çeşitleri", EmptyState, "Mağazaya Dön" CTA |
| `app/news/page.tsx` | ~1 net | Statik `TAGS` dizisi (Steam Türkiye, Oyun Haberleri…) t()'siz render. + tag/kategori adları (Güncelleme/Duyuru/Kampanya) content'ten ham TR — ⚠️ içerik katmanı kararı |
| `app/news/[slug]/page.tsx` | ⚠️ | TAG_CHIP adları content datasından TR render — içerik katmanı |
| `app/page.tsx` | ⚠️ | `HERO_SLIDES`/`CAMPAIGN_CARDS` sayfa-içi sabit dizi (Sezon Kampanyası, Hemen Al…) — kullanıcıya görünür ama "data" gibi yapılandırılmış, t()'siz |

**Temiz (referans alınacak iyi örnekler):** `publisher/*` (3 sayfa), `reseller/*` (2 sayfa), `help`, `support-us` — `getServerT` + key tabanlı, tam lokalize.

**Not — metadata.title/description:** Tüm sayfalarda TR. Proje politikası TR bırakmak (tutarsızlık var, kasıtlı kabul edildi). Raporda gap sayılmadı.

---

## 3. 🟡 SERVER ACTIONS / LIB — kullanıcıya sızan mesajlar (~15 dosya)

Bunlar **server'da çalışır, locale context yok** → `t()` ile basit çözülmez. Hata/başarı mesajları toast veya bildirim olarak UI'ye basılıyor (yani kullanıcı TR görüyor).

**UI'ye sızan mesaj içerenler:**
`actions/checkout.ts` (en yoğun — ERROR_MESSAGES map + notify title/body), `actions/wallet.ts`, `actions/orders.ts`, `actions/profile.ts` (zod mesajları), `actions/favorites.ts`, `actions/reviews.ts`, `actions/kyc.ts`, `actions/promo.ts`, `actions/support.ts`, `actions/earn.ts` (+ reject_reason bildirimi), `actions/player-accounts.ts`, `actions/satisfaction.ts`, `actions/onboarding.ts` (step title/desc UI'de görünür).

**Lib görünür metin:** `lib/payment-methods.ts` (ödeme yöntemi title/desc/talimat), `lib/favorites-notify.ts` (bildirim+e-posta metni), `lib/utils.ts` + `lib/store.ts` (`relativeTime`/`timeAgo` "az önce/gün önce", `formatTL` tr-TR sabit, FAKE_REVIEWS sahte yorum havuzu + "Kullanıcı" fallback).

**Çözüm seçenekleri (ayrı iş):**
- (a) Action'lara `locale` parametresi geçir + server-side dictionary lookup, veya
- (b) Hata **kodu** return et, çeviriyi client'ta yap.
- **Referans model:** `lib/support-meta.ts` zaten (b)'yi uyguluyor (`labelKey` + TR fallback). Tek doğru hazırlanmış dosya.

---

## 4. ⚪ BİLİNÇLİ ATLANANLAR (dokunma)

- **Admin paneli** (`app/admin/*` + `components/admin/*` — ~25 dosya): kasıtlı TR.
- **Uzun yasal sayfalar** (`privacy`, `terms`, `refund`, `distance-sales`): 5/5 tamamen hardcoded TR (~160 blok). Hukuki metin — makine çevirisi riskli, yerel hukukçu gerekir. Ayrı strateji.
- **`api-docs/page.tsx`**: geliştirici dokümanı, hardcoded TR (~40 blok). UI ama yasal değil; istenirse çevrilir.
- **DB/içerik verisi**: ürün/kategori/marka/varyant adları, haber/yayıncı/SSS içeriği (`content.ts`), product `how_to`/`faq` (DB'de TR, 100 ürün). → `product_translations` ayrı büyük proje.
- **AI asistan prompt'ları / tool açıklamaları** (`api/support/route.ts`): server-side, asistan kullanıcı diline göre yanıt veriyor; prompt TR kalabilir.

---

## ÖNCELİK ÖZETİ

| Öncelik | Kapsam | Tahmini string | i18n zorluğu |
|---|---|---|---|
| 🔴 1 | Görünen bileşenler (Bölüm 1) | ~95 | Kolay — client `useI18n` zaten var |
| 🟠 2 | Görünen sayfalar (Bölüm 2) | ~30 | Kolay — `getServerT` zaten var |
| 🟡 3 | Server action/lib mesajları (Bölüm 3) | ~80+ | Zor — server-side i18n mimarisi gerekir |
| ⚪ — | Admin / yasal / içerik / AI prompt | — | Bilinçli atlandı |

**Kolay kazanım:** Bölüm 1 + 2 = ~125 string, mevcut i18n altyapısıyla doğrudan çevrilebilir. Asıl "garip görünen" şeyler bunlar.
**Mimari iş:** Bölüm 3, server-side çeviri kararı verilmeden yapılamaz.
