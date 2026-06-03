-- Hafif, merkezi (serverless-uyumlu) rate-limit altyapısı.
-- Bir "anahtar" (örn. "support:create:<userId>") için kayan pencere içinde
-- sayaç tutar; limit aşılırsa false döner. Vercel'de in-memory sayaç işe
-- yaramaz (her instance ayrı) — bu yüzden Supabase'de merkezi tutuyoruz.

create table if not exists public.rate_limits (
  key         text primary key,
  count       integer not null default 0,
  window_start timestamptz not null default now()
);

-- RPC: bir anahtar için isteği kaydet ve limit içinde mi kontrol et.
--   p_key     : benzersiz eylem+özne anahtarı (örn. "support:create:<uid>")
--   p_limit   : pencere başına izin verilen maksimum istek
--   p_window  : pencere uzunluğu (saniye)
-- Döner: true = izinli (sayaç artırıldı), false = limit aşıldı.
-- Atomik: tek upsert + koşullu sayaç, race-safe.
create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window integer
)
returns boolean
language plpgsql
as $$
declare
  v_now timestamptz := now();
  v_count integer;
  v_start timestamptz;
begin
  -- Mevcut kaydı kilitle (FOR UPDATE) — eşzamanlı isteklerde tutarlı sayım.
  select count, window_start into v_count, v_start
  from public.rate_limits
  where key = p_key
  for update;

  if not found then
    insert into public.rate_limits(key, count, window_start)
    values (p_key, 1, v_now);
    return true;
  end if;

  -- Pencere süresi dolduysa sıfırla.
  if v_start < v_now - make_interval(secs => p_window) then
    update public.rate_limits
    set count = 1, window_start = v_now
    where key = p_key;
    return true;
  end if;

  -- Pencere içinde: limit aşıldı mı?
  if v_count >= p_limit then
    return false;
  end if;

  update public.rate_limits
  set count = count + 1
  where key = p_key;
  return true;
end;
$$;

-- Eski kayıtları periyodik temizlemek için yardımcı (cron/elle çağrılabilir).
create or replace function public.cleanup_rate_limits()
returns void
language sql
as $$
  delete from public.rate_limits
  where window_start < now() - interval '1 day';
$$;
