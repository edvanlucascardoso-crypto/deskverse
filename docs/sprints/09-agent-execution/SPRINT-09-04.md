# SPRINT-09-04 — Eve, execução durável e especialistas compartilhados

**Fase:** 09 — Execução de Agentes  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-09-03  
**Superfície principal:** runtime, delegação, aprovações, filas e subagentes compartilhados

## Objetivo

Usar **Eve** como runtime padrão, atrás de `AgentRuntime`, para execução durável, sandbox, aprovações, subagentes e eval hooks; adicionar **Especialistas** compartilhados entre todos os líderes.

## Abstração

```ts
interface AgentRuntime {
  start(...): Promise<RunRef>
  resume(...): Promise<RunRef>
  cancel(...): Promise<void>
  delegate(...): Promise<DelegationRef>
  requestApproval(...): Promise<ApprovalRef>
}
```

`EveAgentRuntime` implementa a interface. Nenhuma regra de negócio deve depender diretamente de APIs do Eve.

## Especialistas compartilhados

- Especialistas são recursos lógicos globais do workspace, não cópias dentro de cada líder.
- Líder chama `delegateCapability(capability, task, seniority?)`.
- `SpecialistRegistry` escolhe especialista, senioridade, `InferenceProfile`, fila e worker.
- Workers são efêmeros; concurrency/queue podem escalar sem novos cards persistentes.
- Um líder pode definir preferências por capacidade, ex.: `research=junior`, `copy=senior`.
- Eve subagents podem executar a delegação, mas a identidade compartilhada pertence ao registry do Deskverse.
- Líderes criados pela pessoa usuária podem declarar perfis de apoio personalizados por capacidade; o registry resolve a execução sem materializar esses subagentes como entidades visuais persistentes.

## Filas de agentes e workers

O scheduler do Deskverse define a semântica; Eve/Workflow/Redis/BullMQ ou outro backend podem implementá-la atrás de interfaces internas. Não acoplar regras de produto ao transporte da fila.

### 1. Fila do líder

- Cada sessão de líder processa **um turno mutável por vez**, preservando ordem e evitando duas decisões concorrentes sobre o mesmo estado.
- Sessões diferentes podem executar em paralelo até os limites do workspace e do perfil.
- Mensagens do usuário e retomadas após aprovação têm preferência sobre tarefas autônomas em segundo plano.
- DAG/dependências só entram em `READY` quando todos os predecessores obrigatórios concluírem.

### 2. Fila de especialidade

- Uma fila lógica por `workspace + capability` atende todos os líderes autorizados; não criar fila por líder.
- `SpecialistRegistry` aplica round-robin ponderado entre líderes para evitar monopolização.
- O líder pede uma **especialidade**, senioridade e objetivo; não escolhe worker físico.
- O especialista lógico pode ter vários workers efêmeros simultâneos, respeitando `maxConcurrency` e orçamento.
- `aging` promove tarefas antigas até `HIGH`; `URGENT` é reservado a ação explícita/sistema e não nasce automaticamente.

### 3. Fila de execução

Depois da resolução do especialista, a tarefa é encaminhada por classe: `LLM`, `CPU`, `GPU`, `BROWSER` ou `RENDER`. Cada classe possui limites próprios de concorrência, rate limit e custo. Workers retiram tarefas por lease e heartbeat; perda do worker devolve a tarefa à fila de forma idempotente. A saída do scheduler fornece estado, profundidade e `estimatedWaitMs` anulável. A UI mostra volume e estimativa somente quando houver dados confiáveis; nunca promete uma posição fixa.

### Prioridade e capacidade

Ordem: `URGENT > HIGH > NORMAL > LOW`, FIFO dentro da mesma prioridade. Defaults de despacho:

- `URGENT`: recuperação/incidente ou ação explicitamente marcada como urgente; nunca por aging;
- `HIGH`: mensagem direta do usuário, retomada após aprovação e ação interativa bloqueante;
- `NORMAL`: delegação comum entre agentes;
- `LOW`: agenda, manutenção, pesquisa antecipada e trabalho autônomo em segundo plano.

Trabalho interativo recebe o próximo slot livre quando houver backlog; tarefas em segundo plano podem usar toda capacidade ociosa, sem reserva física desperdiçada. Aplicar limites cumulativos por `workspace`, `agent/session`, `capability`, `model/profile` e `resourceClass`, com backpressure antes de aceitar trabalho além da capacidade. Usar uma chave de deduplicação para tarefas sem efeitos colaterais irreversíveis quando o mesmo pedido puder ser reenviado.

Defaults iniciais do MVP, todos configuráveis e sujeitos aos limites do plano:

| Escopo | Limite inicial |
|---|---:|
| sessão de líder | 1 turno mutável |
| especialista por workspace | 4 tarefas simultâneas |
| `LLM` por workspace | 8 execuções |
| `BROWSER` por workspace | 2 execuções |
| `CPU` por workspace | 4 execuções |
| `GPU` por workspace | 1 execução |
| `RENDER` por workspace | 2 execuções |

Esses valores são **defaults operacionais**, não promessa de plano. A Fase 12 pode sobrescrevê-los por assinatura e a infraestrutura pode reduzir dinamicamente um limite diante de rate limit/saturação, nunca aumentá-lo além do permitido pelo workspace.

### Espera, cancelamento e retry

- `WAITING_USER`/`WAITING_APPROVAL` persistem checkpoint e **liberam worker**.
- Cancelamento do run raiz impede novas delegações/retries e cancela filhos pendentes; efeitos já confirmados são preservados.
- Retry técnico segue a fundação da SPRINT-07-01 e não altera modelo/senioridade. Falha semântica volta ao líder para replanejamento ou escalonamento.
- Após `maxAttempts`, tarefa vai para dead-letter/revisão sem desaparecer da auditoria.

### Observabilidade mínima

Registrar `queuedAt`, `startedAt`, `waitMs`, `priority`, `queueDepthAtEnqueue`, `attempt`, `workerLease`, `capability`, `resourceClass` e motivo de saída. Isso permite medir tempo em fila separado de tempo de inferência.

## Execução e estado

Persistir DAG/run, checkpoints, espera humana, retry, cancelamento, resultado e continuação. Refinamento de intenção ocorre antes da execução quando faltar contexto e entra em `WAITING_USER` sem inventar requisitos.

Eventos em tempo real: início, delegação, progresso, comunicação, fila, espera, aprovação, nova tentativa, conclusão, falha e cancelamento. Eventos de comunicação têm ordenação por fluxo: a projeção de handoff libera o próximo turno somente depois de o anterior concluir ou entrar em espera; execução paralela não autoriza todos os agentes a conversarem visualmente ao mesmo tempo.

### Contrato de evento do escritório

- O runtime publica eventos pela tool `createOfficeEventTool`, que valida `runId`, origem, responsável, mensagem, impacto e próximo passo antes de entregar ao sink de persistência/transporte.
- `approval.requested` e `run.waiting_approval` precisam carregar `approvalId` e o contexto completo da aprovação: título, resumo, motivo, solicitante, materiais e versão. `approval.decided` também identifica o item resolvido.
- O evento aceita `idempotencyKey` para retries; a integração durável deve repetir essa garantia no armazenamento, além da proteção local usada na demonstração.
- `conversationId` é opcional. Um evento operacional não abre uma conversa automaticamente; a conversa só é criada quando uma pergunta, refinamento, colaboração ou revisão exigir interação.
- O renderer do canvas e a Central de Notificações consomem a projeção do mesmo evento confirmado. O drawer usa `approvalId` para abrir o item exato e múltiplas aprovações não são tratadas como uma aprovação genérica.

## Canvas

O runtime apenas emite eventos; o renderer decide animação. Conexões entre líder e especialista são **temporárias/contextuais**, evitando um grafo permanente de linhas. O renderer consome uma conversa por vez por fluxo, preservando a sequência de emissor e destinatário em vez de compor linhas concorrentes.

## Critérios de aceite

- Uma execução pode pausar para aprovação e continuar por checkpoint sem processo vivo e sem ocupar worker.
- Dois líderes usam o mesmo especialista lógico simultaneamente, com uma fila compartilhada, fairness e capacidade rastreáveis.
- Falha de worker não perde o run do líder.
- Delegações, aprovações e retomadas são idempotentes.
- Testes demonstram FIFO por prioridade, aging, limite de concorrência, backpressure, deduplicação aplicável, lease expirado, cancelamento em cascata e dead-letter.
- Eve pode ser substituído por outra implementação de `AgentRuntime` nos testes de contrato.

## Referência

https://vercel.com/blog/introducing-eve
