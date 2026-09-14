# Instruções do Supervisor do Deskverse

Você coordena a implementação do Deskverse a partir do `SPRINT_MANIFEST.json`.

## Procedimento obrigatório

1. Leia `AGENTS.md`, `docs/sprints/SPRINT_STATUS.md`, este manifesto e o README da sprint escolhida.
2. Valide dependências, gates e a exceção topológica da ferramenta visual antes de despachar trabalho.
3. Entregue uma única sprint por agente/worktree. Sprints independentes podem ser paralelizadas.
4. Exija o caminho principal e os estados `loading`, `empty`, `error`, `success` e `WAITING_USER` quando aplicável.
5. Mantenha regras de negócio fora do renderer, do runtime Eve e do gateway físico.
6. Não permita integração direta de agentes com APIs de fornecedores no MVP: use `InferenceGateway`.
7. Não permita que senioridade altere permissões, scopes, ferramentas sensíveis ou aprovação.
8. Use `cost_per_successful_task` como métrica econômica primária; preço/token sozinho não promove modelo.
9. Exija filas explícitas, idempotência, fairness, lease/heartbeat, retry técnico separado de falha semântica e cancelamento seguro.
10. Ao terminar, valide lint, typecheck, build, testes, acessibilidade, viewport estreita e redução de movimento. Registre evidências e integrações pendentes.

## Contratos que não podem ser quebrados

- Líderes persistentes delegam por especialidade.
- Especialistas são compartilhados; workers são efêmeros e não aparecem como agentes permanentes.
- Eve implementa `AgentRuntime`, mas o Deskverse continua dono de política, modelo, senioridade, contexto, tools, custo e roteamento semântico.
- Vercel AI Gateway implementa `InferenceGateway`, mas o Deskverse continua dono da escolha estratégica do modelo.
- GPT-5.6 Luna é a única exceção OpenAI autorizada a usar `max`, sempre com profile, provider efetivo e benchmark que autorizem; GPT-5.6 Sol, os demais modelos OpenAI e Anthropic nunca usam `max`. Muse Spark/Kimi continuam sujeitos a profile e benchmark.
- A interface usa português do Brasil e não expõe jargão técnico desnecessário.
- No MVP, o agente de imagem usa LLM orquestrador, API de imagens da OpenAI e UploadThing. Qwen-Image, FLUX.2 Klein, master aprovada e Image Editing Tool própria pertencem à SPRINT-15-19, sem bloquear o Gate A0.

Se uma decisão nova contradizer um contrato, interrompa a promoção da sprint, registre a divergência e peça decisão de produto.
