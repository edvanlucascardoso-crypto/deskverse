> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** As salas prebuilt em GLB/Stem Script foram substituídas pelo grid abstrato de cards; capacidade e tiers continuam válidos via `PRODUCT_BASELINE.md`.
+
# SPRINT-03-01 — Contrato OfficeTemplate + slots

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
Definir o contrato data-driven da sala `Initial`, com slots, capacity, navigation
grid, camera bounds e **Stem scene entrypoint**, mantendo o tipo extensível para
as salas que serão produzidas posteriormente na Fase 16.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
3. `../00-meta/MODEL_POLICY.md`
4. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Slot types: OWNER, LEADER, EMPLOYEE, MEETING, TEMPORARY.
- Employee capacity não inclui owner/leader/meeting.
- Room template nunca conhece IDs específicos de agentes.
- Baseline desta sprint: Initial com 6 employee slots.
- O tipo pode preservar os tiers comerciais Startup (12) e Big Tech (24) para
  compatibilidade contratual, mas esta sprint não cria nem valida fixtures ou
  cenas dessas salas.
- Os manifests e a montagem concretos de Startup e Big Tech pertencem,
  respectivamente, às `SPRINT-16-01` e `SPRINT-16-02`.
- O template Initial referencia um `stemScriptPath`/scene entrypoint e um bundle
  de assets; não referencia um GLB monolítico da sala.
- Scene object IDs usados por slots/interactions devem ser estáveis entre replay/imports.

## ALLOWED CHANGES
- packages/office-contracts/room/**
- packages/office-rooms/manifests/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-01-05`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-03-01-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- OfficeTemplate TS types
- slot schema extension
- Initial fixture manifest

## ACCEPTANCE / TESTS
- schema validation da Initial
- capacity invariants da Initial
- slot uniqueness da Initial

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
