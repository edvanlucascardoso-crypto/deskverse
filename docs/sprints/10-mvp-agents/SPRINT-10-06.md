# SPRINT-10-06 — Primeiro fluxo pós-onboarding

**Fase:** 10 — Agentes do MVP
**Status inicial:** PLANNED
**Dependências:** SPRINT-07-07, SPRINT-10-04 e SPRINT-10-05
**Ordem de criação:** 6 de 7
**Superfície principal:** primeira reunião

## Objetivo

Entregar o primeira reunião como uma fatia utilizável do MVP, com responsabilidades claras, estado rastreável e integração explícita com o canvas.

## Regras obrigatórias

- Confirmar objetivo, público, canal, tom e restrições conhecidas.
- Usar readiness e informação faltante para perguntar, propor ou escalar.
- Criar Initial Business Brief com origem, versão e desconhecidos explícitos.
- Mostrar somente agentes disponíveis e autorizados.
- Exibir o plano no canvas e conduzir ao Gate A0 sem exigir leitura de arquitetura.
- Persistir o Initial Business Brief e outros artefatos textuais do fluxo por tool no UploadThing, vinculando-os ao projeto e disponibilizando-os na tela de arquivos para consulta.

## Camada de elaboração do pedido

Como o usuário inicial será leigo, a primeira reunião deve transformar a linguagem natural em um brief refinado por meio de perguntas curtas, confirmação do resumo e encaminhamento ao agente líder. O mesmo mecanismo deverá funcionar quando a pessoa falar diretamente com um agente.

## Trabalho

Implementar o caminho acima com fixtures locais, estados loading, empty, error, success e WAITING_USER. Cada etapa deve apontar para origem, responsável, versão, dependências e próximo passo.

## Critérios de aceite

- As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

- O fluxo principal pode ser demonstrado do início ao fim.
- O usuário consegue abrir a tela de arquivos e consultar o brief persistido sem receber controles de CRUD ou upload manual.
- Falta de contexto, ferramenta, capacidade ou entitlement tem recuperação ou escalonamento.
- Aprovação, recusa e pedido de mudança alteram o fluxo de modo explícito.
- Takeover humano impede novos envios e não repete ações já confirmadas.
- A presença no canvas e o painel contextual mostram a mesma atividade.
- Não há dependência de engine 3D, runtime de jogo ou modelos legados.
- Lint, typecheck, build e testes da feature passam.

## Verificação

Executar cenário feliz, contexto faltante, erro de ferramenta e espera humana. Verificar o resultado no canvas, no painel e no histórico.

## Entregáveis

Código do agente ou fluxo, fixtures, testes, roteiro de demonstração e registro das integrações futuras.
