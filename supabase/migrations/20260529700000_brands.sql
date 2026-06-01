-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — markalar / oyunlar (bir marka = birden çok ürün çeşidi)
-- ════════════════════════════════════════════════════════════════════════════
-- Brawl Stars → Gems, Brawl Pass, Pro Pass gibi. Ürünler bir markaya bağlanır;
-- /brand/<slug> sayfasında o markanın tüm çeşitleri listelenir.

create table if not exists brands (
  id           serial primary key,
  slug         text unique not null,
  name         text not null,
  description  text,
  tone         text not null default 'brand',
  image_path   text,
  category_id  int references categories(id),
  position     int not null default 100,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);
create index if not exists idx_brands_category on brands (category_id, position);

alter table products
  add column if not exists brand_id int references brands(id);
create index if not exists idx_products_brand on products (brand_id);
