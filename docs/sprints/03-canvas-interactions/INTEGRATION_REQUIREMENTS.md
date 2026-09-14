# Requisitos de integração — Fase 03

## Limites preservados

- Busca, filtros, seleção, zoom e arranjo trabalham somente com fixtures em memória.
- A movimentação por arraste e por `Alt` + setas apenas reordena o canvas local.
- O painel contextual usa Drawer shadcn no mobile e painel lateral no desktop.

## Próximas integrações

| Fase | Necessidade | Decisão pendente |
| --- | --- | --- |
| 04 — Pessoas | Atividade e presença atualizam os cards | Definir feed de eventos e estados observáveis. |
| 06 — Plataforma | Persistir layout, preferências e seleção | Definir schema Prisma, migration e estratégia de sincronização. |
| 08 — Trabalho | Pendências e decisões humanas reais | Ligar atalhos aos estados de aprovação e espera. |
