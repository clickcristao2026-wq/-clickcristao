-- Os registros são administrados pela operação da plataforma.
create table if not exists public.consumer_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  requirements text not null,
  instructions text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  enabled boolean not null default false,
  all_consumers boolean not null default false,
  check (ends_at is null or ends_at > starts_at)
);

create table if not exists public.consumer_program_eligibility (
  program_id uuid not null references public.consumer_programs(id) on delete cascade,
  consumer_id uuid not null references public.profiles(id) on delete cascade,
  primary key (program_id, consumer_id)
);

create table if not exists public.affiliate_offers (
  product_id uuid primary key references public.products(id) on delete cascade,
  commission_percent numeric(5,2) not null check (commission_percent between 0 and 100),
  terms text not null,
  available boolean not null default false,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  check (ends_at is null or ends_at > starts_at)
);

alter table public.consumer_programs enable row level security;
alter table public.consumer_program_eligibility enable row level security;
alter table public.affiliate_offers enable row level security;
revoke all on public.consumer_programs, public.consumer_program_eligibility, public.affiliate_offers from public, anon, authenticated;
grant select, insert, update, delete on public.consumer_programs, public.consumer_program_eligibility, public.affiliate_offers to service_role;

create or replace function public.list_eligible_consumer_programs(search_term text default '')
returns table (id uuid, name text, requirements text, instructions text, ends_at timestamptz)
language sql stable security definer set search_path = ''
as $$
  select p.id, p.name, p.requirements, p.instructions, p.ends_at
  from public.consumer_programs p
  where exists (
    select 1 from public.profiles u where u.id = auth.uid() and u.role = 'consumidor'
  )
  and p.enabled and p.starts_at <= now() and (p.ends_at is null or p.ends_at > now())
  and (p.all_consumers or exists (
    select 1 from public.consumer_program_eligibility e
    where e.program_id = p.id and e.consumer_id = auth.uid()
  ))
  and strpos(lower(p.name), lower(left(trim(coalesce(search_term, '')), 120))) > 0
  order by p.ends_at nulls last, p.id
  limit 50;
$$;

create or replace function public.list_available_affiliate_offers(search_term text default '')
returns table (id uuid, name text, price numeric, commission_percent numeric, estimated_commission numeric, terms text)
language sql stable security definer set search_path = ''
as $$
  select p.id, p.nome, p.preco, o.commission_percent, round(p.preco * o.commission_percent / 100, 2), o.terms
  from public.affiliate_offers o
  join public.products p on p.id = o.product_id
  where exists (
    select 1 from public.profiles u where u.id = auth.uid() and u.role = 'afiliado'
  )
  and p.status = 'publicado' and p.preco > 0 and o.available
  and o.starts_at <= now() and (o.ends_at is null or o.ends_at > now())
  and strpos(lower(concat_ws(' ', p.nome, p.modelo)), lower(left(trim(coalesce(search_term, '')), 120))) > 0
  order by p.nome, p.id
  limit 50;
$$;

revoke all on function public.list_eligible_consumer_programs(text) from public, anon;
revoke all on function public.list_available_affiliate_offers(text) from public, anon;
grant execute on function public.list_eligible_consumer_programs(text) to authenticated;
grant execute on function public.list_available_affiliate_offers(text) to authenticated;
