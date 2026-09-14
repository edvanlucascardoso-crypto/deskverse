> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O Stem/Three.js/WebGPU foi substituído por uma interface 100% DOM.
+
# SPRINT-01-02 — Validação Blender CLI + integração Codex

## ROLE
Você é o subagente Codex responsável exclusivamente por esta sprint do Deskverse. Execute a sprint até os critérios de aceite. Não assuma responsabilidade por outras sprints.

## EXECUTION MODEL
- **OpenAI model:** `gpt-5.6-luna`
- **Reasoning effort:** `xhigh`
- **Why this tier:** Luna xhigh é o executor padrão para revisar evidência visual e fixtures; o rerun usa Blender CLI local e não depende de MCP.
- **Cost rule:** não escale automaticamente. Faça uma segunda tentativa orientada por testes antes de aumentar esforço/tier. Registre qualquer escalonamento.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- Use the locally installed Blender through `blender --background`/CLI. MCP is optional and is not an acceptance prerequisite.
- The production modeling workstation is out of scope for this rerun; reuse the already committed `.blend`, `.glb`, manifests and screenshots.
- Do not place production SaaS secrets in Blender fixtures or command lines.

## OBJECTIVE
Configurar e provar o loop Codex -> Blender CLI -> inspeção -> alteração -> screenshot -> export GLB, consumindo os assets já produzidos.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/ARCHITECTURE_DECISIONS.md`
3. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
4. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
5. `../00-meta/MODEL_POLICY.md`
6. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Não modelar o catálogo ainda.
- Reutilizar a cena de teste simples já produzida; criar uma nova somente se o fixture existente estiver ausente ou inválido.
- Validar leitura da scene tree, transformação de objeto, screenshot e export GLB usando scripts CLI idempotentes.
- Documentar comandos/configuração reproduzíveis para Windows/Linux headless; MCP pode ser integração futura, mas não pode bloquear a sprint.
- O destino runtime dos GLBs é o facade Deskverse Engine sobre o checkout limpo em `vendor/stem-studio/`; não criar loader R3F paralelo nem alterar o checkout Stem para acomodar o teste.
- Luna xhigh deve avaliar o screenshot/render de validação antes de concluir.

## ALLOWED CHANGES
- tools/blender/**
- docs/dev/blender-mcp/** (incluindo o procedimento CLI)
- assets/_mcp_test/**

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- No hard sprint prerequisite beyond the global contracts. It may run in parallel only when file ownership does not overlap with another active sprint.

## REQUIRED OUTPUTS
- configuração CLI documentada
- arquivo Blender de teste
- GLB de teste
- relatório de validação

## ACCEPTANCE / TESTS
- Blender CLI abre a cena
- script headless lê e altera objeto
- screenshot capturado
- GLB reimporta sem erro
- GLB também importa no Deskverse Engine/Stem sem conversão proprietária e sem patch local em `vendor/stem-studio/`

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-01-02-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## IMPLEMENTATION QUALITY BAR
- TypeScript strict quando aplicável.
- Sem `any` como fuga estrutural.
- Sem posições visuais hardcoded quando existe grid/slot/manifest.
- Sem secrets em código/logs/prompts.
- Tenant boundary no servidor para qualquer dado multi-tenant.
- Falhas externas devem ser explícitas e recuperáveis.
- Não adicionar dependências grandes sem justificativa.
- Documentar decisões irreversíveis.

## COMPLETION REPORT
Ao final, produza relatório com:
1. `status`: COMPLETE | COMPLETE_WITH_INTEGRATION_REQUIREMENTS | BLOCKED_BY_FOUNDATION_GATE | FAILED_ACCEPTANCE
2. arquivos criados/alterados;
3. comandos CLI executados e resultados;
4. Integration Requirements criados;
5. Contract Change Requests criados;
6. limitações conhecidas;
7. modelo/effort realmente usados e qualquer escalonamento;
8. próximos pontos que o Supervisor deve conectar.
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
