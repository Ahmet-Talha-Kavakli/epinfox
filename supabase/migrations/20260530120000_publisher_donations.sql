-- ════════════════════════════════════════════════════════════════════════════
-- Bağışları YAYINCI bağışına uyarla
--  - donations: publisher_slug / publisher_name / display_name eklenir
--    (campaign alanı yayıncı adıyla doldurulmaya devam — geriye dönük uyum)
--  - wallet_donate RPC: yayıncı parametreleriyle yeniden yazılır
-- ════════════════════════════════════════════════════════════════════════════

alter table donations
  add column if not exists publisher_slug text,
  add column if not exists publisher_name text,
  add column if not exists display_name  text;   -- yayıncıya görünen ad ("Anonim" olabilir)

create index if not exists donations_publisher_idx
  on donations (publisher_slug, created_at desc);

-- RPC yeniden: yayıncıya cüzdandan atomik bağış.
create or replace function wallet_donate(
  p_user_id        uuid,
  p_publisher_slug text,
  p_publisher_name text,
  p_amount         numeric,
  p_display_name   text default null,
  p_message        text default null,
  p_anonymous      boolean default false
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
  if p_publisher_slug is null or length(trim(p_publisher_slug)) = 0 then
    raise exception 'INVALID_PUBLISHER';
  end if;

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

  insert into donations
      (user_id, campaign, publisher_slug, publisher_name, display_name,
       amount, message, anonymous)
    values
      (p_user_id, coalesce(p_publisher_name, p_publisher_slug),
       p_publisher_slug, p_publisher_name,
       nullif(trim(p_display_name), ''),
       p_amount, nullif(trim(p_message), ''), p_anonymous);

  insert into wallet_transactions (user_id, type, amount, balance_after, note)
    values (p_user_id, 'donation', -p_amount, v_new_balance,
            'Bağış — ' || coalesce(p_publisher_name, p_publisher_slug));

  return v_new_balance;
end;
$$;

-- Eski 5 parametreli imzayı kaldır (campaign tabanlı) — çakışmayı önle.
drop function if exists wallet_donate(uuid, text, numeric, text, boolean);
