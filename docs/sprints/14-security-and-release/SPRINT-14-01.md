# SPRINT-14-01 — Isolamento de workspaces e recursos

**Fase:** 14 — Segurança e Release  
**Status inicial:** PLANNED  
**Dependências:** Fase 13  
**Superfície principal:** autorização e isolamento

## Objetivo

Provar que usuário, agente, especialista compartilhado e worker nunca atravessam boundaries de workspace/recurso por erro de prompt, body, cache ou delegação.

## Regras

Toda tabela sensível possui `workspace_id`. O workspace efetivo vem da identidade autenticada, nunca do body. Validar resource ownership além de scope. Cache/memória/vector search são sempre filtrados antes da recuperação.

Delegações carregam workspace/run/resource/capability explícitos. A área de Especialistas é compartilhada **logicamente**, mas dados e credenciais permanecem isolados por workspace.

## Testes obrigatórios

- token workspace A tentando recurso B;
- troca maliciosa de `workspaceId` no body;
- specialist/worker recebendo memória de outro workspace;
- cache/context retrieval cross-tenant;
- capability token reutilizado fora de audience/recurso/expiração;
- replay/retry após revogação.

## Critérios de aceite

Todos os cenários negam acesso, produzem erro padronizado e auditável e não vazam conteúdo sensível em logs/UI.
