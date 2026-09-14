> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O pipeline Blender→GLB não se aplica mais; os assets legados estão arquivados em `archive/deskverse-3d-legacy-stem-era-2026-09-11.7z`.
+
# SPRINT-02-05 — Modelagem Blender — kit modular de personagem

## ROLE
Você é o subagente Codex responsável exclusivamente por esta sprint do Deskverse. Execute a sprint até os critérios de aceite. Não assuma responsabilidade por outras sprints.

## EXECUTION MODEL
- **OpenAI model:** `gpt-5.6-luna`
- **Reasoning effort:** `xhigh`
- **Why this tier:** Luna xhigh é o executor padrão validado pelo projeto para produção visual iterativa via Blender MCP; escalar só com evidência de falha.
- **Cost rule:** não escale automaticamente. Faça uma segunda tentativa orientada por testes antes de aumentar esforço/tier. Registre qualquer escalonamento.


## MANDATORY USER-APPROVED CONCEPT GATE
Before ANY production Blender work:
1. Read `00-user-visual-concepts/SPRINT-00-USER-CONCEPTS.md`.
2. Read the approved concept specification/references under `docs/art/concepts/`.
3. Verify `docs/art/concepts/CONCEPT_APPROVED.md` exists and contains `CONCEPT_APPROVED=true`.
4. If it does not exist, STOP and return `BLOCKED_BY_FOUNDATION_GATE`.
5. The user/product owner is the art-direction authority. Codex/Luna must not self-approve a new visual direction.
6. Reproduce the approved concept faithfully in 3D while adapting only what is technically necessary for web performance.
7. If a concept cannot be implemented within the performance budget, create a Concept/Integration Requirement describing the problem and a minimal proposed change. Do not silently redesign it.

## EXECUTION ENVIRONMENT
- **REMOTE_GPU_REQUIRED**
- Run on the rented GPU workstation (Hetzner/Vast/etc.) with Blender + Blender MCP when the sprint uses Blender.
- Commit/export all durable `.blend`, `.glb`, manifests and approved screenshots before shutting the GPU host down.
- Do not place production SaaS secrets on the GPU workstation.

## OBJECTIVE
Criar o kit modular de personagem voxel-ish compartilhado por agentes e humanos futuros.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
3. `../00-meta/MODEL_POLICY.md`
4. Schemas relevantes em `../00-meta/contracts/`


## DESKVERSE ENGINE / STEM RULES
- Blender produz assets modulares GLB; a montagem final de salas acontece no Deskverse Engine/Stem Studio.
- Validar o asset no loader real do Deskverse Engine antes de concluir.
- Não criar loader, material system ou scene runtime paralelo em R3F.
- Preserve IDs/metadata necessários a Stem Script, interaction points, footprints e batching/instancing.

## REQUIREMENTS
- Modelar IDs 41–56 do inventário mestre.
- Um rig compartilhado.
- Partes modulares precisam alinhar sem offsets manuais por combinação.
- Materiais com variação de cor configurável quando possível.
- Não criar dezenas de roupas.

## ALLOWED CHANGES
- assets/3d/characters/**
- tools/blender/sources/characters/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-00-USER-CONCEPTS`, `SPRINT-01-02`, `SPRINT-01-03`, `SPRINT-02-01`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-02-05-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- rig base
- partes 41–56
- GLB modular
- appearance manifest

## ACCEPTANCE / TESTS
- montar pelo menos 6 combinações sem clipping grave
- escala coerente com móveis
- reimport

## IMPLEMENTATION QUALITY BAR
- TypeScript strict quando aplicável.
- Sem `any` como fuga estrutural.
- Sem posições visuais hardcoded quando existe grid/slot/manifest.
- Sem secrets em código/logs/prompts.
- Tenant boundary no servidor para qualquer dado multi-tenant.
- Falhas externas devem ser explícitas e recuperáveis.
- Não adicionar dependências grandes sem justificativa.
- Documentar decisões irreversíveis.
- Executar build/lint/tests relevantes antes de concluir.

## COMPLETION REPORT
Ao final, produza relatório com:
1. `status`: COMPLETE | COMPLETE_WITH_INTEGRATION_REQUIREMENTS | BLOCKED_BY_FOUNDATION_GATE | FAILED_ACCEPTANCE
2. arquivos criados/alterados;
3. testes executados e resultados;
4. Integration Requirements criados;
5. Contract Change Requests criados;
6. limitações conhecidas;
7. modelo/effort realmente usados e qualquer escalonamento;
8. próximos pontos que o Supervisor deve conectar.


## Master essential asset inventory

The following is intentionally complete for MVP but intentionally NOT a decorative catalog. Do not add random props.

### A. Room shell / architecture
1. `floor_tile_primary` — primary neutral floor module/material.
2. `floor_tile_secondary` — second floor treatment for meeting/leadership zoning.
3. `wall_straight` — simple wall module.
4. `wall_corner` — internal/external corner-compatible wall module.
5. `door_basic` — office doorway/door module.
6. `window_basic` — simple non-reflective window module.
7. `room_divider` — low divider for visual zoning without blocking the whole room.

### B. Employee workstation
8. `desk_employee` — standard employee desk.
9. `chair_employee` — standard desk chair.
10. `monitor_single` — single monitor.
11. `keyboard_basic`.
12. `mouse_basic`.
13. `computer_tower_basic` — optional visual tower for desktop setups.
14. `laptop_basic` — alternative workstation device.
15. `headset_basic` — useful for SDR/support/editor role dressing.
16. `desk_lamp_basic` — emissive look may be faked; no dynamic light required.

### C. Leadership / owner
17. `desk_leader` — visually distinct but same lightweight language.
18. `chair_leader`.
19. `desk_owner`.
20. `chair_owner`.

### D. Meetings / collaboration
21. `meeting_table_small` — small room/initial office.
22. `meeting_table_large` — Startup/Big Tech.
23. `chair_meeting` — stack/reuse-friendly.
24. `whiteboard_basic`.
25. `meeting_display` — wall/stand display, dark simple material.

### E. Shared office equipment
26. `printer_basic`.
27. `storage_cabinet`.
28. `filing_cabinet`.
29. `bookshelf_basic`.
30. `trash_bin`.
31. `water_cooler`.
32. `coffee_machine`.

### F. Essential comfort / identity props
33. `sofa_basic`.
34. `armchair_basic`.
35. `coffee_table_basic`.
36. `plant_small`.
37. `plant_tall`.
38. `rug_basic`.
39. `wall_clock`.
40. `wall_frame_generic` — generic frame/signage surface; no copyrighted art.

### G. Modular character kit
41. `character_base_rig` — one shared skeleton and base body proportions.
42. `head_base`.
43. `hair_short_a`.
44. `hair_short_b`.
45. `hair_long_a`.
46. `hair_long_b`.
47. `top_tshirt`.
48. `top_shirt`.
49. `top_blazer`.
50. `bottom_pants_a`.
51. `bottom_pants_b`.
52. `bottom_skirt_or_alt`.
53. `shoes_basic_a`.
54. `shoes_basic_b`.
55. `accessory_glasses`.
56. `accessory_headset`.

### H. Required animation clips on shared rig
57. `idle`.
58. `walk`.
59. `sit`.
60. `talk`.
61. `work_keyboard`.

### Explicitly NOT essential for MVP
Do not model decorative food, dozens of plants, bathrooms, kitchen sets, vehicles, outdoor scenery, pets, weapons, complex appliances, multiple monitor brands, dozens of clothing pieces, reflective glass variants, animated screens, realistic cables, tiny desk clutter or physics props.
