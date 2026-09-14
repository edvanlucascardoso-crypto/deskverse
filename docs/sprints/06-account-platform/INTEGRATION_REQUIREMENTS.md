# Integration requirements — Fase 06

Status: `COMPLETE_WITH_INTEGRATION_REQUIREMENTS`.

## Entregue

- `Prisma` + PostgreSQL com isolamento por `workspaceId`, entidades de conta, organização, workspace, membros, itens, preferências, atividade, runs, aprovações, auditoria, idempotência e memória.
- Migration versionada `20260914120000_account_platform_init`, incluindo `CREATE EXTENSION IF NOT EXISTS vector` para pgvector.
- Better Auth com e-mail/senha, sessão server-side, handler `/api/auth/[...all]`, tela `/login` e encerramento de sessão.
- APIs de workspace, membros e layout com validação Zod e RBAC no servidor.
- Contratos `AgentRuntime`, `InferenceGateway`, `WorkerExecutionProvider`, `McpRemoteClient`, `QueueBackend` e `AssetStorage`, com adaptadores locais determinísticos.
- Healthcheck de configuração em `/api/health`, `.env.example` e proteção server-side de `/`, `/workspace` e `/settings` em produção. O modo demo só pode abrir fora de produção.

## Pendências de integração

1. A migration `20260914120000_account_platform_init` foi aplicada no Neon. Ainda é necessário criar recursos segregados de `development`, `staging` e `production` para Neon, Redis/Queue Gateway e UploadThing; preencher os segredos somente nos gerenciadores de cada ambiente.
2. Conectar `QueueBackend` ao gateway Redis autenticado, mantendo a política de fila no Deskverse e o estado durável no Neon.
3. Conectar UploadThing ao contrato `AssetStorage` quando houver um fluxo de arquivos confirmado; a implementação local não envia assets para fora.
4. Fornecer os endpoints reais de Eve, Vercel AI Gateway e MCPs nas sprints funcionais correspondentes. Nenhum worker futuro foi antecipado.
5. Executar o roteiro visual em navegador/CUA. A sessão de execução não disponibilizou navegador (`No browser is available`); a validação de produção cobriu redirects sem sessão para `/`, `/workspace`, `/workspace?demo=1` e `/settings`.
6. O projeto Sites existente permanece com configuração estática (`.openai/hosting.json` aponta para `out`), enquanto esta fase exige rotas server/API. Antes de publicar, migrar o destino para um runtime compatível com Next server ou separar a publicação pública estática do shell autenticado.

## Operação e recuperação

- Segredos ficam ignorados pelo Git (`.env*`), com `.env.example` sem valores reais.
- Mudanças de membro, workspace e preferências registram `AuditEvent` com origem, estado novo e próximo passo.
- Falhas de API preservam o último estado local apresentado ao usuário e retornam mensagens acionáveis.
- Antes do deploy, executar restore em banco limpo, validar `prisma migrate status`, testar isolamento entre dois workspaces e confirmar rotação/redaction dos segredos.
