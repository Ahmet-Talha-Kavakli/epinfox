-- Marka sayfaları için ayrı geniş banner görseli (yatay ~16:6).
-- image_path = kare logo (köşe kutusu), banner_path = geniş kapak.
alter table brands add column if not exists banner_path text;
