> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O Stem/Three.js/WebGPU foi substituído por uma interface 100% DOM.
+
# SPRINT-01-04 — Stem Player embutível + Office Bridge React

## ROLE
Você é o subagente Codex responsável exclusivamente por esta sprint do Deskverse. Execute a sprint até os critérios de aceite. Não assuma responsabilidade por outras sprints.

## EXECUTION MODEL
- **OpenAI model:** `gpt-5.6-sol`
- **Reasoning effort:** `high`
- **Why this tier:** Integração arquitetural sensível entre o facade/overlay Deskverse sobre o runtime Stem isolado e o shell Next.js/React, com ownership de lifecycle e eventos.
- **Cost rule:** não escale automaticamente. Faça uma segunda tentativa orientada por testes antes de aumentar esforço/tier. Registre qualquer escalonamento.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- No rented GPU is required for this sprint.
- Prefer executing on the normal development PC after required GLBs/assets have been committed.
- Do not keep the GPU workstation running for work that does not need Blender/GPU.

## OBJECTIVE
Criar o boundary de integração `React/Next.js <-> Office Bridge <-> Deskverse Engine Player`, montando o runtime diretamente na aplicação e mantendo o SaaS como fonte de verdade.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/ARCHITECTURE_DECISIONS.md`
3. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
4. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
5. `../00-meta/MODEL_POLICY.md`
6. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Consumir o Player pelo facade `packages/deskverse-engine/`, sem importar diretamente módulos de editor ou alterar `vendor/stem-studio/`.
- Criar `packages/office-bridge/` com API TypeScript pequena, estável e testável.
- Expor `DeskverseOfficePlayer`/adapter equivalente consumível pelo app React sem iframe.
- Evitar uma segunda cópia/runtime de React no bundle: deduplicar `react`/`react-dom` e tratar a camada embutível como peer/boundary apropriado.
- Não montar o router/UI do editor Stem dentro do Next.js; extrair/reutilizar apenas o Player/runtime necessário.
- React envia estado visual/comandos ao engine (`loadRoom`, `setActorState`, `selectActor`, `focusActor`, etc.).
- Engine emite eventos semânticos (`actorSelected`, `interactionTriggered`, `roomReady`, `engineError`) de volta ao React.
- O engine nunca acessa Prisma, billing, auth, OpenRouter ou regras de negócio diretamente.
- Lifecycle mount/unmount deve destruir renderer, listeners, timers e recursos de cena corretamente.
- Lazy-load do Player no app.
- Criar cena fixture mínima via Stem Script para teste de integração.
- Não implementar UI SaaS dentro do engine.
- Não criar POC separada; este é o caminho de produção.

## ALLOWED CHANGES
- packages/office-bridge/**
- packages/deskverse-engine/** (facade/overlay somente; não modificar `vendor/stem-studio/`)
- apps/web/src/features/office/player/**
- apps/web/src/features/office/bridge/**
- tests/engine-react-integration/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Substituir o Deskverse Engine por R3F ou por um runtime Three.js paralelo.
- Reintroduzir iframe como integração do office dentro do React.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-01-01`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-01-04-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- `DeskverseOfficePlayer`/adapter equivalente
- `OfficeBridge` typed API
- typed engine events/commands
- fixture `.stemscript`
- lifecycle tests
- integração Next.js mínima em rota/dev harness

## ACCEPTANCE / TESTS
- Player monta diretamente dentro do React/Next.js
- sem iframe
- sem R3F
- comando React altera a cena
- click/seleção no engine chega ao React
- mount/unmount repetido sem listeners/render loops órfãos evidentes
- desktop WebGPU smoke test
- ausência de suporte mobile não bloqueia aceite

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
