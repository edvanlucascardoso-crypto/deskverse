> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** As salas prebuilt em GLB/Stem Script foram substituídas pelo grid abstrato de cards; capacidade e tiers continuam válidos via `PRODUCT_BASELINE.md`.
+
# SPRINT-03-05 — Room loader + bundles separados

## ROLE
Você é o agente responsável por esta sprint do Deskverse: execute-a até seus critérios de aceite e não assuma responsabilidade por outras sprints.

## EXECUÇÃO
Executada diretamente pelo agente de engenharia responsável, sem roteamento por modelo/fornecedor específico. Ajuste o rigor ao tamanho real do problema: trabalho rotineiro e bem especificado pede menos idas e vindas do que trabalho de arquitetura ou integração entre módulos. Se a primeira tentativa falhar, refaça uma vez com base nos testes/erros reais antes de reduzir escopo ou pedir escalonamento; registre qualquer escalonamento no relatório final.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- No rented GPU is required for this sprint.
- Prefer executing on the normal development PC after required GLBs/assets have been committed.
- Do not keep the GPU workstation running for work that does not need Blender/GPU.

## OBJECTIVE
Carregar somente a sala ativa no Deskverse Engine a partir do Stem scene entrypoint e os assets realmente necessários.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
3. `../00-meta/MODEL_POLICY.md`
4. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Room manifests mapeiam para `.stemscript`/scene entrypoint + asset bundle. Startup e Big Tech podem permanecer como manifests pendentes até a montagem pós-Fase 15.
- O loader usa o Deskverse Engine Player; não instancia cena Three.js/R3F no app React.
- Lazy load por roomTemplateId.
- Fallback seguro.
- Não preload Big Tech para usuário na Initial.
- Implementar o loader contra a sala Initial e contratos de bundle; não bloquear o loader pela ausência temporária dos bundles Startup/Big Tech.

## ALLOWED CHANGES
- packages/deskverse-engine/src/deskverse/rooms/**
- packages/office-bridge/src/rooms/**
- packages/office-rooms/runtime/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-03-02`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-03-05-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- RoomLoader
- bundle mapping
- loading state

## ACCEPTANCE / TESTS
- network/load test
- switch room test
- fallback

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
