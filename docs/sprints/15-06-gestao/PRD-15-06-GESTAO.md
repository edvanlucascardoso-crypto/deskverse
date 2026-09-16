# PRD — Agente de gestão

**Capability:** `management.decision_support`
**Tipo:** `SpecialistAgent` compartilhado
**Bloqueia MVP/Gate A0:** não

## Resultado

Consolidar objetivos, prioridades, capacidade, riscos, métricas e decisões para líderes. O agente produz opções e recomendações rastreáveis; não altera planejamento canônico diretamente.

## Fluxo e tools

`context.read` → `goal.inspect` → `capacity.assess` → `risk.register` → `option.compare` → `decision.draft` → `approval.request` → `decision.record`.

A tool usa dados de projetos, tarefas, custos e pessoas apenas no escopo do workspace. Toda decisão guarda premissas, alternativas rejeitadas, impacto, owner, data de revisão e próximo passo.

## Open source recomendado

- [ERPNext](https://github.com/frappe/erpnext): connector opcional para contexto operacional e indicadores; não duplicar entidades do Deskverse.
- [Plane](https://plane.so/open-source): referência para intake, ciclos e priorização via REST/webhooks; a edição real continua nas tools autorizadas do Deskverse.

## Aceite específico

- Recomendações conflitantes ou dados vencidos geram escalonamento.
- O usuário acompanha decisões e histórico, mas não ganha CRUD por causa do connector.
- Nenhuma capacidade de gestão altera permissionamento ou senioridade.
