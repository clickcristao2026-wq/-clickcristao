# Modelo dinâmico de produto

Objetivo: usar a composição aprovada para todos os anúncios cadastrados, preservando a demonstração. React/TypeScript e Supabase existentes; sem criar um documento HTML por produto.

- [x] Consultar produtos publicados sem a relação privada `product_pricing` (sem permissão para visitantes); distinguir erros de ausência.
- [x] Mapear cadastro para todos os campos existentes, condições comerciais e classificação. Buscar recomendações da mesma categoria e complementares configurados, sem incluir rascunhos ou o próprio produto.
- [x] Acrescentar seleção opcional de até três complementares no cadastro, persistida em `detalhes.paginaProduto`, sem migração de banco.
- [x] Abrir o anúncio após publicação; adicionar acesso público e prévia privada em Meus produtos. Preservar rascunhos e falhas de publicação.
- [x] Adaptar galeria para a quantidade real de mídias, navegação entre anúncios e estados vazios. Manter demonstração em `/produto` e `/produto/demonstracao`.
- [x] Testar dados, API, cadastro → anúncio, permissões de visualização, responsividade e regressão da demonstração. Preparar publicação; operação final: push na main e verificação do deploy.

Escopo: template e fluxo de visualização. Estoque/checkout e avaliações verificadas permanecem integrações separadas; não usar a autoavaliação do vendedor como nota pública. Mídias e textos são os salvos no cadastro. Configuração adicional usa o JSON já aceito por `save_product_record`; nenhum SQL ou produto de cliente será alterado manualmente.

Validação: 78 testes passaram, TypeScript e ESLint dos arquivos alterados sem erros. Modelo em 1440/390/320 px sem overflow ou erro de JavaScript; navegação até a 12ª foto e entre anúncios validada. Demonstração repetida em quatro tamanhos, preservada. Leitura do anúncio publicado Jaqueta Premium validada no modelo; nenhuma gravação de teste no banco real. Revisão independente sem achados de regressão.
