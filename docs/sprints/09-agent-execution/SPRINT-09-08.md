# SPRINT-09-08 — Telemetria, custos e Deskverse Agent Benchmark

**Fase:** 09 — Execução de Agentes  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-09-07  
**Superfície principal:** traces, ledger, evals e decisão econômica

## Objetivo

Medir qualidade e custo real por tarefa para decidir modelo/harness com dados próprios, não por benchmark público isolado.

## Trace mínimo

Registrar `run`, `agent`, `kind`, `capability`, senioridade, state, model, provider, reasoning pedido/efetivo, input/output/reasoning/cache tokens, tool calls, retries, delegações, latência, approvals, custo e resultado.

## Deskverse Agent Benchmark

Cada tipo de agente terá casos reais e reproduzíveis. Métrica primária de decisão:

```text
cost_per_successful_task = custo total das execuções / tarefas concluídas corretamente
```

O custo total inclui tentativas técnicas, retries, delegações, ferramentas e inferência atribuíveis ao objetivo. O denominador inclui somente tarefas que atingiram o critério de sucesso validado; tarefas falhas, abandonadas ou aprovadas sem entrega correta não entram como sucesso. Toda comparação registra conjunto de casos, tamanho da amostra e intervalo de confiança ou limitação equivalente.

Se nenhum caso for concluído corretamente, `cost_per_successful_task` é considerado indefinido/infinito para promoção; não tratar custo baixo com zero sucessos como vantagem.

Depois que um profile supera o limiar mínimo de task success e tool accuracy, usar os seguintes guardrails:

- task success: 35%
- correct tool use: 20%
- cost_per_successful_task: 20%
- latency: 10%
- tokens/task: 5%
- retries: 5%
- human intervention: 5%

O score auxiliar não pode promover um modelo com `cost_per_successful_task` pior sem uma decisão registrada e evidência de qualidade relevante.

Comparar `AgentPolicy x ModelAdapter x Seniority`. Uma troca de modelo padrão exige evidência do benchmark ou decisão registrada.

## Critérios de aceite

- Reproduzir cenários de sucesso, recusa, falta de contexto, approval, tool failure e escalation.
- Comparar ao menos dois modelos/adapters no mesmo conjunto de casos.
- Dashboard diferencia custo por token de custo por tarefa bem-sucedida.
- Detectar regressão de tool accuracy, custo e taxa de retry antes de promover novo profile.
- Integrar eval hooks do Eve quando útil sem tornar Eve a fonte única dos dados.
