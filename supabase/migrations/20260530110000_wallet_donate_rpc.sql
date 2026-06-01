-- ════════════════════════════════════════════════════════════════════════════
-- RPC: wallet_donate — cüzdandan atomik bağış düşümü
-- Tek transaction: bakiye kilidi → yeterlilik kontrol → bakiye düş →
-- donations kaydı → wallet_transactions (donation) kaydı.
-- 'donation' enum değeri önceki migration'da eklendi (ayrı tx zorunluluğu).
-- ════════════════════════════════════════════════════════════════════════════
create or replace function wallet_donate(
  p_user_id   uuid,
  p_campaign  text,
  p_amount    numeric,
  p_message   text default null,
  p_anonymous boolean default false
)
returns numeric  -- yeni bakiye
language plpgsql
security definer
as $$
declare
  v_balance     numeric(12,2);
  v_new_balance numeric(12,2);
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;
  if p_campaign is null or length(trim(p_campaign)) = 0 then
    raise exception 'INVALID_CAMPAIGN';
  end if;

  -- Bakiyeyi kilitle (race-safe)
  select balance into v_balance
    from profiles
    where id = p_user_id
    for update;

  if v_balance is null then
    raise exception 'USER_NOT_FOUND';
  end if;
  if v_balance < p_amount then
    raise exception 'INSUFFICIENT_BALANCE';
  end if;

  update profiles
    set balance = balance - p_amount
    where id = p_user_id
    returning balance into v_new_balance;

  insert into donations (user_id, campaign, amount, message, anonymous)
    values (p_user_id, p_campaign, p_amount, nullif(trim(p_message), ''), p_anonymous);

  insert into wallet_transactions (user_id, type, amount, balance_after, note)
    values (p_user_id, 'donation', -p_amount, v_new_balance,
            'Bağış — ' || p_campaign);

  return v_new_balance;
end;
$$;
