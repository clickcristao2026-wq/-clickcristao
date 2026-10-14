// @vitest-environment node
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
let db: PGlite;
const admin = "11111111-1111-4111-8111-111111111111";
const seller = "22222222-2222-4222-8222-222222222222";
const cropped = "33333333-3333-4333-8333-333333333333";
const top = "44444444-4444-4444-8444-444444444444";
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create schema storage;
    create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
    create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create function auth.role() returns text language sql as $$ select current_user::text $$;
    create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text,name text);
    create function storage.foldername(name text) returns text[] language sql as $$ select string_to_array(name,'/') $$;
    grant usage on schema public,auth,storage to anon,authenticated,service_role;
    alter default privileges in schema public grant select,insert,update,delete on tables to anon,authenticated,service_role;`);
  for (const name of [
    "supabase/schema.sql",
    "supabase/schema_products.sql",
    "supabase/migrations/202610050001_product_ai.sql",
    "supabase/migrations/202610050002_product_save.sql",
    "supabase/migrations/202610140001_catalog_review.sql",
  ])
    await db.exec(
      (await readFile(name, "utf8")).replace(
        "create extension if not exists pgcrypto;",
        "",
      ),
    );
  await db.query(
    "insert into auth.users(id,email,raw_user_meta_data) values($1,'admin@test.com','{}'),($2,'seller@test.com','{\"role\":\"vendedor\"}')",
    [admin, seller],
  );
  await db.query("update profiles set role='admin' where id=$1", [admin]);
  const parents = await db.query<{ id: string }>(
    "select id from product_categories where nivel=2 limit 1",
  );
  await db.query(
    "insert into product_categories(id,parent_id,nivel,nome,slug) values($1,$3,3,'Cropped','cropped-test'),($2,$3,3,'Top','top-test')",
    [cropped, top, parents.rows[0].id],
  );
}, 30000);
afterAll(async () => {
  await db.close();
});
async function asUser(id: string) {
  await db.exec("reset role; set role authenticated;");
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [id]);
}
describe.sequential("atributos específicos por produto", () => {
  it("copia os modelos para Cropped e Top com valores independentes", async () => {
    await asUser(admin);
    await db.query("select customize_category_attributes($1)", [cropped]);
    await db.query("select customize_category_attributes($1)", [top]);
    const rows = await db.query<{ id: string; category_id: string }>(
      "select id,category_id from product_attributes where slug='cor' and category_id in ($1,$2)",
      [cropped, top],
    );
    expect(rows.rows).toHaveLength(2);
    expect(rows.rows[0].id).not.toBe(rows.rows[1].id);
    const clone = rows.rows.find((r) => r.category_id === cropped)!;
    await db.query(
      "insert into product_attribute_values(attribute_id,valor,descricao) values($1,'Rosa','Cor especial para Cropped')",
      [clone.id],
    );
    expect(
      (
        await db.query(
          "select v.id from product_attribute_values v join product_attributes a on a.id=v.attribute_id where a.category_id=$1 and v.valor='Rosa'",
          [top],
        )
      ).rows,
    ).toHaveLength(0);
  });
  it("preserva as explicações da seção e pode personalizar novamente sem duplicar", async () => {
    await asUser(admin);
    const before = (
      await db.query("select id from product_attributes where category_id=$1", [
        cropped,
      ])
    ).rows;
    await db.query("select customize_category_attributes($1)", [cropped]);
    expect(
      (
        await db.query(
          "select id from product_attributes where category_id=$1",
          [cropped],
        )
      ).rows,
    ).toEqual(before);
    const description = await db.query<{ descricao: string }>(
      "select v.descricao from product_attribute_values v join product_attributes a on a.id=v.attribute_id where a.slug='secao' and a.category_id=$1 and v.valor='Premium'",
      [cropped],
    );
    expect(description.rows[0].descricao).toContain("durabilidade");
  });
  it("impede vendedor de personalizar filtros, mas permite consultar", async () => {
    await asUser(seller);
    await expect(
      db.query("select customize_category_attributes($1)", [top]),
    ).rejects.toThrow("administrador");
    expect(
      (
        await db.query(
          "select id from product_attributes where category_id=$1",
          [top],
        )
      ).rows.length,
    ).toBeGreaterThan(0);
  });
  it("permite o mesmo nome de atributo em produtos distintos", async () => {
    await asUser(admin);
    await db.query(
      "insert into product_attributes(nome,slug,selecao,category_id) values('Detalhe','detalhe','unica',$1),('Detalhe','detalhe','unica',$2)",
      [cropped, top],
    );
    await expect(
      db.query(
        "insert into product_attributes(nome,slug,category_id) values('Detalhe','detalhe',$1)",
        [cropped],
      ),
    ).rejects.toThrow();
  });
  it("recusa salvar no Cropped um atributo exclusivo de Top", async () => {
    await asUser(seller);
    const values = await db.query<{ id: string }>(
      "select v.id from product_attribute_values v join product_attributes a on a.id=v.attribute_id where a.category_id=$1 limit 1",
      [top],
    );
    await expect(
      db.query("select save_product_record(null,$1::jsonb,$2::uuid[])", [
        JSON.stringify({
          nome: "Cropped",
          preco: 100,
          categoria_id: cropped,
          detalhes: {},
        }),
        [values.rows[0].id],
      ]),
    ).rejects.toThrow("classificação");
    expect(
      (await db.query("select id from products where nome='Cropped'")).rows,
    ).toHaveLength(0);
  });
  it("salva uma seleção válida e impede duas opções no atributo único", async () => {
    await asUser(seller);
    const section = await db.query<{ id: string }>(
      "select v.id from product_attribute_values v join product_attributes a on a.id=v.attribute_id where a.category_id=$1 and a.slug='secao' order by v.ordem",
      [cropped],
    );
    const colors = await db.query<{ id: string }>(
      "select v.id from product_attribute_values v join product_attributes a on a.id=v.attribute_id where a.category_id=$1 and a.slug='cor' limit 1",
      [cropped],
    );
    const payload = JSON.stringify({
      nome: "Cropped com filtros",
      preco: 100,
      categoria_id: cropped,
      detalhes: {},
    });
    const result = await db.query<{ id: string }>(
      "select save_product_record(null,$1::jsonb,$2::uuid[]) as id",
      [payload, [section.rows[0].id, colors.rows[0].id]],
    );
    expect(result.rows[0].id).toBeTruthy();
    await expect(
      db.query("select save_product_record($1,$2::jsonb,$3::uuid[])", [
        result.rows[0].id,
        payload,
        [section.rows[0].id, section.rows[1].id],
      ]),
    ).rejects.toThrow("apenas uma");
    expect(
      (
        await db.query(
          "select * from product_attribute_selections where product_id=$1",
          [result.rows[0].id],
        )
      ).rows,
    ).toHaveLength(2);
  });
  it("publica com dez fotos na galeria e rejeita onze", async () => {
    await asUser(seller);
    const record = await db.query<{ id: string }>(
      "select save_product_record(null,$1::jsonb,'{}'::uuid[]) as id",
      [
        JSON.stringify({
          nome: "Jaqueta",
          preco: 150,
          categoria_id: cropped,
          detalhes: { marca: "Marca do vendedor" },
        }),
      ],
    );
    const id = record.rows[0].id;
    for (const role of [
      "destaque",
      "destaque",
      ...Array(10).fill("galeria"),
      "corpo",
      "corpo",
      "video",
    ])
      await db.query(
        "insert into product_images(product_id,url,papel) values($1,'https://example.com/photo',$2)",
        [id, role],
      );
    await db.query("update products set status='publicado' where id=$1", [id]);
    await db.query("update products set status='rascunho' where id=$1", [id]);
    await db.query(
      "insert into product_images(product_id,url,papel) values($1,'https://example.com/photo','galeria')",
      [id],
    );
    await expect(
      db.query("update products set status='publicado' where id=$1", [id]),
    ).rejects.toThrow("10");
  });
  it("rejeita mudança direta de classificação com filtros incompatíveis", async () => {
    await asUser(seller);
    const product = (
      await db.query<{ id: string }>(
        "select id from products where nome='Cropped com filtros' limit 1",
      )
    ).rows[0];
    await expect(
      db.query("update products set categoria_id=$1 where id=$2", [
        top,
        product.id,
      ]),
    ).rejects.toThrow("classificação");
    const topValue = (
      await db.query<{ id: string }>(
        "select v.id from product_attribute_values v join product_attributes a on a.id=v.attribute_id where a.category_id=$1 and a.slug='cor' limit 1",
        [top],
      )
    ).rows[0];
    await db.query("select save_product_record($1,$2::jsonb,$3::uuid[])", [
      product.id,
      JSON.stringify({
        nome: "Cropped com filtros",
        preco: 100,
        categoria_id: top,
        detalhes: {},
      }),
      [topValue.id],
    ]);
    expect(
      (
        await db.query<{ categoria_id: string }>(
          "select categoria_id from products where id=$1",
          [product.id],
        )
      ).rows[0].categoria_id,
    ).toBe(top);
  });
  it("devolve ao dono os valores selecionados mesmo quando desativados", async () => {
    await asUser(seller);
    const value = (
      await db.query<{ id: string }>(
        "select v.id from product_attribute_values v join product_attributes a on a.id=v.attribute_id where a.category_id=$1 and a.slug='cor' limit 1",
        [cropped],
      )
    ).rows[0];
    const result = await db.query<{ id: string }>(
      "select save_product_record(null,$1::jsonb,$2::uuid[]) as id",
      [
        JSON.stringify({
          nome: "Produto antigo",
          preco: 100,
          categoria_id: cropped,
          detalhes: {},
        }),
        [value.id],
      ],
    );
    await asUser(admin);
    await db.query(
      "update product_attribute_values set ativo=false where id=$1",
      [value.id],
    );
    await asUser(seller);
    const attrs = await db.query<{
      result: Array<{ product_attribute_values: Array<{ id: string }> }>;
    }>("select product_selected_attributes($1) as result", [result.rows[0].id]);
    expect(
      attrs.rows[0].result
        .flatMap((a) => a.product_attribute_values)
        .some((v) => v.id === value.id),
    ).toBe(true);
    await asUser(admin);
    const other = await db.query("select product_selected_attributes($1)", [
      result.rows[0].id,
    ]);
    expect(other.rows).toHaveLength(1);
  });
  it("recupera o equivalente inativo depois de personalizar um produto legado",async()=>{
    await asUser(admin);
    const leafId="99999999-9999-4999-8999-999999999999";
    const parent=(await db.query<{parent_id:string}>("select parent_id from product_categories where id=$1",[cropped])).rows[0].parent_id;
    await db.query("insert into product_categories(id,parent_id,nivel,nome,slug) values($1,$2,3,'Legado','legado-test')",[leafId,parent]);
    const globalValue=(await db.query<{id:string}>("select v.id from product_attribute_values v join product_attributes a on a.id=v.attribute_id where a.category_id is null and a.slug='cor' and v.valor='Azul'")).rows[0].id;
    await asUser(seller);
    const product=(await db.query<{id:string}>("select save_product_record(null,$1::jsonb,$2::uuid[]) as id",[JSON.stringify({nome:"Legado Azul",preco:100,categoria_id:leafId,detalhes:{}}),[globalValue]])).rows[0].id;
    await asUser(admin);await db.query("update product_attribute_values set ativo=false where id=$1",[globalValue]);await db.query("select customize_category_attributes($1)",[leafId]);
    await asUser(seller);
    const response=(await db.query<{result:Array<{category_id:string;product_attribute_values:Array<{id:string;valor:string;ativo:boolean}>}>}>("select product_selected_attributes($1) as result",[product])).rows[0].result;
    const clonedBlue=response.find(a=>a.category_id===leafId)?.product_attribute_values.find(v=>v.valor==="Azul");
    expect(clonedBlue).toBeDefined(); expect(clonedBlue?.ativo).toBe(false);
    await db.query("select save_product_record($1,$2::jsonb,$3::uuid[])",[product,JSON.stringify({nome:"Legado Azul",preco:100,categoria_id:leafId,detalhes:{}}),[clonedBlue!.id]]);
  });
  it("permite repetir o SQL preservando os atributos e valores personalizados", async () => {
    await db.exec("reset role;");
    const before = (
      await db.query(
        "select id,category_id from product_attributes order by id",
      )
    ).rows;
    const beforeValues = (
      await db.query(
        "select id,descricao from product_attribute_values order by id",
      )
    ).rows;
    await db.exec(
      await readFile(
        "supabase/migrations/202610140001_catalog_review.sql",
        "utf8",
      ),
    );
    await db.exec(await readFile("supabase/CORRECAO_FINAL_CATALOGO_2026_10_14.sql", "utf8"));
    expect(
      (
        await db.query(
          "select id,category_id from product_attributes order by id",
        )
      ).rows,
    ).toEqual(before);
    expect(
      (
        await db.query(
          "select id,descricao from product_attribute_values order by id",
        )
      ).rows,
    ).toEqual(beforeValues);
  });
});
