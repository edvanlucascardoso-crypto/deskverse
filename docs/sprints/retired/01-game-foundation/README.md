> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O Stem/Three.js/WebGPU foi substituído por uma interface 100% DOM.
> Consulte `docs/sprints/00-meta/ARCHITECTURE_DECISIONS.md` para a arquitetura vigente.

# Fase 01 — Fundação do Deskverse Engine

Total: 6 sprints.

A decisão de engine já está tomada: usar o fork pinado do Stem Studio como runtime do Deskverse. O checkout/snapshot limpo do Stem fica isolado em `vendor/stem-studio/`; `packages/deskverse-engine/` contém apenas o facade, os adapters e o overlay Deskverse. Não criar POC para decidir entre Stem/R3F e não introduzir um segundo runtime 3D.

- `SPRINT-01-01` — Checkout isolado do Stem + facade Deskverse Engine — **gpt-5.6-sol / high**
- `SPRINT-01-02` — Configurar Blender MCP + validação Codex — **gpt-5.6-luna / xhigh**
- `SPRINT-01-03` — Art Bible voxel-ish + orçamento visual para WebGPU — **gpt-5.6-luna / xhigh**
- `SPRINT-01-04` — Stem Player embutível + Office Bridge React — **gpt-5.6-sol / high**
- `SPRINT-01-05` — Contrato de coordenadas, grid, footprints e scene metadata — **gpt-5.6-sol / high**
- `SPRINT-01-06` — Câmera isométrica (projeção ortográfica) + pan/zoom/touch no Deskverse Engine — **gpt-5.6-terra / high**
