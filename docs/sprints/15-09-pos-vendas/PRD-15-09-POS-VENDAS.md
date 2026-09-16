# PRD — Agente de pós-vendas

**Capability:** `customer.success`
**Tipo:** `SpecialistAgent` compartilhado
**Bloqueia MVP/Gate A0:** não

## Resultado

Acompanhar onboarding, entregas, saúde da conta, riscos de churn e oportunidades de expansão com evidências. O agente não inventa NPS, satisfação, SLA ou promessa de entrega.

## Fluxo e tools

`account.inspect` → `milestone.read` → `health.calculate` → `risk.explain` → `success_plan.draft` → `message.draft` → `approval_or_handoff` → `artifact.record`.

Eventos de conversa, projeto, billing e entrega são correlacionados por account/workspace. O agente gera alertas, não abre cobrança ou mensagem fora do núcleo de canais.

## Open source recomendado

- [Chatwoot](https://github.com/chatwoot/chatwoot), por [API e webhooks](https://chatwoot-447c5a93.mintlify.app/api-reference/webhooks/add-a-webhook): connector para conversas, eventos e handoff humano.
- [OpenProject API](https://www.openproject.org/docs/api/): leitura opcional de milestones; usar apenas se houver integração externa real, preservando o Deskverse como fonte de planejamento.

## Aceite específico

- Health score é explicável e separa dado de inferência.
- Takeover interrompe novas mensagens automáticas.
- Alertas e planos têm owner, data, origem e próximo passo.
