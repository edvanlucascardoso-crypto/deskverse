# Integration requirements — SPRINT-07-01

## Status

`COMPLETE_WITH_INTEGRATION_REQUIREMENTS`

## Limite da entrega local

`createInMemoryQueueBackend` é um adapter determinístico para desenvolvimento e testes. Ele não representa Redis, não mantém estado entre processos e não substitui o Neon como fonte durável. O drawer explicita essa condição por meio das fixtures locais.

## Próxima integração

1. Implementar o gateway autenticado entre a aplicação e o Redis privado no Railway.
2. Persistir o registro durável de cada job antes de publicar ou liberar a próxima etapa.
3. Garantir que o worker receba apenas payload mínimo, `workspaceId`, referência do documento, checksum e chave de idempotência.
4. Reconciliar lease, heartbeat, retry, dead-letter e cancelamento em cascata entre Redis e Neon sem permitir travessia de workspace.
5. Repetir os cenários de fila cheia, fairness, lease expirado, retry técnico, espera humana, dead-letter, reprocessamento e restore em ambiente limpo.

## Fora do escopo

Não foram conectados Redis, workers Railway, OCR, embeddings, UploadThing, publicação externa, cobrança ou novos modelos Prisma. Não há bloqueio de decisão de produto registrado para promover a próxima sprint; há apenas dependências de infraestrutura e adapters reais.

## Atualização da Fase 07 — corte 16/09/2026

`COMPLETE_WITH_INTEGRATION_REQUIREMENTS`

As SPRINT-07-02 a 07-07 foram implementadas sobre a fundação de filas da 07-01. O código agora entrega:

- `Document`, `DocumentVersion`, `DocumentChunk`, `OnboardingSession`, `KnowledgeFact`, `KnowledgeConflict` e `BrandProfile` em migration Prisma versionada;
- adapter `AssetStorage` para UploadThing, com upload privado do original, URL assinada e remoção protegida por `workspaceId`;
- PDF → Markdown com páginas, DOCX → Markdown com títulos/listas e XLSX/XLS → CSV por planilha + Markdown tabular;
- áudio → OpenAI Whisper → `InferenceGateway` com `gpt-5.6-luna`, raciocínio solicitado `medium`, sem `max`; sem chave, a versão fica em `WAITING_USER`;
- chunks estruturais, embeddings por adapter, busca híbrida autorizada e indexação PostgreSQL com distância vetorial pgvector;
- ciclo de vida explícito do `RagIndex`: limpeza total + nova geração no workspace e substituição isolada por arquivo, ambas com confirmação, RBAC, estados e auditoria;
- onboarding persistível, auditoria de respostas/decisões e perfil derivado com readiness;
- drawer integrado ao snapshot/rotas autenticadas e fixtures locais para demonstração sem credenciais.

## Pendências de integração para promoção

1. Executar um smoke de upload, URL assinada e remoção em cada ambiente do UploadThing com ACL privada configurada. O SDK está no projeto, mas esta execução não criou arquivo de teste no storage externo.
2. Aplicar `prisma/migrations/20260916130000_onboarding_knowledge` e `prisma/migrations/20260916150000_rag_index_lifecycle` em banco limpo e no Neon. `yarn db:validate` passou; `yarn db:status` e `yarn build` (na etapa `prisma migrate deploy`) ficaram impedidos pelo erro TLS do ambiente Windows: `P1011: Error opening a TLS connection: Credenciais não disponíveis no pacote de segurança (os error -2146893042)`.
3. Conectar o gateway real de jobs/Redis e mover processamento para worker CPU com checkpoint entre estados, sem enviar bytes desnecessários ao worker.
4. Configurar OCR real para PDF escaneado e um endpoint de embeddings atrás do `InferenceGateway`. PDF sem texto continua em falha recuperável; não é apresentado como compreendido.
5. Configurar `OPENAI_API_KEY`, testar Whisper com arquivo autorizado e validar a revisão `gpt-5.6-luna` `medium` em ambiente controlado. Os testes locais usam providers fake e não fazem chamada externa.
6. Validar isolamento, restore, idempotência de reindexação e filtros de permissão com dois workspaces em banco integrado.
7. Exercitar em banco integrado as transações de `RagIndex` (`EMPTY` → `BUILDING` → `READY/FAILED`), concorrência entre reconstruções e confirmação obrigatória nas três rotas destrutivas.

## Fora do escopo desta execução

Interpretação semântica de música/vídeo, publicação externa, cobrança, agentes do MVP, Eve em produção, notificações realtime e migração futura para Pydio/R2. A limpeza do RAG não remove os arquivos originais nem suas conversões: ela remove o índice vetorial e mantém o material de origem para uma nova geração.
