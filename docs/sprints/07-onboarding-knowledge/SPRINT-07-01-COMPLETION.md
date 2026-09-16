# SPRINT-07-01 — Relatório de conclusão

## Estado

`COMPLETE_WITH_INTEGRATION_REQUIREMENTS`

## Corte

15/09/2026. A sprint foi executada como a primeira fatia da Fase 07, conforme a prioridade do manifesto.

## Entrega

- Contrato de `QueueBackend` com os estados `PENDING`, `READY`, `RUNNING`, `WAITING_USER`, `WAITING_APPROVAL`, `RETRY_SCHEDULED`, `SUCCEEDED`, `FAILED`, `CANCELLED` e `DEAD_LETTER`.
- Jobs carregam `workspaceId`, `runId`, `parentRunId`, `resourceClass`, prioridade, datas, tentativa, limite de tentativas, idempotência, origem, responsável, próximo passo e checkpoint de espera.
- Adaptador local determinístico com FIFO, aging a cada cinco minutos até `HIGH`, preferência para fila interativa, fairness ponderada entre workspaces, limites por workspace/classe/tipo e erro acionável `QUEUE_SATURATED`.
- Lease e heartbeat com recuperação segura de expiração; estados de espera liberam o worker; cancelamento em cascata respeita o workspace; falha semântica não vira retry técnico; dead-letter permite reprocessamento explícito.
- Pipeline rastreável de conhecimento `DOCUMENT_VALIDATE` → `DOCUMENT_EXTRACT` → `DOCUMENT_NORMALIZE` → `DOCUMENT_CHUNK` → `DOCUMENT_EMBED` → `DOCUMENT_INDEX`, com checksum, versão do documento e chave de idempotência em cada etapa.
- Drawer `Fila de trabalho` no canvas com loading, fila vazia, erro recuperável, filtros, seleção, metadados, próximo passo e ações até conclusão. A superfície permanece drawer-first e responsiva.
- Fixtures locais e teste de erro de leitura para demonstrar a experiência sem afirmar que Redis ou workers reais já estão conectados.

## Evidências

- `yarn test`: 9 arquivos e 29 testes aprovados.
- `yarn lint`: aprovado.
- `yarn typecheck`: aprovado com geração do Prisma Client.
- `yarn test:e2e`: 18 testes aprovados em Chromium desktop e mobile; o fluxo adicional percorreu tarefa pronta → em andamento → concluída e também foi executado com `prefers-reduced-motion: reduce`.
- `yarn db:validate`: schema válido.
- `yarn db:status`: banco atualizado, sem migrations pendentes.
- `BETTER_AUTH_URL=http://localhost:3000 BETTER_AUTH_SECRET=<valor-local> yarn build`: build Next 16/Turbopack aprovado. O build sem essas variáveis continua bloqueado pelo guard de produção já existente de Better Auth.

## Roteiro de demonstração

1. Abrir `/?demo=1` e selecionar o controle `Abrir fila de trabalho` no canvas.
2. Conferir as etapas de conhecimento, origem, responsável, prioridade, tentativas, checksum e próximo passo.
3. Usar `Assumir próxima tarefa`, depois `Concluir tarefa`, para observar `READY` → `RUNNING` → `SUCCEEDED` em português.
4. Assumir uma tarefa e usar `Aguardar sua resposta` ou `Pedir aprovação`; o slot é liberado e `Continuar de onde parou` retoma o trabalho.
5. Usar os filtros `Aguardando` e `Atenção`; em um workspace sem fixtures a mesma tela mostra o estado vazio. Em `Teste local da fila`, simular erro e usar `Tentar carregar novamente`.

## Integrações pendentes

- Substituir o adaptador local pelo Queue Gateway HTTPS autenticado sobre Redis no Railway, mantendo a política no Deskverse.
- Persistir estados, leases, tentativas, erros, checkpoints e histórico no Neon; esta sprint não altera o schema nem cria migration porque a persistência durável pertence à integração do backend de fila.
- Conectar workers CPU e o scheduler real às etapas do pipeline de documentos.
- Definir adapters reais de OCR, normalização e embeddings atrás do `InferenceGateway` nas sprints correspondentes; nenhum fornecedor foi acoplado aqui.
- Adicionar transporte real de atualização da fila para a interface quando a integração de jobs assíncronos estiver disponível.

## Próxima prioridade

`SPRINT-07-02 — Upload e armazenamento de arquivos`.

## Atualização do corte de 16/09/2026

A execução completa da Fase 07 adicionou os estágios condicionais `DOCUMENT_TRANSCRIBE` e `DOCUMENT_POLISH` entre extração e normalização quando o payload é áudio. A cadeia final ficou `VALIDATE → EXTRACT → TRANSCRIBE → POLISH → NORMALIZE → CHUNK → EMBED → INDEX`, sem alterar o caminho de documentos que não são áudio. A fila continua atrás de `QueueBackend`; o adapter local foi usado somente para testes e demonstração.

Evidências atuais: `yarn test` passou em 15 arquivos/46 testes; `yarn lint`, `yarn typecheck`, `yarn db:validate` e `yarn next build` com variáveis locais de Better Auth passaram. O E2E do drawer de onboarding/conhecimento passou em Chromium desktop e mobile. A transcrição real continua deliberadamente sem teste externo até a configuração de `OPENAI_API_KEY`.
