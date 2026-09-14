> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** A integração Stem de autoria, navegação e animação foi removida; atores e gameplay foram reescopados na nova Fase 04.
+
# SPRINT-04-13 — Deskverse Game Project completo no Stem

## ROLE
Você é o agente responsável por consolidar a camada de game do Deskverse em um projeto autoral Stem completo e reabrível. Não mova responsabilidades SaaS para a engine.

## EXECUÇÃO
Execute diretamente, registre evidências e preserve os limites de ownership. Use ferramentas tipadas; não edite JSON de cena à mão.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**

## OBJECTIVE
Permitir que uma pessoa abra no Stem o `Deskverse Game Project`, modifique qualquer aspecto da camada de game e execute preview: salas/cenas, assets, atores, câmera, navegação, animações, interactions/triggers, Behaviors/Lambdas e settings.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/STEM_EDITOR_INTEGRATION_STRATEGY.md`
2. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
3. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
4. `../../engine/LOCAL_EDITOR.md`
5. `SPRINT-04-11-stem-commands-tool-bridge.md`
6. `SPRINT-04-12-migrate-initial-to-stem-authoring-project.md`

## REQUIREMENTS
- Criar um manifest/projeto autoral de nível superior, Deskverse-owned e fora de `vendor/`; salas são cenas desse projeto.
- Incluir a Initial migrada como primeira cena sem remontagem e permitir adicionar Startup/Big Tech depois sem quebrar bundles independentes.
- Catalogar assets, atores, Behaviors/Lambdas, navegação/NavMesh/waypoints, câmera, animações, interactions/triggers e settings suportados pelo Stem.
- Reutilizar runtime e editor nativos do Stem por facade/adapters; não criar engine, editor visual ou sistema de gameplay paralelo.
- Abrir, salvar, fechar, reabrir e executar preview por launcher documentado.
- Toda alteração automatizada usa a ponte `04-11`; arquivos autorais e runtime não são escritos manualmente.
- Exportar por `04-10`, validar contratos e carregar no Player.
- Manter auth, billing, dados multi-tenant, orchestration e painéis de produto no React/backend; o projeto pode consumir mocks/eventos via Office Bridge.

## ALLOWED CHANGES
- `game/authoring/**`
- `game/rooms/**/authoring/**`
- `packages/deskverse-engine/src/deskverse/**`
- `packages/deskverse-engine/src/authoring-bridge/**`
- `tooling/engine/authoring/**`
- `package.json`
- `docs/engine/**`

## FORBIDDEN CHANGES
- `vendor/stem-studio/**`
- segundo runtime/editor/sistema paralelo ao Stem
- business logic SaaS dentro da cena
- rebuild/redesign da Initial
- JSON autoral/runtime escrito manualmente

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisites: `SPRINT-04-03`, `SPRINT-04-05`, `SPRINT-04-06`, `SPRINT-04-07`, `SPRINT-04-08`, `SPRINT-04-09`, `SPRINT-04-12`.

## REQUIRED OUTPUTS
- `Deskverse Game Project` e manifest autoral versionados
- launcher open/save/preview
- catálogo das capacidades de game
- fixtures e relatório de round-trip Player

## ACCEPTANCE / TESTS
- projeto abre em clone/bootstrap limpo, salva, fecha e reabre sem perda
- humano altera objeto, luz/câmera, navegação, ator/animação, trigger e Behavior e vê o preview
- agente executa alterações equivalentes pela ponte tipada
- export -> validação -> Player preserva mudanças determinísticas
- eventos mock do Office Bridge dirigem agentes sem controle locomotor do jogador
- nenhum subsistema nativo é duplicado e nenhuma função SaaS fica presa à navegação 3D

## INTEGRATION DISCIPLINE
Lacuna nativa demonstrada exige IR/decisão antes de fallback Deskverse. Mudança compartilhada exige CCR.

## COMPLETION REPORT
Produza relatório canônico com arquivos, capacidades exercitadas, testes, IRs/CCRs, limitações e handoff.
