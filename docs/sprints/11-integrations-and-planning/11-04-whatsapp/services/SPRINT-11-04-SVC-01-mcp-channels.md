# SPRINT-11-04-SVC-01 — MCP de canais no Railway

**Depende de:** 07-01, 08-04, 09-04 e credenciais aprovadas.  
**Não bloqueia:** o Gate A0 do MVP; canal conectado é posterior ao fluxo de entrega.

## Objetivo

Hospedar o conector de WhatsApp e o contrato reutilizável de canais fora do app web. O serviço executa efeitos externos; o Deskverse mantém decisão, aprovação e contexto.

## Regras

- Railway `deskverse-mcp-channels`, privado, por ambiente e com webhook dedicado.
- Tools mínimas: validar conexão, listar contexto autorizado, preparar envio/publicação, executar ação aprovada, consultar estado e cancelar quando o provider permitir.
- Toda ação tem `workspaceId`, credencial do workspace, approval id, idempotency key e audit trail.
- Webhook valida assinatura, é idempotente e reconcilia estado de forma assíncrona.
- Sem aprovação persistida, não envia mensagem nem publica; espera humana não ocupa worker.

## Aceite

- Reenvio da mesma chave não duplica mensagem/publicação.
- Credencial e dados de um workspace não atravessam para outro.
- Falha técnica é observável e recuperável; resultado nunca é inventado na UI.

