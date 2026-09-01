-- Click Cristão — cadastro de produtos (categorias, atributos, produtos)
-- Rode DEPOIS do supabase/schema.sql (precisa de public.profiles e
-- public.is_admin()). Seguro rodar mais de uma vez (idempotente).

create extension if not exists pgcrypto;

-- =========================================================================
-- 1) Árvore de categorias: Tipo → Categoria → Subcategoria → Filtro
-- =========================================================================
-- Uma única tabela recursiva (em vez de 4 tabelas fixas) para o admin poder
-- cadastrar qualquer nível da hierarquia pela mesma tela.
create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.product_categories(id) on delete cascade,
  nivel int not null check (nivel between 0 and 3), -- 0=Tipo,1=Categoria,2=Subcategoria,3=Filtro
  nome text not null,
  slug text not null,
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists product_categories_parent_slug_unique_idx
  on public.product_categories (coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), slug);

alter table public.product_categories enable row level security;

drop policy if exists "categories_select_public" on public.product_categories;
create policy "categories_select_public" on public.product_categories
  for select using (ativo = true or public.is_admin(auth.uid()));

drop policy if exists "categories_write_admin" on public.product_categories;
create policy "categories_write_admin" on public.product_categories
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================================
-- 2) Atributos (facetas) e seus valores: Cor, Tamanho, Marca, Material...
-- =========================================================================
-- "OBS: todos esses terão uma chave para virar [filtro]" — sistema genérico
-- para o admin cadastrar/editar os valores de cada faceta sem precisar de
-- migração de banco a cada cor/tamanho/marca nova.
create table if not exists public.product_attributes (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  slug text not null unique,
  selecao text not null default 'multipla' check (selecao in ('unica', 'multipla')),
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.product_attributes enable row level security;

drop policy if exists "attributes_select_public" on public.product_attributes;
create policy "attributes_select_public" on public.product_attributes
  for select using (ativo = true or public.is_admin(auth.uid()));

drop policy if exists "attributes_write_admin" on public.product_attributes;
create policy "attributes_write_admin" on public.product_attributes
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create table if not exists public.product_attribute_values (
  id uuid primary key default gen_random_uuid(),
  attribute_id uuid not null references public.product_attributes(id) on delete cascade,
  valor text not null,
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  unique (attribute_id, valor)
);

alter table public.product_attribute_values enable row level security;

drop policy if exists "attribute_values_select_public" on public.product_attribute_values;
create policy "attribute_values_select_public" on public.product_attribute_values
  for select using (ativo = true or public.is_admin(auth.uid()));

drop policy if exists "attribute_values_write_admin" on public.product_attribute_values;
create policy "attribute_values_write_admin" on public.product_attribute_values
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- =========================================================================
-- 3) Produtos
-- =========================================================================
-- "Marca" e "Seção" (linha do produto) também são facetas do sistema de
-- atributos acima (product_attribute_selections), não colunas fixas aqui —
-- assim o admin consegue editar essas listas sem alteração de schema.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  categoria_id uuid references public.product_categories(id),

  -- Publicação
  nome text not null,
  modelo text,
  preco numeric(10, 2) not null,
  preco_parcelado_texto text,

  -- Características
  descricao text,
  ficha_tecnica text,
  beneficios_texto text,
  curiosidade text,
  modo_uso_cuidados text,
  garantia_satisfacao text,

  -- Gestão de estoque
  sku text,

  status text not null default 'publicado'
    check (status in ('rascunho', 'publicado', 'pausado', 'removido')),
  vendas_count integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_seller_id_idx on public.products (seller_id);
create index if not exists products_categoria_id_idx on public.products (categoria_id);
create index if not exists products_status_idx on public.products (status);

alter table public.products enable row level security;

drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products
  for select using (
    status = 'publicado' or seller_id = auth.uid() or public.is_admin(auth.uid())
  );

-- Só vendedor, anunciante ou admin conseguem publicar produtos (consumidor e
-- afiliado não têm essa opção no menu, e a policy garante isso no banco também).
drop policy if exists "products_insert_seller" on public.products;
create policy "products_insert_seller" on public.products
  for insert
  with check (
    seller_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('vendedor', 'anunciante', 'admin')
    )
  );

drop policy if exists "products_update_own_or_admin" on public.products;
create policy "products_update_own_or_admin" on public.products
  for update
  using (seller_id = auth.uid() or public.is_admin(auth.uid()))
  with check (seller_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "products_delete_own_or_admin" on public.products;
create policy "products_delete_own_or_admin" on public.products
  for delete using (seller_id = auth.uid() or public.is_admin(auth.uid()));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  NEW.updated_at := now();
  return NEW;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 4) Seleção de atributos por produto (Cor, Tamanho, Marca, Material...)
-- =========================================================================
create table if not exists public.product_attribute_selections (
  product_id uuid not null references public.products(id) on delete cascade,
  attribute_value_id uuid not null references public.product_attribute_values(id) on delete cascade,
  primary key (product_id, attribute_value_id)
);

alter table public.product_attribute_selections enable row level security;

drop policy if exists "pas_select" on public.product_attribute_selections;
create policy "pas_select" on public.product_attribute_selections
  for select using (
    exists (
      select 1 from public.products pr
      where pr.id = product_id
        and (pr.status = 'publicado' or pr.seller_id = auth.uid() or public.is_admin(auth.uid()))
    )
  );

drop policy if exists "pas_write" on public.product_attribute_selections;
create policy "pas_write" on public.product_attribute_selections
  for all
  using (
    exists (
      select 1 from public.products pr
      where pr.id = product_id
        and (pr.seller_id = auth.uid() or public.is_admin(auth.uid()))
    )
  )
  with check (
    exists (
      select 1 from public.products pr
      where pr.id = product_id
        and (pr.seller_id = auth.uid() or public.is_admin(auth.uid()))
    )
  );

-- =========================================================================
-- 5) Imagens do produto
-- =========================================================================
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.product_images enable row level security;

drop policy if exists "product_images_select" on public.product_images;
create policy "product_images_select" on public.product_images
  for select using (
    exists (
      select 1 from public.products pr
      where pr.id = product_id
        and (pr.status = 'publicado' or pr.seller_id = auth.uid() or public.is_admin(auth.uid()))
    )
  );

drop policy if exists "product_images_write" on public.product_images;
create policy "product_images_write" on public.product_images
  for all
  using (
    exists (
      select 1 from public.products pr
      where pr.id = product_id
        and (pr.seller_id = auth.uid() or public.is_admin(auth.uid()))
    )
  )
  with check (
    exists (
      select 1 from public.products pr
      where pr.id = product_id
        and (pr.seller_id = auth.uid() or public.is_admin(auth.uid()))
    )
  );

-- =========================================================================
-- 6) Storage: bucket público para as fotos dos produtos
-- =========================================================================
-- Caminho esperado dos arquivos: {seller_id}/{product_id}/{arquivo}
-- (é assim que a policy de exclusão abaixo identifica o dono do arquivo).
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product_images_authenticated_write" on storage.objects;
create policy "product_images_authenticated_write" on storage.objects
  for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "product_images_owner_delete" on storage.objects;
create policy "product_images_owner_delete" on storage.objects
  for delete
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- =========================================================================
-- 7) Seed: taxonomia e atributos de exemplo (baseado no rascunho enviado)
-- =========================================================================
do $$
declare
  v_tipo_produto uuid;
  v_cat_moda_feminina uuid;
  v_sub_blusa uuid;

  v_attr_secao uuid;
  v_attr_cor uuid;
  v_attr_tamanho uuid;
  v_attr_marca uuid;
  v_attr_material uuid;
  v_attr_modelagem uuid;
  v_attr_beneficios uuid;
  v_attr_localizacao uuid;
  v_attr_internacional uuid;

  v_valor text;
  v_ordem int;
begin
  -- ---- Árvore de categorias: Produto → Moda Feminina → Blusa → filtros ----
  insert into public.product_categories (parent_id, nivel, nome, slug, ordem)
  values (null, 0, 'Produto', 'produto', 0)
  on conflict (coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), slug) do nothing;
  select id into v_tipo_produto from public.product_categories where parent_id is null and slug = 'produto';

  insert into public.product_categories (parent_id, nivel, nome, slug, ordem)
  values (v_tipo_produto, 1, 'Moda Feminina', 'moda-feminina', 0)
  on conflict (coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), slug) do nothing;
  select id into v_cat_moda_feminina from public.product_categories
    where parent_id = v_tipo_produto and slug = 'moda-feminina';

  insert into public.product_categories (parent_id, nivel, nome, slug, ordem)
  values (v_cat_moda_feminina, 2, 'Blusa', 'blusa', 0)
  on conflict (coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), slug) do nothing;
  select id into v_sub_blusa from public.product_categories
    where parent_id = v_cat_moda_feminina and slug = 'blusa';

  v_ordem := 0;
  foreach v_valor in array array['Camiseta', 'Regata', 'Bata', 'Cropped']
  loop
    insert into public.product_categories (parent_id, nivel, nome, slug, ordem)
    values (v_sub_blusa, 3, v_valor, lower(v_valor), v_ordem)
    on conflict (coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), slug) do nothing;
    v_ordem := v_ordem + 1;
  end loop;

  -- ---- Atributos (facetas) ----
  insert into public.product_attributes (nome, slug, selecao, ordem) values
    ('Seção', 'secao', 'unica', 0),
    ('Cor', 'cor', 'multipla', 1),
    ('Tamanho', 'tamanho', 'multipla', 2),
    ('Marca', 'marca', 'unica', 3),
    ('Material', 'material', 'multipla', 4),
    ('Modelagem', 'modelagem', 'multipla', 5),
    ('Benefícios', 'beneficios', 'multipla', 6),
    ('Localização', 'localizacao', 'unica', 7),
    ('Internacional', 'internacional', 'multipla', 8)
  on conflict (slug) do nothing;

  select id into v_attr_secao from public.product_attributes where slug = 'secao';
  select id into v_attr_cor from public.product_attributes where slug = 'cor';
  select id into v_attr_tamanho from public.product_attributes where slug = 'tamanho';
  select id into v_attr_marca from public.product_attributes where slug = 'marca';
  select id into v_attr_material from public.product_attributes where slug = 'material';
  select id into v_attr_modelagem from public.product_attributes where slug = 'modelagem';
  select id into v_attr_beneficios from public.product_attributes where slug = 'beneficios';
  select id into v_attr_localizacao from public.product_attributes where slug = 'localizacao';
  select id into v_attr_internacional from public.product_attributes where slug = 'internacional';

  -- Seção
  v_ordem := 0;
  foreach v_valor in array array['Premium', 'Intermediário', 'Popular']
  loop
    insert into public.product_attribute_values (attribute_id, valor, ordem)
    values (v_attr_secao, v_valor, v_ordem) on conflict (attribute_id, valor) do nothing;
    v_ordem := v_ordem + 1;
  end loop;

  -- Cor
  v_ordem := 0;
  foreach v_valor in array array['Azul', 'Preto', 'Branco']
  loop
    insert into public.product_attribute_values (attribute_id, valor, ordem)
    values (v_attr_cor, v_valor, v_ordem) on conflict (attribute_id, valor) do nothing;
    v_ordem := v_ordem + 1;
  end loop;

  -- Tamanho
  v_ordem := 0;
  foreach v_valor in array array['P', 'M', 'G', 'XG', 'GG', 'XGG', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8']
  loop
    insert into public.product_attribute_values (attribute_id, valor, ordem)
    values (v_attr_tamanho, v_valor, v_ordem) on conflict (attribute_id, valor) do nothing;
    v_ordem := v_ordem + 1;
  end loop;

  -- Marca
  v_ordem := 0;
  foreach v_valor in array array['Polo', 'Lacoste', 'Tommy Hilfiger']
  loop
    insert into public.product_attribute_values (attribute_id, valor, ordem)
    values (v_attr_marca, v_valor, v_ordem) on conflict (attribute_id, valor) do nothing;
    v_ordem := v_ordem + 1;
  end loop;

  -- Material
  v_ordem := 0;
  foreach v_valor in array array[
    'Algodão', 'Algodão pima', 'Canelado', 'Elastano', 'Malha', 'Microfibra',
    'Náilon', 'Piquet', 'Poliamida', 'Poliéster', 'Ripstop', 'Viscolycra', 'Viscose'
  ]
  loop
    insert into public.product_attribute_values (attribute_id, valor, ordem)
    values (v_attr_material, v_valor, v_ordem) on conflict (attribute_id, valor) do nothing;
    v_ordem := v_ordem + 1;
  end loop;

  -- Modelagem
  v_ordem := 0;
  foreach v_valor in array array['Slim', 'Normal', 'Manga Longa']
  loop
    insert into public.product_attribute_values (attribute_id, valor, ordem)
    values (v_attr_modelagem, v_valor, v_ordem) on conflict (attribute_id, valor) do nothing;
    v_ordem := v_ordem + 1;
  end loop;

  -- Benefícios
  v_ordem := 0;
  foreach v_valor in array array['Cupom', 'Promoção', 'Cashback', 'Frete Grátis', 'Produto Afiliado']
  loop
    insert into public.product_attribute_values (attribute_id, valor, ordem)
    values (v_attr_beneficios, v_valor, v_ordem) on conflict (attribute_id, valor) do nothing;
    v_ordem := v_ordem + 1;
  end loop;

  -- Localização (estados brasileiros)
  v_ordem := 0;
  foreach v_valor in array array[
    'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará', 'Distrito Federal',
    'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso', 'Mato Grosso do Sul',
    'Minas Gerais', 'Pará', 'Paraíba', 'Paraná', 'Pernambuco', 'Piauí',
    'Rio de Janeiro', 'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
    'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
  ]
  loop
    insert into public.product_attribute_values (attribute_id, valor, ordem)
    values (v_attr_localizacao, v_valor, v_ordem) on conflict (attribute_id, valor) do nothing;
    v_ordem := v_ordem + 1;
  end loop;

  -- Internacional (lista inicial — admin pode adicionar mais depois)
  v_ordem := 0;
  foreach v_valor in array array[
    'Brasil', 'Estados Unidos', 'Portugal', 'Angola', 'Moçambique', 'Argentina', 'Paraguai'
  ]
  loop
    insert into public.product_attribute_values (attribute_id, valor, ordem)
    values (v_attr_internacional, v_valor, v_ordem) on conflict (attribute_id, valor) do nothing;
    v_ordem := v_ordem + 1;
  end loop;
end $$;

-- "Avaliações" (quantidade de estrelas) não entrou como atributo cadastrável:
-- isso depende de um sistema de avaliações reais de clientes, que ainda não
-- existe no banco. Fica para uma próxima etapa.
