# SPRINT-15-05 — Agente futuro de contabilidade brasileira

**Fase:** 15 — Agentes Futuros
**Status inicial:** PLANNED
**Dependências:** SPRINT-15-04
**Superfície principal:** classificação, documentos e ressalvas


## Inference profile default

**Primary:** Gemini 3.1 Pro  \
**Escalation:** Muse Spark 1.3 (`max`, quando o provider efetivo suportar) + aprovação humana  \
GPT-5.6 Sol permanece somente como último recurso quando o benchmark ou a avaliação de risco não demonstrar paridade.
A senioridade vem da Fase 09; trocar o modelo padrão exige benchmark/decisão registrada, não apenas preferência do implementador.
## Objetivo

Entregar classificação, documentos e ressalvas como uma fatia de produto demonstrável. A sprint deve resolver o problema descrito sem antecipar implementação de sprints posteriores e sem esconder decisões de integração.

## Trabalho

1. Descrever e implementar o caminho principal de classificação, documentos e ressalvas.
2. Tratar loading, empty, error e success com mensagens e recuperação acionáveis.
3. Registrar origem, responsável, estado, última atualização e próximo passo quando aplicável.
4. Validar acesso, falha parcial, repetição segura e retorno ao canvas ou à tela de origem.
5. Registrar em integration-requirements toda integração externa, decisão de produto ou mock que não possa ser concluído localmente.

## Uso da tela de arquivos

Documentos, relatórios, planilhas, anexos e demais arquivos produzidos pelo agente devem ser enviados ao UploadThing por tool, vinculados ao projeto, tarefa, versão, origem e agente responsável. Depois da confirmação, ficam disponíveis para consulta na tela de arquivos, com tipo, descrição/copy, data, status e demais metadados; no mobile, a mesma informação aparece em cards.

## Incluído

- Implementação da superfície indicada.
- Fixtures e dados de teste suficientes para demonstrar os estados.
- Testes proporcionais ao risco e documentação de operação local.
- Relatório de conclusão com evidências, riscos e integrações pendentes.

## Não incluído

Escopos de sprints futuras, dados inventados, bypass de autorização, publicação sem aprovação, mudança silenciosa de política ou dependência de engine visual externa.

## Critérios de aceite

- O caminho principal funciona do começo ao fim.
- Os documentos e relatórios produzidos aparecem na tela de arquivos após upload confirmado, sem upload ou edição manual pelo usuário.
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
