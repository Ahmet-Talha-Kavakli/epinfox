-- Bayi API altyapısı: istek log + rate limit + son kullanım takibi.
-- Endpoint'ler /api/v1/* — API anahtarı (SHA-256 hash) ile doğrulanır.

create table if not exists reseller_api_requests (
  id          bigserial primary key,
  user_id     uuid not null references profiles(id) on delete cascade,
  endpoint    text not null,
  method      text not null,
  status_code int not null,
  ip          text,
  created_at  timestamptz not null default now()
);

create index if not exists reseller_api_requests_user_time_idx
  on reseller_api_requests (user_id, created_at desc);

-- profiles: API son kullanım + sipariş referansı için kolonlar
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_name = 'profiles' and column_name = 'reseller_api_last_used') then
    alter table profiles add column reseller_api_last_used timestamptz;
  end if;
end $$;

-- orders: bayinin kendi referans no'su (idempotency / mutabakat)
do $$
begin
  if not exists (select 1 from information_schema.columns
                 where table_name = 'orders' and column_name = 'reseller_ref') then
    alter table orders add column reseller_ref text;
  end if;
  if not exists (select 1 from information_schema.columns
                 where table_name = 'orders' and column_name = 'source') then
    alter table orders add column source text not null default 'web'; -- web | api
  end if;
end $$;

-- Son 1 dakikadaki istek sayısı (rate limit kontrolü için yardımcı)
create or replace function reseller_api_rate_count(p_user_id uuid)
returns int
language sql
stable
as $$
  select count(*)::int from reseller_api_requests
  where user_id = p_user_id and created_at > now() - interval '1 minute';
$$;
