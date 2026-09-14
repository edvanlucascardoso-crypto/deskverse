# Prompt de revisão do canvas

Revise a implementação do canvas do Deskverse seguindo esta decisão de produto. Trate este texto como requisito de interface, não como sugestão.

O canvas deve ocupar toda a viewport e ser a superfície dominante da aplicação. A composição deve ser uma grade espacial única de logos/tiles de agentes, inspirada em um wall visual de agentes. Ela não pode parecer um Kanban, uma lista de tarefas ou um dashboard com colunas, lanes, agrupamentos de trabalho ou sidebar permanente.

Cada agente deve aparecer como um tile compacto com logo/marca, nome e papel. As logos começam cinza, neutras e dessaturadas. Quando o agente estiver trabalhando ou se comunicando, sua logo pode ganhar a cor própria, halo, pulso e estado de presença. Agentes disponíveis ou aguardando permanecem visualmente discretos. O feedback visual deve sempre corresponder ao estado real da execução/notificação.

Os tiles devem ser minimalistas e quadrados em proporção 1:1 em desktop e mobile. Não adicione molduras, badges ou bordas internas envolvendo a logo: preserve uma composição limpa e use somente a borda externa do tile quando necessário para foco ou atividade.

Calcule a quantidade de colunas a partir do número de agentes visíveis, buscando uma composição próxima de quadrado (use a raiz quadrada arredondada para cima como referência). Quando a quantidade não fechar um quadrado perfeito, aceite uma última linha parcial e mantenha o reflow consistente; no mobile, limite as colunas à largura disponível.

No desktop, mantenha o wall menor e centralizado, limitando cada tile a aproximadamente 180px para evitar cards excessivamente grandes. No mobile, use a largura disponível de forma responsiva, preservando a proporção 1:1.

Use ícones/logos com linhas finas. A tag de estado deve ficar no canto superior direito do tile, com tratamento discreto e sem ocupar o centro visual da logo.

A logo deve ser grande, centralizada e ter opacidade baixa, aproximadamente 30%. Use traços ainda mais finos nos ícones. O nome do agente e seu cargo devem ficar centralizados sobre a logo. No rodapé, exiba uma frase curta de no máximo três palavras, preenchida pelo próprio agente para resumir o que ele está fazendo. O status deve ser somente uma bolinha no canto superior direito, com a borda externa do tile usando a mesma cor: roxo para trabalhando, vermelho para erro/ajuda, verde para disponível e amarelo para aguardando resposta.

Quando um agente se comunicar com outro, o tile emissor deve se mover para um slot imediatamente ao lado do destinatário. Os outros tiles devem fazer reflow espacial com Motion, de forma fluida, suave e rápida, sem atraso artificial. Preserve seleção, foco e contexto. A ordem deve mudar por atividade de comunicação, não por uma interação de drag-and-drop com semântica de Kanban.

Durante uma comunicação ativa, desenhe uma linha animada, discreta e não interativa ligando as bordas externas dos dois tiles. Ela deve acompanhar o reflow e desaparecer quando a comunicação terminar.

Use transições curtas e suaves no hover e foco. Mudanças de status devem animar discretamente ponto, borda, halo e cor da logo, comunicando a troca imediatamente sem tornar a interface lenta. Respeite `prefers-reduced-motion`.

O canvas deve continuar tomando a tela inteira quando um detalhe for aberto. Navegação, filtros, atividade, chat, configurações e contexto devem aparecer em sheets ou drawers sobre o canvas. Controles simples, como zoom, restaurar visão, encaixar na tela e iniciar uma demonstração, devem ser botões somente com ícone, com `aria-label`, tooltip e posição absoluta harmonicamente distribuída sobre o canvas. Não crie toolbar textual, menu fixo, coluna lateral ou painel permanente que reduza a área útil do canvas.

Revise também o mobile: preserve a grade visual, adapte o número de colunas e mova contexto/menus para drawers; não transforme a tela em tabela ou Kanban. Garanta teclado, foco visível, contraste, `prefers-reduced-motion`, estados loading/empty/error/success e componentes reutilizáveis.

Entregue: (1) diagnóstico do que ainda parece Kanban; (2) alterações propostas; (3) implementação; (4) validação em desktop e mobile; (5) confirmação de que os controles simples são icon-only e que o canvas ocupa toda a viewport.
