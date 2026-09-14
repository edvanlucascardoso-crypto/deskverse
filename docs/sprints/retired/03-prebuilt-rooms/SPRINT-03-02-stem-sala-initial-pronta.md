> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** As salas prebuilt em GLB/Stem Script foram substituídas pelo grid abstrato de cards; capacidade e tiers continuam válidos via `PRODUCT_BASELINE.md`.
+
# SPRINT-03-02 — Deskverse Engine/Stem — sala Initial pronta

## ROLE
Você é o subagente Codex responsável exclusivamente por esta sprint do Deskverse. Execute a sprint até os critérios de aceite. Não assuma responsabilidade por outras sprints.

## EXECUTION MODEL
- **OpenAI model:** `gpt-6-astra`
- **Reasoning effort:** `high`
- **Why this tier:** Astra `high` é autorizado excepcionalmente apenas para montar esta sala com assets modulares usando `floor_plans`; não é o executor padrão das demais sprints.
- **Cost rule:** Esta é a única exceção autorizada para Astra: use `gpt-6-astra` com reasoning `high` somente para montar esta sala a partir de assets modulares e `floor_plans`. Não usar Sol/Terra `xhigh`; registrar evidências no relatório.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- No rented GPU is required for this sprint.
- Prefer executing on the normal development PC after required GLBs/assets have been committed.
- Do not keep the GPU workstation running for work that does not need Blender/GPU.

## MANDATORY USER-APPROVED CONCEPT GATE
Before ANY room assembly:
1. Read `00-user-visual-concepts/SPRINT-00-USER-CONCEPTS.md`.
2. Read the approved concept specification/references under `docs/art/concepts/`.
3. Verify `docs/art/concepts/CONCEPT_APPROVED.md` exists and contains `CONCEPT_APPROVED=true`.
4. If it does not exist, STOP and return `BLOCKED_BY_FOUNDATION_GATE`.
5. The user/product owner is the art-direction authority. Codex/Sol must not self-approve a new visual direction.
6. Reproduce the approved concept faithfully using the already-produced modular GLBs; adjust only what is technically necessary for gameplay/performance.
7. If the concept cannot be implemented within budget, create an Integration Requirement; do not silently redesign it.

## OBJECTIVE
Montar a sala Initial completa no Deskverse Engine/Stem Studio, usando assets modulares GLB e produzindo uma cena reproduzível por Stem Script com 6 employee slots.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/ARCHITECTURE_DECISIONS.md`
3. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
4. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
5. `../00-meta/MODEL_POLICY.md`
6. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Usar apenas assets essenciais já produzidos na Fase 02; não remodelar catálogo nesta sprint.
- A composição/level design final acontece no Stem Studio/Deskverse Engine, **não no Blender**.
- Produzir `game/rooms/initial/initial.stemscript` (ou entrypoint equivalente) como fonte declarativa/replayable da sala.
- Manter objetos interativos/endereçoáveis separados; não achatar a sala inteira em um único GLB.
- 6 employee slots exatos; owner/leader/meeting não consomem essa capacidade.
- Slots, interaction points, camera bounds e navigation metadata devem usar IDs estáveis e contratos Deskverse.
- Layout deve acompanhar o concept aprovado e ter circulação legível.
- Salvar snapshot/replay da cena e screenshots de validação.
- Não criar editor de sala para assinantes; o editor é ferramenta interna.
- Não depender de mobile para aprovação.

## ALLOWED CHANGES
- game/rooms/initial/**
- packages/office-rooms/scenes/initial/**
- packages/office-rooms/manifests/initial*
- docs/art/rooms/initial/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Substituir o Deskverse Engine por R3F ou por um runtime Three.js paralelo.
- Reintroduzir iframe como integração do office dentro do React.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-00-USER-CONCEPTS`, `SPRINT-01-04`, `SPRINT-01-06`, `SPRINT-02-08`, `SPRINT-03-01`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-03-02-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- `game/rooms/initial/initial.stemscript`
- room manifest/slot anchors
- replay/import bundle quando aplicável
- screenshots
- lista de assets usados

## ACCEPTANCE / TESTS
- Stem Script reconstrói a sala em projeto limpo
- room carrega no Deskverse Player
- 6 employee slots exatos e únicos
- sem overlap crítico e corredores navegáveis
- objetos interativos continuam endereçáveis
- câmera/camera bounds válidos
- budget desktop/WebGPU dentro do tier

## IMPLEMENTATION QUALITY BAR
- TypeScript strict quando aplicável.
- Sem `any` como fuga estrutural.
- Sem posições visuais hardcoded quando existe grid/slot/manifest/Stem Script.
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
