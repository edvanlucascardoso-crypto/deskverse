# SPRINT-09-03 — Identidade, permissões e delegação segura

**Fase:** 09 — Execução de Agentes  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-09-02  
**Superfície principal:** autorização independente do prompt

## Objetivo

Implementar autenticação, autorização, isolamento, delegação e aprovação com menor privilégio. **Mais inteligência não significa mais poder.**

## Modelo de segurança

```text
Autenticação -> quem é?
Autorização  -> o que pode fazer?
Isolamento   -> sobre quais recursos?
Delegação    -> em nome de quem?
```

Entidades mínimas: `User`, `Workspace`, `Agent`, `AgentRun`, `Service`, `Resource`, `Delegation`, `Policy`, `Approval`. Toda execução possui `agent_run_id`.

## Tokens e scopes

- OAuth 2.1 + PKCE para humanos.
- Service identity para agentes/serviços.
- Tokens curtos; capability tokens para ações sensíveis.
- Audience própria por serviço/MCP.
- Scopes `resource:action`; roles são apenas bundles.
- Workspace vem do token, nunca do body.
- Scope não ignora ownership, policy, budget ou approval.

Autorização valida: JWT, issuer, audience, expiração, scope, workspace, resource ownership, policy e budget.

## Delegação entre agentes

Ao delegar para especialista compartilhado, emitir identidade/token delegado mínimo para **capability + recurso + workspace + run**, com expiração curta. O especialista não herda todas as permissões do líder.

## Human approval

Ações sensíveis podem entrar em `WAITING_APPROVAL`. Aprovar, recusar, expirar e cancelar são idempotentes e auditáveis. Solicitações de alteração da própria configuração do agente seguem o mesmo fluxo.

## Critérios de aceite

- Um token de um workspace/recurso não opera em outro.
- Delegação para especialista transfere apenas scopes necessários.
- Senioridade Júnior/Pleno/Sênior/Especialista não muda permissões.
- Repetições não aplicam aprovação ou ação duas vezes.
- Segredos nunca entram no prompt ou argumentos visíveis.
- Erros de auth são padronizados e auditados.
