# Serviços externos — Fase 09

## Objetivo operacional

Esta fase liga a execução real aos contratos internos. A regra de negócio continua no Deskverse; fornecedores executam transporte, runtime ou inferência.

## Mapa por sprint

| Sprint | Serviço | Configuração |
|---|---|---|
| 09-01 | Neon + Redis | Registry, capabilities e filas lógicas |
| 09-02 | Vercel AI Gateway | Inferência, provider routing e failover técnico |
| 09-03 | Secret manager/credenciais | Scopes, audience, OAuth 2.1 + PKCE e delegação |
| 09-04 | Eve + Redis Railway + workers Railway/RunPod Serverless | Runtime durável, especialistas e filas físicas |
| 09-05 | Neon + Redis | Budget, retry e proteção contra loops |
| 09-06 | Secret manager/MCP | Credenciais por workspace e recurso |
| 09-07 | Neon/pgvector | Memória única dos agentes |
| 09-08 | OpenTelemetry/ledger | Traces, custo, evals e benchmark |

## Vercel AI Gateway

Criar uma credencial por ambiente no gateway e manter as chaves dos providers fora do app e fora do prompt. O adapter recebe somente a resposta do gateway.

Variável lógica sugerida:

```env
AI_GATEWAY_API_KEY=
```

OpenAI, Anthropic, Gemini, Kimi, Muse, DeepSeek e Qwen continuam atrás do gateway. O catálogo em runtime é autoridade para modelos, preços e capacidades; a tabela da sprint não deve alimentar billing.

## Eve, Railway e RunPod Serverless

Provisionar o runtime Eve conforme seu contrato e registrar endpoint/projeto/credencial em secret group separado por ambiente. APIs, scheduler e workers efêmeros `LLM`, `CPU` e `BROWSER` rodam no Railway; jobs `GPU` e `RENDER` são despachados para endpoints RunPod Serverless quando habilitados.

```env
EVE_API_URL=
EVE_API_KEY=
REDIS_URL=
```

O Redis deve permanecer atrás de `QueueBackend`. Workers CPU usam conexão privada no Railway; o scheduler chama o endpoint RunPod Serverless por HTTPS assinado para jobs GPU/RENDER. A Vercel não acessa worker diretamente. `WAITING_USER` e `WAITING_APPROVAL` persistem checkpoint e liberam o worker.

## Conexões e memória

- Neon continua fonte de estado, auditoria e memória persistente.
- pgvector é habilitado por migration Prisma.
- Segredos de integrações são referenciados, nunca serializados no prompt, trace ou resultado da tool.
- MCP valida `audience`, `scope`, `workspaceId` e recurso.
- `lease`, `heartbeat`, retry técnico, dead-letter e cancelamento devem ser testados contra Redis real.

## Validação

Testar troca de adapter Eve, provider indisponível, rate limit, perda de worker, lease expirado, deduplicação, budget excedido e isolamento entre workspaces. Nenhuma senioridade pode alterar permissões ou scopes.
