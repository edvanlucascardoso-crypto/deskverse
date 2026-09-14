# Serviços externos — Grupo 11-04

## Configuração

O conector canônico é o MCP de canais privado hospedado no Railway, compartilhado pelos canais e agentes previstos no serviço [SPRINT-11-04-SVC-01](services/SPRINT-11-04-SVC-01-mcp-channels.md). Cada ambiente usa seu endpoint, webhook, credenciais e Secret Group próprios.

```env
CHANNEL_MCP_URL=
CHANNEL_MCP_AUDIENCE=
CHANNEL_MCP_CLIENT_ID=
CHANNEL_MCP_CLIENT_SECRET=
```

As credenciais do provedor ficam no MCP. O Deskverse envia somente payloads autorizados, com `workspaceId`, agente, finalidade e idempotency key; sem aprovação ou permissão válida, não há ação externa.

## Limites

Não criar uma cópia do conector por agente nem mover o MCP para Northflank silenciosamente. Uma migração exige atualização do SVC, testes de webhook, coexistência, replay idempotente e rollback. O ciclo UploadThing no MVP → Pydio Cells no Northflank pós-MVP é uma decisão de arquivos e não altera o transporte de canais.
