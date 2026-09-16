# Fase 07 — onboarding, conversão antes do RAG e ciclo de vida do índice

## Data e escopo

16/09/2026. Registro append-only da execução das SPRINT-07-01 a 07-07 e da decisão complementar solicitada pelo usuário para apagar/recriar o RAG e substituir a indexação de um arquivo específico.

## Motivo e contexto

A fase precisava transformar referências enviadas no onboarding em contexto rastreável sem entregar bytes, texto bruto ou conversões pendentes ao RAG. Também faltava uma operação explícita para invalidar um índice existente, reconstruí-lo a partir dos documentos prontos e refazer somente a evidência de um arquivo quando necessário.

## Estado anterior

- A documentação não detalhava de forma uniforme PDF → Markdown, XLSX/XLS → CSV + Markdown tabular, DOCX → Markdown e áudio → Whisper → revisão Luna antes do RAG.
- A fundação de pgvector existia na Fase 06 para memória, mas a Fase 07 ainda não tinha o fluxo de chunks, embeddings e busca do conhecimento.
- Não havia estado durável de geração do RAG nem operações autenticadas de limpeza/reconstrução/substituição por arquivo.

## Novo estado

- O pipeline obrigatório é original preservado → extração/transcrição → correção de áudio no `gpt-5.6-luna` com raciocínio `medium` → Markdown canônico/CSV derivado → chunks → embeddings → pgvector.
- `Document`, `DocumentVersion`, `DocumentChunk`, onboarding, fatos, conflitos, perfil e `RagIndex` são persistidos por migrations Prisma versionadas e isolados por workspace.
- `RagIndex` possui `EMPTY`, `BUILDING`, `READY` e `FAILED`. Busca só considera chunks ativos de um workspace cujo RAG esteja `READY`.
- Reconstrução completa exige `APAGAR_E_CRIAR_NOVO_RAG`; limpeza exige `APAGAR_RAG_COMPLETAMENTE`; substituição por documento exige `SUBSTITUIR_RAG_DO_ARQUIVO`. As confirmações são validadas por Zod, protegidas por `workspace:update` e auditadas.
- A limpeza remove chunks/embeddings, mas preserva original, Markdown, CSV, transcrição, metadados e histórico. A substituição por arquivo não remove chunks de outros documentos e usa a versão pronta mais recente.
- Sem `OPENAI_API_KEY`, áudio fica `WAITING_USER`; não é apresentado como compreendido nem indexado.

## Impacto em produto, arquitetura e roadmap

- Produto: o drawer mostra conversão, evidência, estados do RAG, confirmação destrutiva e ação de substituição por arquivo.
- Arquitetura: converters, Whisper, polisher, embeddings, storage e índice ficam atrás de adapters; PostgreSQL/pgvector permanece a fonte única da memória/RAG.
- Roadmap: a Fase 07 foi fechada como `COMPLETE_WITH_INTEGRATION_REQUIREMENTS`; a próxima prioridade continua SPRINT-08-00. A criação dos agentes do MVP não foi antecipada.

## Arquivos e contratos afetados

- Migrations `20260916130000_onboarding_knowledge` e `20260916150000_rag_index_lifecycle`.
- Schema Prisma, tipos/Zod de conhecimento, `DocumentPipeline`, converters, `RagRepository`, `PrismaKnowledgeIndex`, adapters UploadThing/Whisper/InferenceGateway/embeddings e rotas autenticadas.
- Drawer de conhecimento, controles de RAG, testes unitários/E2E, relatórios da Fase 07, status, manifesto e checkpoint `docs/sprints/07-checkpoint-1/`.

## Evidências

- `yarn test`: 15 arquivos/46 testes aprovados.
- `yarn lint`, `yarn typecheck`, `yarn db:validate` aprovados.
- `yarn next build` com valores locais de Better Auth aprovado e rotas de RAG incluídas.
- E2E de onboarding/conhecimento aprovado em Chromium desktop e mobile; áudio foi validado apenas com estado de espera, conforme a ausência deliberada da chave.

## Riscos e integrações pendentes

- Migration e conexão Neon continuam impedidas pelo erro TLS Windows `P1011`; aplicar em banco limpo e confirmar `prisma migrate status` ainda é obrigatório.
- UploadThing, Redis/workers, OCR escaneado, embeddings produtivos, Whisper real e gateway Luna precisam de smoke integrado.
- Concorrência entre rebuilds, restore, isolamento com dois workspaces, idempotência e política operacional de retry ainda precisam de validação integrada.

## Fora do escopo

Interpretação semântica de vídeo/música, agentes do MVP, Eve em produção, notificações realtime, publicação externa, billing, canais sociais e migração futura de storage. Limpar o RAG não significa apagar os arquivos de origem.

## Decisão tomada e decisão em aberto

Decisão tomada: toda operação destrutiva do RAG exige confirmação explícita e a API rejeita chamadas sem o literal correto; o RAG por arquivo pode ser substituído sem apagar os demais.

Decisão em aberto: escolher e validar o provider produtivo de embeddings/OCR e o transporte de jobs, sem alterar o contrato do domínio.

## Relação com registros anteriores

Complementa [2026-09-16-modelo-de-agentes-e-referencias.md](2026-09-16-modelo-de-agentes-e-referencias.md) e [2026-09-16-biblioteca-de-assets.md](2026-09-16-biblioteca-de-assets.md), que estabelecem a rastreabilidade e o armazenamento de referências antes dos agentes do MVP. Este registro não reescreve decisões anteriores.
