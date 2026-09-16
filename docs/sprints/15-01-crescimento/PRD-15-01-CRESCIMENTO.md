# PRD — Agente de crescimento

**Capability:** `growth.strategy`
**Tipo:** `SpecialistAgent` compartilhado
**Bloqueia MVP/Gate A0:** não

## Resultado

Transformar contexto de negócio, histórico, ICP, canais autorizados e dados de analytics em hipóteses testáveis, planos de experimento e aprendizados com confiança explícita. O agente não publica campanha nem promete resultado.

## Fluxo e tools

`brief.confirm` → `hypothesis.create` → `experiment.plan` → `metric.define` → `experiment.observe` → `learning.record` → `report.publish`.

As tools recebem `workspaceId` do contexto autenticado, fonte, período, custo máximo e `idempotencyKey`. Ações de escrita ficam em draft até aprovação. Um resultado de analytics deve preservar fonte, janela, filtros e timestamp; ausência de dados vira pergunta, não número inventado.

## Skills e modelos

Carregar progressivamente skills de pesquisa, posicionamento, experimentação e analytics pelo registry. A skill é agnóstica; `ModelAdapter` resolve JSON/tool calling e visão se disponível. O default `muse-spark-1.3` é proposta sujeita ao benchmark; `max` somente se o profile autorizar.

## Open source recomendado

- [Matomo](https://github.com/matomo-org/matomo) + [Analytics API](https://matomo.org/guide/apis/analytics-api/): adapter/tool de métricas próprias, funil e atribuição, com filtros e exportação limitados.
- [Mautic](https://github.com/mautic/mautic): automação e segmentos por connector opcional; confirmar licença por módulo, isolamento de tenant e compatibilidade antes de incorporar.

Matomo é a primeira integração sugerida. Mautic deve ser uma conexão externa, nunca uma permissão implícita para disparar e-mail ou campanha.

## Aceite específico

- Hipótese, experimento, métrica, fonte, owner, janela e próximo passo são persistidos.
- O agente distingue observação, inferência e recomendação.
- Alteração de budget, audiência, copy publicada ou campanha exige approval.
- Falha parcial mantém o draft e permite retomar do checkpoint.
- O relatório aparece no UploadThing após confirmação e a tela de arquivos permanece somente leitura.
