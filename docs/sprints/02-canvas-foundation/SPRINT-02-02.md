# SPRINT-02-02 — Logos, estados neutros e hierarquia visual

**Fase:** 02 — Fundamento do Canvas
**Status:** COMPLETE_WITH_INTEGRATION_REQUIREMENTS
**Dependências:** SPRINT-02-01
**Superfície principal:** tiles/logos de agente, identidade, papel e atividade

## Objetivo

Entregar tiles/logos de agente com identidade, papel, capacidade e atividade como uma fatia utilizável do workspace. Outros objetos do produto podem abrir em sheets relacionadas, mas não devem transformar a grade principal em um quadro de tarefas.

## Trabalho

1. Definir o fluxo principal de variantes de pessoa, agente, projeto, plano, tarefa, arquivo e entrega e os estados que o usuário precisa compreender.
2. Implementar o caminho feliz com componentes reutilizáveis e dados locais legíveis.
3. Implementar loading, empty, error e success, incluindo recuperação quando uma ação falhar.
4. Registrar em integration-requirements qualquer dependência de outra fase, sem esconder decisão dentro do renderer.
5. Cobrir loading, empty, error e success com mensagens acionáveis.
6. Manter logos neutras, cinza e dessaturadas quando o agente estiver disponível ou em espera.
7. Aplicar cor própria, halo e/ou pulso somente durante trabalho ou comunicação, com contraste e legenda acessíveis.
8. Manter cada tile com proporção 1:1 e visual minimalista, sem moldura ou borda interna ao redor da logo.
9. Usar traços finos nos ícones e posicionar a tag de estado no canto superior direito de cada tile.
10. Exibir logo grande centralizada com aproximadamente 30% de opacidade, nome e cargo sobrepostos no centro e uma frase de rodapé com no máximo três palavras, preenchida pelo agente.
11. Representar o status apenas por uma bolinha e pela borda externa correspondente: roxo/trabalhando, vermelho/erro ou ajuda, verde/disponível e amarelo/aguardando resposta.
12. Aplicar transições curtas e suaves no hover/foco, elevando e ampliando sutilmente o tile com Motion e transicionando fundo, borda e logo; animar discretamente ponto, borda, halo e cor da logo quando o status mudar, respeitando `prefers-reduced-motion`.

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
