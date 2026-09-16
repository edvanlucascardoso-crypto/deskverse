# SPRINT-08-01 — Projetos objetivos planos e tarefas

**Fase:** 08 — Trabalho e Loop Humano
**Status inicial:** PLANNED
**Dependências:** SPRINT-08-00
**Superfície principal:** tela dedicada de projetos, objetivo, plano e DAG de tarefas

## Objetivo

Entregar uma tela dedicada de gerenciamento de projetos, separada do canvas e dos painéis contextuais, somente para visualização, junto de objetivo, plano e DAG de tarefas como uma fatia utilizável do produto. A implementação deve ligar o comportamento à experiência do workspace, deixando explícitos os estados que o usuário pode observar e as decisões que pertencem a outra fase.

## Painel de gerenciamento de projetos

A tela dedicada deve permitir ao usuário acompanhar projetos, objetivos, planos, tarefas, dependências, responsáveis, prazos, saúde, atividade e histórico de versões. O canvas pode oferecer um ponto de entrada ou link para essa tela, mas não deve transformar o acompanhamento em edição contextual. Busca, filtros, seleção e navegação contextual dentro da tela são permitidos porque apenas organizam a visualização.

Não devem existir no painel ações de CRUD para o usuário: sem criar, editar, excluir, reordenar ou alterar diretamente projetos, planos ou tarefas. O usuário pode visualizar o planejamento e acompanhar sua evolução, mas as alterações devem ser executadas exclusivamente por tools autorizadas dos agentes Gestor de Projetos/Gerente e Social Media.

Cada mudança feita por um agente deve voltar ao painel com origem, agente responsável, estado anterior, novo estado, data da atualização, motivo ou decisão e próximo passo. O painel não deve apresentar uma alteração como confirmada antes de o backend registrar o resultado da tool.

## Trabalho

1. Modelar o caminho principal de objetivo, plano e DAG de tarefas com dados mínimos e estados nomeados.
2. Implementar o painel de consulta com visão resumida do projeto, progresso, saúde, dependências, tarefas bloqueadas, responsáveis, prazos e atividade recente.
3. Implementar o caminho feliz, loading, empty, error e success, incluindo recuperação.
4. Exibir origem, responsável, última atualização e próximo passo quando esses dados existirem.
5. Representar uma atualização de planejamento originada por tool de agente, incluindo processamento, sucesso, falha e retry sem duplicação visual.
6. Manter regras próximas da feature, com tipos locais e fixtures pequenas, sem criar uma abstração transversal prematura.
7. Registrar em integration-requirements dependências, decisões ou mocks que precisem de integração posterior.

## Regras essenciais

- O trabalho nasce de um objetivo, é dividido em plano e tarefas e pode formar um DAG sem tarefas órfãs.
- Cada tarefa tem responsável, estado, dependências, evidência e próximo passo.
- Uma tarefa aguardando pessoa não é tratada como concluída.

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
- O usuário consegue abrir uma tela dedicada e acompanhar projeto, plano, tarefas, dependências, saúde e histórico em uma visualização completa.
- A tela dedicada não oferece CRUD ou edição direta ao usuário; alterações demonstráveis entram somente pela execução de tools dos agentes Gestor de Projetos/Gerente ou Social Media.
- Uma alteração de agente aparece apenas após confirmação do resultado no backend e preserva origem, estado anterior, novo estado e próximo passo.
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
