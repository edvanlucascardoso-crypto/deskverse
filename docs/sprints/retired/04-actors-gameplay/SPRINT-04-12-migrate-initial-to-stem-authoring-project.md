> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** A integração Stem de autoria, navegação e animação foi removida; atores e gameplay foram reescopados na nova Fase 04.
+
# SPRINT-04-12 — Migrar Initial para projeto autoral Stem reabrível

## ROLE
Você é o agente responsável por esta sprint do Deskverse: execute-a até seus critérios de aceite e não assuma responsabilidade por outras sprints.

## EXECUÇÃO
Executada diretamente pelo agente de engenharia responsável, sem roteamento por modelo/fornecedor específico. Esta é uma migração mecânica; não assuma papel de level designer.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- GPU real é usada somente se necessária para repetir o benchmark visual já aceito.

## OBJECTIVE
Transformar a composição da sala Initial já montada e aprovada em um projeto Stem versionado e reabrível, sem remontar, redesenhar ou remodelar a sala.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/STEM_EDITOR_INTEGRATION_STRATEGY.md`
2. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
3. `../00-meta/GATE_MATRIX.md`
4. `../../engine/LOCAL_EDITOR.md`
5. `../../sprints/completed/03-prebuilt-rooms/SPRINT-03-02-stem-sala-initial-pronta.md`
6. `../../../reports/gates/G1.md`

## REQUIREMENTS
- Usar `game/rooms/initial/initial.replay.json`, manifest/OfficeTemplate e settings de composição ainda presentes em `scene.ts` como entrada autorizada.
- Recriar mecanicamente a cena chamando a ponte `04-11`; não transcrever JSON manualmente.
- Definir um workspace/catalog Deskverse com um projeto Stem por sala, fora de `vendor/`.
- Rastrear o `.stemscript.json` autoral e referências duráveis necessárias; replay/OfficeTemplate permanecem saída runtime gerada.
- Fornecer comando para abrir diretamente a Initial no editor após bootstrap.
- Preservar IDs, asset mappings, hierarquia, transforms, luzes, enquadramento, slots e circulação.
- Não migrar para o arquivo de autoria responsabilidades runtime como GLB loader, material adapter, instancing/batching, budgets ou validação.
- Não alterar o conceito visual aprovado nem reduzir critérios G1.

## ALLOWED CHANGES
- `game/authoring/**`
- `game/rooms/initial/authoring/**`
- `game/rooms/initial/**` somente outputs gerados/documentação
- `packages/office-rooms/scenes/initial/**` somente separação de composição gerada sem perda de runtime
- `tooling/engine/authoring/**`
- `package.json`
- `docs/engine/**`

## FORBIDDEN CHANGES
- `vendor/stem-studio/**`
- `assets/3d/**` e fontes Blender
- redesign/remodelagem da Initial
- prompts/relatórios arquivados da Fase 03
- remoção especulativa de código runtime

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites: `SPRINT-03-02`, `SPRINT-03-05`, `SPRINT-04-00`, `SPRINT-04-10`, `SPRINT-04-11`.

## REQUIRED OUTPUTS
- projeto Initial `.stemscript.json` reabrível e versionado
- manifest/launcher do workspace de autoria
- replay/OfficeTemplate regenerados
- relatório de paridade semântica e visual

## ACCEPTANCE / TESTS
- clone limpo -> bootstrap -> open Initial funciona por comando documentado
- salvar/fechar/reabrir preserva a cena
- export -> tradutor regenera replay/OfficeTemplate sem edição manual
- IDs, transforms, luzes, slots, camera bounds e asset mappings mantêm paridade
- Player, AJV, `validateAssembly`, budgets e screenshot comparativo passam
- diferença visual relevante falha a sprint e G1 histórico não é rebaixado silenciosamente

## INTEGRATION DISCIPLINE
Qualquer diferença não mecânica exige decisão do Product Owner; não a corrija como redesign silencioso.

## COMPLETION REPORT
Produza o relatório canônico com status, arquivos, testes, IRs/CCRs, limitações, execução utilizada e handoff ao Supervisor.
