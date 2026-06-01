-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — sepet ile çoklu satın alma (atomik)
-- ════════════════════════════════════════════════════════════════════════════
-- purchase_cart: sepetteki tüm satırları (variant_id + qty) TEK transaction'da
-- işler. Toplam bakiye kontrolü + her satır için qty adet race-safe kod atama.
-- Herhangi bir satırda stok/bakiye yetmezse TÜM işlem rollback (ya hep ya hiç).
--
-- p_items: jsonb array, örn '[{"variant_id":"...","qty":2},{"variant_id":"...","qty":1}]'
-- Döner: her teslim edilen kod için bir satır (order_id, product_name, variant_label, code)

create or replace function purchase_cart(
  p_user_id uuid,
  p_items jsonb,
  p_enc_key text
)
returns table (order_id uuid, product_name text, variant_label text, code text)
language plpgsql
security definer
as $$
declare
  v_item        jsonb;
  v_variant_id  uuid;
  v_qty         int;
  v_price       numeric(12,2);
  v_v_active    boolean;
  v_v_label     text;
  v_product_id  uuid;
  v_p_active    boolean;
  v_name        text;
  v_total       numeric(12,2) := 0;
  v_balance     numeric(12,2);
  v_code_id     uuid;
  v_code_enc    bytea;
  v_order_id    uuid;
  v_new_balance numeric(12,2);
  i             int;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  -- 1) Bakiyeyi kilitle
  select balance into v_balance from profiles where id = p_user_id for update;
  if v_balance is null then raise exception 'USER_NOT_FOUND'; end if;

  -- 2) Tüm satırları gez: doğrula, fiyatla, toplamı hesapla, varyantı kilitle
  --    (kod atama 3. turda; önce toplam tutar + stok yeterliliği netleşsin)
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_variant_id := (v_item->>'variant_id')::uuid;
    v_qty := coalesce((v_item->>'qty')::int, 1);
    if v_qty < 1 or v_qty > 20 then raise exception 'INVALID_QTY'; end if;

    select pv.price, pv.is_active, pv.label, pv.product_id
      into v_price, v_v_active, v_v_label, v_product_id
      from product_variants pv
      where pv.id = v_variant_id
      for update;
    if v_price is null then raise exception 'VARIANT_NOT_FOUND'; end if;
    if not v_v_active then raise exception 'PRODUCT_INACTIVE'; end if;

    select is_active into v_p_active from products where id = v_product_id;
    if not v_p_active then raise exception 'PRODUCT_INACTIVE'; end if;

    v_total := v_total + (v_price * v_qty);
  end loop;

  -- 3) Bakiye yeterli mi?
  if v_balance < v_total then raise exception 'INSUFFICIENT_BALANCE'; end if;

  -- 4) Her satır için qty adet kod ata (race-safe), order + sold + txn
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_variant_id := (v_item->>'variant_id')::uuid;
    v_qty := coalesce((v_item->>'qty')::int, 1);

    select pv.price, pv.label, pv.product_id
      into v_price, v_v_label, v_product_id
      from product_variants pv where pv.id = v_variant_id;
    select name into v_name from products where id = v_product_id;

    i := 0;
    while i < v_qty loop
      select id, code_encrypted into v_code_id, v_code_enc
        from product_codes
        where variant_id = v_variant_id and status = 'available'
        order by created_at
        for update skip locked
        limit 1;
      if v_code_id is null then raise exception 'OUT_OF_STOCK'; end if;

      insert into orders (user_id, product_id, variant_id, code_id, product_name, variant_label, price, status, payment_provider)
        values (p_user_id, v_product_id, v_variant_id, v_code_id, v_name, v_v_label, v_price, 'completed', 'wallet')
        returning id into v_order_id;

      update product_codes set status='sold', order_id=v_order_id, sold_at=now() where id=v_code_id;

      update profiles set balance = balance - v_price where id = p_user_id
        returning balance into v_new_balance;

      insert into wallet_transactions (user_id, type, amount, balance_after, order_id, note)
        values (p_user_id, 'purchase', -v_price, v_new_balance, v_order_id, v_name || ' — ' || v_v_label);

      order_id := v_order_id;
      product_name := v_name;
      variant_label := v_v_label;
      code := pgp_sym_decrypt(v_code_enc, p_enc_key);
      return next;

      i := i + 1;
    end loop;
  end loop;
end;
$$;
