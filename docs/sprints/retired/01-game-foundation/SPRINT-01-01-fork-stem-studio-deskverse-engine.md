> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** O Stem/Three.js/WebGPU foi substituído por uma interface 100% DOM.
+
# SPRINT-01-01 — Checkout isolado do Stem + facade Deskverse Engine

## ROLE
Você é o subagente Codex responsável exclusivamente por esta sprint do Deskverse. Execute a sprint até os critérios de aceite. Não assuma responsabilidade por outras sprints.

## EXECUTION MODEL
- **OpenAI model:** `gpt-5.6-sol`
- **Reasoning effort:** `high`
- **Why this tier:** Sol `high` é o padrão custo-eficiente para cirurgia estrutural no fork/runtime: leitura de arquitetura upstream, refatoração cuidadosa e integração de build. Astra não é autorizado nesta sprint.
- **Cost rule:** Não usar `xhigh` em Sol/Terra e não usar Astra nesta sprint. Faça a segunda tentativa no mesmo modelo com reasoning `high`; a exceção de Astra fica restrita às sprints 03-02, 16-01 e 16-02, na montagem de salas modulares com `floor_plans`, sempre em `high` e registrada no relatório.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- No rented GPU is required for this sprint.
- Prefer executing on the normal development PC after required GLBs/assets have been committed.
- Do not keep the GPU workstation running for work that does not need Blender/GPU.

## OBJECTIVE
Estabelecer o fork canônico do Stem Studio como checkout/snapshot limpo e isolado em `vendor/stem-studio/`, sem modificar seu código upstream, e criar em `packages/deskverse-engine/` o facade/overlay Deskverse que fornece editor de desenvolvimento e Player/runtime de produção diretamente consumíveis pelo monorepo.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/PRODUCT_BASELINE.md`
2. `../00-meta/ARCHITECTURE_DECISIONS.md`
3. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
4. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
5. `../00-meta/MODEL_POLICY.md`
6. Schemas relevantes em `../00-meta/contracts/`

## REQUIREMENTS
- Clonar o fork canônico (com fallback explícito para `Stem-Studio/Engine`) em um diretório de trabalho separado, fixar um commit upstream e importar o snapshot limpo em `vendor/stem-studio/`.
- Registrar URL do fork, commit upstream inicial, data, versão e a relação entre `vendor/stem-studio/` e `packages/deskverse-engine/` em `docs/engine/STEM_UPSTREAM.md`.
- Garantir que `vendor/stem-studio/` não receba patches Deskverse: toda adaptação deve viver no facade/overlay em `packages/deskverse-engine/` ou em tooling próprio.
- Criar um procedimento reproduzível de clone/import/sync que não dependa de um clone local fora do repositório para o build ou para o CI.
- Preservar histórico/proveniência, `LICENSE`, `THIRD-PARTY-NOTICES.md` e notices de assets.
- Renomear apenas a superfície de produto necessária para `Deskverse Engine`; não remover atribuições legais.
- Criar dois build targets: `deskverse-editor` e `deskverse-player`.
- `deskverse-player` deve excluir UI de editor, Copilot/BYOK, AI proxy server e multiplayer sidecar quando não forem necessários.
- Expor uma API/runtime embutível para o React; **não usar iframe**.
- Não adicionar React Three Fiber. O engine forkado é o runtime Three.js/WebGPU.
- Criar procedimento documentado de atualização upstream com pin, diff, testes e rollback.
- Registrar e pin/validar o toolchain exigido pelo commit upstream (especialmente Bun/Node; Go apenas quando o AI server upstream for testado), com comandos reproduzíveis em `docs/engine/STEM_UPSTREAM.md`. O `deskverse-player` não deve depender do Go/AI server em produção.
- Desktop/WebGPU é baseline obrigatório. Não criar POC mobile para revalidar a escolha do engine.

## ALLOWED CHANGES
- vendor/stem-studio/** (somente snapshot limpo do commit pinado)
- packages/deskverse-engine/** (somente facade, overlay, adapters e build configuration Deskverse)
- tooling/engine/**
- docs/engine/**
- docs/legal/**
- package.json
- workspace config necessário para incorporar/buildar o fork

## FORBIDDEN CHANGES
- Módulos pertencentes a outras sprints, salvo mocks/adapters locais dentro do escopo permitido.
- Shared contracts sem Contract Change Request.
- Substituir o Deskverse Engine por R3F ou por um runtime Three.js paralelo.
- Reintroduzir iframe como integração do office dentro do React.
- Mudanças de produto, preço, entitlement ou arquitetura não solicitadas.

## DEPENDENCIES / EXPECTED INPUTS
- No hard sprint prerequisite beyond the global contracts. It may run in parallel only when file ownership does not overlap with another active sprint.

## INTEGRATION DISCIPLINE
- Se outro módulo necessário ainda não existir, crie um mock/adapter local aderente ao contrato.
- Não corrija o outro módulo nesta sprint.
- Registre a lacuna em `integration-requirements/SPRINT-01-01-<slug>.json`.
- Se um contrato compartilhado parecer inadequado, gere um Contract Change Request; não altere unilateralmente.

## REQUIRED OUTPUTS
- fork canônico clonado/importado como snapshot limpo e documentado em `vendor/stem-studio/`
- facade/overlay Deskverse criado e pinado em `packages/deskverse-engine/`
- `docs/engine/STEM_UPSTREAM.md`
- `docs/engine/UPSTREAM_SYNC.md`
- `docs/legal/OSS_NOTICES.md` baseline
- build `deskverse-editor`
- build `deskverse-player`
- rota canônica do editor Deskverse em `/deskverse/editor`, preservando `/editor.html`, `/create/project/*` e `/stem-editor/*` como aliases compatíveis
- runtime/Player API inicial exportada

## ACCEPTANCE / TESTS
- clone/import reproduzível a partir da URL e do commit pinado
- `vendor/stem-studio/` permanece sem modificações locais após o build
- build/typecheck/test/lint do fork por meio do facade/overlay Deskverse
- editor abre uma cena mínima
- editor acessível pela rota `/deskverse/editor`
- Player abre a mesma cena sem carregar UI do editor
- bundle de Player não inicializa AI server/Copilot/Colyseus
- pin upstream, toolchain reproduzível e notices legais presentes
- nenhuma dependência de R3F introduzida
- nenhum iframe usado

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
