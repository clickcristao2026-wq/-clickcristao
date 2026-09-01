-- Click Cristão — cria 1 conta de teste para cada tipo de usuário.
--
-- PRÉ-REQUISITO: rode (ou re-rode) o supabase/schema.sql atualizado antes
-- deste script — ele corrige um bug na trigger que bloqueava até promoções
-- de role feitas direto pelo SQL Editor.
--
-- Todas as contas abaixo já nascem com e-mail confirmado (login imediato,
-- mesmo que "Confirm email" esteja ligado) e senha "Click@2026!".
-- É seguro rodar mais de uma vez: contas com e-mail já existente são puladas.

create extension if not exists pgcrypto;

do $$
declare
  v_password text := 'Click@2026!';
  v_encrypted text := crypt(v_password, gen_salt('bf'));
  v_users jsonb := '[
    {"email":"consumidor@clickcristao.com","nome_usuario":"consumidor","nome_completo":"Consumidor Teste","role":"consumidor"},
    {"email":"vendedor@clickcristao.com","nome_usuario":"vendedor","nome_completo":"Vendedor Teste","role":"vendedor"},
    {"email":"anunciante@clickcristao.com","nome_usuario":"anunciante","nome_completo":"Anunciante Teste","role":"anunciante"},
    {"email":"afiliado@clickcristao.com","nome_usuario":"afiliado","nome_completo":"Afiliado Teste","role":"afiliado"},
    {"email":"admin@clickcristao.com","nome_usuario":"admin","nome_completo":"Administrador Teste","role":"admin"}
  ]'::jsonb;
  v_item jsonb;
  v_user_id uuid;
begin
  for v_item in select * from jsonb_array_elements(v_users)
  loop
    if exists (select 1 from auth.users where email = v_item->>'email') then
      raise notice 'Já existe, pulando: %', v_item->>'email';
      continue;
    end if;

    v_user_id := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated',
      v_item->>'email', v_encrypted,
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'nome_completo', v_item->>'nome_completo',
        'nome_usuario', v_item->>'nome_usuario',
        -- o trigger handle_new_user só aceita os 4 papéis "de fora" por aqui;
        -- "admin" é promovido manualmente logo abaixo.
        'role', v_item->>'role',
        'tipo_conta', 'conta_unica'
      ),
      now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_item->>'email'),
      'email', v_user_id::text,
      now(), now(), now()
    );
  end loop;
end $$;

-- Promove a conta de teste "admin" (o trigger de cadastro nunca concede esse
-- papel sozinho — precisa desta atualização explícita).
update public.profiles set role = 'admin' where email = 'admin@clickcristao.com';

-- Conferir o resultado:
select email, nome_usuario, role, tipo_conta from public.profiles order by role;
