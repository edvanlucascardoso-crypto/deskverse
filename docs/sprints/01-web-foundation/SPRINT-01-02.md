# SPRINT-01-02 — Workspace principal do canvas

**Fase:** 01 — Fundação Web
**Status:** COMPLETE_WITH_INTEGRATION_REQUIREMENTS
**Dependências:** SPRINT-01-01
**Superfície principal:** a área full-screen, tiles de agentes, seleção e sheet contextual

## Objetivo

Entregar a área full-screen, tiles de agentes, seleção e painel contextual como uma fatia utilizável do workspace. A sprint deve transformar o canvas em uma grade visual única, inspirada em um wall de logos: sem colunas de tarefas, lanes ou agrupamentos de Kanban.

## Trabalho

1. Definir o fluxo principal de a área central, cards de exemplo, seleção e painel contextual e os estados que o usuário precisa compreender.
2. Implementar o caminho feliz com componentes reutilizáveis e dados locais legíveis.
3. Implementar loading, empty, error e success, incluindo recuperação quando uma ação falhar.
4. Registrar em integration-requirements qualquer dependência de outra fase, sem esconder decisão dentro do renderer.
5. Cobrir loading, empty, error e success com mensagens acionáveis.
6. Exibir tiles/logos inicialmente cinza e dessaturados; colorir e destacar somente o agente em atividade.
7. Abrir detalhes, conversa e ações em sheet/drawer, mantendo a área principal do canvas livre.

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
- A grade não apresenta colunas, swimlanes ou agrupamentos que sugiram Kanban.
- Lint, typecheck e build passam; testes adicionais da sprint também passam.
- O relatório lista riscos e decisões que o Supervisor precisa integrar.

## Verificação

Executar instalação e scripts de qualidade do aplicativo, percorrer o caminho no navegador e testar uma fixture vazia, uma cheia e uma com falha. Registrar a evidência no relatório da sprint.

## Critério de conclusão

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Marcar como COMPLETE somente após todos os critérios serem demonstrados. Se depender de decisão externa, manter a sprint visível como BLOCKED_BY_FOUNDATION_GATE ou COMPLETE_WITH_INTEGRATION_REQUIREMENTS, sem apagar a pendência.
