# SPRINT-09-05 — Budgets, retries e prevenção de loops

**Fase:** 09 — Execução de Agentes  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-09-04  
**Superfície principal:** budgets por run, senioridade e capability

## Objetivo

Impedir loops de custo e tornar senioridade economicamente previsível.

## Regras

Cada execução possui hard/soft budget para custo, tokens, tempo, tool calls, iterações, retries e profundidade de delegação. O budget raiz inclui subagentes; especialista não abre orçamento infinito próprio.

Perfis padrão relativos:

- Júnior: menor número de iterações/contexto/review.
- Pleno: baseline.
- Sênior: maior budget e self-review quando útil.
- Especialista: maior reasoning permitido, mas ainda com hard cap.

Model adapter pode reduzir limites para modelos always-thinking ou caros. Retry técnico não muda modelo; escalation semântico exige regra explícita. Cancelamento bloqueia novos retries/delegações.


## Relação com a fila

- Budget é reservado no despacho, não no enqueue; tarefa aguardando não consome tokens/custo de inferência.
- Limite de concorrência não pode ser contornado criando subagentes; filhos contam contra o run/workspace raiz.
- Retry técnico reutiliza o mesmo budget/run e tem teto próprio de tentativas.
- Escalonamento de modelo/senioridade cria uma nova etapa auditável no mesmo objetivo, nunca um loop automático ilimitado.
- Se o soft budget for atingido ainda na fila, reavaliar antes de despachar; se o hard budget já não comportar a execução, marcar `BLOCKED_BUDGET`/pedir aprovação sem ocupar worker.

## Critérios de aceite

- Nenhum run/subrun ultrapassa o hard budget sem aprovação configurada.
- Recursão líder -> especialista -> líder é detectada e interrompida.
- Backoff/idempotência evitam gasto duplicado.
- UI mostra aviso antes do limite e motivo de cancelamento/escalation.
