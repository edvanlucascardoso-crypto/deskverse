# Serviços externos — Fase 11

## Mapa por sprint

| Sprint | Serviço necessário | Decisão |
|---|---|---|
| 11-01 | UploadThing | MCP/tool do clone do Figma é interno e não tem painel público |
| 11-02 | Nenhum agora | Escopo transferido para a SPRINT-15-19 |
| 11-03 | API/conta do Instagram | Credencial por workspace e aprovação para publicar |
| 11-04 | WhatsApp + MCP de canais | Serviço canônico atualmente definido no Railway |
| 11-05 | MCP de canais + Neon | Inbox unificada e atribuição |
| 11-06 | Neon + fila | Agenda e replanejamento; provider de calendário ainda não fixado |
| 11-07 | Neon + Gateway | Resumo e recomendações |

## Canais sociais

As credenciais de Instagram e WhatsApp pertencem ao workspace, devem ser criptografadas, revogáveis e referenciadas por ID. Não colocar tokens de canal no `.env` global nem no prompt do agente.

O serviço de canais reutilizável está descrito em [SPRINT-11-04-SVC-01](11-04-whatsapp/services/SPRINT-11-04-SVC-01-mcp-channels.md). A decisão canônica atual é `deskverse-mcp-channels` privado no Railway, por ambiente, com webhook dedicado. Colocar workers e Redis no Northflank não altera automaticamente essa decisão; uma migração exige atualização da SVC e teste de rede/segredos.

Variáveis de serviço sugeridas:

```env
CHANNEL_MCP_URL=
CHANNEL_MCP_AUDIENCE=
CHANNEL_MCP_CLIENT_ID=
CHANNEL_MCP_CLIENT_SECRET=
```

Credenciais reais do workspace ficam no armazenamento seguro da aplicação, não nessas variáveis.

## Webhooks e efeitos irreversíveis

- Verificar assinatura do webhook.
- Deduplicar por `eventId` e `idempotencyKey`.
- Reconciliar estado de forma assíncrona.
- Exigir approval persistida antes de enviar/publicar.
- Preservar auditoria de agente, superior, humano, motivo e resultado.

Até as credenciais aprovadas existirem, usar fixtures sem simular publicação confirmada. UploadThing continua sendo o storage de artefatos; a plataforma própria de imagem permanece posterior.
