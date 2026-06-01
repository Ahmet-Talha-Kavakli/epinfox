-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — hesap geliştirme: profil alanları + referans ödül mekaniği
-- ════════════════════════════════════════════════════════════════════════════

-- ─── Profil alanları (opsiyonel) ──────────────────────────────────────────────
alter table profiles
  add column if not exists full_name        text,
  add column if not exists phone            text,
  add column if not exists birth_date       date,
  add column if not exists marketing_opt_in boolean not null default true;

-- ─── Referans ödül durumu ─────────────────────────────────────────────────────
-- Davet, kayıtta oluşur (pending); davet edilen ilk yüklemesini yapınca
-- "rewarded" olur ve iki tarafa bonus bakiye yazılır.
do $$ begin
  create type referral_status as enum ('pending','rewarded');
exception when duplicate_object then null; end $$;

alter table referrals
  add column if not exists status            referral_status not null default 'pending',
  add column if not exists referrer_reward   numeric(12,2) not null default 0,
  add column if not exists rewarded_at       timestamptz;

-- ─── RPC: referans ödülü ver ──────────────────────────────────────────────────
-- Davet edilen ilk yüklemesini yaptığında çağrılır. Idempotent: zaten
-- ödüllenmişse tekrar bonus vermez. İki tarafa wallet_topup mantığıyla bakiye +
-- wallet_transactions kaydı (type='refund' yerine 'adjustment' = bonus).
create or replace function grant_referral_reward(
  p_referred_id   uuid,
  p_referrer_bonus numeric default 25,
  p_referred_bonus numeric default 25
) returns boolean
language plpgsql
as $$
declare
  v_ref        referrals%rowtype;
  v_bal        numeric;
begin
  select * into v_ref from referrals where referred_id = p_referred_id;
  if not found then return false; end if;
  if v_ref.status = 'rewarded' then return false; end if;

  -- Davet eden bonus
  update profiles set balance = balance + p_referrer_bonus
    where id = v_ref.referrer_id returning balance into v_bal;
  insert into wallet_transactions (user_id, type, amount, balance_after, note)
    values (v_ref.referrer_id, 'adjustment', p_referrer_bonus, v_bal,
            'Referans bonusu (arkadaşın katıldı)');

  -- Davet edilen bonus
  update profiles set balance = balance + p_referred_bonus
    where id = p_referred_id returning balance into v_bal;
  insert into wallet_transactions (user_id, type, amount, balance_after, note)
    values (p_referred_id, 'adjustment', p_referred_bonus, v_bal,
            'Referans hoş geldin bonusu');

  update referrals
    set status = 'rewarded',
        referrer_reward = p_referrer_bonus,
        reward_amount   = p_referred_bonus,
        rewarded_at     = now()
    where referred_id = p_referred_id;

  return true;
end $$;
