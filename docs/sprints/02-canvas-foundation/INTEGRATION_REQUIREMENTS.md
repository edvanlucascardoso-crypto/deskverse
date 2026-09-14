# Requisitos de integração — Fase 02

## Limites preservados

- Os cards, agrupamentos, contadores e modos de visualização são fixtures locais.
- Densidade, modo de visualização e tema são preferências somente em memória nesta fase.
- A superfície continua exclusivamente DOM; não há WebGL, engine 3D ou runtime legado.

## Próximas integrações

| Fase | Necessidade | Decisão pendente |
| --- | --- | --- |
| 03 — Interações | Seleção persistente, teclado e navegação espacial | Definir contrato de foco e atalhos do canvas. |
| 04 — Pessoas | Presença e estado real de pessoas/agentes | Conectar feed de atividade com controles de autorização. |
| 06 — Plataforma | Persistência de preferências e layout | Modelar schema Prisma e migration PostgreSQL. |
