-- ════════════════════════════════════════════════════════════════════════════
-- EpinFox — Referans kademe (milestone) ödülleri
-- Her başarılı davette sabit bonus (25+25₺) zaten veriliyor (grant_referral_reward).
-- Bunun ÜZERİNE, davet eden belirli davet sayısı eşiklerine ulaşınca BİR KEZ
-- ekstra milestone bonusu kazanır:  3→+50₺, 5→+150₺, 10→+300₺ (+VIP rozet).
-- ════════════════════════════════════════════════════════════════════════════

-- Hangi kullanıcı hangi eşiği aldı — idempotency anahtarı (user + threshold tek).
create table if not exists referral_milestones (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  threshold    int not null,                 -- 3 / 5 / 10
  bonus        numeric(12,2) not null,        -- verilen ekstra ₺
  created_at   timestamptz not null default now(),
  unique (user_id, threshold)
);
create index if not exists idx_referral_milestones_user
  on referral_milestones (user_id);
-- Not: erişim sunucu tarafı admin client (service role) ile; referrals gibi
-- bu tablo da RLS kullanmaz (tüm okuma/yazma server action'lar üzerinden).

-- ─── RPC: kademe ödüllerini ver ───────────────────────────────────────────────
-- Davet edenin GÜNCEL rewarded davet sayısına göre, henüz ödenmemiş tüm eşikleri
-- öder. Idempotent: unique(user_id, threshold) sayesinde aynı eşik iki kez ödenmez.
-- Dönüş: bu çağrıda yeni ödenen toplam milestone bonusu (₺). 0 = yeni eşik yok.
create or replace function grant_referral_milestones(
  p_referrer_id uuid
) returns numeric
language plpgsql
as $$
declare
  v_count   int;
  v_total   numeric := 0;
  v_bal     numeric;
  r         record;
  -- eşik → bonus tablosu (tek yerde tanımlı)
  c_tiers   constant int[]     := array[3, 5, 10];
  c_bonus   constant numeric[] := array[50, 150, 300];
  i         int;
begin
  -- Bu kullanıcının ödüllenmiş (rewarded) davet sayısı
  select count(*) into v_count
    from referrals
    where referrer_id = p_referrer_id and status = 'rewarded';

  for i in 1 .. array_length(c_tiers, 1) loop
    if v_count >= c_tiers[i] then
      -- Daha önce ödenmiş mi?
      perform 1 from referral_milestones
        where user_id = p_referrer_id and threshold = c_tiers[i];
      if not found then
        -- Ödülü yaz (race-safe: unique violation olursa atla)
        begin
          insert into referral_milestones (user_id, threshold, bonus)
            values (p_referrer_id, c_tiers[i], c_bonus[i]);
        exception when unique_violation then
          continue;
        end;

        update profiles set balance = balance + c_bonus[i]
          where id = p_referrer_id returning balance into v_bal;
        insert into wallet_transactions (user_id, type, amount, balance_after, note)
          values (p_referrer_id, 'adjustment', c_bonus[i], v_bal,
                  c_tiers[i] || ' davet kademe bonusu');

        v_total := v_total + c_bonus[i];
      end if;
    end if;
  end loop;

  return v_total;
end $$;
