# SPRINT-07-05 — Relatório de conclusão

## Estado

`COMPLETE_WITH_INTEGRATION_REQUIREMENTS`

## Corte

16/09/2026.

## Entrega

- Chunks estruturais gerados apenas a partir de Markdown canônico confirmado, com título, página/seção, offsets, checksum, confiança e permissão do workspace.
- Embeddings passam por `EmbeddingProvider`; o código possui provider determinístico para desenvolvimento/testes e adapter HTTP para o `InferenceGateway`.
- Indexação PostgreSQL usa a coluna `vector` e busca híbrida lexical + distância pgvector, sempre filtrada por `workspaceId`, permissões e `RagIndex` em estado `READY`.
- Resposta de busca entrega trechos e origem rastreável; sem evidência suficiente retorna `INSUFFICIENT` e orienta a pedir contexto.
- `RagIndex` por workspace com geração e estados `EMPTY`, `BUILDING`, `READY` e `FAILED`.
- Reconstrução completa exige confirmação literal, apaga chunks/embeddings anteriores e cria nova geração a partir da versão pronta mais recente de cada arquivo.
- Limpeza completa exige confirmação literal, remove todo o índice vetorial do workspace e preserva originais, Markdown, CSV, transcrição e auditoria.
- Substituição por arquivo exige confirmação literal, remove/recria somente os chunks e embeddings daquele documento pronto e não remove a evidência de outros documentos.
- As três operações têm RBAC `workspace:update`, auditoria e rotas autenticadas; busca fica sem evidência enquanto o índice está construindo ou falhou.

## Evidências

- `yarn test`: 15 arquivos e 46 testes aprovados, incluindo pipeline, busca local, conversores e confirmações Zod obrigatórias.
- `yarn lint`, `yarn typecheck`, `yarn db:validate` e build Next 16/Turbopack com variáveis locais: aprovados.
- E2E do drawer: demonstra busca com fonte, estado de áudio pendente, reconstrução do workspace e substituição confirmada por arquivo em desktop/mobile.
- Migration `20260916130000_onboarding_knowledge` cria `DocumentChunk.embedding vector`; migration `20260916150000_rag_index_lifecycle` cria o estado durável de `RagIndex`.

## Integrações pendentes

- Aplicar e validar ambas as migrations no banco limpo/Neon; `yarn db:status` e `yarn build` completo permanecem bloqueados pelo erro TLS Windows `P1011` no ambiente atual.
- Executar embeddings reais atrás do gateway e validar recall, custo e dimensão do vetor em benchmark.
- Testar isolamento com dois workspaces, restore, concorrência entre reconstruções, retry idempotente e operação real de delete/rebuild.

## Próxima prioridade

`SPRINT-07-06 — Conflitos e confiança das informações`.
