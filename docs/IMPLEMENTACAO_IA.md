# Click Cristão — cadastro de produtos e OpenAI

Implementação local em 05/10/2026. Projeto identificado: `xqmvlozonwudwewjlpfe`. Site atual: https://clickcristao.vercel.app/.

## O que foi implementado

- Cadastro e edição nas etapas Informação, Preço e Imagem, com progresso azul `#0A20E7`.
- Conteúdo do anúncio, nome da loja, qualidade, seção Premium/Intermediário/Popular, avaliações autodeclaradas e links de comprovação.
- Filtros existentes mantidos; os benefícios comerciais passaram para a etapa de preço.
- Precificação normal ou promoção, cupom percentual, custo de frete, frete grátis, afiliado de 5%, faturamento e lucro líquido.
- Dois destaques, três fotos de galeria, duas imagens no corpo e um vídeo MP4/WebM. Rascunhos permitem mídias incompletas; publicar exige os oito arquivos.
- Menu administrativo renomeado para “Categorias”, mantendo o gerenciamento de atributos.
- Área “Inteligência Artificial” em todas as contas de usuários, com cadastro, validação, substituição e remoção da chave OpenAI.
- Agentes de mercado, lucro, conteúdo, comparação, suporte e investigação, todos usando `gpt-6-luna`.
- Histórico por usuário e por produto, incluindo análises feitas antes do primeiro salvamento.

## Cálculos adotados

Os cálculos usam arredondamento por valor monetário para duas casas decimais.

```text
Taxa da plataforma = (custo + margem desejada em R$) × 3%
Preço sugerido = custo + margem − taxa da plataforma
Economia da promoção = preço original − preço promocional
Cupom = preço ativo × percentual de desconto / 100
Afiliado = preço ativo × 5%, quando ativado
Faturamento líquido = preço ativo − cupom − custo de frete − afiliado
Lucro líquido = faturamento líquido − custo do produto
```

Exemplo: custo de R$ 84,00 e margem de R$ 33,70 resultam em taxa de R$ 3,53 e preço sugerido de R$ 114,17. O exemplo do briefing cita R$ 114,16, mas a fórmula descrita resulta em R$ 114,17. Também R$ 114,16 × 5% resulta em R$ 5,71, após arredondamento. O campo de cupom é percentual: 10% de R$ 114,16 equivale a R$ 11,42, e não R$ 10,00.

A taxa de 3% segue a fórmula solicitada e não é descontada novamente do resumo. Isso é uma simulação de anúncio; não substitui regras de liquidação financeira. O frete informado representa o custo suportado pelo vendedor, inclusive quando ele oferece frete grátis ao comprador.

## Arquitetura e dados

O navegador usa Supabase Auth para autenticar chamadas às Edge Functions. As funções validam a sessão com `auth.getUser()`; `verify_jwt = false` no gateway não remove essa validação. O modelo é fixado no servidor, sem substituição silenciosa.

`ai-settings` valida acesso ao modelo com `GET /v1/models/gpt-6-luna`. Guarda a chave cifrada em AES-256-GCM com IV aleatório e associação ao ID do proprietário. Nenhuma chave é salva em `localStorage`, em variáveis `VITE_*` ou no histórico. O navegador recebe apenas o estado e os quatro últimos caracteres. A chave só fica no estado do campo enquanto está sendo digitada.

`ai-agent` chama a Responses API com `store: false` e saída JSON validada. A análise de mercado exige a ferramenta `web_search` e salva fontes retornadas pela API. Conteúdo inspeciona as imagens, reduzidas antes do envio; o vídeo é considerado somente pelos metadados porque GPT-6 Luna não recebe vídeo diretamente. Nenhum agente publica ou altera automaticamente o produto. Recomendações de preço só são aplicadas quando o usuário escolhe “Usar este preço”.

Comparação e investigação consultam o catálogo publicado via busca textual em português. São enviadas até 20 correspondências, selecionadas entre até 50 resultados recentes. Suporte recebe orientações básicas e produtos; não acessa pedidos nem presume políticas operacionais que ainda não existem no projeto.

`ai_credentials` e `ai_request_limits` são acessíveis somente pelo servidor. `ai_runs` permite leitura apenas pelo proprietário. Existe limite atômico de 6 solicitações por minuto e 100 por 24 horas por usuário, incluindo validações de chave.

Características e benefícios públicos ficam em `products.detalhes`. Custo, margem e custo de frete ficam em `product_pricing`, com acesso ao proprietário e administradores. Não são publicados no JSON do anúncio. Produto e seleções de filtros são salvos por uma transação SQL. Mídias são enviadas depois; se houver falha, o produto permanece como rascunho, com aviso. Arquivos de fotos e vídeos de anúncios têm URLs públicas.

Fotos antigas são preservadas; as duas primeiras tornam-se destaques. Produtos antigos precisam completar os novos grupos de mídias quando forem publicados novamente.

## Ativação no projeto Supabase

O acesso público do site foi usado para configurar `.env.local`, ignorado pelo Git. Esse acesso não permite instalar migrações, publicar funções nem cadastrar segredos. É necessário conectar a integração Supabase à conta do projeto ou autenticar a CLI.

**Ordem de implantação: banco, segredos, funções e frontend.** Não publique o frontend antes de atualizar o banco: o novo cadastro depende das tabelas e funções SQL abaixo.

1. No projeto existente, aplicar, nesta ordem:
   Como alternativa, executar inteiro o arquivo `supabase/ATUALIZACAO_PRODUTOS_IA.sql` no SQL Editor. Ele reúne as duas migrações em uma única transação e pode ser repetido sem reclassificar mídias já existentes.
   - `supabase/migrations/202610050001_product_ai.sql`
   - `supabase/migrations/202610050002_product_save.sql`
   Esses arquivos dependem dos schemas originais `schema.sql` e `schema_products.sql`, já usados pelo projeto. Em instalação nova, executar primeiro esses dois schemas originais. O controle da CLI aplica cada migração uma vez; os scripts também toleram repetição manual.
2. Gerar uma chave aleatória de 32 bytes e cadastrar como segredo **do servidor** `AI_CREDENTIAL_ENCRYPTION_KEY`. Manter uma cópia protegida; trocar ou perder esse segredo exige reconfigurar as chaves dos usuários. Para gerar: `node -e "process.stdout.write(require('node:crypto').randomBytes(32).toString('base64'))"`. Não colocar o resultado em arquivos versionados ou no chat.
3. Cadastrar `APP_ALLOWED_ORIGINS` com `https://clickcristao.vercel.app,http://localhost:8080,http://127.0.0.1:8080`. Acrescentar outros domínios apenas se realmente usados. `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` são fornecidos pelo ambiente hospedado do Supabase.
4. Publicar `ai-settings` e `ai-agent`, incluindo seus arquivos `_shared` e a configuração de gateway do `supabase/config.toml`.
5. Publicar o frontend na Vercel com `VITE_SUPABASE_URL` e a chave pública `VITE_SUPABASE_ANON_KEY` do projeto.
6. Entrar como vendedor, ir a “Inteligência Artificial” e cadastrar uma chave real de um projeto OpenAI com acesso ao modelo e saldo disponível. Verificar uma análise de mercado, uma de lucro e uma de conteúdo. Cada chamada usa o saldo da conta OpenAI desse usuário.

A migração, as funções e o frontend estão prontos para implantação. O acesso administrativo ao projeto ainda não estava disponível durante a implementação local. Não foi executada nenhuma consulta paga à OpenAI.

## Verificação

```sh
npm run test
npm run typecheck
npm run lint
npm run build
npx deno check supabase/functions/ai-settings/index.ts supabase/functions/ai-agent/index.ts
```

Testes cobrem cálculos, edição e preservação dos campos, salvamento, quotas e tipos de mídia, cifragem, autenticação das funções, isolamento entre usuários, fontes da pesquisa, falhas de provedor, migrações SQL, reversão de uma transação com filtro inválido e privacidade dos custos. Os testes de banco executam PostgreSQL local com PGlite e simulam os schemas de autenticação e armazenamento do Supabase. Chamadas ao provedor usam respostas simuladas nos testes.

As três etapas foram verificadas no navegador com a conta de teste do projeto. Nenhum produto de teste foi salvo no banco remoto. Captura da etapa de preço: `qa/etapa-preco.png`.

Documentação oficial consultada: [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna), [Responses API](https://developers.openai.com/api/reference/responses/overview), [Web search](https://developers.openai.com/api/docs/guides/tools-web-search), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses).
