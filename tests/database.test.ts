// @vitest-environment node
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
const sellerA = "11111111-1111-4111-8111-111111111111";
const sellerB = "22222222-2222-4222-8222-222222222222";
let db: PGlite;
let categoryId: string;
let productId: string;
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create function auth.role() returns text language sql as $$ select current_user::text $$;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
    create function storage.foldername(name text) returns text[] language sql as $$ select string_to_array(name,'/') $$;
    grant usage on schema public,auth,storage to anon,authenticated,service_role;
    grant execute on all functions in schema auth to anon,authenticated,service_role;
    alter default privileges in schema public grant select,insert,update,delete on tables to anon,authenticated,service_role;
  `);
  for (const file of [
    "supabase/schema.sql",
    "supabase/schema_products.sql",
    "supabase/migrations/202610050001_product_ai.sql",
    "supabase/migrations/202610050002_product_save.sql",
  ]) {
    const sql = (await readFile(file, "utf8")).replace(
      "create extension if not exists pgcrypto;",
      "",
    );
    await db.exec(sql);
  }
  await db.query(
    "insert into auth.users(id,email,raw_user_meta_data) values ($1,'a@example.com','{\"role\":\"vendedor\"}'),($2,'b@example.com','{\"role\":\"vendedor\"}')",
    [sellerA, sellerB],
  );
  const cats = await db.query<{ id: string }>(
    "select id from product_categories where nivel = 1 limit 1",
  );
  categoryId = cats.rows[0].id;
}, 30000);
afterAll(async () => {
  if (db) await db.close();
});
const session = async (userId: string, role = "authenticated") => {
  await db.exec(`reset role; set role ${role};`);
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
    userId,
  ]);
};
const payload = () => ({
  categoria_id: categoryId,
  nome: "Jaqueta",
  preco: 150,
  detalhes: {
    nomeLoja: "Loja",
    precificacao: {
      custo: 84,
      margem: 33.7,
      freteCusto: 10,
      modalidade: "normal",
      precoNormal: 150,
    },
  },
});
describe.sequential("migrações e isolamento no PostgreSQL", () => {
  it("executa o script consolidado sobre as migrações já instaladas", async () => {
    await db.exec(await readFile("supabase/ATUALIZACAO_PRODUTOS_IA.sql", "utf8"));
    expect((await db.query("select * from ai_runs")).rows).toHaveLength(0);
  });
  it("salva campos e precificação privada em uma transação", async () => {
    await session(sellerA);
    const result = await db.query<{ id: string }>(
      "select save_product_record(null,$1::jsonb,'{}'::uuid[]) as id",
      [JSON.stringify(payload())],
    );
    productId = result.rows[0].id;
    const publicRow = await db.query<{
      status: string;
      detalhes: { precificacao: object };
    }>("select status,detalhes from products where id=$1", [productId]);
    expect(publicRow.rows[0].status).toBe("rascunho");
    expect(publicRow.rows[0].detalhes.precificacao).not.toHaveProperty("custo");
    const privateRow = await db.query<{ data: { custo: number } }>(
      "select data from product_pricing where product_id=$1",
      [productId],
    );
    expect(privateRow.rows[0].data.custo).toBe(84);
  });
  it("reverte alterações do produto se um filtro não existir", async () => {
    await expect(
      db.query("select save_product_record($1,$2::jsonb,$3::uuid[])", [
        productId,
        JSON.stringify({ ...payload(), nome: "Não salvar" }),
        ["33333333-3333-4333-8333-333333333333"],
      ]),
    ).rejects.toThrow();
    const result = await db.query<{ nome: string }>(
      "select nome from products where id=$1",
      [productId],
    );
    expect(result.rows[0].nome).toBe("Jaqueta");
  });
  it("rejeita edição por outro vendedor e oculta custos e credenciais", async () => {
    await session(sellerB);
    expect(
      (
        await db.query("select * from product_pricing where product_id=$1", [
          productId,
        ])
      ).rows,
    ).toHaveLength(0);
    await expect(
      db.query("select save_product_record($1,$2::jsonb,'{}'::uuid[])", [
        productId,
        JSON.stringify(payload()),
      ]),
    ).rejects.toThrow("sem permissão");
    await expect(db.query("select * from ai_credentials")).rejects.toThrow(
      "permission denied",
    );
    await expect(
      db.query("select reserve_ai_request($1)", [sellerB]),
    ).rejects.toThrow("permission denied");
  });
  it("bloqueia publicação incompleta e publica com sete imagens e vídeo", async () => {
    await session(sellerA);
    await expect(
      db.query("update products set status='publicado' where id=$1", [
        productId,
      ]),
    ).rejects.toThrow("complete");
    const roles = [
      "destaque",
      "destaque",
      "galeria",
      "galeria",
      "galeria",
      "corpo",
      "corpo",
      "video",
    ];
    for (const role of roles)
      await db.query(
        "insert into product_images(product_id,url,papel) values($1,'https://example.com/media',$2)",
        [productId, role],
      );
    await db.query("update products set status='publicado' where id=$1", [
      productId,
    ]);
    await session(sellerB);
    expect(
      (await db.query("select id from products where id=$1", [productId])).rows,
    ).toHaveLength(1);
    expect(
      (
        await db.query("select * from product_pricing where product_id=$1", [
          productId,
        ])
      ).rows,
    ).toHaveLength(0);
  });
  it("mantém histórico privado e permite vincular só ao produto do dono", async () => {
    await session("", "service_role");
    const draft = "44444444-4444-4444-8444-444444444444";
    await db.query(
      "insert into ai_runs(user_id,draft_id,kind,report) values($1,$2,'lucro','{}')",
      [sellerA, draft],
    );
    await session(sellerB);
    expect((await db.query("select * from ai_runs")).rows).toHaveLength(0);
    await expect(
      db.query("select attach_ai_draft($1,$2)", [draft, productId]),
    ).rejects.toThrow("não pertence");
    await session(sellerA);
    await db.query("select attach_ai_draft($1,$2)", [draft, productId]);
    expect(
      (await db.query<{ product_id: string }>("select product_id from ai_runs"))
        .rows[0].product_id,
    ).toBe(productId);
  });
  it("aplica limite atômico por usuário", async () => {
    await session("", "service_role");
    for (let i = 0; i < 6; i++)
      expect(
        (
          await db.query<{ allowed: boolean }>(
            "select reserve_ai_request($1) as allowed",
            [sellerA],
          )
        ).rows[0].allowed,
      ).toBe(true);
    expect(
      (
        await db.query<{ allowed: boolean }>(
          "select reserve_ai_request($1) as allowed",
          [sellerA],
        )
      ).rows[0].allowed,
    ).toBe(false);
    expect(
      (
        await db.query<{ allowed: boolean }>(
          "select reserve_ai_request($1) as allowed",
          [sellerB],
        )
      ).rows[0].allowed,
    ).toBe(true);
  });
  it("permite repetir a instalação sem modificar fotos, custos ou histórico", async () => {
    await db.exec("reset role;");
    const beforeMedia = (await db.query("select id,papel from product_images order by id")).rows;
    const beforePricing = (await db.query("select * from product_pricing")).rows;
    const beforeHistory = (await db.query("select id,product_id from ai_runs")).rows;
    await db.exec(await readFile("supabase/ATUALIZACAO_PRODUTOS_IA.sql", "utf8"));
    expect((await db.query("select id,papel from product_images order by id")).rows).toEqual(beforeMedia);
    expect((await db.query("select * from product_pricing")).rows).toEqual(beforePricing);
    expect((await db.query("select id,product_id from ai_runs")).rows).toEqual(beforeHistory);
  });
});
