-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — API-tipi tedarik için satın alma RPC'leri
-- ════════════════════════════════════════════════════════════════════════════
-- Akış (mock/gerçek sağlayıcılar için):
--   1) begin_supply_order : bakiye kontrol+düş, order 'processing' oluştur, txn
--   2) app-code provider.fulfill() çağırır
--   3a) complete_supply_order : order 'completed', kod(lar) ekle / topup note
--   3b) fail_supply_order     : bakiye İADE, order 'failed', refund txn
-- Manuel kaynak bu RPC'leri KULLANMAZ (mevcut purchase_product/cart kalır).

-- ─── 1) begin_supply_order ──────────────────────────────────────────────────
create or replace function begin_supply_order(
  p_user_id     uuid,
  p_variant_id  uuid,
  p_qty         int,
  p_delivery    delivery_type,
  p_player_id   text default null
) returns uuid
language plpgsql
security definer
as $$
declare
  v_price      numeric(12,2);
  v_v_active   boolean;
  v_v_label    text;
  v_product_id uuid;
  v_p_active   boolean;
  v_name       text;
  v_balance    numeric(12,2);
  v_total      numeric(12,2);
  v_order_id   uuid;
  v_new_bal    numeric(12,2);
begin
  if p_qty < 1 or p_qty > 20 then raise exception 'INVALID_QTY'; end if;

  select pv.price, pv.is_active, pv.label, pv.product_id
    into v_price, v_v_active, v_v_label, v_product_id
    from product_variants pv where pv.id = p_variant_id for update;
  if v_price is null then raise exception 'VARIANT_NOT_FOUND'; end if;
  if not v_v_active then raise exception 'PRODUCT_INACTIVE'; end if;

  select name, is_active into v_name, v_p_active
    from products where id = v_product_id for update;
  if not v_p_active then raise exception 'PRODUCT_INACTIVE'; end if;

  v_total := v_price * p_qty;

  select balance into v_balance from profiles where id = p_user_id for update;
  if v_balance is null then raise exception 'USER_NOT_FOUND'; end if;
  if v_balance < v_total then raise exception 'INSUFFICIENT_BALANCE'; end if;

  -- Tek order satırı (qty bilgisi note'ta; kodlar complete'te eklenecek).
  -- NOT: code teslimde her qty için ayrı kod, ama order tek; sadeleştirme için
  -- qty=1 önerilir (UI tek adet topup/kod akışı). qty>1 code teslimde de tek
  -- order + çoklu kod complete'te eklenir.
  insert into orders (
    user_id, product_id, variant_id, product_name, variant_label,
    price, status, payment_provider, delivery_type, player_id
  ) values (
    p_user_id, v_product_id, p_variant_id, v_name, v_v_label,
    v_total, 'processing', 'wallet', p_delivery, p_player_id
  ) returning id into v_order_id;

  update profiles set balance = balance - v_total
    where id = p_user_id returning balance into v_new_bal;

  insert into wallet_transactions (user_id, type, amount, balance_after, order_id, note)
    values (p_user_id, 'purchase', -v_total, v_new_bal, v_order_id,
            v_name || ' — ' || coalesce(v_v_label,'') ||
            case when p_qty > 1 then ' ×' || p_qty else '' end);

  return v_order_id;
end $$;

-- ─── 2) complete_supply_order ───────────────────────────────────────────────
-- code teslim: p_codes (düz metin) şifrelenip product_codes'a 'sold' eklenir,
--   order.code_id ilk koda set edilir (tek koda link; çoğu akış qty=1).
-- topup teslim: p_note order.delivered_note'a yazılır.
create or replace function complete_supply_order(
  p_order_id    uuid,
  p_codes       text[] default null,
  p_note        text default null,
  p_supplier_ref text default null,
  p_enc_key     text default null
) returns void
language plpgsql
security definer
as $$
declare
  v_variant_id uuid;
  v_product_id uuid;
  v_delivery   delivery_type;
  v_code       text;
  v_first_code uuid;
  v_code_id    uuid;
begin
  select variant_id, product_id, delivery_type
    into v_variant_id, v_product_id, v_delivery
    from orders where id = p_order_id for update;
  if v_variant_id is null and v_product_id is null then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if v_delivery = 'code' and p_codes is not null then
    foreach v_code in array p_codes loop
      if length(trim(v_code)) > 0 then
        insert into product_codes (product_id, variant_id, code_encrypted, status, order_id, sold_at)
          values (v_product_id, v_variant_id, pgp_sym_encrypt(trim(v_code), p_enc_key),
                  'sold', p_order_id, now())
          returning id into v_code_id;
        if v_first_code is null then v_first_code := v_code_id; end if;
      end if;
    end loop;
    update orders set code_id = v_first_code where id = p_order_id;
  end if;

  update orders
    set status = 'completed',
        supplier_ref = p_supplier_ref,
        delivered_note = case
          when v_delivery in ('topup','service') then p_note
          else delivered_note
        end
    where id = p_order_id;

  insert into supplier_logs (order_id, source, variant_id, qty, status, supplier_ref)
    select p_order_id, p.supply_source, v_variant_id,
           coalesce(array_length(p_codes,1), 1), 'success', p_supplier_ref
    from products p where p.id = v_product_id;
end $$;

-- ─── 3) fail_supply_order ───────────────────────────────────────────────────
-- Sağlayıcı teslim edemedi → bakiyeyi İADE et, order 'failed', refund txn, log.
create or replace function fail_supply_order(
  p_order_id    uuid,
  p_error       text default null,
  p_supplier_ref text default null
) returns void
language plpgsql
security definer
as $$
declare
  v_user_id    uuid;
  v_price      numeric(12,2);
  v_status     order_status;
  v_variant_id uuid;
  v_product_id uuid;
  v_new_bal    numeric(12,2);
begin
  select user_id, price, status, variant_id, product_id
    into v_user_id, v_price, v_status, v_variant_id, v_product_id
    from orders where id = p_order_id for update;
  if v_user_id is null then raise exception 'ORDER_NOT_FOUND'; end if;
  -- Idempotent: zaten failed/refunded ise tekrar iade etme.
  if v_status in ('failed','refunded') then return; end if;

  -- İade
  update profiles set balance = balance + v_price
    where id = v_user_id returning balance into v_new_bal;
  insert into wallet_transactions (user_id, type, amount, balance_after, order_id, note)
    values (v_user_id, 'refund', v_price, v_new_bal, p_order_id,
            'Teslim edilemedi — otomatik iade');

  update orders set status = 'failed', supplier_ref = p_supplier_ref
    where id = p_order_id;

  insert into supplier_logs (order_id, source, variant_id, qty, status, supplier_ref, error)
    select p_order_id, p.supply_source, v_variant_id, 1, 'failed', p_supplier_ref, p_error
    from products p where p.id = v_product_id;
end $$;
