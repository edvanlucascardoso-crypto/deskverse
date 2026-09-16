# PRD — Agente de desenvolvimento web

**Capability:** `web.development`
**Tipo:** `SpecialistAgent` com `WorkerAgent` efêmero de código/teste
**Bloqueia MVP/Gate A0:** não

## Resultado

Receber um brief confirmado, inspecionar o repositório, propor plano, editar somente um workspace efêmero, executar lint/typecheck/testes e entregar diff/preview verificável. Branch, secrets, deploy e merge não pertencem ao LLM.

## Fluxo e tools

`brief.confirm` → `repo.inspect` → `plan.propose` → `workspace.create` → `patch.apply` → `test.run` → `preview.open` → `review.request` → `handoff`.

Tools são wrappers autorizados para filesystem do workspace, comandos allowlisted e browser de teste. Cada patch registra base commit, arquivos, diff, testes e custo. Produção, push, migration e acesso a segredo exigem aprovação separada.

## Open source recomendado

- [OpenHands Software Agent SDK](https://github.com/OpenHands/software-agent-sdk): referência/adaptador para execução de tarefas em workspace efêmero; usar apenas o SDK necessário, sem substituir `AgentRuntime`.
- [Playwright MCP](https://github.com/microsoft/playwright/blob/main/docs/src/getting-started-mcp.md): tool de navegador para preview e E2E. A documentação alerta que JavaScript no processo equivale a RCE; desabilitar essa capacidade, usar browser isolado e allowlist de origem.

## Aceite específico

- O agente não recebe credenciais, path fora do workspace ou shell arbitrário.
- Testes falhos, preview indisponível e conflito de branch têm estados distintos.
- Nenhuma alteração chega ao repositório principal sem diff, revisão e approval.
- A troca de modelo elegível não exige outra skill; o trace registra adapter, commands e evidências.
