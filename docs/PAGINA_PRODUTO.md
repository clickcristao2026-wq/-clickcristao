# Página de produto

Prévia pública: `/produto`. Anúncio do catálogo: `/produto/:id` (UUID do produto publicado). A home tem um acesso à prévia.

A composição segue os PNGs recebidos e o PDF: galeria/painel de compra, condições/descrição, abas, vídeo, mosaico de complementares e recomendações. No celular a compra precede o título; as ações Filtrar/Comparar/Favoritar/Denunciar ficam ocultas e as fotos editoriais aparecem após as abas. Desktop usa container até 1440 px; mobile até 767 px, tablet de 768 a 1023 px.

As imagens WebP são recortes dos mockups, com variantes de 480 e 960 px, dimensões reservadas, `srcset` e lazy loading. `scripts/extract-product-assets.py` reproduz a extração com Pillow. Nenhum PNG original foi alterado. O manifesto recebido descreve nove nomes padronizados, mas o pacote disponível contém oito PNGs com nomes/dimensões diferentes; `qa/produto/originais-sha256.json` registra os hashes do material efetivamente recebido.

## Dados e limites atuais

- A prévia usa os nomes, preços, avaliações e condições ilustrativos do pacote; a faixa superior identifica a demonstração.
- Anúncios reais consultam Supabase com filtro `status = publicado`, respeitando RLS. Nome, preço, parcelamento, SKU, descrição, loja, mídias e conteúdo das abas vêm do cadastro.
- Avaliações autodeclaradas do vendedor não são avaliações verificadas de compradores. Sem fonte pública confiável, notas e condições comerciais não são inventadas.
- O esquema atual não dispõe de estoque, carrinho, checkout, cadastro de complementares ou avaliações verificadas. A prévia abre um resumo ilustrativo ao clicar em compra; anúncios reais mantêm a compra desabilitada até existir validação de disponibilidade no servidor. Não há pagamento nem pedido criado.
- O pacote não contém arquivo de vídeo. A prévia mantém a capa identificada como referência estática. Anúncios com vídeo cadastrado usam player HTML nativo; sem vídeo, a seção é omitida.
- O card da loja abre as informações disponíveis; a plataforma ainda não tem página pública de vendedor. Favoritos duram a visita. Denúncia não envia dados sem atendimento integrado.

## Verificação

`npm test`, `npm run typecheck`, `npm run build`. ESLint nos arquivos alterados. Testes cobrem galeria, recuperação após erro de imagem, ampliação, limites de quantidade, abas por teclado, favoritos, resumo ilustrativo, fechamento com Escape, ausência de estoque e limites reais de rolagem. Consulta pública diferencia anúncio inexistente de falha de serviço.

`scripts/qa-product-page.cjs` verifica navegação e imagens em 1440, 820, 390 e 320 px. Requer Playwright e Microsoft Edge; `PLAYWRIGHT_MODULE` permite apontar para o Playwright do runtime local. `PRODUCT_QA_URL` permite validar um deploy. As capturas são locais em `qa/produto`, e o resumo está em `browser-checks.json`.

O detector visual indicou apenas Arial e o sublinhado azul das abas; ambos foram preservados para corresponder à referência fornecida.
