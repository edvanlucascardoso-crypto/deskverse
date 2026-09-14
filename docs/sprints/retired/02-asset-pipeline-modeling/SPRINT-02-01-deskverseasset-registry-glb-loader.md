> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O pipeline Blender→GLB não se aplica mais; os assets legados estão arquivados em `archive/deskverse-3d-legacy-stem-era-2026-09-11.7z`.
+
# SPRINT-02-01 — DeskverseAsset registry + GLB loader

## ROLE
Você é o subagente Codex responsável exclusivamente por esta sprint do Deskverse. Execute a sprint até os critérios de aceite. Não assuma responsabilidade por outras sprints.

## EXECUTION MODEL
- **OpenAI model:** `gpt-5.6-terra`
- **Reasoning effort:** `high`
- **Why this tier:** Complexidade intermediária com integração moderada; Terra oferece melhor equilíbrio custo/capacidade.
- **Cost rule:** não escale automaticamente. Faça uma segunda tentativa orientada por testes antes de aumentar esforço/tier. Registre qualquer escalonamento.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- No rented GPU is required for this sprint.
- Prefer executing on the normal development PC after required GLBs/assets have been committed.
- Do not keep the GPU workstation running for work that does not need Blender/GPU.

## OBJECTIVE
Criar o formato interno de assets e pipeline runtime GLB desacoplado do Blender.

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
- Usar/estender deskverse-asset schema sem quebrá-lo unilateralmente.
- Loader deve suportar cache, preload e falha amigável.
- Footprint e interaction points são metadata; GLB não é fonte única da lógica.
- Não incluir catálogo final.

## ALLOWED CHANGES
- packages/office-assets/**
- packages/deskverse-engine/src/deskverse/assets/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-01-01`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-02-01-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- asset registry
- GLB loader
- cache/preload adapter
- sample manifest

## ACCEPTANCE / TESTS
- load success
- missing asset fallback
- duplicate load cache

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
