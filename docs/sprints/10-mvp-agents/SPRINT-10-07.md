# SPRINT-10-07 — Experiência local integrada

**Fase:** 10 — Agentes do MVP
**Status inicial:** PLANNED
**Dependências:** SPRINT-06-07, SPRINT-09-06 e SPRINT-10-06
**Ordem de criação:** 7 de 7
**Superfície principal:** preview web local

## Objetivo

Entregar o preview web local como uma fatia utilizável do MVP, com responsabilidades claras, estado rastreável e integração explícita com o canvas.

## Regras obrigatórias

- Documentar comandos de iniciar, status, check e parada segura do aplicativo web.
- Criar fixture que percorra onboarding, plano Social, copy, Designer opcional, aprovação e entrega.
- Exibir os três agentes, histórico, erro e espera humana no preview.
- Garantir que o check detecte tarefas órfãs e aprovação pulada.
- Demonstrar a tela de arquivos com os trabalhos confirmados do fluxo na Data Table paginada com busca e na lista de cards mobile.
- Demonstrar chat global, chat privado, notificação em tempo real, feedback nos cards e recuperação de uma preferência ou decisão salva em pgvector.
- Manter a demonstração local sem Stem, ponte, Blender, jogo ou engine 3D.

## Trabalho

Implementar o caminho acima com fixtures locais, estados loading, empty, error, success e WAITING_USER. Cada etapa deve apontar para origem, responsável, versão, dependências e próximo passo.

## Critérios de aceite

- As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

- O fluxo principal pode ser demonstrado do início ao fim.
- Briefing/planejamento, copy e imagem ou export aparecem na tela de arquivos após upload confirmado, com a consulta desktop e mobile funcionando.
- A tela de arquivos permanece somente leitura para o usuário, sem CRUD ou upload manual.
- Chat, notificações, cards e memória apresentam o mesmo estado confirmado, incluindo uma permissão pendente e uma conclusão.
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
