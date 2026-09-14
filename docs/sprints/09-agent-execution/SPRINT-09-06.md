# SPRINT-09-06 — Conexões externas e credenciais

**Fase:** 09 — Execução de Agentes  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-09-05  
**Superfície principal:** tools externas, conexões e credenciais

## Objetivo

Conectar sistemas externos sem vazar segredos para modelos e sem acoplar agentes a credenciais de usuário.

## Regras

- Conexões têm estado, capability, owner, workspace, saúde e credencial referenciada.
- Preferir Vercel Connect/credenciais temporárias quando a integração suportar; manter interface interna para outro secret manager.
- MCP atua como Resource Server e valida audience/scope/workspace/resource.
- Segredo nunca é serializado em prompt, tool result ou trace.
- Argumentos das tools são neutros ao provider e validados por schema.
- Indisponibilidade entra em WAITING/RETRY/ESCALATE; nunca simula sucesso.
- Revogação de conexão invalida novas execuções e não apaga histórico de auditoria.

## Critérios de aceite

- Agent run usa referência/credencial temporária sem conhecer token bruto.
- Revogação e rotação entram em vigor sem reiniciar o agente.
- Tool recebe somente scopes/recurso necessários.
- Falha de conexão é distinguível de falha do LLM.
