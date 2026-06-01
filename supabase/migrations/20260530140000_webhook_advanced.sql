-- ════════════════════════════════════════════════════════════════════════════
-- Webhook gelişmiş ayarları
--  1) profiles.reseller_webhook_ips: izin verilen IP'ler (text[] — whitelist)
--  2) webhook_deliveries: her webhook gönderiminin geçmişi (test + gerçek)
-- ════════════════════════════════════════════════════════════════════════════

alter table profiles
  add column if not exists reseller_webhook_ips text[] not null default '{}';

create table if not exists webhook_deliveries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  event        text not null,                 -- 'test', 'order.completed', ...
  target_url   text not null,
  -- sonuç
  status       text not null check (status in ('success','failed')),
  status_code  int,                           -- HTTP yanıt kodu (null = bağlanılamadı)
  duration_ms  int,                           -- istek süresi
  error        text,                          -- hata mesajı (failed ise)
  payload      jsonb not null default '{}',   -- gönderilen gövde
  created_at   timestamptz not null default now()
);

create index if not exists webhook_deliveries_user_idx
  on webhook_deliveries (user_id, created_at desc);
