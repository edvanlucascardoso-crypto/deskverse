# SPRINT-14-02 — Segredos, credenciais, revogação e auditoria

**Fase:** 14 — Segurança e Release  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-14-01  
**Superfície principal:** identidade de serviço e trilha de auditoria

## Objetivo

Completar o modelo de acesso iniciado na SPRINT-09-03/06 com rotação, revogação e auditoria de produção.

## Regras

- Tokens humanos/agentes/delegados têm validade curta; capability token é o mais curto.
- Audience por serviço/MCP; roles são bundles de scopes.
- API keys, quando inevitáveis, têm owner, workspace, scopes, expiração/rotação e hash; nunca aparecem novamente em plaintext.
- Preferir credenciais temporárias/Connect para integrações suportadas.
- Audit log registra actor, run, workspace, resource, action, policy, approval, delegation, resultado e timestamp sem armazenar segredo.
- Revogação bloqueia novas operações e invalida sessões/credenciais conforme capacidade do provider.

## Critérios de aceite

- Rotação não quebra runs já autorizados além do necessário e não mantém credencial antiga ativa indefinidamente.
- Revogação é testada durante run e delegação.
- Auditoria reconstrói uma ação sensível do humano até o worker/tool final.
- Nenhum prompt, trace ou erro contém token/secret.
