# SPRINT-16-01 — Convites e entrada de colaboradores

**Fase:** 16 — Colaboração
**Status inicial:** PLANNED
**Dependências:** SPRINT-10-07
**Superfície principal:** convite, aceite, entrada segura e contexto de workspace

## Objetivo

Permitir colaboração humana depois da criação dos agentes do MVP, sem transformar convites em pré-requisito do primeiro uso. Esta sprint é atemporal: pode ser executada em qualquer ponto posterior à Fase 10, sem aguardar outros agentes futuros, temas ou uma posição fixa no roadmap.

## Trabalho

1. Criar convite vinculado a organização, workspace, papel e escopo.
2. Permitir aceite, expiração, cancelamento, reenvio idempotente e recusa.
3. Criar sessão e contexto ativo da pessoa convidada somente após aceite válido.
4. Registrar origem, responsável, data, estado e auditoria do convite.
5. Tratar loading, empty, error, success e WAITING_USER sem expor acesso antes da confirmação.

## Critérios de aceite

- Convite não concede acesso antes do aceite autenticado.
- Usuário convidado entra somente no workspace e no papel autorizados.
- Convite expirado, cancelado ou repetido falha de forma recuperável e auditável.
- A sprint não é requisito para o MVP nem para qualquer agente futuro.
- Lint, typecheck, build, testes de autorização, teclado e viewport estreita passam.
