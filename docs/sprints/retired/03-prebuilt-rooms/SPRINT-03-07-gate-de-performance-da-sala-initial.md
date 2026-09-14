> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** As salas prebuilt em GLB/Stem Script foram substituídas pelo grid abstrato de cards; capacidade e tiers continuam válidos via `PRODUCT_BASELINE.md`.
+
# SPRINT-03-07 — Gate de performance desktop/WebGPU da sala Initial (G1)

## STATUS

Dispatchable agora. Esta sprint foi originalmente escrita para medir as três
salas (Initial, Startup, Big Tech) e por isso ficou presa esperando
`SPRINT-16-01`/`SPRINT-16-02` — que só rodam depois da Fase 15. Isso travava
o Gate G1 por um motivo que não é dela: `SUPERVISOR_PROMPT.md` já definia G1
como "Initial room, assets, camera and performance work on the required
desktop/WebGPU baseline", não como as três salas. Esta sprint agora mede
apenas a sala Initial, que já existe (`SPRINT-03-02`) e já tem loader
(`SPRINT-03-05`). Nada em Fases 04+ depende de `SPRINT-03-07` no manifesto —
só o rótulo do gate G1 dependia dela, e G1 pendente/parcial não bloqueia
Fases posteriores por si só (ver `GATE_MATRIX.md`).

A medição de Startup e Big Tech vira `SPRINT-16-04` (Fase 16), despachada
somente depois que `SPRINT-16-01`/`SPRINT-16-02` produzirem essas salas.

## ROLE
Você é o agente responsável por esta sprint do Deskverse: execute-a até seus critérios de aceite e não assuma responsabilidade por outras sprints.

## EXECUÇÃO
Executada diretamente pelo agente de engenharia responsável, sem roteamento por modelo/fornecedor específico. Ajuste o rigor ao tamanho real do problema: trabalho rotineiro e bem especificado pede menos idas e vindas do que trabalho de arquitetura ou integração entre módulos. Se a primeira tentativa falhar, refaça uma vez com base nos testes/erros reais antes de reduzir escopo ou pedir escalonamento; registre qualquer escalonamento no relatório final.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- Precisa de uma GPU real (não software rendering) para os números de FPS/frame time serem válidos; a montagem/validação da geometria em si não exige GPU dedicada.
- No rented GPU is required for this sprint.

## OBJECTIVE
Medir a sala Initial real (via `SPRINT-03-05`'s RoomLoader, não um harness paralelo) no Deskverse Engine/Player e travar um baseline de desktop/WebGPU para ela, fechando G1 no escopo em que ele já existe hoje.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
3. `../00-meta/MODEL_POLICY.md`
4. `../00-meta/GATE_MATRIX.md`
5. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Medir a sala Initial carregada pelo RoomLoader real (`createDeskverseOfficeEngineWithRoomLoader`), não uma cena de teste paralela.
- Registrar triangles/draw calls/materials/textures/tamanho de arquivo e FPS/frame time em GPU real.
- Comparar contra os budgets em `docs/art/ASSET_BUDGET.md`.
- Não "corrigir" assets fora do escopo; abrir IR para a sprint de asset responsável se algo estourar o budget.
- Registrar claramente o hardware/driver/navegador usados na medição (isso é o que faltou nas evidências anteriores da `SPRINT-03-02`, que rodaram em software rendering).

## ALLOWED CHANGES
- docs/perf/rooms/**
- tools/perf/rooms/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-01-06`, `SPRINT-02-07`, `SPRINT-03-02`, `SPRINT-03-05`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-03-07-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- Initial room benchmark report (hardware real, não SwiftShader/software)
- automated budget checks where possible
- Gate G1 result (escopo: sala Initial)
- `reports/gates/G1.md` evidence

## ACCEPTANCE / TESTS
- Initial benchmark em GPU física (desktop/WebGPU)
- mobile/touch smoke opcional e não bloqueante quando houver aparelho compatível
- no hidden preload (RoomLoader não carrega Startup/Big Tech antecipadamente)

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
