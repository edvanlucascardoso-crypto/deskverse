# Requisitos de integração — Fase 01

## Limites preservados

- O workspace usa somente fixtures locais. Persistência, autenticação e colaboração pertencem às fases de plataforma.
- As ações exibidas são demonstrativas e não executam agentes, publicações ou integrações externas.
- Cards e painel contextual estabelecem a superfície DOM que as fases de canvas e atividade podem estender.

## Próximas integrações

| Fase | Necessidade | Decisão pendente |
| --- | --- | --- |
| 02 — Canvas | Reflow espacial e relações entre cards | Definir modelo de layout persistível. |
| 04 — Pessoas | Dados reais de presença e atividade | Definir fonte de eventos e permissões. |
| 06 — Plataforma | Autenticação e workspace remoto | Implementar Better Auth, Prisma e PostgreSQL com migrations. |
