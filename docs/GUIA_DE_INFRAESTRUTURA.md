# Guia de infraestrutura do Deskverse

## Decisão operacional

| Necessidade | Serviço padrão | Regra |
|---|---|---|
| Aplicação web e API | Vercel | Não executar render, navegador ou GPU na função web. |
| Banco relacional e vetores | Neon PostgreSQL | Fonte transacional; uma base por ambiente. |
| Cache e filas físicas | Redis gerenciado | Transporte de fila; a política continua no Deskverse. |
| Arquivos do MVP | UploadThing | Artefatos dos três primeiros agentes; binários não passam pelo LLM. |
| Gerenciamento de arquivos posterior | Pydio Cells no Northflank | Migração headless após o MVP; Deskverse continua dono de metadados e autorização. |
| Mídia própria posterior | Cloudflare R2 | Asset Service headless, URLs assinadas e multipart. |
| Inferência | Vercel AI Gateway | `InferenceGateway`; sem APIs diretas no MVP. |
| Execução durável | Eve | `AgentRuntime`; política e custo pertencem ao Deskverse. |
| Serviços próprios de mídia | Northflank | Containers privados, versionados e isolados por ambiente. |
| GPU elástica posterior | Northflank | Sempre atrás de `WorkerExecutionProvider`; não fica ligada sem demanda. |
| Observabilidade | OpenTelemetry + logs/erros | Correlacionar `workspaceId`, `runId`, `taskId`, `traceId`. |

Fases 01–04 são protótipo local. Não declarar estes componentes como implementados antes das sprints correspondentes.

## Topologia

```text
Browser -> Vercel (app/API) -> Neon
                         -> UploadThing / API de imagens da OpenAI (MVP)
                         -> Pydio Cells no Northflank (pós-MVP, após migração)
                         -> Eve / Vercel AI Gateway
                         -> Redis scheduler -> Northflank workers -> R2 (mídia pesada quando aplicável)
```

O app não chama worker diretamente: persiste tarefa, o scheduler resolve especialidade/classe e o worker retira por lease/heartbeat. Espera de usuário ou aprovação salva checkpoint e libera worker.

## Ambientes

Criar `development`, `staging` e `production`, cada um com Neon, Redis, UploadThing e Vercel. Depois do MVP, cada ambiente que adotar Pydio terá um serviço Pydio Cells no Northflank e storage persistente próprio. Não reutilizar banco, filas, bucket, OAuth ou chaves de produção em preview.

## Neon PostgreSQL

1. Um projeto Neon por ambiente; connection pooling para app e conexão direta só para migrations.
2. Migrations versionadas; nenhuma alteração manual em produção.
3. Todo dado multi-tenant recebe `workspace_id`; validar o boundary em query, cache e tool.
4. pgvector para memória/busca, sempre vinculada a workspace/origem.
5. Backup, restore testado e retenção são gate de release.

Tabelas mínimas: workspace/membros, líderes/especialistas, tasks/runs/checkpoints, approvals, leases, assets, integrações, custos/uso, auditoria e idempotency keys. Segredos não ficam em texto puro no Neon.

## Redis e scheduler

Redis sustenta `LLM`, `CPU`, `GPU`, `BROWSER` e `RENDER`, além de rate limit, deduplicação e lease. Neon continua fonte definitiva. Implementar atrás de `QueueBackend`; BullMQ/Redis é a referência inicial.

A política não fica no backend: prioridade, FIFO por faixa, aging, justiça entre workspaces/líderes, backpressure, retry técnico, dead-letter e cancelamento em cascata são regras do Deskverse. Falha semântica retorna ao líder, não repete cegamente.

## Northflank: serviços, workers e Pydio posteriores

Cada serviço é privado, sem painel público, com container reproduzível, healthcheck e variáveis por ambiente:

| Serviço | Classe | Responsabilidade |
|---|---|---|
| `deskverse-worker-llm` | LLM | tools seguras e continuidade de run |
| `deskverse-worker-cpu` | CPU | conversão, thumbnails, FFmpeg leve e arquivos |
| `deskverse-worker-browser` | BROWSER | navegação isolada e autorizada |
| `deskverse-mcp-channels` | MCP/API | WhatsApp, Instagram e ações externas auditáveis |
| `deskverse-mcp-media` | MCP/API | composição, edição e metadados de mídia |
| `deskverse-pydio` | Files/API | gerenciamento headless de arquivos após a migração do MVP |

Workers consomem a fila autenticados, renovam heartbeat, validam payload e devolvem referência de resultado. MCPs usam schemas pequenos, `workspaceId`, escopo de credencial, idempotency key, timeout, auditoria e resposta estruturada.

## GPU e render

No MVP, a geração/edição visual é executada pela API de imagens da OpenAI. Depois, a GPU não fica ligada sem demanda: o scheduler envia `GPU`/`RENDER` ao `WorkerExecutionProvider` no Northflank.

O worker recebe URLs assinadas de entrada e devolve referências/URLs de saída. Não recebe banco direto desnecessário, credenciais amplas ou chaves de canais. Na plataforma própria posterior, Qwen-Image e FLUX.2 Klein geram e a ferramenta própria edita/recompõe. Em vídeo: preview antes de render final, com cancelamento e idempotência.

## MCPs, APIs e canais

Ações complexas ou com credencial de terceiro viram MCP/API externo. Serviços próprios de mídia e render rodam no Northflank; o app chama a tool por interface interna e o serviço valida autorização, aprovação exigida e idempotência.

Envio, publicação, mudança financeira e outro efeito irreversível exigem approval persistida. Webhooks entram por endpoint próprio, assinatura verificada, evento idempotente e reconciliação assíncrona.

## Segredos, observabilidade e operação

- Vercel/Northflank guardam variáveis; cada processo recebe apenas o necessário.
- Credenciais de canal são por workspace, criptografadas, revogáveis e de escopo curto.
- Separar chaves de leitura/escrita/administração e usar conta própria para migrations.
- Propagar `traceId`, `workspaceId`, `leaderRunId`, `taskId` e `idempotencyKey`.
- Medir espera de fila, execução, retries, falha técnica/semântica, custo por modelo/tool/worker, GPU-minutos e `cost_per_successful_task`.
- Alertar fila parada, lease expirado, dead-letter, orçamento excedido, webhook inválido e uso anormal de GPU.

## Ordem de implantação

1. Vercel + Neon + workspace/autenticação.
2. UploadThing e artefatos do MVP.
3. Redis/scheduler e contratos de task/run.
4. Eve + Vercel AI Gateway pelas interfaces internas.
5. API de imagens da OpenAI para o Designer do MVP.
6. Pydio Cells no Northflank, somente após a migração aprovada do storage do MVP.
7. Asset Service R2 e workers Northflank somente na plataforma própria de mídia.
8. Observabilidade, segurança e gates de release.

Agentes futuros não bloqueiam o MVP. Cada agente posterior mantém, na sua pasta, as sprints de MCP/API/worker que ele requer.

## Implementação registrada em 14/09/2026

- O app usa Next 16 com rotas server/API e `proxy.ts`; a configuração anterior de export estático foi removida para permitir Better Auth e persistência no servidor.
- Prisma 7 usa `prisma.config.ts`, `DATABASE_URL` para a aplicação e `DIRECT_URL` para migrations quando fornecido. A migration `20260914120000_account_platform_init` cria o boundary multi-tenant e habilita pgvector.
- O código mantém `AgentRuntime`, `InferenceGateway`, `WorkerExecutionProvider`, `McpRemoteClient`, `QueueBackend` e `AssetStorage` como contratos; o desenvolvimento usa adaptadores locais deterministicamente testáveis.
- As variáveis ficam documentadas em `.env.example`; `.env*` é ignorado pelo Git. O Neon configurado no ambiente foi apenas consultado: a migration está pendente e deve ser aplicada por operação aprovada.
- O projeto Sites existente ainda aponta para publicação estática em `out`. O shell autenticado com rotas server requer um destino compatível com Next server antes de nova publicação.
