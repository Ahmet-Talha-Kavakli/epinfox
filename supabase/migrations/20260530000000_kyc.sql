-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — Kimlik Doğrulama (KYC) + iletişim doğrulama
-- ════════════════════════════════════════════════════════════════════════════

-- ─── KYC durumu ───────────────────────────────────────────────────────────────
-- none      : henüz başvuru yok
-- pending   : başvuru yapıldı, admin onayı bekliyor
-- approved  : onaylandı
-- rejected  : reddedildi (kullanıcı yeniden gönderebilir)
do $$ begin
  create type kyc_status as enum ('none','pending','approved','rejected');
exception when duplicate_object then null; end $$;

alter table profiles
  add column if not exists kyc_status        kyc_status not null default 'none',
  add column if not exists kyc_full_name     text,
  add column if not exists kyc_national_id   text,        -- TC kimlik no (11 hane)
  add column if not exists kyc_birth_date    date,
  add column if not exists kyc_doc_front_path text,        -- storage yolu (ön yüz)
  add column if not exists kyc_doc_back_path  text,        -- storage yolu (arka yüz)
  add column if not exists kyc_submitted_at  timestamptz,
  add column if not exists kyc_reviewed_at   timestamptz,
  add column if not exists kyc_reject_reason text,
  -- İletişim doğrulama: e-posta Clerk'te tutulur; burada telefon doğrulaması.
  add column if not exists phone_verified_at timestamptz;

-- ─── KYC belgeleri için private storage bucket ────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('kyc-documents', 'kyc-documents', false)
  on conflict (id) do nothing;
