# SPRINT-15-11 — Agente futuro de gestão de projetos

**Fase:** 15 — Agentes Futuros
**Status inicial:** PLANNED
**Dependências:** SPRINT-15-10
**Superfície principal:** tela dedicada de projetos, plano, dependências e saúde


## Inference profile default

**Primary:** Muse Spark 1.3  \
**Escalation:** GPT-5.6 Sol  \
A senioridade vem da Fase 09; trocar o modelo padrão exige benchmark/decisão registrada, não apenas preferência do implementador.
## Objetivo

Entregar o agente Gestor de Projetos/Gerente e seu uso do painel de projetos para plano, dependências e saúde como uma fatia de produto demonstrável. A sprint deve resolver o problema descrito sem antecipar implementação de sprints posteriores e sem esconder decisões de integração.

## Painel e tools do agente

O agente deve acompanhar e modificar projetos, objetivos, planos, tarefas, dependências, prazos e indicadores de saúde por tools autorizadas. A tela dedicada, separada do canvas e dos painéis contextuais, é uma superfície de acompanhamento para o usuário e não oferece CRUD ou edição direta de nenhum desses itens.

As tools devem registrar operações de criação, atualização, replanejamento, arquivamento e remoção quando necessárias ao trabalho do agente, com validação de autorização, idempotência, auditoria e resultado explícito. O painel só atualiza a visualização depois da confirmação do backend e deve mostrar quem alterou, o que mudou, por que mudou e qual é o próximo passo.

Relatórios, planos, cronogramas e demais trabalhos produzidos pelo Gestor de Projetos/Gerente devem ser enviados ao UploadThing por tools e aparecer na tela de arquivos do projeto com versão, data, origem e status. O usuário pode consultar e abrir esses artefatos, mas não fazer upload, editar ou excluir pela interface.

## Trabalho

1. Descrever e implementar o caminho principal de plano, dependências e saúde.
2. Implementar as tools do agente para consultar, criar, atualizar, replanejar, arquivar e remover itens do planejamento conforme autorização e necessidade do trabalho.
3. Integrar os resultados das tools ao painel somente leitura, com atualização otimista proibida para mudanças não confirmadas.
4. Tratar loading, empty, error e success com mensagens e recuperação acionáveis.
5. Registrar origem, responsável, estado, última atualização e próximo passo quando aplicável.
6. Validar acesso, falha parcial, repetição segura e retorno ao canvas ou à tela de origem.
7. Registrar em integration-requirements toda integração externa, decisão de produto ou mock que não possa ser concluído localmente.

## Incluído

- Implementação da superfície indicada.
- Fixtures e dados de teste suficientes para demonstrar os estados.
- Testes proporcionais ao risco e documentação de operação local.
- Relatório de conclusão com evidências, riscos e integrações pendentes.

## Não incluído

Escopos de sprints futuras, dados inventados, bypass de autorização, publicação sem aprovação, mudança silenciosa de política ou dependência de engine visual externa.

## Critérios de aceite

- O caminho principal funciona do começo ao fim.
- O Gestor de Projetos/Gerente consegue modificar o planejamento por tools e o usuário acompanha o resultado em uma tela dedicada somente leitura.
- Não há CRUD ou edição direta de projetos, planos, tarefas ou dependências disponível ao usuário.
- Os artefatos produzidos pelo agente aparecem na tela de arquivos após upload confirmado pelo UploadThing.
- Operações repetidas, falhas e replanejamentos mantêm auditoria e não geram estados duplicados ou falsamente confirmados.
- Estados vazio, carregando, erro e sucesso são compreensíveis.
- Ações protegidas pedem confirmação ou aprovação quando necessário.
- Falhas não simulam sucesso nem perdem dados confirmados.
- A interface continua acessível por teclado e em viewport estreita.
- Lint, typecheck, build e testes da sprint passam.
- O relatório registra pendências sem transformar uma integração futura em comportamento falso.

## Verificação

Executar instalação e scripts de qualidade, percorrer o fluxo no navegador e validar uma fixture vazia, uma completa e uma com falha. Repetir operações para confirmar idempotência quando aplicável.

## Critério de conclusão

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Usar COMPLETE quando os critérios forem demonstrados. Usar COMPLETE_WITH_INTEGRATION_REQUIREMENTS quando restarem somente integrações registradas; manter bloqueios visíveis quando houver decisão externa.
