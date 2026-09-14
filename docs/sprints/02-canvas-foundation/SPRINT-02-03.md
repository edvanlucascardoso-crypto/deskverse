# SPRINT-02-03 — Composição única do wall e sheets contextuais

**Fase:** 02 — Fundamento do Canvas
**Status:** COMPLETE_WITH_INTEGRATION_REQUIREMENTS
**Dependências:** SPRINT-02-02
**Superfície principal:** composição espacial única, seleção e sheets de contexto

## Objetivo

Entregar a composição espacial única do wall e suas sheets contextuais como uma fatia utilizável do workspace. Filtros de atividade podem mudar o conjunto visível, mas não devem criar colunas, grupos ou uma visão Kanban.

## Trabalho

1. Definir o fluxo principal de visão geral, foco em trabalho e foco em pessoas e os estados que o usuário precisa compreender.
2. Implementar o caminho feliz com componentes reutilizáveis e dados locais legíveis.
3. Implementar loading, empty, error e success, incluindo recuperação quando uma ação falhar.
4. Registrar em integration-requirements qualquer dependência de outra fase, sem esconder decisão dentro do renderer.
5. Cobrir loading, empty, error e success com mensagens acionáveis.
6. Durante a comunicação entre agentes, conectar emissor e destinatário com uma linha animada que acompanhe o reflow e suma quando a comunicação encerrar. A projeção visual admite uma conversa ativa por vez: o próximo handoff só começa depois de a conversa atual concluir ou entrar em espera.
6. Abrir navegação, filtros, histórico, chat e detalhes em sheets/drawers sobre o canvas.
7. Garantir que a grade continue sendo a leitura dominante em todas as variações.

## Incluído

- Implementação do fluxo descrito no objetivo.
- Fixtures locais para demonstração e testes.
- Estados de foco, seleção, disabled e erro quando aplicáveis.
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
- Lint, typecheck e build passam; testes adicionais da sprint também passam.
- O relatório lista riscos e decisões que o Supervisor precisa integrar.

## Verificação

Executar instalação e scripts de qualidade do aplicativo, percorrer o caminho no navegador e testar uma fixture vazia, uma cheia e uma com falha. Registrar a evidência no relatório da sprint.

## Critério de conclusão

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Marcar como COMPLETE somente após todos os critérios serem demonstrados. Se depender de decisão externa, manter a sprint visível como BLOCKED_BY_FOUNDATION_GATE ou COMPLETE_WITH_INTEGRATION_REQUIREMENTS, sem apagar a pendência.
