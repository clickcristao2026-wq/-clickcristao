-- Executar depois de schema.sql e schema_products.sql em instalações existentes.
begin;
alter table public.products add column if not exists detalhes jsonb not null default '{}'::jsonb;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'products_detalhes_object' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_detalhes_object check (jsonb_typeof(detalhes) = 'object');
  end if;
end $$;
alter table public.product_images add column if not exists papel text;
-- Preserva fotos antigas; as duas primeiras passam a ser as fotos destacadas.
with ranked as (
  select id, row_number() over (partition by product_id order by ordem, created_at, id) as position
  from public.product_images
)
update public.product_images image
set papel = case when ranked.position <= 2 then 'destaque' else 'galeria' end
from ranked where image.id = ranked.id and image.papel is null;
alter table public.product_images alter column papel set default 'galeria';
alter table public.product_images alter column papel set not null;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'product_images_papel_check' and conrelid = 'public.product_images'::regclass) then
    alter table public.product_images add constraint product_images_papel_check check (papel in ('destaque', 'galeria', 'corpo', 'video'));
  end if;
end $$;

create table if not exists public.ai_credentials (
  user_id uuid primary key references auth.users(id) on delete cascade,
  encrypted_key text not null,
  key_suffix text not null,
  updated_at timestamptz not null default now()
);
alter table public.ai_credentials enable row level security;
revoke all on public.ai_credentials from anon, authenticated;
grant all on public.ai_credentials to service_role;
-- Nenhuma policy de cliente: somente a Edge Function consegue ler a chave cifrada.

create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  draft_id uuid,
  kind text not null check (kind in ('mercado','lucro','conteudo','comparacao','suporte','investigador')),
  model text not null default 'gpt-6-luna',
  report jsonb not null,
  sources jsonb not null default '[]'::jsonb,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists ai_runs_owner_created_idx on public.ai_runs(user_id, created_at desc);
create index if not exists ai_runs_draft_idx on public.ai_runs(user_id, draft_id);
alter table public.ai_runs enable row level security;
revoke all on public.ai_runs from anon, authenticated;
grant select on public.ai_runs to authenticated;
grant all on public.ai_runs to service_role;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'ai_runs' and policyname = 'ai_runs_read_own') then
    create policy ai_runs_read_own on public.ai_runs for select to authenticated using (user_id = auth.uid());
  end if;
end $$;

-- Uma operação atômica evita duas abas consumirem o mesmo limite simultaneamente.
create table if not exists public.ai_request_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  minute_start timestamptz not null default now(), minute_count integer not null default 0,
  day_start timestamptz not null default now(), day_count integer not null default 0
);
alter table public.ai_request_limits enable row level security;
revoke all on public.ai_request_limits from anon, authenticated;
grant all on public.ai_request_limits to service_role;
create or replace function public.reserve_ai_request(p_user_id uuid) returns boolean
language plpgsql security definer set search_path = public as $$
declare r public.ai_request_limits; t timestamptz := clock_timestamp();
begin
  insert into public.ai_request_limits(user_id) values(p_user_id) on conflict do nothing;
  select * into r from public.ai_request_limits where user_id = p_user_id for update;
  if r.minute_start <= t - interval '1 minute' then r.minute_start := t; r.minute_count := 0; end if;
  if r.day_start <= t - interval '24 hours' then r.day_start := t; r.day_count := 0; end if;
  if r.minute_count >= 6 or r.day_count >= 100 then return false; end if;
  update public.ai_request_limits set minute_start = r.minute_start, minute_count = r.minute_count + 1,
    day_start = r.day_start, day_count = r.day_count + 1 where user_id = p_user_id;
  return true;
end;
$$;
revoke all on function public.reserve_ai_request(uuid) from public, anon, authenticated;
grant execute on function public.reserve_ai_request(uuid) to service_role;

create or replace function public.attach_ai_draft(p_draft_id uuid, p_product_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.products where id = p_product_id and seller_id = auth.uid()) then
    raise exception 'Produto não pertence à sua conta';
  end if;
  update public.ai_runs set product_id = p_product_id
  where user_id = auth.uid() and draft_id = p_draft_id and product_id is null;
end;
$$;
revoke all on function public.attach_ai_draft(uuid, uuid) from public, anon;
grant execute on function public.attach_ai_draft(uuid, uuid) to authenticated;

-- Imagens e um vídeo por produto, sempre dentro da pasta do proprietário.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('product-videos','product-videos',true,104857600,array['video/mp4','video/webm'])
on conflict (id) do nothing;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'product_videos_read') then
    create policy product_videos_read on storage.objects for select using(bucket_id = 'product-videos');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'product_videos_insert') then
    create policy product_videos_insert on storage.objects for insert to authenticated
      with check(bucket_id = 'product-videos' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'product_videos_delete') then
    create policy product_videos_delete on storage.objects for delete to authenticated
      using(bucket_id = 'product-videos' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
end $$;
commit;
