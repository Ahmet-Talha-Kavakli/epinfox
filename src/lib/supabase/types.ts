// E-Pin (EpinFox) veri modeli tipleri.
// Supabase tablolarıyla 1:1. Server action'lar service-role ile RLS bypass eder;
// auth kontrolü app-code'da (requireAdmin / requireMember).

import type { Tone } from "@/lib/card-tones";

export type UserRole = "owner" | "admin" | "member";
export type CodeStatus = "available" | "sold" | "reserved" | "disabled";
export type OrderStatus =
  | "completed"
  | "refunded"
  | "failed"
  | "pending"
  | "processing";
export type WalletTxnType =
  | "topup"
  | "purchase"
  | "refund"
  | "adjustment"
  | "donation";

/** Admin yetkisine sahip roller. */
export const ADMIN_ROLES: UserRole[] = ["owner", "admin"];

export type KycStatus = "none" | "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  clerk_user_id: string | null;
  email: string;
  nickname: string;
  role: UserRole;
  balance: number; // mağaza bakiyesi (TL)
  avatar_path: string | null;
  joined_at: string;
  last_active_at: string | null;
  full_name: string | null;
  phone: string | null;
  birth_date: string | null;
  marketing_opt_in: boolean;
  referral_code: string | null;
  referred_by: string | null;
  // Kimlik doğrulama (KYC)
  kyc_status: KycStatus;
  kyc_full_name: string | null;
  kyc_national_id: string | null;
  kyc_birth_date: string | null;
  kyc_doc_front_path: string | null;
  kyc_doc_back_path: string | null;
  kyc_submitted_at: string | null;
  kyc_reviewed_at: string | null;
  kyc_reject_reason: string | null;
  phone_verified_at: string | null;
  // Sosyal medya bağlantıları (kullanıcı adları)
  social_instagram: string | null;
  social_tiktok: string | null;
  social_steam: string | null;
  social_discord: string | null;
  social_x: string | null;
  // Bayilik
  reseller_status: ResellerStatus;
  reseller_tier: ResellerTier | null;
  reseller_discount: number;
  reseller_store: string | null;
  reseller_api_key: string | null; // SHA-256 hash (düz metin asla saklanmaz)
  reseller_api_key_hint: string | null; // gösterim maskesi: epf_live_…son4
  reseller_webhook: string | null;
  reseller_webhook_ips: string[];
  reseller_since: string | null;
  // Hesap askıya alma (admin)
  banned_at: string | null;
  ban_reason: string | null;
}

export type PromoType = "bonus_balance" | "percent" | "free_shipping";

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  description: string | null;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface WebhookDelivery {
  id: string;
  user_id: string;
  event: string;
  target_url: string;
  status: "success" | "failed";
  status_code: number | null;
  duration_ms: number | null;
  error: string | null;
  payload: Record<string, unknown>;
  created_at: string;
}

export type ResellerStatus = "none" | "pending" | "approved" | "rejected";
export type ResellerTier = "bronze" | "silver" | "gold" | "platinum";

export type ResellerChannel = "web" | "social" | "physical" | "other";

export interface ResellerApplication {
  id: string;
  user_id: string;
  company_type: "individual" | "company";
  company_name: string;
  contact_name: string;
  phone: string;
  tax_number: string | null;
  channel: ResellerChannel;
  monthly_volume: string | null;
  message: string | null;
  status: ResellerStatus;
  reject_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export type BillingKind = "individual" | "corporate";

export interface BillingAddress {
  id: string;
  user_id: string;
  kind: BillingKind;
  title: string;
  full_name: string;
  phone: string | null;
  company_name: string | null;
  tax_office: string | null;
  tax_number: string | null;
  country: string;
  city: string;
  district: string | null;
  zip_code: string | null;
  address_line: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  user_id: string;
  campaign: string; // geriye dönük: yayıncı adıyla doldurulur
  publisher_slug: string | null;
  publisher_name: string | null;
  display_name: string | null; // yayıncıya görünen ad ("Anonim" olabilir)
  amount: number;
  message: string | null;
  anonymous: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  tone: Tone;
  icon_path: string | null;
  position: number;
  is_active: boolean;
}

/**
 * code = teslimde kod verilir; topup = oyuncu ID'sine yükleme;
 * service = SMM sosyal medya hizmeti (hedef link, asenkron teslim).
 */
export type DeliveryType = "code" | "topup" | "service";
/**
 * manual = DB stoğu; manual_pending = admin elle teslim (köprü);
 * mock = test sağlayıcı; seagm = SouthEast Asia Game Mall;
 * smm = Perfect Panel standart SMM API'si; ileride 'mtcgame' vb.
 */
export type SupplySource =
  | "manual"
  | "manual_pending"
  | "mock"
  | "seagm"
  | "smm"
  | (string & {});

export interface Product {
  id: string;
  category_id: number;
  brand_id: number | null;
  slug: string;
  name: string;
  description: string | null;
  price: number; // satış fiyatı (TL)
  image_path: string | null;
  tone: Tone;
  is_active: boolean;
  position: number;
  created_at: string;
  delivery_type: DeliveryType;
  supply_source: SupplySource;
  /** Ürüne özel "Nasıl Kullanılır" adımları (sıralı). Boşsa generic gösterilir. */
  how_to: string[] | null;
  /** Ürün detayındaki "Önemli" kutusu metni. Boşsa generic uyarı gösterilir. */
  requirements: string | null;
  /** Ürüne özel SSS. Boşsa generic SSS gösterilir. */
  faq: { q: string; a: string }[] | null;
}

export interface Brand {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  tone: Tone;
  image_path: string | null;
  banner_path: string | null;
  category_id: number | null;
  position: number;
  is_active: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  label: string; // "660 UC", "1 Aylık", "100 TL"
  price: number;
  compare_at: number | null; // üstü çizili eski fiyat
  bonus_pct: number; // "+%1 bonus"
  position: number;
  is_active: boolean;
  created_at: string;
  /** SMM (service teslim) varyantlarında paneldeki servis id'si. */
  supplier_service_id?: string | null;
  /** SMM teslimde panele gönderilecek adet (örn. 1000 takipçi). */
  supplier_quantity?: number | null;
}

/** Varyant + stok (detay seçici için). */
export interface VariantWithStock extends ProductVariant {
  stock: number;
}

/** Ürün + kategori + stok adedi (listeleme/detay için zenginleştirilmiş). */
export interface ProductWithMeta extends Product {
  category?: Category | null;
  stock?: number; // tüm varyantların toplam available kod adedi
  variants?: VariantWithStock[];
  minPrice?: number; // en düşük varyant fiyatı
  maxCompareAt?: number | null; // en yüksek indirim referansı (rozet için)
  soldCount?: number; // toplam satış (sosyal kanıt)
  brandSlug?: string | null; // markası varsa slug (kart linki /brand/<slug> için)
}

export interface ProductCode {
  id: string;
  product_id: string;
  // code_encrypted asla client'a dönmez; decrypt yalnız teslimde server'da yapılır.
  status: CodeStatus;
  order_id: string | null;
  created_at: string;
  sold_at: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  code_id: string | null;
  product_name: string; // snapshot
  variant_label: string | null; // snapshot
  price: number; // snapshot
  status: OrderStatus;
  payment_provider: string; // 'wallet' (Faz 2: 'paytr' vb.)
  created_at: string;
  delivery_type: DeliveryType;
  player_id: string | null; // topup teslimde oyuncu ID/UID
  supplier_ref: string | null;
  delivered_note: string | null; // topup teslim açıklaması
}

export interface SupplierLog {
  id: number;
  order_id: string | null;
  source: string;
  variant_id: string | null;
  qty: number;
  status: "success" | "failed";
  supplier_ref: string | null;
  error: string | null;
  created_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: WalletTxnType;
  amount: number; // topup/refund +, purchase -
  balance_after: number;
  order_id: string | null;
  payment_ref: string | null; // Faz 2: PayTR transaction id
  note: string | null;
  created_at: string;
}

// ─── BİLDİRİMLER ──────────────────────────────────────────────────────────
export type NotificationType =
  | "order.completed" // satın alma başarılı, kod hazır
  | "wallet.topup" // bakiye yüklendi
  | "wallet.refund" // iade bakiyeye eklendi
  | "order.refunded" // sipariş iade edildi
  | "promo" // kampanya / indirim duyurusu
  | "favorite" // favori ürün fiyat/stok değişimi
  | "system"; // genel sistem bildirimi

export interface Notification {
  id: number;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
  /** Dil-bağımsız çeviri anahtarı (varsa render'da çevrilir; yoksa title). */
  title_key: string | null;
  body_key: string | null;
  i18n_params: Record<string, string>;
}

// ─── HESAP MERKEZİ ────────────────────────────────────────────────────────
export type InvoiceStatus = "issued" | "paid" | "cancelled";

export interface Invoice {
  id: string;
  user_id: string;
  order_id: string | null;
  number: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  created_at: string;
}

export type TicketStatus = "open" | "answered" | "resolved" | "closed";
export type TicketCategory = "general" | "order" | "wallet" | "other";

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  order_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  author_id: string | null;
  is_staff: boolean;
  body: string;
  created_at: string;
}

export type ReferralStatus = "pending" | "rewarded";

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  reward_amount: number;
  status: ReferralStatus;
  referrer_reward: number;
  rewarded_at: string | null;
  created_at: string;
}

// ─── YORUMLAR ─────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number; // 1-5
  body: string | null;
  created_at: string;
  updated_at: string;
}

/** Yorum + yazarın görünen adı/avatarı (UI için). */
export interface ReviewWithAuthor extends Review {
  author: { nickname: string; avatar_path: string | null } | null;
}
