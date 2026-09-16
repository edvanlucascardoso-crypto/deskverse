# PRD — Agente de pré-vendas / SDR

**Capability:** `sales.pre_sales`
**Tipo:** `SpecialistAgent` compartilhado
**Bloqueia MVP/Gate A0:** não

## Resultado

Qualificar leads com critérios configuráveis, resumir contexto, identificar próximo passo e preparar handoff para vendas. O agente não compra listas, não envia mensagem fora do canal conectado e não trata inferência como consentimento.

## Fluxo e tools

`lead.ingest` → `context.enrich` → `qualification.score` → `question.propose` → `conversation.draft` → `human_or_policy_approval` → `handoff.create` → `crm.sync`.

O núcleo de canais da Fase 11 é a única fronteira de mensagens. A tool CRM usa external ID, deduplicação e campos permitidos; contatos opt-out e dados sensíveis bloqueiam automação.

## Open source recomendado

- [EspoCRM](https://github.com/espocrm/espocrm) e sua [REST API](https://github.com/espocrm/documentation/blob/master/docs/development/api.md): connector de leads, contas, oportunidades e histórico.
- [Mautic](https://github.com/mautic/mautic): connector opcional para scoring/segmentos, sujeito a revisão de licença e consentimento.

## Aceite específico

- Score mostra fatores, fonte, data e incerteza.
- Handoff contém resumo, perguntas em aberto, consentimento e próximo passo.
- Mensagem externa, alteração de estágio e exclusão exigem policy/idempotência.
