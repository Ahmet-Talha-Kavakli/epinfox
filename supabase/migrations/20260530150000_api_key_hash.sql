-- ════════════════════════════════════════════════════════════════════════════
-- API anahtarı güvenliği: düz metin yerine HASH sakla.
--  - reseller_api_key artık SHA-256 hash tutar (geri çözülemez).
--  - reseller_api_key_hint: kullanıcıya gösterilecek maske (ör. 'kk_live_…1a2b').
--  - Mevcut düz-metin anahtarlar geçersiz kılınır (null) — kullanıcı yeniden üretir.
-- ════════════════════════════════════════════════════════════════════════════

alter table profiles
  add column if not exists reseller_api_key_hint text;

-- Mevcut (düz metin) anahtarları sıfırla — artık hash saklanacak.
update profiles
  set reseller_api_key = null
  where reseller_api_key is not null
    and reseller_api_key like 'kk_live_%';

comment on column profiles.reseller_api_key is 'API anahtarının SHA-256 hash''i (düz metin asla saklanmaz)';
comment on column profiles.reseller_api_key_hint is 'Kullanıcıya gösterilen maske: kk_live_…son4';
