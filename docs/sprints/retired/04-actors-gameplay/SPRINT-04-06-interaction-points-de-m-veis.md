> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** A integração Stem de autoria, navegação e animação foi removida; atores e gameplay foram reescopados na nova Fase 04.
+
# SPRINT-04-06 — Stem interactions e triggers

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
Definir e consumir interaction points como work/sit/meeting sem coordenadas arbitrárias no código.

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
- Interaction point pertence ao asset/slot metadata.
- Permitir transform por room placement.
- Validar accessibility do point contra walkable grid.
- Criar/resolver interaction points, reservas e triggers pelo sistema nativo do Stem e pela ponte tipada.
- Interações servem à simulação autônoma de atores; nenhuma função SaaS pode depender de caminhar até um objeto.

## ALLOWED CHANGES
- packages/office-interactions/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-02-08`, `SPRINT-03-01`, `SPRINT-04-00`, `SPRINT-04-04`, `SPRINT-04-11`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-04-06-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- interaction point resolver
- metadata examples
- tests

## ACCEPTANCE / TESTS
- rotated furniture
- invalid point rejected
- work/sit resolve
- criação/edição por comando nativo e trigger executado no Stem
- nenhuma interação é requisito para abrir função SaaS

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
