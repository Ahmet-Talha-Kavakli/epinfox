-- ════════════════════════════════════════════════════════════════════════════
-- EpinFox — Promo kodları: yalnızca BONUS_BALANCE (cüzdan bonusu) geçerli
--
-- Sorun: percent / free_shipping kodları redeem ediliyor ve "sepette uygulanacak"
-- diyordu AMA checkout fiyatı RPC içinde hesaplandığı için indirim HİÇ
-- uygulanmıyordu → kullanıcıya "promo çalışmıyor" hissi.
--
-- Karar (cüzdan modeline en uygun): yalnızca bonus_balance kodları (kod gir →
-- cüzdana anında bonus). percent/free_shipping şimdilik devre dışı; redeem
-- edilmeye çalışılırsa net mesajla reddedilir (kullanım kaydı OLUŞTURULMAZ).
-- İleride ödeme/checkout entegrasyonuyla percent gerçekten uygulanabilir.
-- ════════════════════════════════════════════════════════════════════════════

create or replace function promo_redeem(
  p_user_id uuid,
  p_code    text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_promo    promo_codes%rowtype;
  v_amount   numeric(12,2);
  v_new_bal  numeric(12,2);
  v_msg      text;
begin
  select * into v_promo from promo_codes
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

  -- Yalnızca bonus_balance kodları destekleniyor. Diğer tipler reddedilir
  -- (kullanım kaydı OLUŞTURULMAZ, sayaç artmaz → kod boşa harcanmaz).
  if v_promo.type <> 'bonus_balance' then
    return jsonb_build_object('ok', false,
      'message', 'Bu kod şu an kullanılamıyor. Lütfen geçerli bir bonus kodu dene.');
  end if;

  -- Daha önce kullanmış mı?
  if exists (select 1 from promo_redemptions where promo_id = v_promo.id and user_id = p_user_id) then
    return jsonb_build_object('ok', false, 'message', 'Bu kodu zaten kullandın.');
  end if;

  -- bonus_balance: cüzdana yükle
  v_amount := v_promo.value;
  update profiles set balance = balance + v_amount where id = p_user_id
    returning balance into v_new_bal;
  insert into wallet_transactions (user_id, amount, type, balance_after, note)
    values (p_user_id, v_amount, 'adjustment', v_new_bal, 'Promo kod bonusu: ' || v_promo.code);
  v_msg := v_amount::text || '₺ bonus bakiye tanımlandı!';

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
    'new_balance', v_new_bal
  );
end;
$$;

-- Mevcut bonus dışı kodları pasifleştir (çalışmayan/anlamsız: BAYRAM10 percent,
-- VIP2026 percent %0). bonus_balance kodları aktif kalır.
update promo_codes set is_active = false where type <> 'bonus_balance';
