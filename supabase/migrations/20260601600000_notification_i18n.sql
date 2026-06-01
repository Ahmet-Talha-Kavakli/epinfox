-- ════════════════════════════════════════════════════════════════════════════
-- EpinFox — Bildirim i18n
-- Bildirimler artık dil-bağımsız anahtar + parametre olarak saklanır; render
-- anında okuyanın diline göre çevrilir. title/body (TR snapshot) geriye dönük
-- uyumluluk için kalır (eski kayıtlar + anahtarı olmayan bildirimler).
--
-- title_key / body_key: dict anahtarı (ör. "ntf.order.ready.title")
-- i18n_params: {"label": "Valorant VP (475 VP)", "amount": "₺255,00"} gibi
--              çeviri içinde {label}/{amount} ile değiştirilecek değerler.
-- ════════════════════════════════════════════════════════════════════════════

alter table notifications
  add column if not exists title_key   text,
  add column if not exists body_key    text,
  add column if not exists i18n_params jsonb not null default '{}'::jsonb;
