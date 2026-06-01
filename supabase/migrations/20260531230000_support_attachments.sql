-- Destek mesajlarına dosya eki: görsel/PDF kanıt yükleme.
-- attachments: [{ path, name, mime, size }] biçiminde jsonb dizisi.

alter table support_messages
  add column if not exists attachments jsonb not null default '[]'::jsonb;

-- Storage bucket: support-attachments (özel; service-role yazar, imzalı URL ile okunur)
insert into storage.buckets (id, name, public)
values ('support-attachments', 'support-attachments', false)
on conflict (id) do nothing;
