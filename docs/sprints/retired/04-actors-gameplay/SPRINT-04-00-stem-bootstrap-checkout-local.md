> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** A integração Stem de autoria, navegação e animação foi removida; atores e gameplay foram reescopados na nova Fase 04.
+
# SPRINT-04-00 — Bootstrap reproduzível do checkout local do Stem

## ROLE
Você é o agente responsável por esta sprint do Deskverse: execute-a até seus critérios de aceite e não assuma responsabilidade por outras sprints.

## EXECUÇÃO
Executada diretamente pelo agente de engenharia responsável, sem roteamento por modelo/fornecedor específico. Ajuste o rigor ao tamanho real do problema e registre escalonamentos no relatório final.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- Nenhuma GPU alugada é necessária.

## OBJECTIVE
Retirar `vendor/stem-studio/` do controle de versão do produto e materializar o mesmo caminho local, de forma idempotente e verificável, a partir do fork/commit pinado.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/STEM_EDITOR_INTEGRATION_STRATEGY.md`
2. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
3. `../00-meta/ARCHITECTURE_DECISIONS.md`
4. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
5. `../../engine/STEM_UPSTREAM.md`

## REQUIREMENTS
- Criar comando de bootstrap canônico no tooling Deskverse, nunca dentro de `vendor/`.
- Usar URL e commit de `packages/deskverse-engine/.stem-upstream.json`; não depender de branch móvel.
- Materializar exatamente `vendor/stem-studio/` e verificar commit, versão e notices.
- Ser idempotente: checkout correto é reutilizado; checkout divergente falha com instrução recuperável e não é sobrescrito.
- Adicionar `vendor/stem-studio/` ao `.gitignore` e retirar os arquivos upstream somente do índice Git, sem apagar a cópia de trabalho.
- Preservar `LICENSE`, third-party notices e proveniência no checkout materializado.
- Expor seam reutilizável por desenvolvimento e CI antes de typecheck/test/build.
- Não modificar nenhum arquivo upstream para fazer a validação passar.

## ALLOWED CHANGES
- `.gitignore`
- `package.json`
- `tooling/engine/**`
- `packages/deskverse-engine/.stem-upstream.json`
- `docs/engine/**`
- remoção de `vendor/stem-studio/**` somente do índice Git

## FORBIDDEN CHANGES
- Conteúdo da cópia local `vendor/stem-studio/**`.
- Lógica de produto, salas, atores ou HUD.
- Atualizar o commit upstream nesta sprint.

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisite: `SPRINT-01-01`.

## REQUIRED OUTPUTS
- script/comando de bootstrap
- verificador de pin e integridade
- configuração de ignore
- documentação para clone novo e CI

## ACCEPTANCE / TESTS
- clone/fixture sem `vendor/` materializa o commit exato
- segunda execução não altera checkout correto
- checkout divergente falha sem perda de dados
- `git ls-files vendor/stem-studio` retorna vazio
- engine typecheck/test e build do Player passam após bootstrap
- Player verifier continua excluindo editor/Copilot/AI server/multiplayer

## INTEGRATION DISCIPLINE
Não corrija módulos externos. Registre Integration Requirement ou Contract Change Request quando necessário.

## COMPLETION REPORT
Produza o relatório canônico com status, arquivos, testes, IRs/CCRs, limitações, execução utilizada e handoff ao Supervisor.
