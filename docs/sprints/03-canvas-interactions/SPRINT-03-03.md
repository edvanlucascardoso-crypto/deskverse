# SPRINT-03-03 — Movimentação espacial e comunicação entre agentes

**Fase:** 03 — Interações do Canvas
**Status:** COMPLETE_WITH_INTEGRATION_REQUIREMENTS
**Dependências:** SPRINT-03-02
**Superfície principal:** movimento espacial automático, comunicação e reflow

## Objetivo

Entregar movimento espacial automático, comunicação entre agentes e reflow como uma fatia utilizável do canvas. A ordem visual não é uma coluna de tarefas editável: ela muda para comunicar o trabalho que está acontecendo.

## Trabalho

1. Definir o fluxo principal de arraste, movimento por teclado, snap e recuperação e os estados que o usuário precisa compreender.
2. Implementar o caminho feliz com componentes reutilizáveis e dados locais legíveis.
3. Implementar loading, empty, error e success, incluindo recuperação quando uma ação falhar.
4. Registrar em integration-requirements qualquer dependência de outra fase, sem esconder decisão dentro do renderer.
5. Garantir equivalência entre mouse, teclado, foco visível e leitor de tela.
6. Quando o agente emissor se comunicar com o destinatário, mover o emissor para um slot imediatamente ao lado dele e reorganizar os demais tiles com Motion. A comunicação visual é serializada: somente uma dupla conversa por vez e o próximo emissor inicia após a conclusão ou a espera da dupla atual.
7. Permitir reposicionamento manual de qualquer tile: click-and-hold com arraste no desktop e long press de um segundo seguido de arraste no mobile. Durante o arraste, reorganizar os demais tiles com Motion, como o rearranjo de ícones do iOS, sem introduzir semântica de Kanban.
8. Persistir a ordem por usuário e workspace de forma assíncrona e não bloqueante em PostgreSQL via Prisma. Criar migration para o schema de layout, atualizar a UI de modo otimista, registrar erro recuperável e preservar a ordem local quando a rede falhar.

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

## Comunicação espacial entre agentes

Quando um agente iniciar uma comunicação com outro, o card de origem deve animar-se para um slot imediatamente ao lado do card de destino. Os demais cards devem se rearranjar no grid com reflow animado e uma lacuna/placeholder compreensível, preservando a ordem e o foco. O movimento só ocorre a partir de uma atividade explícita. Cada conversa é um turno: não apresentar todos os agentes falando simultaneamente; o próximo handoff aguarda o término ou estado de espera do anterior.

## Reposicionamento manual e persistência

O arranjo manual é uma preferência do usuário, não um estado de tarefa. A UI deve atualizar primeiro e salvar depois, sem travar o gesto. O modelo Prisma e a migration devem guardar uma ordem versionada por usuário e workspace; em falha, mostre feedback recuperável sem descartar o arranjo local.

## Motion e imersão

As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

Marcar como COMPLETE somente após todos os critérios serem demonstrados. Se depender de decisão externa, manter a sprint visível como BLOCKED_BY_FOUNDATION_GATE ou COMPLETE_WITH_INTEGRATION_REQUIREMENTS, sem apagar a pendência.
