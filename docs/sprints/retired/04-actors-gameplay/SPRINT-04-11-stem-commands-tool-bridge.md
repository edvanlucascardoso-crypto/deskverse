> **Status: RETIRED / NON-EXECUTABLE (2026-09-11).** A integração Stem de autoria, navegação e animação foi removida; atores e gameplay foram reescopados na nova Fase 04.
+
# SPRINT-04-11 — Ponte local de ferramentas para o CommandsRegistry do Stem

## ROLE
Você é o agente responsável por esta sprint do Deskverse: execute-a até seus critérios de aceite e não assuma responsabilidade por outras sprints.

## EXECUÇÃO
Executada diretamente pelo agente de engenharia responsável, sem roteamento por modelo/fornecedor específico. Registre tentativas, falhas e escalonamentos no relatório final.

## EXECUTION ENVIRONMENT
- **LOCAL_OR_STANDARD_DEV_MACHINE**
- A ponte e o editor são locais; nenhuma GPU alugada é necessária.

## OBJECTIVE
Entregar, como primeira capacidade nova após o bootstrap, a superfície pela qual agentes de código operam o editor pelo catálogo tipado open-source do `CommandsRegistry`: uma CLI e um servidor compatível com MCP sobre o mesmo executor Deskverse, sem escrever JSON de cena e sem usar o serviço comercial do Stem.

## GLOBAL CONTEXT TO READ FIRST
1. `../00-meta/STEM_EDITOR_INTEGRATION_STRATEGY.md`
2. `../00-meta/STEM_ENGINE_FORK_POLICY.md`
3. `../00-meta/SPRINT_EXECUTION_CONTRACT.md`
4. `../../engine/LOCAL_EDITOR.md`

## REQUIREMENTS
- Ligar diretamente a `CommandsRegistry`/`CommandsExecutor`/`StudioJsonRpcHandler` do checkout pinado por facade Deskverse.
- Descobrir nomes, descrições e parâmetros no registry em runtime; não duplicar manualmente o catálogo.
- Expor uma CLI não interativa e um servidor local compatível com MCP, ambos derivados do mesmo catálogo/executor, com request IDs, timeout, erros estruturados e lifecycle previsível.
- Incluir tools para capabilities, lifecycle/open/save do projeto, inspeção/mutação de cena, preview/play, export, screenshot quando suportado, logs e status do editor.
- Garantir equivalência de schema, resultado e erro entre CLI, MCP e execução pelo editor; proibir catálogo ou implementação duplicada por transporte.
- Validar parâmetros antes da execução e propagar falha do handler sem reportar sucesso falso.
- Restringir bind a loopback e exigir handshake/token efêmero quando houver socket/porta.
- Suportar pelo menos descoberta, objetos, assets, luzes, câmera, NavMesh/waypoints, Behaviors/Lambdas, triggers/settings e save/export conforme capabilities do pin.
- Não depender de `stemstudio-copilot/`, Firebase, login Stem ou companion comercial.
- Permanecer fora do build/deploy do assinante e nunca expor secrets.

## ALLOWED CHANGES
- `packages/deskverse-engine/src/authoring-bridge/**`
- `tooling/engine/bridge/**`
- `packages/deskverse-engine/vite.editor.config.ts`
- `packages/deskverse-engine/package.json`
- `package.json`
- `docs/engine/**`

## FORBIDDEN CHANGES
- `vendor/stem-studio/**`
- build/runtime do Player além de verificadores que provem exclusão
- adoção da ponte proprietária
- catálogo paralelo de comandos

## DEPENDENCIES / EXPECTED INPUTS
- Hard prerequisite: `SPRINT-04-00`.
- Prioridade: primeira capacidade nova do plano; nenhuma outra sprint ativa da Fase 04 deve ser despachada antes de sua conclusão.

## REQUIRED OUTPUTS
- CLI e servidor MCP-compatible locais sobre o mesmo core
- cliente/tool descriptors derivados do registry
- lifecycle scripts e documentação
- testes unitários e integração CLI/MCP -> editor -> save/export

## ACCEPTANCE / TESTS
- capabilities refletem o registry do pin sem lista copiada
- CLI e cliente MCP criam/modificam objeto e luz, consultam a cena e salvam/exportam com resultados equivalentes
- cenário usa NavMesh/waypoint e Behavior de protótipo via comandos nativos
- projeto exportado é válido como entrada real para o tradutor posterior `04-10`
- parâmetro inválido, timeout e editor ausente falham corretamente
- porta não fica exposta fora de loopback
- bundle Player não contém bridge/Copilot/Firebase/companion

## INTEGRATION DISCIPLINE
Não faça patch em upstream. Mudança de contrato exige CCR; lacuna externa exige IR.

## COMPLETION REPORT
Produza o relatório canônico com status, arquivos, testes, IRs/CCRs, limitações, execução utilizada e handoff ao Supervisor.
