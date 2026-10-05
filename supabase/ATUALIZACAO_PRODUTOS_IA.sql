-- CLICK CRISTÃO — atualização de produtos e IA
-- Projeto: xqmvlozonwudwewjlpfe
-- Execute o arquivo inteiro no SQL Editor do projeto existente.
-- Não remove produtos, usuários, fotos, chaves ou histórico.
-- Pode ser executado novamente: mantém as mídias já classificadas.
begin;
do $$ begin
  if to_regclass('public.profiles') is null
     or to_regclass('public.products') is null
     or to_regclass('public.product_images') is null
     or to_regclass('public.product_attribute_selections') is null
     or to_regprocedure('public.is_admin(uuid)') is null then
    raise exception 'Faltam as tabelas originais. Execute primeiro schema.sql e schema_products.sql.';
  end if;
end $$;

-- Executar depois de schema.sql e schema_products.sql em instalações existentes.

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

-- Salva produto e filtros na mesma transação, evitando perda parcial de seleções.

-- Custos e margem nunca ficam no JSON do anúncio, que é consultável pelos compradores.
create table if not exists public.product_pricing (
  product_id uuid primary key references public.products(id) on delete cascade,
  data jsonb not null check (jsonb_typeof(data) = 'object')
);
alter table public.product_pricing enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'product_pricing' and policyname = 'product_pricing_owner') then
    create policy product_pricing_owner on public.product_pricing for all to authenticated
      using (exists(select 1 from public.products p where p.id = product_id and (p.seller_id = auth.uid() or public.is_admin(auth.uid()))))
      with check (exists(select 1 from public.products p where p.id = product_id and (p.seller_id = auth.uid() or public.is_admin(auth.uid()))));
  end if;
end $$;
revoke all on public.product_pricing from anon;
grant select, insert, update, delete on public.product_pricing to authenticated;
grant all on public.product_pricing to service_role;

alter table public.products add column if not exists search_document tsvector generated always as (
  to_tsvector('portuguese', coalesce(nome,'') || ' ' || coalesce(modelo,'') || ' ' || coalesce(descricao,'') || ' ' || coalesce(beneficios_texto,''))
) stored;
create index if not exists products_search_document_idx on public.products using gin(search_document);

create or replace function public.save_product_record(p_product_id uuid, p_data jsonb, p_attribute_ids uuid[])
returns uuid language plpgsql security invoker set search_path = public as $$
declare product_uuid uuid; public_details jsonb; private_pricing jsonb;
begin
  if auth.uid() is null or not exists (
    select 1 from public.profiles where id = auth.uid() and role in ('vendedor','anunciante','admin')
  ) then raise exception 'Conta sem permissão para cadastrar produtos'; end if;
  if trim(coalesce(p_data->>'nome','')) = '' or coalesce((p_data->>'preco')::numeric,0) <= 0 or nullif(p_data->>'categoria_id','') is null then
    raise exception 'Preencha nome e preço do produto';
  end if;
  private_pricing := coalesce(p_data->'detalhes'->'precificacao','{}'::jsonb);
  public_details := jsonb_set(coalesce(p_data->'detalhes','{}'::jsonb),'{precificacao}',private_pricing - 'custo' - 'margem' - 'freteCusto');
  if p_product_id is null then
    insert into public.products(seller_id,categoria_id,nome,modelo,preco,preco_parcelado_texto,
      descricao,ficha_tecnica,beneficios_texto,curiosidade,modo_uso_cuidados,garantia_satisfacao,sku,status,detalhes)
    values(auth.uid(),(p_data->>'categoria_id')::uuid,p_data->>'nome',nullif(p_data->>'modelo',''),
      (p_data->>'preco')::numeric,nullif(p_data->>'preco_parcelado_texto',''),nullif(p_data->>'descricao',''),
      nullif(p_data->>'ficha_tecnica',''),nullif(p_data->>'beneficios_texto',''),nullif(p_data->>'curiosidade',''),
      nullif(p_data->>'modo_uso_cuidados',''),nullif(p_data->>'garantia_satisfacao',''),nullif(p_data->>'sku',''),
      'rascunho',public_details) returning id into product_uuid;
  else
    update public.products set categoria_id = (p_data->>'categoria_id')::uuid,nome = p_data->>'nome',
      modelo = nullif(p_data->>'modelo',''),preco = (p_data->>'preco')::numeric,
      preco_parcelado_texto = nullif(p_data->>'preco_parcelado_texto',''),descricao = nullif(p_data->>'descricao',''),
      ficha_tecnica = nullif(p_data->>'ficha_tecnica',''),beneficios_texto = nullif(p_data->>'beneficios_texto',''),
      curiosidade = nullif(p_data->>'curiosidade',''),modo_uso_cuidados = nullif(p_data->>'modo_uso_cuidados',''),
      garantia_satisfacao = nullif(p_data->>'garantia_satisfacao',''),sku = nullif(p_data->>'sku',''),
      status = 'rascunho',detalhes = public_details
    where id = p_product_id and seller_id = auth.uid() returning id into product_uuid;
    if product_uuid is null then raise exception 'Produto não encontrado ou sem permissão'; end if;
  end if;
  insert into public.product_pricing(product_id,data) values(product_uuid,private_pricing)
    on conflict(product_id) do update set data = excluded.data;
  delete from public.product_attribute_selections where product_id = product_uuid;
  insert into public.product_attribute_selections(product_id, attribute_value_id)
    select product_uuid, id from (select distinct unnest(p_attribute_ids) as id) selected;
  return product_uuid;
end;
$$;
revoke all on function public.save_product_record(uuid,jsonb,uuid[]) from public, anon;
grant execute on function public.save_product_record(uuid,jsonb,uuid[]) to authenticated;

-- Também protege a publicação feita fora da tela de cadastro.
create or replace function public.validate_product_publication()
returns trigger language plpgsql set search_path = public as $$
declare counts jsonb;
begin
  if NEW.status = 'publicado' and OLD.status <> 'publicado' then
    select jsonb_object_agg(papel,n) into counts from (
      select papel,count(*) as n from public.product_images where product_id = NEW.id group by papel
    ) grouped;
    if coalesce((counts->>'destaque')::int,0) <> 2 or coalesce((counts->>'galeria')::int,0) <> 3
      or coalesce((counts->>'corpo')::int,0) <> 2 or coalesce((counts->>'video')::int,0) <> 1 then
      raise exception 'Para publicar, complete as 2 imagens destacadas, 3 de galeria, 2 do corpo e 1 vídeo';
    end if;
  end if;
  return NEW;
end;
$$;
do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_product_publication' and tgrelid = 'public.products'::regclass) then
    create trigger trg_product_publication before update of status on public.products
      for each row execute function public.validate_product_publication();
  end if;
end $$;

commit;
select 'Atualização de produtos e IA aplicada com sucesso.' as resultado;
