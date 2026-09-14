# SPRINT-07-01 — Filas de trabalho e jobs assíncronos

**Fase:** 07 — Onboarding e Conhecimento
**Status inicial:** PLANNED
**Dependências:** nenhuma
**Superfície principal:** jobs, estados, retries, idempotência e observação

## Objetivo

Entregar jobs, estados, retries, idempotência e observação como uma fatia utilizável do produto. A implementação deve ligar o comportamento à experiência do workspace, deixando explícitos os estados que o usuário pode observar e as decisões que pertencem a outra fase.

## Contrato de fila

A fundação de jobs deve suportar, sem amarrar o produto a uma tecnologia específica:

- estados `PENDING`, `READY`, `RUNNING`, `WAITING_USER`, `WAITING_APPROVAL`, `RETRY_SCHEDULED`, `SUCCEEDED`, `FAILED`, `CANCELLED` e `DEAD_LETTER`;
- `priority`, `createdAt`, `availableAt`, `attempt`, `maxAttempts`, `idempotencyKey`, `workspaceId`, `runId`, `parentRunId`, `resourceClass` e `leaseUntil`;
- FIFO dentro da mesma prioridade, com **aging**: por padrão, a cada 5 min de espera a tarefa sobe uma faixa, até `HIGH`; `URGENT` nunca é obtido por aging;
- prioridades internas `URGENT`, `HIGH`, `NORMAL`, `LOW`; na interface usar **Urgente, Alta, Normal e Baixa**;
- side effects com chave de idempotência; reenvio da mesma operação não duplica cobrança, publicação ou escrita externa;
- worker usa lease/heartbeat; lease expirado devolve tarefa à fila sem marcar sucesso;
- `WAITING_USER` e `WAITING_APPROVAL` não ocupam slot de worker;
- cancelamento impede novas tentativas e propaga para filhos ainda não concluídos;
- depois de esgotar retries técnicos, mover para `DEAD_LETTER`, preservando erro e permitindo reprocessamento explícito.

## Jobs de conhecimento

Documentos enviados no onboarding percorrem jobs explícitos e rastreáveis: `DOCUMENT_VALIDATE` → `DOCUMENT_EXTRACT` → `DOCUMENT_NORMALIZE` → `DOCUMENT_CHUNK` → `DOCUMENT_EMBED` → `DOCUMENT_INDEX`. Cada etapa recebe `workspaceId`, `documentId`, `documentVersionId`, checksum do conteúdo e `idempotencyKey`; uma nova versão cancela ou invalida com segurança os jobs pendentes da versão anterior.

## Backpressure e justiça

- limites configuráveis por workspace, classe de execução e tipo de tarefa;
- nenhum workspace pode monopolizar todos os slots: usar round-robin ponderado entre workspaces com trabalho pronto;
- tarefas interativas têm preferência sobre trabalho em segundo plano, mas tarefas `LOW` envelhecem para evitar starvation;
- quando houver saturação, persistir a tarefa e informar espera; nunca descartar silenciosamente;
- se o limite durável de fila for atingido, responder `QUEUE_SATURATED` com recuperação acionável em vez de aceitar trabalho impossível de processar.

## Retry técnico

Retry apenas para erro recuperável (`429`, timeout, `5xx`, perda transitória de rede ou lease). Respeitar `Retry-After`; caso ausente, usar backoff exponencial com jitter, por padrão `2s -> 5s -> 15s -> 45s`, máximo de 4 tentativas. Erro semântico, tool inválida ou resultado ruim **não** é retry técnico: volta para planejamento/escalonamento da Fase 09.

## Trabalho

1. Modelar o caminho principal de jobs, estados, retries, idempotência e observação com dados mínimos e estados nomeados.
2. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
3. Exibir origem, responsável, última atualização e próximo passo quando esses dados existirem.
4. Manter regras próximas da feature, com tipos locais e fixtures pequenas, sem criar uma abstração transversal prematura.
5. Registrar em integration-requirements dependências, decisões ou mocks que precisem de integração posterior.

## Incluído

- Código funcional na superfície indicada.
- Fixtures locais ou persistência mínima necessária para demonstrar a sprint.
- Feedback de foco, seleção, erro, espera e conclusão.
- Relatório de conclusão com evidências e pendências.

## Não incluído

Escopo de fases posteriores, publicação externa, cobrança, dados inventados, engine visual paralela ou mudança silenciosa de produto.

## Entregáveis

Implementação, testes proporcionais ao risco, roteiro de demonstração e instruções para executar a validação local.

## Critérios de aceite

- O fluxo principal funciona do início ao fim.
- Prioridade, aging, fairness, lease, retry, cancelamento e dead-letter são demonstráveis por testes.
- Estados vazio, carregando, erro e sucesso são compreensíveis.
- A tela permanece utilizável com teclado e viewport estreita.
- Falhas parciais não apagam dados válidos nem deixam a interface travada.
- Não há dependência de WebGL, engine 3D, modelos legados, Stem ou jogo.
- Lint, typecheck e build passam.
- O relatório lista integrações pendentes e limites da entrega.

## Verificação

Executar instalação e scripts de qualidade, percorrer o fluxo no navegador e testar fixtures vazias, completas e com falha. Registrar a evidência no relatório da sprint.

## Critério de conclusão

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Usar COMPLETE quando todos os critérios forem demonstrados. Usar COMPLETE_WITH_INTEGRATION_REQUIREMENTS quando só restarem integrações registradas; manter bloqueios visíveis quando dependerem de uma decisão externa.
