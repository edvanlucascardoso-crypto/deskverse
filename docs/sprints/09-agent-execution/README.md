# Fase 09 — Execução de Agentes

Criar a fundação de execução do Deskverse com foco em custo por tarefa concluída, isolamento e troca simples de modelos.

Configuração de serviços: [EXTERNAL_SERVICES.md](EXTERNAL_SERVICES.md).

## Decisões de arquitetura

- **Runtime padrão:** Eve, atrás da interface `AgentRuntime`; a lógica de produto não depende diretamente do framework.
- **Gateway primário:** Vercel AI Gateway, atrás da interface `InferenceGateway`; APIs diretas de fornecedores não entram no MVP.
- **Responsabilidade do Deskverse:** escolher agente, capacidade, senioridade, modelo, reasoning, contexto, tools e escalonamento semântico.
- **Responsabilidade do AI Gateway:** provider físico, failover técnico, ZDR, cache e roteamento por custo/latência/throughput.
- **Model adapters:** perfis finos por família/modelo; não recriam transporte do gateway.
- **Métrica principal:** `cost_per_successful_task`, acompanhada de task success, tool accuracy, tokens, retries, latência e intervenção humana.
- **Afinidade de sessão:** um agente mantém seu modelo primário durante a sessão; troca somente por escalonamento explícito ou falha técnica.
- **Tool/context filtering:** expor apenas ferramentas e memória relevantes ao estado atual.
- **Estado de negócio:** state machines e permissões ficam fora do LLM.

## Senioridade

Todo agente configurável possui quatro níveis independentes de permissão:

| Nível | Reasoning alvo | Política |
|---|---|---|
| Júnior | low | baixo custo, tarefas simples, menor budget/iterações |
| Pleno | medium | padrão operacional |
| Sênior | high | tarefas complexas, revisão e maior budget |
| Especialista | xhigh ou equivalente | maior profundidade economicamente permitida |

`max` é permitido somente para GPT-5.6 Luna entre os modelos OpenAI, quando o `ModelCapabilityProfile`, o provider efetivo e o benchmark demonstrarem suporte e ganho. GPT-5.6 Sol, os demais modelos OpenAI e Anthropic não usam `max`. Muse Spark 1.3, Kimi e DeepSeek V4.1 Flash podem usar `max` quando o caminho efetivo do provider realmente o suportar, o profile estiver habilitado e o benchmark demonstrar ganho. O trace registra `requested_reasoning` e `effective_reasoning`; nunca promover silenciosamente nem esconder uma tradução para `xhigh`.

Senioridade **não concede tools, scopes ou autonomia adicional**. Autorização é uma camada separada.

## Tipos de agente

- `LeaderAgent`: mantém objetivo, contexto organizacional e delega. Na interface: **Líder**.
- `SpecialistAgent`: capacidade reutilizável e compartilhada entre líderes. Na interface: **Especialista**.
- `WorkerAgent`: execução efêmera; normalmente invisível ao usuário. Na interface, só aparece como capacidade/execução quando necessário.

Líderes delegam por `capability`, não por ID físico de worker. Um `SpecialistRegistry` resolve capacidade, senioridade, fila, concorrência, modelo e worker.


## Modelo de filas

- **Líder:** uma decisão mutável por sessão de cada vez; sessões independentes podem paralelizar.
- **Especialidade:** fila compartilhada por `workspace + capability`, com fairness entre líderes e workers efêmeros.
- **Execução:** filas por classe `LLM/CPU/GPU/BROWSER/RENDER`, cada uma com limites próprios.
- Prioridade `URGENT/HIGH/NORMAL/LOW`, FIFO por faixa, aging contra starvation, leases/heartbeat, retry idempotente e dead-letter.
- Aprovação/espera humana libera worker; cancelamento do run raiz bloqueia novas delegações.
- Métricas separam `queue_wait_ms` de `execution_ms`.

## Ordem

1. SPRINT-09-01 — Cadastro, tipos, capacidades e senioridade
2. SPRINT-09-02 — AI Gateway, routing e model adapters
3. SPRINT-09-03 — Permissões, identidade e delegação segura
4. SPRINT-09-04 — Eve, execução durável e especialistas compartilhados
5. SPRINT-09-05 — Budgets, retries e prevenção de loops
6. SPRINT-09-06 — Conexões externas e credenciais
7. SPRINT-09-07 — Memória de trabalho com pgvector
8. SPRINT-09-08 — Telemetria, custos e Deskverse Agent Benchmark

## Fontes técnicas pesquisadas

- Eve: https://vercel.com/blog/introducing-eve
- AI Gateway / provider options: https://vercel.com/docs/ai-gateway/models-and-providers/provider-options
- Routing por custo/latência/TPS: https://vercel.com/changelog/sort-providers-by-cost-latency-or-throughput-on-ai-gateway
- Model catalog dinâmico: https://vercel.com/docs/ai-gateway/models-and-providers

## Limites

Canvas continua DOM/full-screen; sem engine 3D ou runtime de jogo. Eve e Vercel são infraestrutura substituível por interfaces internas, evitando lock-in estrutural.
