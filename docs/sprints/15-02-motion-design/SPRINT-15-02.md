# SPRINT-15-02 — Agente futuro de motion design

**Fase:** 15 — Agentes Futuros
**Status inicial:** PLANNED
**Dependências do Spike:** checkout fixado do Premation e ambiente de estudo.
**Pré-requisitos da implementação produtiva:** Fases 07, 08, 09 e 14, além da revisão jurídica aplicável, conforme detalhado nas sprints filhas.
**Bloqueia o MVP de agentes:** não
**Superfície principal:** roteiro, movimento e revisão

**Especificação técnica:** [PRD-15-02-MOTION-MCP.md](PRD-15-02-MOTION-MCP.md)
**Detalhamento de implementação:** [grupo técnico Motion Design e Motion MCP](README.md)


## Inference profile default

**ID técnico primário proposto:** `qwen3.5-plus`  \
**ID técnico de escalonamento proposto:** `kimi-k3`  \
Os nomes exibidos são apenas rótulos. O `ModelCapabilityProfile` e o `ModelAdapter` resolvem o modelo elegível e suas capacidades; o `InferenceGateway` cuida do transporte e do failover do provedor. A senioridade vem da Fase 09; trocar o default exige benchmark e decisão registrada.

## Papel desta sprint

Esta é a sprint funcional guarda-chuva. A investigação do Spike e cada fatia de implementação pertencem às sprints filhas e devem entregar seus próprios artefatos, testes e evidências. A sprint só pode ser concluída após o relatório de integração consolidar esses resultados; o Spike não é produção nem depende de `SPRINT-15-01`.
## Objetivo

Entregar roteiro, movimento e revisão como uma fatia de produto demonstrável. A sprint deve resolver o problema descrito sem antecipar implementação de sprints posteriores e sem esconder decisões de integração.

## Trabalho

1. Descrever e implementar o caminho principal de roteiro, movimento e revisão.
2. Tratar loading, empty, error e success com mensagens e recuperação acionáveis.
3. Registrar origem, responsável, estado, última atualização e próximo passo quando aplicável.
4. Validar acesso, falha parcial, repetição segura e retorno ao canvas ou à tela de origem.
5. Registrar em integration-requirements toda integração externa, decisão de produto ou mock que não possa ser concluído localmente.

## Ferramentas do agente

O agente usará Remotion para o caminho code-first/template já previsto e uma tool/MCP interna da aplicação clone do Figma para criar designs vetoriais quando essa capability estiver disponível. Para o documento editável e a PoC deste PRD, o Motion MCP/engine é a fonte estruturada; o MCP do Figma é upstream de vetor e não um substituto da engine. Nenhum dos dois ganha painel MCP público para o usuário.

Para o escopo de documento editável definido no PRD, Remotion permanece o caminho code-first/template e não substitui a engine de documento compartilhada. O grupo técnico deve validar se o adapter Premation é o caminho de composição/render estruturado; qualquer divergência deve ser registrada no Spike antes de promover uma dependência.

A implementação técnica é dividida em `SPRINT-15-02-SPIKE-01`, `SPRINT-15-02-01` a `SPRINT-15-02-04` e, se necessário, `SPRINT-15-02-SVC-01`. Essa divisão não cria outro agente, não altera a ordem da Fase 10 e não bloqueia o MVP.

As skills são carregadas progressivamente a partir de `agent-skills/registry.json` e `agent-skills/compatibility/`. O agente recebe a skill canônica somente depois de resolver a capability do modelo; sintaxe específica de fornecedor fica no adapter, e não no prompt ou na skill. A skill de visão só pode ser usada quando o perfil efetivo declarar suporte visual e a entrada for um `assetInputRef` autorizado.

## Uso da tela de arquivos

Vídeos, animações, composições vetoriais, previews, exports e demais mídias produzidas pelo agente devem ser enviadas ao UploadThing por tool e vinculadas ao projeto, tarefa, versão, origem e agente responsável. Após a confirmação, devem aparecer na tela de arquivos com preview, tipo, copy ou descrição, data e status. O usuário somente consulta esses resultados na Data Table desktop ou nos cards mobile.

## Incluído

- Implementação da superfície indicada.
- Fixtures e dados de teste suficientes para demonstrar os estados.
- Testes proporcionais ao risco e documentação de operação local.
- Relatório de conclusão com evidências, riscos e integrações pendentes.

## Não incluído

Escopos de sprints futuras, dados inventados, bypass de autorização, publicação sem aprovação, mudança silenciosa de política ou promoção de engine visual externa sem Spike, benchmark e aprovação registrados.

## Critérios de aceite

- O caminho principal funciona do começo ao fim.
- A mídia produzida pelo agente aparece na tela de arquivos após upload confirmado pelo UploadThing, com versão, origem, data e status.
- O usuário não recebe controles de upload, edição ou exclusão nessa tela.
- Estados vazio, carregando, erro e sucesso são compreensíveis.
- Ações protegidas pedem confirmação ou aprovação quando necessário.
- Falhas não simulam sucesso nem perdem dados confirmados.
- A interface continua acessível por teclado e em viewport estreita.
- A troca entre composição, preview, inspeção e aprovação funciona em drawer/sheet sem rolagem horizontal essencial; foco, retorno e `prefers-reduced-motion` permanecem previsíveis em mobile.
- Trocar entre modelos elegíveis não exige duplicar a skill: o trace registra perfil, provider efetivo, capability aplicada e eventual rebaixamento pelo adapter.
- Lint, typecheck, build e testes da sprint passam.
- O relatório registra pendências sem transformar uma integração futura em comportamento falso.

## Verificação

Executar instalação e scripts de qualidade, percorrer o fluxo no navegador e validar uma fixture vazia, uma completa e uma com falha. Repetir operações para confirmar idempotência quando aplicável.

## Critério de conclusão

Usar `COMPLETE` somente quando o caminho de roteiro, revisão, artefato e integração técnica tiver evidência. Usar `COMPLETE_WITH_INTEGRATION_REQUIREMENTS` quando restarem apenas serviços externos, parecer jurídico ou adapters explicitamente registrados; manter `BLOCKED_BY_FOUNDATION_GATE` para dependência não resolvida.

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Usar COMPLETE quando os critérios forem demonstrados. Usar COMPLETE_WITH_INTEGRATION_REQUIREMENTS quando restarem somente integrações registradas; manter bloqueios visíveis quando houver decisão externa.
