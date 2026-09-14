# Roadmap de sprints do Deskverse

O Deskverse é um workspace em canvas para montar e operar uma **equipe de agentes de IA como uma organização**, com líderes, especialistas compartilhados, senioridade configurável e controle humano.

Infraestrutura: consultar [GUIA_DE_INFRAESTRUTURA.md](../GUIA_DE_INFRAESTRUTURA.md). Serviços MCP/API/workers externos são hospedados no Railway e ficam agrupados com a sprint funcional que os requer; não são uma segunda arquitetura dentro do app.

## Princípios de produto/arquitetura

- **Funções antes de modelos:** o usuário escolhe agentes e senioridade; modelos ficam como detalhe avançado.
- **Quatro níveis:** Júnior, Pleno, Sênior e Especialista.
- **Especialistas compartilhados:** líderes delegam por especialidade a especialistas reutilizáveis; workers são efêmeros.
- **Custo como diferencial:** roteamento e benchmark otimizam `cost_per_successful_task`, não apenas preço/token.
- **Eve como runtime substituível:** execução durável, approvals, sandbox e subagents atrás de `AgentRuntime`.
- **Vercel AI Gateway como gateway primário substituível:** todos os LLMs passam por `InferenceGateway`; provider routing é responsabilidade do gateway.
- **Harness por agente/modelo sem lock-in:** AgentPolicy + ModelAdapter + TaskPolicy.
- **Estado/permissão fora do LLM:** state machines, scopes, budgets e approvals são determinísticos.
- **Interface em português do Brasil:** nomes visíveis ao usuário devem ser curtos e naturais; inglês fica restrito a marcas, siglas e identificadores técnicos no código.
- **Filas previsíveis:** líderes, especialistas e workers usam filas duráveis com prioridade, justiça entre workspaces, limites de concorrência, retries idempotentes, aging e cancelamento em cascata.
- **OpenAI/Anthropic nunca usam reasoning `max`;** outros modelos usam `max` apenas quando suportado e permitido pelo profile.

As filas são uma política do Deskverse, não uma consequência da implementação do runtime: há uma fila por sessão de líder, uma fila compartilhada por `workspace + especialidade` e filas físicas por classe de execução. A posição exibida na interface nunca é uma promessa fixa; prioridade, aging, justiça e capacidade podem alterar a ordem. Espera humana salva checkpoint e libera a execução física.

## Ordem das fases

1. 01-web-foundation
2. 02-canvas-foundation
3. 03-canvas-interactions
4. 04-people-and-activity
5. 05-office-experience
6. 06-account-platform
7. 07-onboarding-knowledge
8. 08-work-and-human-loop
9. 09-agent-execution
10. 10-mvp-agents
11. 11-integrations-and-planning
12. 12-billing-and-usage
13. 13-public-site-and-guide
14. 14-security-and-release
15. 15-future-agents
16. 16-collaboration

## Gate A0

Líder de Mídias Sociais -> Especialista de Texto -> Especialista de Design opcional -> aprovação -> entrega, com delegação por especialidade, área Especialistas visível, senioridade configurável, rastreio/custo e memória autorizada.

## Documentação

As sprints são a fonte operacional única. PRDs soltos foram absorvidos nas sprints correspondentes; novas decisões devem atualizar a sprint/fase responsável em vez de criar documento paralelo.

Os números das fases organizam o roadmap, mas o manifesto usa dependências topológicas. A única exceção atual é a ferramenta visual: `SPRINT-11-01` e `SPRINT-11-02` devem concluir antes de `SPRINT-10-03`, pois o Designer depende desse contrato e dessa execução headless.
