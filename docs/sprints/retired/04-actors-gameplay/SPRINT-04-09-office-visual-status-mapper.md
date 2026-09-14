> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** A integração Stem de autoria, navegação e animação foi removida; atores e gameplay foram reescopados na nova Fase 04.
+
# SPRINT-04-09 — Office visual status mapper

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
Mapear status operacional para comportamento visual: IDLE, PLANNING, WORKING, DELEGATING, WAITING_AGENT, WAITING_USER, REVIEWING, ERROR, DONE.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
3. `../00-meta/MODEL_POLICY.md`
4. Schemas relevantes em `../00-meta/contracts/`


## DESKVERSE ENGINE / STEM RULES
- Gameplay visual roda no Deskverse Engine; React não executa frame loop de personagem.
- Preferir Stem Behaviors para lógica por objeto e Lambdas/ECS quando houver ganho claro em trabalho batched.
- `packages/office-*` pode conter contratos/algoritmos puros, mas execução visual/Three.js fica encapsulada no engine forkado.
- O backend/SaaS é a fonte de verdade operacional; o engine representa visualmente esse estado.
- Comunicação com React/servidor ocorre pelo Office Bridge, nunca por acesso direto a Prisma/auth/billing.

## REQUIREMENTS
- Mapeamento declarativo.
- Não mostrar cada call de modelo/tool.
- WAITING_USER deve ter indicação visual discreta.
- ERROR não deve dominar a cena.
- Mapear somente estado operacional recebido pelo Office Bridge para capacidades nativas do Stem; a cena não inventa trabalho, destino ou estado de negócio.
- Seleção/click pode abrir HUD contextual, mas não dirigir locomoção nem esconder função do produto atrás da cena.

## ALLOWED CHANGES
- packages/deskverse-engine/src/deskverse/status/**
- packages/office-bridge/src/status/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-04-00`, `SPRINT-04-01`, `SPRINT-04-03`, `SPRINT-04-11`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-04-09-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- status mapper
- visual indicator layer
- fixtures

## ACCEPTANCE / TESTS
- all statuses map
- unknown fallback
- no business logic in mapper

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
