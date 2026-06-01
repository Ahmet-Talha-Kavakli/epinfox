-- ════════════════════════════════════════════════════════════════════════════
-- KodKasa — "Sosyal Medya" kategorisi (SMM ürünleri için dedike)
-- ════════════════════════════════════════════════════════════════════════════
-- Instagram / TikTok / YouTube / Twitter / Telegram takipçi-beğeni-izlenme vb.
-- supply_source = 'smm', delivery_type = 'service' ürünler buraya yerleşir.
insert into categories (slug, name, position)
values ('sosyal-medya', 'Sosyal Medya', 5)
on conflict (slug) do update set name = excluded.name, position = excluded.position;
