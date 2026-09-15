# SPRINT-08-06 — Notificações e encaminhamentos

**Fase:** 08 — Trabalho e Loop Humano
**Status inicial:** PLANNED
**Dependências:** SPRINT-08-05
**Superfície principal:** notificação, destinatário, leitura e roteamento

## Objetivo

Entregar um sistema de notificações em tempo real, com destinatário, leitura e roteamento, como uma fatia utilizável do produto. O sistema será o principal canal de pedidos de permissão e também comunicará conclusão, falha, espera e mudanças relevantes dos agentes. A implementação deve ligar o comportamento à experiência do workspace, deixando explícitos os estados que o usuário pode observar e as decisões que pertencem a outra fase.

## Sistema de notificações em tempo real

As notificações devem chegar enquanto o usuário estiver no workspace, sem depender de refresh, e permanecer consultáveis quando a entrega em tempo real falhar. Devem existir, no mínimo, eventos para pedido de permissão, alteração de configuração solicitada por agente, tarefa concluída, tarefa bloqueada, execução em espera, falha, retry, conclusão de upload e mudança importante de preferência ou planejamento.

Cada notificação deve atualizar também o feedback visual do card relacionado, com estado compreensível e vínculo para a origem. A interface não pode mostrar uma permissão como aprovada, uma tarefa como concluída ou um upload como disponível antes da confirmação do backend.

## Histórico paginado por scroll

A central de notificações reais deve carregar o histórico por paginação baseada em cursor, ordenado da mais recente para a mais antiga. A primeira consulta traz uma página inicial; ao se aproximar do fim da lista pelo scroll, a interface deve buscar e anexar a próxima página sem substituir os itens já exibidos. Não usar paginação por número de página ou offset como contrato principal.

O carregamento incremental precisa preservar a posição de leitura, indicar um estado discreto de “carregando mais” e parar quando não houver próxima página. Falhas nessa etapa não podem apagar o histórico carregado: devem exibir recuperação para tentar novamente. Eventos em tempo real recebidos durante a navegação entram sem duplicar itens nem reordenar abruptamente o conteúdo que a pessoa está lendo. Quando o observer de scroll não estiver disponível, deve existir uma ação acessível equivalente para carregar mais.

## Trabalho

1. Modelar o caminho principal de notificação, destinatário, leitura e roteamento com dados mínimos e estados nomeados.
2. Implementar a entrega em tempo real, a persistência da notificação e o fallback de consulta quando o canal estiver indisponível.
3. Mapear pedidos de permissão e alterações de configuração dos agentes para notificações prioritárias, com ações explícitas de permitir, recusar ou revisar quando aplicável.
4. Atualizar card, histórico e destino da notificação a partir do mesmo evento confirmado, sem duplicação.
5. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
6. Exibir origem, responsável, última atualização e próximo passo quando esses dados existirem.
7. Manter regras próximas da feature, com tipos locais e fixtures pequenas, sem criar uma abstração transversal prematura.
8. Registrar em integration-requirements dependências, decisões ou mocks que precisem de integração posterior.
9. Implementar a consulta inicial e o carregamento progressivo do histórico por scroll, com cursor, `hasMore`, loading incremental, retry e alternativa acessível para carregar mais.
10. Consumir o contrato de eventos do escritório com correlação de execução, aprovação, conversa e artefato; manter a mesma projeção entre notificação, drawer e card do agente.

## Regras essenciais

- Cada notificação tem destinatário, motivo, prioridade, estado de leitura e origem.
- Encaminhamentos não duplicam indefinidamente a mesma pendência.
- Falha de entrega local fica visível e pode ser tentada novamente.
- Eventos repetidos, retries e reconexões são idempotentes e não criam notificações ou feedback visual duplicados.
- Pedidos de permissão têm prioridade, expiração ou estado de resolução e nunca são confundidos com uma autorização já concedida.
- Um pedido de aprovação identifica exatamente o item, material, versão, motivo e próximo passo; aprovações múltiplas aparecem como pendências independentes.
- Eventos operacionais não criam conversas automaticamente. A notificação roteia o evento e só aponta para uma conversa quando o evento tiver `conversationId`.
- A paginação do histórico usa cursor estável e carrega mais itens somente quando a pessoa avança no scroll; itens já carregados e sua posição de leitura são preservados.

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
- Uma notificação nova chega em tempo real sem refresh, fica disponível no histórico e possui fallback quando o canal é interrompido.
- Um pedido de permissão recebido atualiza a notificação e o card do agente com estado pendente até a decisão confirmada.
- Conclusão, falha, espera, retry, upload confirmado e mudança de preferência ou planejamento geram feedback no card relacionado.
- Reconexão, evento duplicado e falha de entrega não produzem estado falso nem duplicação.
- Ao avançar no scroll da central, a próxima página é carregada e anexada sem apagar ou centralizar os itens existentes; ao fim do histórico, a busca é encerrada de forma explícita.
- Uma falha ao carregar mais mantém o histórico visível e permite nova tentativa; teclado e tecnologias assistivas possuem ação equivalente ao gatilho por scroll.
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
