-- Memnuniyet anketi: rastgele beliren popup'tan gelen 1-5 yıldız + opsiyonel yorum.
create table if not exists satisfaction_feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete set null, -- misafir de gönderebilir
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  path        text,                  -- hangi sayfada gönderildi (bağlam)
  created_at  timestamptz not null default now()
);

create index if not exists satisfaction_feedback_time_idx
  on satisfaction_feedback (created_at desc);
