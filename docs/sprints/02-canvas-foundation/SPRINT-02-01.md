# SPRINT-02-01 — Canvas full-screen e grade espacial de agentes

**Fase:** 02 — Fundamento do Canvas
**Status:** COMPLETE_WITH_INTEGRATION_REQUIREMENTS
**Dependências:** nenhuma
**Superfície principal:** o canvas de tela inteira, a grade espacial e os estados de presença

## Objetivo

Entregar o canvas de tela inteira, a grade espacial de agentes e os estados de presença como uma fatia utilizável do workspace. O wall deve ser uma superfície contínua, sem agrupamentos, colunas ou lanes de Kanban.

## Trabalho

1. Definir o fluxo principal de a grade, agrupamentos, contadores e estados do painel e os estados que o usuário precisa compreender.
2. Implementar o caminho feliz com componentes reutilizáveis e dados locais legíveis.
3. Implementar loading, empty, error e success, incluindo recuperação quando uma ação falhar.
4. Registrar em integration-requirements qualquer dependência de outra fase, sem esconder decisão dentro do renderer.
5. Cobrir loading, empty, error e success com mensagens acionáveis.
6. Definir uma grade única de tiles com espaçamento regular, leitura imediata e logos inicialmente cinza/dessaturadas.
7. Reservar a viewport inteira ao canvas; navegação, filtros e atividade devem abrir em sheets/drawers.
8. Calcular as colunas do wall a partir da quantidade de agentes visíveis, priorizando uma geometria próxima de quadrado e permitindo uma última linha parcial quando necessário; limitar a densidade no mobile.
9. Manter o wall compacto e centralizado no desktop, com tiles de aproximadamente 180px no máximo, sem deixar os cards crescerem para preencher a viewport inteira.

## Incluído

- Implementação do fluxo descrito no objetivo.
- Fixtures locais para demonstração e testes.
- Estados de foco, seleção, disabled e erro quando aplicáveis.
- Fixtures de agentes com marca, papel, status e cor de atividade.
- Relatório de conclusão com evidências e integrações pendentes.

## Não incluído

Persistência remota, dados multiusuário, publicação, cobrança, execução autônoma ou regras de fases futuras não necessárias para demonstrar esta entrega.

## Entregáveis

Código funcional na superfície indicada, documentação curta de uso, validações automatizadas proporcionais ao risco e roteiro de demonstração reproduzível.

## Critérios de aceite

- O fluxo principal pode ser demonstrado do início ao fim.
- Estados vazio, carregando, erro e sucesso são visíveis e acionáveis.
- A interface continua utilizável em viewport estreita e com teclado.
- A mudança não quebra shell, canvas ou seleções já entregues.
- Não há dependência de WebGL, engine 3D, modelos legados ou runtime de jogo.
- O resultado não se parece com Kanban: não há colunas, swimlanes, agrupamentos de trabalho ou painel fixo reduzindo o canvas.
- Lint, typecheck e build passam; testes adicionais da sprint também passam.
- O relatório lista riscos e decisões que o Supervisor precisa integrar.

## Verificação

Executar instalação e scripts de qualidade do aplicativo, percorrer o caminho no navegador e testar uma fixture vazia, uma cheia e uma com falha. Registrar a evidência no relatório da sprint.

## Critério de conclusão

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Marcar como COMPLETE somente após todos os critérios serem demonstrados. Se depender de decisão externa, manter a sprint visível como BLOCKED_BY_FOUNDATION_GATE ou COMPLETE_WITH_INTEGRATION_REQUIREMENTS, sem apagar a pendência.
