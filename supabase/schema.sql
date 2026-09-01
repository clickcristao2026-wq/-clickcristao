-- Click Cristão — schema de autenticação (Supabase)
-- Rode este arquivo inteiro no SQL Editor do seu projeto Supabase
-- (Project → SQL Editor → New query → cole tudo → Run).
-- É seguro rodar mais de uma vez (idempotente).

-- =========================================================================
-- 1) Tabela de perfis (1:1 com auth.users)
-- =========================================================================
-- O Supabase Auth (auth.users) guarda e-mail/senha. Todo o resto do usuário
-- (nome, tipo de conta, papel de acesso...) fica aqui.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  nome_completo text not null default '',
  nome_usuario text not null,
  role text not null default 'consumidor'
    check (role in ('consumidor', 'vendedor', 'anunciante', 'afiliado', 'admin')),
  tipo_conta text not null default 'conta_unica'
    check (tipo_conta in ('conta_unica', 'conta_vinculada', 'conta_compartilhada')),
  created_at timestamptz not null default now()
);

-- nome de usuário único, sem diferenciar maiúsculas/minúsculas
create unique index if not exists profiles_nome_usuario_unique_idx
  on public.profiles (lower(nome_usuario));

alter table public.profiles enable row level security;

-- =========================================================================
-- 2) Função auxiliar: "o usuário logado é admin?"
-- =========================================================================
-- SECURITY DEFINER + owner com bypassrls evita recursão infinita ao usar
-- esta função dentro das próprias policies de profiles.
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;

-- =========================================================================
-- 3) Policies de RLS
-- =========================================================================
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_select_admin_all" on public.profiles;
create policy "profiles_select_admin_all" on public.profiles
  for select
  using (public.is_admin(auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_update_admin_any" on public.profiles;
create policy "profiles_update_admin_any" on public.profiles
  for update
  using (public.is_admin(auth.uid()))
  with check (true);

-- Não existe policy de INSERT para authenticated/anon de propósito: a única
-- forma de criar uma linha em profiles é pelo trigger abaixo (que roda como
-- SECURITY DEFINER), nunca por um insert direto do cliente.

-- =========================================================================
-- 4) Trava: ninguém consegue virar admin sozinho
-- =========================================================================
-- Mesmo com a policy "profiles_update_own", esta trigger garante que só um
-- admin já autenticado consegue alterar a coluna "role" de alguém (inclusive
-- a própria). Isso fecha o buraco de um usuário comum se autopromover pelo
-- app. Quando auth.uid() é NULL (SQL rodado direto no SQL Editor/service
-- role, sem passar pela API autenticada), a alteração é permitida — esse
-- acesso já exige login no painel do Supabase, então é um contexto confiável.
create or replace function public.protect_role_column()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if NEW.role is distinct from OLD.role
     and auth.uid() is not null
     and not public.is_admin(auth.uid()) then
    NEW.role := OLD.role;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_protect_role_column on public.profiles;
create trigger trg_protect_role_column
  before update on public.profiles
  for each row execute function public.protect_role_column();

-- =========================================================================
-- 5) Criação automática do perfil ao cadastrar um usuário no Supabase Auth
-- =========================================================================
-- Os dados extras enviados em supabase.auth.signUp({ options: { data } })
-- chegam aqui em NEW.raw_user_meta_data. Por segurança, "role" só é aceito
-- se for um dos 4 tipos de usuário — "admin" nunca é concedido por este
-- caminho (só via update feito por outro admin, ver AuthContext).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := NEW.raw_user_meta_data;
  requested_role text := meta->>'role';
  safe_role text;
begin
  if requested_role in ('consumidor', 'vendedor', 'anunciante', 'afiliado') then
    safe_role := requested_role;
  else
    safe_role := 'consumidor';
  end if;

  insert into public.profiles (id, email, nome_completo, nome_usuario, role, tipo_conta)
  values (
    NEW.id,
    NEW.email,
    coalesce(meta->>'nome_completo', ''),
    coalesce(meta->>'nome_usuario', split_part(NEW.email, '@', 1)),
    safe_role,
    coalesce(meta->>'tipo_conta', 'conta_unica')
  );
  return NEW;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- 6) RPC pública: resolve e-mail a partir do nome de usuário
-- =========================================================================
-- Usada na tela de login (que aceita e-mail OU usuário) e para checar se um
-- nome de usuário já está em uso antes de tentar o cadastro. Só devolve o
-- e-mail — nenhum outro dado do perfil fica exposto por aqui.
create or replace function public.get_email_by_username(p_username text)
returns text
language sql
security definer
set search_path = public
as $$
  select email from public.profiles where lower(nome_usuario) = lower(p_username) limit 1;
$$;

grant execute on function public.get_email_by_username(text) to anon, authenticated;

-- =========================================================================
-- 7) Primeiro admin
-- =========================================================================
-- Não existe um jeito automático de criar o PRIMEIRO admin (por segurança,
-- ninguém consegue se autopromover). Depois de cadastrar sua própria conta
-- pelo app normalmente (ela nasce "consumidor"), rode o comando abaixo no
-- SQL Editor para promovê-la manualmente:
--
--   update public.profiles set role = 'admin' where email = 'seu-email@exemplo.com';
--
-- A partir daí, use essa conta para cadastrar os demais cooperadores pelo
-- próprio app (RH → Cadastro de Cooperador), que já nascem admin.
