> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O pipeline Blender→GLB não se aplica mais; os assets legados estão arquivados em `archive/deskverse-3d-legacy-stem-era-2026-09-11.7z`.
+
# SPRINT-02-07 — Otimização, compressão e validador de assets

## ROLE
Você é o subagente Codex responsável exclusivamente por esta sprint do Deskverse. Execute a sprint até os critérios de aceite. Não assuma responsabilidade por outras sprints.

## EXECUTION MODEL
- **OpenAI model:** `gpt-5.6-sol`
- **Reasoning effort:** `high`
- **Why this tier:** Sistema ou integração complexa em que erros arquiteturais custariam retrabalho; Sol é justificado.
- **Cost rule:** não escale automaticamente. Faça uma segunda tentativa orientada por testes antes de aumentar esforço/tier. Registre qualquer escalonamento.

## EXECUTION ENVIRONMENT
- **REMOTE_GPU_PREFERRED_LOCAL_ALLOWED**
- This sprint can run without permanent GPU access if the exported GLBs are already available, but running it on the remote Blender workstation may simplify validation.
- Do not keep the GPU host running merely for this sprint if local/headless validation is sufficient.

## OBJECTIVE
Criar pipeline repetível que detecta assets pesados/incompatíveis antes de entrarem no game.

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
- Validar triangles, materials, textures, dimensions, animations e file size.
- Adicionar compressão/otimização glTF apropriada sem degradar visual de forma perceptível.
- Gerar relatório por asset.
- Falhar CI quando ultrapassar limites hard definidos pela Art Bible.

## ALLOWED CHANGES
- tools/assets/**
- scripts/assets/**
- docs/perf/assets/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-02-02`, `SPRINT-02-03`, `SPRINT-02-04`, `SPRINT-02-05`, `SPRINT-02-06`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-02-07-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- asset validator CLI
- optimization script
- CI command
- reports

## ACCEPTANCE / TESTS
- run on all essential GLBs
- invalid sample fails
- optimized GLB reimports

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
