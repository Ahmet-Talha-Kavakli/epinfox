-- ════════════════════════════════════════════════════════════════════════════
-- EpinFox — "Para Kazan": sosyal medya içerik paylaşımı → admin onayı → bakiye ödülü
-- Kullanıcı bir paylaşım gönderir (platform + link + opsiyonel kanıt görseli),
-- admin inceler; onaylarsa ödül tutarını belirler ve bakiye + wallet_transaction
-- yazılır. Reddederse sebep kaydedilir. Idempotent ödül (status guard).
-- ════════════════════════════════════════════════════════════════════════════

do $$ begin
  create type earn_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

create table if not exists earn_submissions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  platform      text not null,                 -- instagram / tiktok / youtube / x / other
  content_url   text not null,                 -- paylaşımın linki
  note          text,                          -- kullanıcının açıklaması (ops.)
  attachments   jsonb not null default '[]'::jsonb,  -- kanıt görselleri (storage path)
  status        earn_status not null default 'pending',
  reward        numeric(12,2) not null default 0,    -- onayda verilen ödül (₺)
  reject_reason text,
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists idx_earn_user on earn_submissions (user_id, created_at desc);
create index if not exists idx_earn_status on earn_submissions (status, created_at desc);
-- Not: erişim sunucu tarafı admin client ile; RLS kullanılmıyor (diğer tablolar gibi).

-- Kanıt görselleri için özel bucket.
insert into storage.buckets (id, name, public)
values ('earn-attachments', 'earn-attachments', false)
on conflict (id) do nothing;

-- ─── RPC: paylaşım ödülünü onayla ─────────────────────────────────────────────
-- Idempotent: yalnız 'pending' kayıt onaylanır; ödül bakiyeye + wallet_transactions'a
-- yazılır. Dönüş: true = onaylandı & ödendi, false = uygun değil (zaten işlenmiş).
create or replace function approve_earn_submission(
  p_submission_id uuid,
  p_reward        numeric
) returns boolean
language plpgsql
as $$
declare
  v_sub  earn_submissions%rowtype;
  v_bal  numeric;
begin
  select * into v_sub from earn_submissions where id = p_submission_id for update;
  if not found then return false; end if;
  if v_sub.status <> 'pending' then return false; end if;

  update earn_submissions
    set status = 'approved',
        reward = greatest(p_reward, 0),
        reject_reason = null,
        reviewed_at = now()
    where id = p_submission_id;

  if p_reward > 0 then
    update profiles set balance = balance + p_reward
      where id = v_sub.user_id returning balance into v_bal;
    insert into wallet_transactions (user_id, type, amount, balance_after, note)
      values (v_sub.user_id, 'adjustment', p_reward, v_bal,
              'Para Kazan ödülü (içerik paylaşımı)');
  end if;

  return true;
end $$;
