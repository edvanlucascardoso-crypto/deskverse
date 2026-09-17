# Controles do pedido no escritorio

## Data e escopo

16/09/2026. Atualizacao do fluxo local de pedidos do escritorio para escolher o agente lider, registrar parametros e cancelar pedidos com confirmacao.

## Motivo e contexto

O pedido precisava registrar explicitamente quem e responsavel pelo trabalho e permitir interrupcao humana sem iniciar novas etapas, mantendo o estado e o historico visiveis.

## Estado anterior

- O fluxo local iniciava pedidos com o agente Social Media fixo.
- Parametros do pedido eram representados apenas por texto livre e nao havia selecao de lider.
- Um pedido ativo nao tinha uma acao de cancelamento confirmada na interface.

## Novo estado

- A pessoa usuaria escolhe um agente do tipo lider ao criar o pedido.
- Parametros sugeridos, contexto adicional e criterio de conclusao ficam associados ao snapshot do pedido.
- O estado `cancelled` interrompe o pedido, cancela aprovacoes pendentes e registra o evento `run.cancelled`.
- Notificacoes, atividade do canvas e eventos usam o lider selecionado, sem criar hierarquia ou delegacao automatica.

## Impacto em produto, arquitetura e roadmap

- Produto: o drawer orienta a escolha do responsavel, mostra o contexto do pedido e exige confirmacao antes do cancelamento.
- Arquitetura: o estado e a maquina de transicao local permanecem a fonte de verdade do fluxo demonstrativo.
- Roadmap: reforca o Gate A0 de agente responsavel, modo de execucao e cancelamento visivel; nao antecipa colaboracao automatica.

## Arquivos e contratos afetados

- Tipos, schema Zod, reducer, repositorio local e notificacoes do escritorio.
- Drawers, canvas, tokens visuais e testes unitarios/E2E.

## Evidencias

- Teste unitario cobre persistencia do lider e cancelamento com aprovacao pendente.
- E2E cobre selecao de lider, parametros e cancelamento com confirmacao.

## Riscos e integracoes pendentes

- O repositorio atual e local/simulado; persistencia remota e execucao real continuam fora deste conjunto.
- A lista de lideres ainda vem do catalogo local de agentes.

## Fora do escopo

Colaboracao automatica, hierarquia entre agentes, alteracao de permissoes e persistencia Prisma do pedido.

## Decisao tomada e decisao em aberto

Decisao tomada: cancelamento e uma transicao terminal explicita e o pedido conserva o responsavel escolhido.

Decisao em aberto: integrar o mesmo contrato a execucao remota e a persistencia autorizada quando a fundacao correspondente estiver disponivel.

## Relacao com registros anteriores

Complementa as decisoes de agentes independentes e do fluxo do escritorio existentes no historico, sem reescrever registros anteriores.
