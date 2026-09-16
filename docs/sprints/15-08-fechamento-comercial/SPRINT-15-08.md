# SPRINT-15-08 — Agente futuro de fechamento comercial

**Fase:** 15 — Agentes Futuros
**Status inicial:** PLANNED
**Dependências:** Fases 09, 11 e 12, catálogo comercial e approval; não depende de `SPRINT-15-07`.
**Superfície principal:** proposta, aprovação e negociação

**Documentação:** [README](README.md) · [PRD](PRD-15-08-FECHAMENTO-COMERCIAL.md) · [integrações](INTEGRATION_REQUIREMENTS.md)


## Inference profile default

**Primary:** Muse Spark 1.3  \
**Escalation:** Muse Spark 1.3 (`max`, quando o provider efetivo suportar)  \
A senioridade vem da Fase 09; trocar o modelo padrão exige benchmark/decisão registrada, não apenas preferência do implementador.
## Objetivo

Entregar proposta, aprovação e negociação como uma fatia de produto demonstrável. A sprint deve resolver o problema descrito sem antecipar implementação de sprints posteriores e sem esconder decisões de integração.

## Trabalho

1. Descrever e implementar o caminho principal de proposta, aprovação e negociação.
2. Tratar loading, empty, error e success com mensagens e recuperação acionáveis.
3. Registrar origem, responsável, estado, última atualização e próximo passo quando aplicável.
4. Validar acesso, falha parcial, repetição segura e retorno ao canvas ou à tela de origem.
5. Registrar em integration-requirements toda integração externa, decisão de produto ou mock que não possa ser concluído localmente.

## Uso da tela de arquivos

Propostas, versões de copy, documentos comerciais e exports produzidos pelo agente devem ser enviados ao UploadThing por tool e vinculados ao projeto, oportunidade, tarefa, versão, origem e agente responsável. A versão confirmada aparece na tela de arquivos com copy ou descrição, data, status e histórico; o usuário somente consulta o resultado na tabela desktop ou nos cards mobile.

## Incluído

- Implementação da superfície indicada.
- Fixtures e dados de teste suficientes para demonstrar os estados.
- Testes proporcionais ao risco e documentação de operação local.
- Relatório de conclusão com evidências, riscos e integrações pendentes.

## Não incluído

Escopos de sprints futuras, dados inventados, bypass de autorização, publicação sem aprovação, mudança silenciosa de política ou dependência de engine visual externa.

## Critérios de aceite

- O caminho principal funciona do começo ao fim.
- As propostas e demais artefatos comerciais aparecem na tela de arquivos após upload confirmado, sem controles de CRUD para o usuário.
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
