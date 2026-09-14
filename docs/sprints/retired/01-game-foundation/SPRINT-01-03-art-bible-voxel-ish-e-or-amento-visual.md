> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O Stem/Three.js/WebGPU foi substituído por uma interface 100% DOM.
+
# SPRINT-01-03 — Art Bible voxel-ish + orçamento visual para WebGPU

## ROLE
Você é o subagente Codex responsável exclusivamente por esta sprint do Deskverse. Execute a sprint até os critérios de aceite. Não assuma responsabilidade por outras sprints.

## EXECUTION MODEL
- **OpenAI model:** `gpt-5.6-luna`
- **Reasoning effort:** `xhigh`
- **Why this tier:** Luna xhigh é o executor padrão do projeto para iteração visual via Blender MCP e consegue validar a Art Bible produzindo objetos de prova.
- **Cost rule:** não escale automaticamente. Faça uma segunda tentativa orientada por testes antes de aumentar esforço/tier. Registre qualquer escalonamento.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- No rented GPU is required for this sprint.
- Prefer executing on the normal development PC after required GLBs/assets have been committed.
- Do not keep the GPU workstation running for work that does not need Blender/GPU.

## OBJECTIVE
Definir uma linguagem visual 3D própria, leve e reproduzível pelo Blender MCP.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/ARCHITECTURE_DECISIONS.md`
3. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
4. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
5. `../00-meta/MODEL_POLICY.md`
6. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Voxel-ish/low-poly, não fotorealista.
- Materiais simples, roughness alta, metalness quase sempre zero.
- Sem reflexos avançados, ray tracing, SSS, displacement ou transparência desnecessária.
- Preferir cor/material simples; quando textura for necessária, deve ser criada no próprio Blender via Luna xhigh e ser pequena.
- Definir escala, grid, bevel, paleta neutra e limites de complexidade.
- Orçamentos devem considerar o Deskverse Engine/WebGPU e batching/instancing disponíveis no fork.
- Mobile é alvo de compatibilidade, mas não gate de aprovação do visual.

## ALLOWED CHANGES
- docs/art/**
- tools/blender/materials/**
- assets/_style_test/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites (all must be COMPLETE or accepted by the Supervisor): `SPRINT-00-USER-CONCEPTS`, `SPRINT-01-02`.
- Adapters/mocks are for non-hard integration edges only; they do not waive these prerequisites.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-01-03-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- 3D_ART_BIBLE.md
- asset budget table
- naming conventions
- sample material library

## ACCEPTANCE / TESTS
- Luna xhigh cria 3 objetos de prova coerentes via Blender MCP
- GLBs pequenos
- visual consistente em screenshot

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
