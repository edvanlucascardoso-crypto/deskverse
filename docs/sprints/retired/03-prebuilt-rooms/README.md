> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** As salas prebuilt em GLB/Stem Script foram substituídas pelo grid abstrato de cards; capacidade e tiers continuam válidos via `PRODUCT_BASELINE.md`.
> Consulte `docs/sprints/00-meta/ARCHITECTURE_DECISIONS.md` para a arquitetura vigente.

# Fase 03 — Salas Prontas e Tiers no Deskverse Engine

Total: 4 sprints nesta fase ativa; a produção das salas Startup e Big Tech foi
movida para a Fase 16.

As salas são **montadas no Stem Studio/Deskverse Engine** a partir dos GLBs modulares da Fase 02 e registradas por Stem Script/manifest. Blender não é o level editor final.

Nota de planejamento: a montagem concreta das salas Startup e Big Tech agora
é `SPRINT-16-01` e `SPRINT-16-02`, ambas `PENDING_FUTURE_PHASE`. O contrato de
room, o loader e a sala Initial continuam avançando nesta fase sem depender
delas. Upgrade/downgrade foi movido para `SPRINT-16-03`, junto da produção
posterior das salas.

O gate de performance (G1) desta fase mede só a sala Initial e não depende
mais de Startup/Big Tech nem da Fase 16 — ver a nota de status em
`SPRINT-03-07`. A extensão do gate para as três salas é `SPRINT-16-04`, na
Fase 16, e não bloqueia esta fase nem as seguintes.

O sistema de atores/personagens que vai ocupar os slots desta sala (owner,
leader, employee, meeting, temporary) não é desta fase: ele já está planejado
logo em seguida, na Fase 04 — Actors e Mecânicas (`SPRINT-04-01` a
`SPRINT-04-09`), que depende só de `SPRINT-03-01` e pode começar assim que o
contrato de slots estiver aceito, em paralelo ao resto da Fase 03.

- `SPRINT-03-01` — Contrato OfficeTemplate + slots da sala Initial + Stem scene entrypoint
- `SPRINT-03-02` — Deskverse Engine/Stem — sala Initial pronta
- `SPRINT-03-05` — Stem room loader + bundles separados
- `SPRINT-03-07` — Gate de performance desktop/WebGPU da sala Initial (G1)
