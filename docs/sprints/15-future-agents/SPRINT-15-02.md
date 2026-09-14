# SPRINT-15-02 — Agente futuro de motion design

**Fase:** 15 — Agentes Futuros
**Status inicial:** PLANNED
**Dependências:** SPRINT-15-01
**Superfície principal:** roteiro, movimento e revisão


## Inference profile default

**Primary:** Qwen 3.5 Plus  \
**Escalation:** Kimi K3  \
A senioridade vem da Fase 09; trocar o modelo padrão exige benchmark/decisão registrada, não apenas preferência do implementador.
## Objetivo

Entregar roteiro, movimento e revisão como uma fatia de produto demonstrável. A sprint deve resolver o problema descrito sem antecipar implementação de sprints posteriores e sem esconder decisões de integração.

## Trabalho

1. Descrever e implementar o caminho principal de roteiro, movimento e revisão.
2. Tratar loading, empty, error e success com mensagens e recuperação acionáveis.
3. Registrar origem, responsável, estado, última atualização e próximo passo quando aplicável.
4. Validar acesso, falha parcial, repetição segura e retorno ao canvas ou à tela de origem.
5. Registrar em integration-requirements toda integração externa, decisão de produto ou mock que não possa ser concluído localmente.

## Ferramentas do agente

O agente usará Remotion para composição e renderização de motion design e uma tool/MCP interna da aplicação clone do Figma para criar designs vetoriais. Esse MCP será somente uma ferramenta para o agente, sem painel visual próprio para o usuário. O clone e suas capacidades serão estudados na implementação do agente, não nesta sprint.

## Uso da tela de arquivos

Vídeos, animações, composições vetoriais, previews, exports e demais mídias produzidas pelo agente devem ser enviadas ao UploadThing por tool e vinculadas ao projeto, tarefa, versão, origem e agente responsável. Após a confirmação, devem aparecer na tela de arquivos com preview, tipo, copy ou descrição, data e status. O usuário somente consulta esses resultados na Data Table desktop ou nos cards mobile.

## Incluído

- Implementação da superfície indicada.
- Fixtures e dados de teste suficientes para demonstrar os estados.
- Testes proporcionais ao risco e documentação de operação local.
- Relatório de conclusão com evidências, riscos e integrações pendentes.

## Não incluído

Escopos de sprints futuras, dados inventados, bypass de autorização, publicação sem aprovação, mudança silenciosa de política ou dependência de engine visual externa.

## Critérios de aceite

- O caminho principal funciona do começo ao fim.
- A mídia produzida pelo agente aparece na tela de arquivos após upload confirmado pelo UploadThing, com versão, origem, data e status.
- O usuário não recebe controles de upload, edição ou exclusão nessa tela.
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
