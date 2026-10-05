# Ativação manual no Supabase — Click Cristão

Projeto correto: **xqmvlozonwudwewjlpfe**. Abra https://supabase.com/dashboard/project/xqmvlozonwudwewjlpfe e confira esse identificador na URL antes de salvar.

O SQL já foi aplicado e o frontend já foi publicado. Agora faltam os segredos e as duas Edge Functions. Os arquivos desta pasta estão completos: os módulos compartilhados foram incorporados, permitindo copiar apenas um arquivo por função para o editor do painel. As funções recusam operar se forem publicadas em outro projeto.

## 1. Segredos do servidor

No projeto, abra **Edge Functions → Secrets**. Cadastre os dois nomes abaixo e salve:

| Nome | Valor |
| --- | --- |
| `APP_ALLOWED_ORIGINS` | `https://clickcristao.vercel.app` |
| `AI_CREDENTIAL_ENCRYPTION_KEY` | Chave aleatória de 32 bytes em Base64, conforme a consulta abaixo |

Para gerar a chave de proteção dentro do próprio Supabase, execute esta consulta no SQL Editor:

```sql
select encode(gen_random_bytes(32), 'base64') as chave_de_protecao;
```

Copie o valor retornado para o segredo `AI_CREDENTIAL_ENCRYPTION_KEY` e guarde uma cópia protegida. Essa é a chave que cifra os tokens dos usuários; a chave da API OpenAI será cadastrada na plataforma. Se esse segredo já existir, mantenha o valor atual. Gerar outra chave depois de salvar tokens tornaria os tokens antigos ilegíveis. Não publique o valor no GitHub nem envie pelo chat.

Se a consulta informar que `gen_random_bytes` não existe, verifique o esquema da extensão:

```sql
select n.nspname as esquema
from pg_extension e
join pg_namespace n on n.oid = e.extnamespace
where e.extname = 'pgcrypto';
```

Quando o resultado for `extensions`, use `select encode(extensions.gen_random_bytes(32), 'base64') as chave_de_protecao;`. A instalação original do projeto inclui `pgcrypto`.

Para usar a versão local do site, acrescente `http://localhost:8080,http://127.0.0.1:8080` à lista de `APP_ALLOWED_ORIGINS`, separados por vírgula.

## 2. Função ai-settings

1. Abra **Edge Functions → Deploy a new function → Via Editor**.
2. Dê à função o nome exato **ai-settings**.
3. No arquivo **index.ts** do editor, substitua o exemplo por TODO o conteúdo do arquivo **ai-settings.ts** desta pasta.
4. Clique em **Deploy function**.
5. Nas configurações da função, deixe **Verify JWT** (ou **Verify JWT with legacy secret**) desativado e salve. A função valida a sessão do usuário no próprio código com `auth.getUser()`, antes de acessar o banco. Essa configuração é aplicada somente a essa função.

## 3. Função ai-agent

Repita os mesmos passos com o nome exato **ai-agent**, copiando TODO o conteúdo de **ai-agent.ts** para o **index.ts** correspondente. Configure **Verify JWT** como desativado nessa função também.

## 4. Verificação

Depois do deploy, as duas funções devem aparecer na lista de Edge Functions. Entre na plataforma como vendedor, abra **Inteligência Artificial**, cadastre uma chave OpenAI válida e clique em **Validar e salvar chave**. Depois teste os botões de análise do cadastro de produto.

Abrir a URL da função diretamente no navegador pode retornar erro 405, porque ela atende chamadas POST autenticadas. Não use a chave `service_role` no navegador para testar. O teste funcional deve partir da plataforma com o usuário conectado.

Os arquivos foram verificados localmente. Publicação e teste real dependem de você aplicar estes passos no projeto. Para regenerar os arquivos depois de mudar o código das funções, execute `node scripts/build-supabase-dashboard.mjs` na pasta do projeto.

Referências oficiais: [Editor de funções do Supabase](https://supabase.com/docs/guides/functions/quickstart-dashboard), [Segredos do servidor](https://supabase.com/docs/guides/functions/secrets), [Configuração de autenticação](https://supabase.com/docs/guides/functions/function-configuration).
