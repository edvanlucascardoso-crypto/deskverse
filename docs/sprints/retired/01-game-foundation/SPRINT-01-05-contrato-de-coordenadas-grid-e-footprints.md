> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O Stem/Three.js/WebGPU foi substituído por uma interface 100% DOM.
+
# SPRINT-01-05 — Contrato de coordenadas, grid e footprints

## ROLE
Você é o subagente Codex responsável exclusivamente por esta sprint do Deskverse. Execute a sprint até os critérios de aceite. Não assuma responsabilidade por outras sprints.

## EXECUTION MODEL
- **OpenAI model:** `gpt-5.6-sol`
- **Reasoning effort:** `high`
- **Why this tier:** Sistema ou integração complexa em que erros arquiteturais custariam retrabalho; Sol é justificado.
- **Cost rule:** não escale automaticamente. Faça uma segunda tentativa orientada por testes antes de aumentar esforço/tier. Registre qualquer escalonamento.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- No rented GPU is required for this sprint.
- Prefer executing on the normal development PC after required GLBs/assets have been committed.
- Do not keep the GPU workstation running for work that does not need Blender/GPU.

## OBJECTIVE
Definir a matemática estável de grid -> world position, occupancy, footprint e orientation usada por salas, móveis e actors.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/ARCHITECTURE_DECISIONS.md`
3. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
4. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
5. `../00-meta/MODEL_POLICY.md`
6. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Grid lógico 2D sobre mundo 3D.
- Nenhum sistema futuro deve hardcodar posições de tela.
- Stem Script/scene userData deve referenciar slots e anchors por IDs estáveis, não por seletores frágeis de hierarchy.
- Definir conversão explícita entre grid Deskverse e world coordinates do Deskverse Engine.
- Definir origem, unidade, eixos, rotações permitidas e footprints multi-célula.
- Criar funções puras e testes.

## ALLOWED CHANGES
- packages/office-grid/**
- packages/office-contracts/grid/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- No hard sprint prerequisite beyond the global contracts. It may run in parallel only when file ownership does not overlap with another active sprint.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-01-05-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- grid contract TS
- coordinate helpers
- footprint helpers
- tests

## ACCEPTANCE / TESTS
- roundtrip grid/world
- footprint collision cases
- rotation cases

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
