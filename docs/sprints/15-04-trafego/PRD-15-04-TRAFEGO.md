# PRD — Agente de tráfego

**Capability:** `traffic.performance`
**Tipo:** `SpecialistAgent` compartilhado
**Bloqueia MVP/Gate A0:** não

## Resultado

Planejar campanhas, orçamento, UTMs, eventos e otimização com base em dados confirmados. O agente recomenda ações e pode preparar alterações, mas não publica ou aumenta investimento sem approval.

## Fluxo e tools

`brief.confirm` → `campaign.plan` → `audience.validate` → `tracking.plan` → `metrics.read` → `anomaly.detect` → `budget.recommend` → `approval.request` → `change.apply`.

Cada connector de Meta/Google/TikTok fica atrás de uma interface de provider; a tool do agente usa nomes neutros, paginação, rate limit, dry-run e idempotência. Custo estimado, janela, moeda e atribuição entram no trace.

## Open source recomendado

- [Matomo](https://github.com/matomo-org/matomo) / [Analytics API](https://matomo.org/guide/apis/analytics-api/): primeira integração para eventos, conversões, referrers e atribuição própria.
- [Mautic](https://github.com/mautic/mautic): alternativa para segmentos e automações; somente connector externo após revisão de licença, consentimento e deliverability.

## Aceite específico

- Métricas incompletas mostram a limitação de atribuição.
- O orçamento efetivo nunca pode exceder policy sem approval.
- Um retry não duplica campanha, evento ou alteração de orçamento.
- Relatórios e recomendações distinguem dado observado de previsão.
