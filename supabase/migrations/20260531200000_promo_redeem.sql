-- Promo kod KULLANIMI (redemption) — kullanıcı tarafı.
-- Her kullanıcı bir kodu 1 kez kullanabilir; max_uses ve expiry atomik kontrol edilir.
-- bonus_balance tipi cüzdana anında bonus yükler.

create table if not exists promo_redemptions (
  id          uuid primary key default gen_random_uuid(),
  promo_id    uuid not null references promo_codes(id) on delete cascade,
  user_id     uuid not null references profiles(id) on delete cascade,
  code        text not null,
  type        promo_type not null,
  value       numeric(12,2) not null,
  amount      numeric(12,2) not null default 0, -- bonus_balance ise yüklenen tutar
  created_at  timestamptz not null default now(),
  unique (promo_id, user_id)   -- aynı kodu iki kez kullanamaz
);

create index if not exists promo_redemptions_user_idx
  on promo_redemptions (user_id, created_at desc);

-- Atomik redeem: doğrula → kullanım kaydı → (bonus ise) cüzdana yükle → used_count++
-- Dönüş: json { ok, type, value, amount, message, new_balance }
create or replace function promo_redeem(
  p_user_id uuid,
  p_code    text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_promo   promo_codes%rowtype;
  v_amount  numeric(12,2) := 0;
  v_new_bal numeric(12,2);
  v_msg     text;
begin
  -- Kodu kilitle (race-safe used_count için)
  select * into v_promo
    from promo_codes
    where code = upper(trim(p_code))
    for update;

  if v_promo.id is null then
    return jsonb_build_object('ok', false, 'message', 'Geçersiz kod.');
  end if;
  if not v_promo.is_active then
    return jsonb_build_object('ok', false, 'message', 'Bu kod artık aktif değil.');
  end if;
  if v_promo.expires_at is not null and v_promo.expires_at < now() then
    return jsonb_build_object('ok', false, 'message', 'Bu kodun süresi dolmuş.');
  end if;
  if v_promo.max_uses is not null and v_promo.used_count >= v_promo.max_uses then
    return jsonb_build_object('ok', false, 'message', 'Bu kodun kullanım limiti dolmuş.');
  end if;

  -- Daha önce kullanmış mı? (unique constraint de korur ama erken dönelim)
  if exists (select 1 from promo_redemptions where promo_id = v_promo.id and user_id = p_user_id) then
    return jsonb_build_object('ok', false, 'message', 'Bu kodu zaten kullandın.');
  end if;

  -- bonus_balance: cüzdana yükle
  if v_promo.type = 'bonus_balance' then
    v_amount := v_promo.value;
    update profiles set balance = balance + v_amount where id = p_user_id
      returning balance into v_new_bal;
    -- cüzdan hareketi kaydı (bonus = 'adjustment')
    insert into wallet_transactions (user_id, amount, type, balance_after, note)
      values (p_user_id, v_amount, 'adjustment', v_new_bal, 'Promo kod bonusu: ' || v_promo.code);
    v_msg := v_amount::text || '₺ bonus bakiye tanımlandı!';
  elsif v_promo.type = 'percent' then
    v_amount := 0;
    v_msg := '%' || v_promo.value::text || ' indirim kuponun tanımlandı. Sepette otomatik uygulanacak.';
  else -- free_shipping
    v_amount := 0;
    v_msg := 'Ücretsiz teslim avantajın tanımlandı.';
  end if;

  -- Kullanım kaydı + sayaç
  insert into promo_redemptions (promo_id, user_id, code, type, value, amount)
    values (v_promo.id, p_user_id, v_promo.code, v_promo.type, v_promo.value, v_amount);
  update promo_codes set used_count = used_count + 1 where id = v_promo.id;

  return jsonb_build_object(
    'ok', true,
    'type', v_promo.type,
    'value', v_promo.value,
    'amount', v_amount,
    'message', v_msg,
    'new_balance', coalesce(v_new_bal, null)
  );
end;
$$;
