-- CLICK CRISTÃO — CORREÇÃO FINAL DO CATÁLOGO, 14/10/2026
-- Projeto xqmvlozonwudwewjlpfe. Execute o arquivo inteiro no SQL Editor.
-- Corrige salvamento e preservação de filtros antigos. Não remove dados.
begin;
create or replace function public.validate_product_attribute_scope()
returns trigger language plpgsql security definer set search_path=public as $$
declare leaf uuid; owner_id uuid; expected_scope uuid; actual_scope uuid; selected_attribute_id uuid; mode text;
begin
  select categoria_id,seller_id into leaf,owner_id from public.products where id=NEW.product_id;
  if auth.uid() is not null and owner_id<>auth.uid() and not public.is_admin(auth.uid()) then raise exception 'Produto não pertence à sua conta'; end if;
  with recursive ancestors as (
    select id,parent_id,attributes_configured,0 as distance from public.product_categories where id=leaf
    union all select c.id,c.parent_id,c.attributes_configured,a.distance+1 from public.product_categories c join ancestors a on c.id=a.parent_id
  ) select id into expected_scope from ancestors where attributes_configured order by distance limit 1;
  select a.category_id,a.id,a.selecao into actual_scope,selected_attribute_id,mode from public.product_attributes a
    join public.product_attribute_values v on v.attribute_id=a.id where v.id=NEW.attribute_value_id;
  if actual_scope is distinct from expected_scope then raise exception 'Atributo não pertence à classificação selecionada'; end if;
  if mode='unica' and exists(select 1 from public.product_attribute_selections s join public.product_attribute_values v on v.id=s.attribute_value_id
    where s.product_id=NEW.product_id and v.attribute_id=selected_attribute_id and s.attribute_value_id<>NEW.attribute_value_id) then
    raise exception 'Selecione apenas uma opção para este atributo';
  end if;
  return NEW;
end $$;
drop trigger if exists trg_attribute_scope on public.product_attribute_selections;
create trigger trg_attribute_scope before insert or update on public.product_attribute_selections
for each row execute function public.validate_product_attribute_scope();

create or replace function public.validate_product_category_scope()
returns trigger language plpgsql security definer set search_path=public as $$
declare expected_scope uuid; leaf uuid;
begin
  select categoria_id into leaf from public.products where id=NEW.id;
  with recursive ancestors as (
    select id,parent_id,attributes_configured,0 as distance from public.product_categories where id=leaf
    union all select c.id,c.parent_id,c.attributes_configured,a.distance+1 from public.product_categories c join ancestors a on c.id=a.parent_id
  ) select id into expected_scope from ancestors where attributes_configured order by distance limit 1;
  if exists(select 1 from public.product_attribute_selections s join public.product_attribute_values v on v.id=s.attribute_value_id
    join public.product_attributes a on a.id=v.attribute_id where s.product_id=NEW.id and a.category_id is distinct from expected_scope) then
    raise exception 'Atributos não pertencem à classificação selecionada';
  end if;
  return null;
end $$;
drop trigger if exists trg_product_category_scope on public.products;
create constraint trigger trg_product_category_scope after update on public.products
deferrable initially deferred for each row when (OLD.categoria_id is distinct from NEW.categoria_id)
execute function public.validate_product_category_scope();

-- A edição precisa recuperar as opções antigas ocultas pela RLS pública, apenas para o dono ou administrador.
create or replace function public.product_selected_attributes(p_product_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb; leaf uuid; expected_scope uuid;
begin
  if auth.uid() is null or not exists(select 1 from public.products p where p.id=p_product_id and (p.seller_id=auth.uid() or public.is_admin(auth.uid()))) then
    raise exception 'Produto não pertence à sua conta';
  end if;
  select categoria_id into leaf from public.products where id=p_product_id;
  with recursive ancestors as (
    select id,parent_id,attributes_configured,0 as distance from public.product_categories where id=leaf
    union all select c.id,c.parent_id,c.attributes_configured,a.distance+1 from public.product_categories c join ancestors a on c.id=a.parent_id
  ) select id into expected_scope from ancestors where attributes_configured order by distance limit 1;
  select coalesce(jsonb_agg(to_jsonb(selected)),'[]'::jsonb) into result from (
    select a.*, (select coalesce(jsonb_agg(to_jsonb(v) order by v.ordem,v.id),'[]'::jsonb) from public.product_attribute_values v where v.attribute_id=a.id
      and (v.ativo or exists(select 1 from public.product_attribute_selections s where s.product_id=p_product_id and s.attribute_value_id=v.id)
        or exists(select 1 from public.product_attribute_selections s join public.product_attribute_values old_value on old_value.id=s.attribute_value_id
          join public.product_attributes old_attr on old_attr.id=old_value.attribute_id where s.product_id=p_product_id and old_attr.slug=a.slug and old_value.valor=v.valor))) as product_attribute_values
    from public.product_attributes a where exists(select 1 from public.product_attribute_selections s join public.product_attribute_values v on v.id=s.attribute_value_id
      where s.product_id=p_product_id and v.attribute_id=a.id)
      or (a.category_id is not distinct from expected_scope and exists(select 1 from public.product_attribute_selections s join public.product_attribute_values old_value on old_value.id=s.attribute_value_id
        join public.product_attributes old_attr on old_attr.id=old_value.attribute_id where s.product_id=p_product_id and old_attr.slug=a.slug))
  ) selected;
  return result;
end $$;
revoke all on function public.product_selected_attributes(uuid) from public,anon;
grant execute on function public.product_selected_attributes(uuid) to authenticated;

notify pgrst, 'reload schema';
commit;
select to_regprocedure('public.product_selected_attributes(uuid)') as funcao_instalada,
  'Correção final aplicada com sucesso.' as resultado;
