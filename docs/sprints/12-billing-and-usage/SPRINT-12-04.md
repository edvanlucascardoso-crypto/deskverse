# SPRINT-12-04 — Uso de IA, ledger e custo por tarefa

**Fase:** 12 — Cobrança e Uso  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-12-03  
**Superfície principal:** consumo, budget e economia real

## Objetivo

Cobrar e explicar uso sem reduzir a economia a preço por token.

## Regras

Ledger recebe traces da SPRINT-09-08 e separa input, cached input, output/reasoning, tools externas, geração de mídia, provider e subagentes. Agregar por workspace, agente, capability, senioridade e tarefa.

Métrica de produto prioritária: `cost_per_successful_task`. Mostrar também custo médio por execução, taxa de sucesso/retry e impacto estimado de senioridade.

Budgets possuem aviso e hard cap. Falhas/retries não podem gerar débito duplicado por idempotência. Provider/model pricing é lido do catálogo/ledger, não de tabela hardcoded na UI.

## Critérios de aceite

- Explicar de onde veio cada unidade de custo.
- Agregar custo de subagentes no run raiz sem perder detalhamento.
- Comparar Júnior/Pleno/Sênior/Especialista com estimativa antes da mudança.
- Bloqueio seguro respeita hard budget sem marcar tarefa como concluída.
