> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O pipeline Blender→GLB não se aplica mais; os assets legados estão arquivados em `archive/deskverse-3d-legacy-stem-era-2026-09-11.7z`.
> Consulte `docs/sprints/00-meta/ARCHITECTURE_DECISIONS.md` para a arquitetura vigente.

# Fase 02 — Pipeline e Modelagem de Assets

**Status: CONCLUÍDA (2026-09-10) — produção visual baseada nas referências
aprovadas em `concepts/`, com runtime canônico em `assets/3d/`. Todos os
Integration Requirements da fase foram fechados (resolvidos por evidência ou
adiados explicitamente para a Fase 04/16, que são os únicos consumidores
possíveis do que ainda falta); ver `docs/sprints/SPRINT_STATUS.md` e
`integration-requirements/SPRINT-02-*.json`.**

As referências visuais duráveis desta fase estão preservadas em `concepts/`,
incluindo renders, o kit de personagens e os planos de piso. Os GLBs canônicos
estão organizados em `assets/3d/` e as fontes editáveis `.blend` em
`tools/blender/sources/`. A presença desses arquivos não substitui os
registries, validadores, manifests runtime e testes exigidos pelos prompts.

Total: 8 sprints.

Use `00-meta/SPRINT_MANIFEST.json` como fonte de verdade para `depends_on`. Execute em paralelo apenas sprints com todos os hard prerequisites concluídos e sem ownership de arquivos sobreposto; o Supervisor integra depois.

- `SPRINT-02-01` — DeskverseAsset registry + GLB loader — **gpt-5.6-terra / high**
- `SPRINT-02-02` — Modelagem Blender — arquitetura e workstations essenciais — **gpt-5.6-luna / xhigh**
- `SPRINT-02-03` — Modelagem Blender — reunião e equipamento compartilhado — **gpt-5.6-luna / xhigh**
- `SPRINT-02-04` — Modelagem Blender — conforto e props essenciais — **gpt-5.6-luna / xhigh**
- `SPRINT-02-05` — Modelagem Blender — kit modular de personagem — **gpt-5.6-luna / xhigh**
- `SPRINT-02-06` — Animações essenciais do rig — **gpt-5.6-luna / xhigh**
- `SPRINT-02-07` — Otimização, compressão e validador de assets — **gpt-5.6-sol / high**
- `SPRINT-02-08` — Catálogo runtime dos assets essenciais — **gpt-5.6-luna / xhigh**
