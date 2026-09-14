# SPRINT-15-18 — APOSENTADA — Controle de HumanActor no escritório

> **Status: RETIRED / NON-EXECUTABLE (2026-09-10).** A decisão de produto
> camera-only tornou locomoção de jogador incompatível com o Deskverse. Este
> arquivo é preservado apenas como registro histórico, foi retirado do
> manifesto executável e não deve ser despachado. Presença humana futura está
> reescopada em `SPRINT-15-17` como co-observação e contexto no HUD.

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
Permitir futuramente que humanos conectados controlem seu Actor usando o mesmo navigation/movement system do Deskverse Engine, com input chegando pelo Office Bridge.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
3. `../00-meta/MODEL_POLICY.md`
4. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Do not duplicate Agent movement code.
- Permission to enter office/workspace.
- Remote interpolation adapter separated from local controls.

## ALLOWED CHANGES
- packages/deskverse-engine/src/deskverse/human-player/**
- packages/office-bridge/src/human-player/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-04-01`, `SPRINT-15-17`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-15-18-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- HumanActor controller
- input abstraction
- presence adapter

## ACCEPTANCE / TESTS
- local movement
- remote fixture
- office bounds

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
