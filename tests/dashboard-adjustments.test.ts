// @vitest-environment node
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";
import { calcularReceita, dadosMensaisGerenciamento } from "@/data/gerenciamentoDadosMensais";
import { categoriasVariaveis, transacaoParceiro } from "@/data/dashboardTransactions";

it("contabiliza a taxa do Parceiro exatamente uma vez", () => {
  const janeiro = dadosMensaisGerenciamento.janeiro;
  expect(categoriasVariaveis.map(({ id }) => id)).toEqual(["outlet", "digital", "produto", "feira"]);
  expect(janeiro.vendaVariavel).toBe(755000);
  expect(janeiro.vendaFixa).toBe(2420000);
  expect(janeiro.parceiro).toBe(transacaoParceiro.taxaPlataforma);
  expect(janeiro.inbox).toBe(1675000);
  expect(calcularReceita(janeiro)).toBe(6418440);
  expect(calcularReceita(janeiro) - janeiro.custos).toBe(3648440);
});

it("restringe programas e ofertas vigentes aos perfis autorizados", async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon;
      create role authenticated;
      create role service_role bypassrls;
      create schema auth;
      create function auth.uid() returns uuid language sql as $$
        select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
      $$;
      create table public.profiles(id uuid primary key, role text);
      create table public.products(id uuid primary key, nome text, modelo text, preco numeric, status text);
      insert into public.profiles values
        ('00000000-0000-0000-0000-000000000001', 'consumidor'),
        ('00000000-0000-0000-0000-000000000002', 'consumidor'),
        ('00000000-0000-0000-0000-000000000003', 'afiliado');
    `);
    await db.exec(await readFile("supabase/migrations/202611240001_dashboard_programs.sql", "utf8"));
    await db.exec(`
      insert into public.consumer_programs(id, name, requirements, instructions, starts_at, ends_at, enabled, all_consumers)
      values
        ('10000000-0000-0000-0000-000000000001', 'Público', 'Conta ativa', 'Acesse a campanha', now() - interval '1 day', null, true, true),
        ('10000000-0000-0000-0000-000000000002', 'Por convite', 'Convite', 'Aceite o convite', now() - interval '1 day', null, true, false),
        ('10000000-0000-0000-0000-000000000003', 'Futuro', 'Conta ativa', 'Aguarde', now() + interval '1 day', null, true, true),
        ('10000000-0000-0000-0000-000000000004', 'Encerrado', 'Conta ativa', 'Aguarde', now() - interval '2 days', now() - interval '1 day', true, true),
        ('10000000-0000-0000-0000-000000000005', 'Rascunho', 'Conta ativa', 'Aguarde', now(), null, false, true);
      insert into public.consumer_program_eligibility values
        ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001');
      insert into public.products values
        ('20000000-0000-0000-0000-000000000001', 'Livro', 'Edição 1', 79.90, 'publicado'),
        ('20000000-0000-0000-0000-000000000002', 'Caderno', null, 50, 'publicado'),
        ('20000000-0000-0000-0000-000000000003', 'Pausado', null, 50, 'pausado'),
        ('20000000-0000-0000-0000-000000000004', 'Indisponível', null, 50, 'publicado');
      insert into public.affiliate_offers(product_id, commission_percent, terms, available) values
        ('20000000-0000-0000-0000-000000000001', 12.5, 'Por venda aprovada', true),
        ('20000000-0000-0000-0000-000000000003', 10, 'Por venda aprovada', true),
        ('20000000-0000-0000-0000-000000000004', 10, 'Por venda aprovada', false);
      set role authenticated;
    `);
    async function signIn(id: number) {
      await db.query("select set_config('request.jwt.claim.sub', $1, false)", [`00000000-0000-0000-0000-00000000000${id}`]);
    }
    await signIn(1);
    expect((await db.query("select name from list_eligible_consumer_programs()")).rows)
      .toEqual([{ name: "Público" }, { name: "Por convite" }]);
    expect((await db.query("select * from list_available_affiliate_offers()")).rows).toEqual([]);
    await expect(db.query("select * from consumer_program_eligibility")).rejects.toThrow(/permission denied/);

    await signIn(2);
    expect((await db.query("select name from list_eligible_consumer_programs()")).rows)
      .toEqual([{ name: "Público" }]);
    expect((await db.query("select * from list_eligible_consumer_programs('convite')")).rows).toEqual([]);

    await signIn(3);
    expect((await db.query("select * from list_eligible_consumer_programs()")).rows).toEqual([]);
    expect((await db.query("select name, estimated_commission from list_available_affiliate_offers('edição')")).rows)
      .toEqual([{ name: "Livro", estimated_commission: "9.99" }]);
    expect((await db.query("select name from list_available_affiliate_offers()")).rows).toEqual([{ name: "Livro" }]);
    await db.exec("reset role; set role anon;");
    await expect(db.query("select * from list_available_affiliate_offers()")).rejects.toThrow(/permission denied/);
  } finally {
    await db.close();
  }
}, 15000);
