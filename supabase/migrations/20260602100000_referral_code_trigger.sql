-- ════════════════════════════════════════════════════════════════════════════
-- EpinFox — referral_code otomatik üretimi (trigger)
--
-- Sorun: referral_code yalnızca 20260529400000_account_hub.sql'de BİR KEZ
-- dolduruldu; ne DEFAULT ne trigger vardı. ensureProfile (current-user.ts) de
-- yeni profile referral_code yazmıyor → o tarihten sonra kayıt olan herkesin
-- (örn. Steam kullanıcıları) referral_code'u NULL → /referral'da kod "—" görünür.
--
-- Çözüm: BEFORE INSERT trigger ile her yeni profile benzersiz 8-haneli kod üret;
-- ayrıca mevcut NULL'ları doldur. Kod md5(id + salt) tabanlı (account_hub ile aynı
-- mantık) + çakışma olasılığına karşı döngü.
-- ════════════════════════════════════════════════════════════════════════════

-- 1) Üretici fonksiyon: benzersiz 8-hane büyük harf kod döndürür.
create or replace function gen_referral_code(p_seed text)
returns text
language plpgsql
as $$
declare
  candidate text;
  i int := 0;
begin
  loop
    -- ilk deneme account_hub ile aynı; çakışırsa rastgele tuz ekle
    candidate := upper(substr(md5(p_seed || 'kodkasa' || (case when i = 0 then '' else i::text || random()::text end)), 1, 8));
    exit when not exists (select 1 from profiles where referral_code = candidate);
    i := i + 1;
    if i > 20 then
      -- aşırı güvenlik: tamamen rastgele
      candidate := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 8));
      exit;
    end if;
  end loop;
  return candidate;
end;
$$;

-- 2) Trigger fonksiyonu: INSERT'te referral_code boşsa üret.
create or replace function set_referral_code()
returns trigger
language plpgsql
as $$
begin
  if new.referral_code is null or new.referral_code = '' then
    new.referral_code := gen_referral_code(new.id::text);
  end if;
  return new;
end;
$$;

-- 3) Trigger'ı bağla (varsa önce kaldır — idempotent).
drop trigger if exists trg_set_referral_code on profiles;
create trigger trg_set_referral_code
  before insert on profiles
  for each row
  execute function set_referral_code();

-- 4) Mevcut NULL/boş kodları doldur (geriye dönük).
update profiles
set referral_code = gen_referral_code(id::text)
where referral_code is null or referral_code = '';
