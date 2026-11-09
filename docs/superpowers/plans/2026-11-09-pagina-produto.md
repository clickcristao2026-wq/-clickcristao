# Página de produto

**Objetivo:** reproduzir as referências fornecidas em React, preservando a ordem desktop e a reorganização mobile.
**Referência:** `Pagina Produtos/1. Pacote Pagina - Produtos/02_Especificacao_Tecnica/Especificacao_Tecnica_Pagina_Produto_Desktop_Mobile.pdf` e oito PNGs recebidos.
**Arquitetura:** rota pública `/produto` de demonstração e `/produto/:id` integrada ao catálogo existente. Componentes próprios, CSS isolado, imagens WebP recortadas dos originais. Sem dependências novas.

- [x] Criar testes de interação: galeria, quantidade mínima/máxima, abas por teclado, favoritos, compra ilustrativa e anúncio indisponível.
- [x] Criar modelo de apresentação e adaptador do catálogo. Não converter avaliações autodeclaradas em avaliações públicas. Não inventar estoque, selos, vendedor verificado ou itens relacionados reais.
- [x] Implementar galeria, painel, loja, condições, descrição, abas, vídeo e mosaico/recomendações. No mobile: galeria, compra, título/preço/resumo, loja, condições, descrição, abas, fotografias, vídeo, relacionados, recomendações.
- [x] Verificar testes, TypeScript, build, lint dos arquivos alterados e navegador em desktop/mobile/tablet. Registrar limitações e integridade dos originais.
- [x] Preparar entrega para publicação autorizada no GitHub. Etapa operacional final: push na main e confirmação do deploy da Vercel.

Decisões de implementação: o usuário forneceu a direção visual e autorizou execução/publicação. Trabalho na branch `codex/pagina-produto`, preservando SQL local modificado e pacote não rastreado. Não há inventário, carrinho, checkout ou página pública de vendedor no projeto: a demonstração identifica simulação; anúncios reais não permitem compra sem validação no servidor. O vídeo não foi entregue: na demonstração há apenas a referência estática identificada, nos anúncios sem arquivo a seção é omitida. O manifesto recebido não corresponde a todos os nomes/dimensões dos PNGs disponíveis; hashes atuais registrados em `qa/produto/originais-sha256.json`.

Verificação final: 62 testes passando, TypeScript e ESLint dos arquivos alterados sem erros, build de produção concluído. Navegador em 1440/820/390/320 px: sem overflow, imagem quebrada ou exceção de JavaScript. Revisão independente encontrou falhas de recuperação de imagem, limites do carrossel e distinção de erro de consulta; as três foram reproduzidas em testes e corrigidas. Oito PNGs originais permanecem intactos.
