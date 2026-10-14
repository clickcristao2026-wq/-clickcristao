-- Click Cristão — atualização de atributos por classificação e galeria.
begin;
alter table public.product_categories add column if not exists attributes_configured boolean not null default false;
alter table public.product_attributes add column if not exists category_id uuid references public.product_categories(id) on delete cascade;
alter table public.product_attribute_values add column if not exists descricao text not null default '';
alter table public.product_attributes drop constraint if exists product_attributes_nome_key;
alter table public.product_attributes drop constraint if exists product_attributes_slug_key;
create unique index if not exists attribute_scope_slug_idx on public.product_attributes(coalesce(category_id,'00000000-0000-0000-0000-000000000000'::uuid),slug);
create unique index if not exists attribute_scope_name_idx on public.product_attributes(coalesce(category_id,'00000000-0000-0000-0000-000000000000'::uuid),nome);

update public.product_attribute_values v set descricao = case v.valor
  when 'Premium' then 'Produto de luxo, com excelente qualidade e durabilidade, marca de credibilidade e acabamento refinado. O preço deve representar a qualidade e o valor do produto.'
  when 'Intermediário' then 'Bom produto, que atende aos padrões e às necessidades dos consumidores. Possui qualidade confiável, segurança, bom acabamento e valor compatível para comercialização.'
  when 'Popular' then 'Produto acessível para consumidores com menor exigência de qualidade e durabilidade. Considere o acabamento, a estética de fabricação e a durabilidade limitada.'
  else v.descricao end
from public.product_attributes a where v.attribute_id=a.id and a.slug='secao' and v.descricao='';

create or replace function public.customize_category_attributes(p_category_id uuid)
returns void language plpgsql security definer set search_path=public as $$
declare configured boolean; source_id uuid; template record; clone_id uuid;
begin
  if auth.uid() is null or not public.is_admin(auth.uid()) then raise exception 'Somente administrador pode configurar os atributos'; end if;
  select attributes_configured into configured from public.product_categories where id=p_category_id for update;
  if not found then raise exception 'Classificação não encontrada'; end if;
  if configured then return; end if;
  with recursive ancestors as (
    select id,parent_id,attributes_configured,0 as distance from public.product_categories where id=p_category_id
    union all select c.id,c.parent_id,c.attributes_configured,a.distance+1 from public.product_categories c join ancestors a on c.id=a.parent_id
  ) select id into source_id from ancestors where attributes_configured order by distance limit 1;
  for template in select * from public.product_attributes where category_id is not distinct from source_id and slug<>'marca' order by ordem,id loop
    insert into public.product_attributes(nome,slug,selecao,ordem,ativo,category_id)
      values(template.nome,template.slug,template.selecao,template.ordem,template.ativo,p_category_id) returning id into clone_id;
    insert into public.product_attribute_values(attribute_id,valor,ordem,ativo,descricao)
      select clone_id,valor,ordem,ativo,descricao from public.product_attribute_values where attribute_id=template.id;
  end loop;
  update public.product_categories set attributes_configured=true where id=p_category_id;
end $$;
revoke all on function public.customize_category_attributes(uuid) from public,anon;
grant execute on function public.customize_category_attributes(uuid) to authenticated;

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

create or replace function public.validate_product_publication()
returns trigger language plpgsql set search_path=public as $$
declare counts jsonb;
begin
  if NEW.status='publicado' and OLD.status<>'publicado' then
    select jsonb_object_agg(papel,n) into counts from (select papel,count(*) n from public.product_images where product_id=NEW.id group by papel) grouped;
    if coalesce((counts->>'destaque')::int,0)<>2 or coalesce((counts->>'galeria')::int,0) not between 1 and 10
      or coalesce((counts->>'corpo')::int,0)<>2 or coalesce((counts->>'video')::int,0)<>1 then
      raise exception 'Para publicar, complete 2 imagens destacadas, 1 a 10 de galeria, 2 do corpo e 1 vídeo';
    end if;
  end if;
  return NEW;
end $$;
notify pgrst, 'reload schema';
commit;
