# SPRINT-04-03 — Chat global privado reuniões e atividade

**Fase:** 04 — Pessoas e Atividade
**Status inicial:** PLANNED
**Dependências:** SPRINT-04-02
**Superfície principal:** chat global, chat privado, reunião e atividade ligada

## Objetivo

Entregar a experiência de chat global, chat privado, reunião e atividade ligada como uma fatia utilizável do workspace. A sprint deve transformar a missão da fase em comportamento observável, com limites claros e sem antecipar responsabilidades de fases posteriores.

## Modos de conversa

- O chat global lista todos os agentes do workspace e está disponível para leitura e participação dos agentes autorizados, além do usuário quando a superfície permitir.
- O chat privado é aberto ao clicar ou navegar por teclado até o card de um agente e contém somente a conversa com aquele agente, respeitando autorização e escopo.
- Mensagens mostram autor, data, estado de envio, origem e relação com atividade ou tarefa quando aplicável.
- Uma conversa entre agentes deve continuar sendo refletida nos cards e no histórico; o estado visual não pode afirmar entrega antes da confirmação do evento.
- A comunicação entre agentes é exibida em turnos sequenciais: uma conversa ativa por vez no fluxo visual, com o próximo participante iniciando somente após a anterior concluir ou aguardar.

## Trabalho

1. Definir o fluxo principal de chat global, chat privado, reunião e atividade ligada e os estados que o usuário precisa compreender.
2. Implementar o caminho feliz com componentes reutilizáveis e dados locais legíveis.
3. Implementar loading, empty, error e success, incluindo recuperação quando uma ação falhar.
4. Registrar em integration-requirements qualquer dependência de outra fase, sem esconder decisão dentro do renderer.
5. Mostrar origem, horário, estado desconhecido e próximo passo sem prometer uma ação externa.

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
- O chat global lista todos os agentes e um chat privado abre ao selecionar o card de um agente.
- A conversa mantém autoria, escopo, estado de envio e vínculo com a atividade correspondente.
- Estados vazio, carregando, erro e sucesso são visíveis e acionáveis.
- A interface continua utilizável em viewport estreita e com teclado.
- A mudança não quebra shell, canvas ou seleções já entregues.
- Não há dependência de WebGL, engine 3D, modelos legados ou runtime de jogo.
- Lint, typecheck e build passam; testes adicionais da sprint também passam.
- O relatório lista riscos e decisões que o Supervisor precisa integrar.

## Verificação

Executar instalação e scripts de qualidade do aplicativo, percorrer o caminho no navegador e testar uma fixture vazia, uma cheia e uma com falha. Registrar a evidência no relatório da sprint.

## Critério de conclusão

## Comunicação espacial entre agentes

Uma conversa entre agentes deve ser legível também no espaço: aproximar visualmente os cards envolvidos, manter o painel contextual sincronizado e devolver os cards ao arranjo anterior quando a comunicação terminar ou for cancelada. A interface mostra uma única conversa ativa por vez; paralelismo de execução não vira múltiplas conversas simultâneas no canvas.

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Marcar como COMPLETE somente após todos os critérios serem demonstrados. Se depender de decisão externa, manter a sprint visível como BLOCKED_BY_FOUNDATION_GATE ou COMPLETE_WITH_INTEGRATION_REQUIREMENTS, sem apagar a pendência.
