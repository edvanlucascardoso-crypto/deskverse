# Integration requirements — grupo Motion Design e Motion MCP

**Status:** PLANNED
**Owner:** `SPRINT-15-02` e Supervisor da Fase 15
**Escopo:** integrações compartilhadas e decisões que não podem ser simuladas como concluídas

## Dependências externas

1. Aplicar/confirmar as migrations das Fases 07, 08 e 09 em banco limpo e validar `prisma migrate status`.
2. Substituir `createInMemoryQueueBackend` por Queue Gateway/Redis autenticado antes do render remoto.
3. Conectar `AssetStorage` ao UploadThing com checksum, versão, URL assinada e confirmação de backend.
4. Entregar service identity, audience, scopes e delegation da SPRINT-09-03 para o `motion-mcp`.
5. Entregar `WorkerExecutionProvider` com progresso, lease, heartbeat, cancelamento e output estruturado.
6. Entregar notificações/outbox da SPRINT-08-06 e approval/policy das SPRINT-08-07/08.
7. Provisionar serviços privados no Railway por ambiente e endpoint RunPod Serverless para GPU/RENDER, com healthcheck, logs redacted, secrets mínimos e rollback.
8. Obter parecer jurídico e SBOM/SPDX antes de promover packages Premation.

## Decisões pendentes

- resultado do Spike sobre Chromium headless, WebGPU/WebGL2, Canvas2D e Electron;
- modelo canônico de `Project` da SPRINT-08-01;
- política de aprovação para render final e limites de UploadThing;
- adapter e owner operacional do MCP do clone do Figma;
- retenção de snapshots, previews e outputs falhos.

## Fallbacks obrigatórios

- Sem renderer remoto: preview local/fixture ou `RETRY_SCHEDULED`/`FAILED` visível; nunca output falso.
- Sem UploadThing: manter revisão e job, sem confirmar arquivo na tela.
- Sem MCP do Figma: shapes básicos/asset vetorial aprovado ou `WAITING_USER`.
- Sem contexto/BrandProfile: pergunta curta e checkpoint, sem inventar estilo, fonte ou prazo.
- Sem aprovação: `WAITING_APPROVAL`, notificação e card pendente; não entregar.

## Evidência exigida

Cada sprint do grupo deve anexar comandos, ambiente, revisão de dependência, testes, screenshots/trace quando houver UI e uma lista do que permanece pendente. Fixtures, mocks e adapters locais devem ser identificados como locais no relatório.
