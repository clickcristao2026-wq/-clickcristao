-- Salva produto e filtros na mesma transação, evitando perda parcial de seleções.
begin;
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
