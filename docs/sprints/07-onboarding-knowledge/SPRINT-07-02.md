# SPRINT-07-02 — Upload e armazenamento de arquivos

**Fase:** 07 — Onboarding e Conhecimento
**Status inicial:** PLANNED
**Dependências:** SPRINT-07-01
**Superfície principal:** upload, validação, armazenamento, acesso e remoção

## Objetivo

Entregar upload, validação, armazenamento, acesso e remoção como uma fatia utilizável do produto. A implementação deve ligar o comportamento à experiência do workspace, deixando explícitos os estados que o usuário pode observar e as decisões que pertencem a outra fase.

## Arquivo-fonte do conhecimento

O arquivo original enviado pela pessoa usuária fica no UploadThing e nunca é substituído pelo conteúdo extraído. Cada upload cria `Document` e `DocumentVersion` isolados por `workspaceId`, com hash, MIME type, tamanho, origem, data e estado de processamento. O upload confirmado apenas inicia a fila de conhecimento; ele não significa que o documento já está disponível para busca pelos agentes.

## Trabalho

1. Modelar o caminho principal de upload, validação, armazenamento, acesso e remoção com dados mínimos e estados nomeados.
2. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
3. Exibir origem, responsável, última atualização e próximo passo quando esses dados existirem.
4. Manter regras próximas da feature, com tipos locais e fixtures pequenas, sem criar uma abstração transversal prematura.
5. Registrar em integration-requirements dependências, decisões ou mocks que precisem de integração posterior.

## Incluído

- Código funcional na superfície indicada.
- Fixtures locais ou persistência mínima necessária para demonstrar a sprint.
- Feedback de foco, seleção, erro, espera e conclusão.
- Relatório de conclusão com evidências e pendências.

## Não incluído

Escopo de fases posteriores, publicação externa, cobrança, dados inventados, engine visual paralela ou mudança silenciosa de produto.

## Entregáveis

Implementação, testes proporcionais ao risco, roteiro de demonstração e instruções para executar a validação local.

## Critérios de aceite

- O fluxo principal funciona do início ao fim.
- Estados vazio, carregando, erro e sucesso são compreensíveis.
- A tela permanece utilizável com teclado e viewport estreita.
- Falhas parciais não apagam dados válidos nem deixam a interface travada.
- Não há dependência de WebGL, engine 3D, modelos legados, Stem ou jogo.
- Lint, typecheck e build passam.
- O relatório lista integrações pendentes e limites da entrega.

## Verificação

Executar instalação e scripts de qualidade, percorrer o fluxo no navegador e testar fixtures vazias, completas e com falha. Registrar a evidência no relatório da sprint.

## Critério de conclusão

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Usar COMPLETE quando todos os critérios forem demonstrados. Usar COMPLETE_WITH_INTEGRATION_REQUIREMENTS quando só restarem integrações registradas; manter bloqueios visíveis quando dependerem de uma decisão externa.
