-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — tedarik (supply) sistemi
-- ════════════════════════════════════════════════════════════════════════════
-- Sağlayıcı-bağımsız: her ürünün bir "supply_source" (kod nereden gelir) ve
-- "delivery_type" (kod mu, oyuncu ID'sine top-up mu) vardır.
--  - manual : kod DB'deki product_codes stoğundan verilir (mevcut davranış)
--  - mock   : test sağlayıcısı (sahte kod/topup üretir)
--  - <api>  : ileride mtcgame/codeswholesale gibi gerçek B2B sağlayıcılar
-- App-code (provider adaptörü) gerçek çağrıyı yapar; DB sadece durumu tutar.

-- NOT: delivery_type enum'u ve order_status'a eklenen 'pending'/'processing'
-- değerleri, ALTER TYPE ADD VALUE transaction dışında çalışması gerektiği için
-- ayrı script ile (scripts/apply-supply-enums.cjs) önceden eklenir.

-- ─── PRODUCTS: teslim tipi + tedarik kaynağı ────────────────────────────────
alter table products
  add column if not exists delivery_type  delivery_type not null default 'code',
  add column if not exists supply_source  text not null default 'manual';
-- supply_source: 'manual' | 'mock' | ileride 'mtcgame' vb.

-- ─── ORDERS: teslim metadata ────────────────────────────────────────────────
alter table orders
  add column if not exists delivery_type  delivery_type not null default 'code',
  add column if not exists player_id      text,         -- topup için oyuncu ID/UID
  add column if not exists supplier_ref   text,         -- sağlayıcı sipariş referansı
  add column if not exists delivered_note text;         -- topup teslim açıklaması
-- topup siparişlerinde code_id null olabilir → init FK zaten nullable.

-- ─── SUPPLIER_LOGS: her tedarik çağrısının denetim izi ──────────────────────
-- İade/uzlaşma ve hata ayıklama için. Hassas yanıt (kod) saklanmaz; özet tutulur.
create table if not exists supplier_logs (
  id           bigint generated always as identity primary key,
  order_id     uuid references orders(id) on delete set null,
  source       text not null,                 -- 'mock' | 'mtcgame' vb.
  variant_id   uuid references product_variants(id),
  qty          int not null default 1,
  status       text not null,                 -- 'success' | 'failed'
  supplier_ref text,
  error        text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_supplier_logs_order on supplier_logs (order_id);
create index if not exists idx_supplier_logs_created on supplier_logs (created_at desc);
