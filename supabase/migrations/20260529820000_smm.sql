-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — SMM (sosyal medya hizmetleri) tedarik desteği
-- ════════════════════════════════════════════════════════════════════════════
-- SMM = Instagram takipçi, YouTube izlenme, TikTok beğeni vb. "Perfect Panel"
-- standart /api/v2 API'siyle tedarik edilir (resellerprovider, followiz,
-- justanotherpanel, medyabayim... hepsi aynı format → tek adaptör: smm).
--
-- Yeni teslim tipi: delivery_type = 'service'
--   - Kod YOK, oyuncu ID YOK; hedef bir LİNK (profil/video URL'si) gerekir.
--   - SMM ASENKRONdur: sipariş açılır (action=add), saatler/günler sürebilir;
--     durum action=status ile poll edilir. Bu yüzden teslim 'processing'te kalır
--     ve poll (smm-sync) tamamlandığında 'completed'/'failed' yapılır.
--
-- NOT: delivery_type enum'una 'service' değeri ALTER TYPE ADD VALUE ile, tx
-- DIŞINDA eklenir (scripts/apply-supply-enums.cjs). Bu dosya yalnız tx-içi
-- güvenli DDL içerir (kolon ekleme).

-- ─── PRODUCT_VARIANTS: SMM servis eşlemesi ──────────────────────────────────
-- KodKasa varyantı → SMM panelindeki servis id'si (action=services'tan gelir).
-- Admin /admin/smm sayfasından paneldeki servisleri görüp bu kolona yazar.
alter table product_variants
  add column if not exists supplier_service_id text,
  add column if not exists supplier_quantity   int;
comment on column product_variants.supplier_service_id is
  'SMM (Perfect Panel) servis id''si — delivery_type=service + supply_source=smm varyantlarında zorunlu.';
comment on column product_variants.supplier_quantity is
  'SMM teslimde panele gönderilecek adet (örn. "1000 takipçi" → 1000). Sipariş qty ile çarpılır. Boşsa sipariş qty kullanılır.';

-- ─── ORDERS: SMM hedef linki ────────────────────────────────────────────────
-- service teslimde oyuncu ID yerine hedef profil/video linki tutulur.
-- player_id kolonu zaten var; semantik karışmasın diye ayrı bir kolon eklemek
-- yerine, service teslimde link'i player_id kolonuna yazıyoruz (tek "hedef"
-- alanı). delivered_note SMM durum özetini (charge/start_count/remains) tutar.
-- Ek kolon GEREKMEZ — mevcut player_id + delivered_note yeterli.

-- ─── complete_supply_order: service teslimi destekle ────────────────────────
-- ÖN KOŞUL: delivery_type enum'una 'service' eklenmiş olmalı
-- (scripts/apply-supply-enums.cjs ÖNCE çalıştırılır). Fonksiyon, service
-- teslimde de delivered_note yazsın diye güncellenir (topup ile aynı dal).
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
