# AGENTS — Deskverse

Estas instruções valem para todo o repositório.

## Produto

O Deskverse é uma aplicação web de workspace visual:

- Next 16, React, Tailwind CSS, shadcn/ui, React Flow quando relações entre itens precisarem ser exibidas e Motion para transições.
- O código-fonte do app Next.js fica em `src`, com `src/app` para App Router e `src/components` para componentes; `package.json`, `next.config.ts`, `tsconfig.json`, `public` e demais configurações ficam na raiz do projeto.
- Antes de alterar código ou configuração do Next.js, consulte a documentação local correspondente em `node_modules/next/dist/docs/`.
- Workspace central em canvas DOM de tela inteira, com uma grade espacial de tiles/logos dos agentes. Não tratar essa superfície como Kanban, lista de tarefas ou quadro com colunas.
- O Deskverse não é uma agência de marketing digital virtual: cada agente representa um profissional independente, com identidade, escopo, capacidade e responsabilidade próprios.
- Uma tarefa pode ser recebida por um único agente e executada de forma independente (`SOLO`) ou pode ter uma colaboração explícita entre dois ou mais agentes (`COLLABORATION`). Não criar uma cadeia fixa de marketing, uma hierarquia ou uma delegação automática só porque capacidades diferentes estão disponíveis.
- O agente responsável e o modo de execução devem ser definidos ou confirmados no pedido. Um agente pode propor colaboração quando isso melhorar o resultado, mas a proposta, os participantes, os motivos e a decisão ficam no histórico da tarefa.
- Cards representam pessoas, agentes, projetos, planos, tarefas, arquivos, entregas e atividade.
- Painéis contextuais mostram conversa, estado, decisão pendente e histórico.
- A tela dedicada de gerenciamento de projetos, separada do canvas e dos painéis contextuais, é somente leitura para o usuário: exibe projetos, objetivos, planos, tarefas, dependências, responsáveis, prazos, saúde e histórico sem oferecer operações de criação, edição ou exclusão.
- Alterações de planejamento são feitas exclusivamente por tools autorizadas do agente responsável pelo planejamento naquele contexto, com origem, estado anterior, novo estado, motivo e próximo passo rastreáveis; nenhum papel ganha privilégio apenas por senioridade.
- Antes da criação dos agentes do MVP, a Fase 08 deve entregar a tela de arquivos dos projetos: os agentes enviam seus trabalhos para o UploadThing por tools e o usuário apenas consulta os arquivos e metadados.
- Antes da criação dos agentes do MVP, a SPRINT-08-00 deve entregar a Biblioteca de Assets do workspace: o usuário pode cadastrar áudio, vídeo, imagem, documento e outros formatos suportados no UploadThing, inserir uma descrição de uso e disponibilizar o asset aos agentes autorizados do mesmo workspace. A descrição autoral, a finalidade, as restrições, a versão, a permissão e o estado de compreensão entram no contexto do agente; a biblioteca não é pública na internet.
- A tela de arquivos usa Data Table do shadcn/ui com paginação e busca adaptadas ao mobile/tablet; a mesma informação vira uma lista de cards sem exigir rolagem horizontal.
- O usuário deve acompanhar o trabalho sem perder posição, foco ou contexto.
- Toda interface ou funcionalidade deve ser pensada desde o início para usabilidade mobile: layout responsivo, hierarquia legível, ações acessíveis por toque e teclado, estados completos e nenhum fluxo essencial dependente de largura de desktop.
- O produto não possui uma visão desktop separada: mobile é a base e tablet apenas amplia espaçamentos e dimensões dentro da mesma composição.
- Crie componentes reutilizáveis sempre que a repetição, a consistência visual ou a composição da interface tornar isso oportuno; mantenha APIs pequenas, acessíveis e próximas do domínio que realmente compartilham.
- Evite arquivos muito longos e vários componentes, funções ou responsabilidades sem relação no mesmo arquivo. Separe módulos por domínio e responsabilidade quando o tamanho, a reutilização ou a testabilidade justificar.
- Prefira funções pequenas e reutilizáveis, extraia lógica compartilhada em módulos próprios e reutilize funções existentes antes de criar duplicações locais.
- Existe um chat global com todos os agentes listados e disponível para todos os agentes, além de chats privados abertos ao selecionar o card de um agente. O chat global pode alimentar a memória compartilhada; o privado respeita o escopo e a permissão da conversa.
- Notificações em tempo real são o canal principal para pedidos de permissão, incluindo solicitações de alteração da própria configuração do agente, e também comunicam conclusão, falha, espera e mudanças relevantes.
- Cada card deve refletir visualmente a atividade, a permissão pendente, a espera, a conclusão ou a falha correspondente à notificação e à execução real.

## Stack obrigatória

- Next 16
- Tailwind CSS
- shadcn/ui
- Better Auth
- Prisma ORM
- Zod
- React Hook Form
- Lucide Icons
- date-fns
- Motion
- PostgreSQL
- pgvector como extensão do PostgreSQL para toda memória dos agentes
- Abacate Pay para billing e pagamentos
- UploadThing para armazenamento dos arquivos produzidos pelos agentes

Use essa stack como padrão do produto. Uma dependência adicional precisa de justificativa no escopo da sprint e não deve duplicar uma capacidade já coberta por esses componentes.
Abacate Pay é o provedor oficial de billing: checkout, assinaturas, retorno, webhooks e reconciliação devem seguir esse provedor.

## Arquitetura operacional de agentes

- `Agent` é a identidade persistente de um profissional independente e pode receber uma tarefa diretamente.
- `LeaderAgent` é um papel de coordenação que um agente pode exercer em uma colaboração; não significa que toda tarefa precise de um líder nem que exista uma organização hierárquica padrão.
- `SpecialistAgent` é lógico, reutilizável e compartilhado quando a tarefa pedir uma capacidade específica. A delegação usa especialidade/capacidade; não usa ID fixo de agente ou worker.
- `WorkerAgent` é efêmero e representa uma execução LLM, CPU, GPU, navegador, render ou mídia. Não deve virar identidade persistente na interface.
- Uma colaboração não transforma especialistas em subordinados nem altera permissões, senioridade ou escopo. Cada agente conserva sua própria tarefa, evidência, decisão e responsabilidade.
- O contrato do produto é `Harness = AgentPolicy + TaskPolicy + ModelAdapter`.
- `AgentRuntime` abstrai Eve. `InferenceGateway` abstrai o Vercel AI Gateway. O Deskverse decide inteligência e política; runtime executa e gateway transporta.
- A métrica principal é `cost_per_successful_task`: custo total atribuível às tentativas dividido pelo número de tarefas concluídas corretamente.
- Todo trace registra senioridade e raciocínio solicitados, aplicados e eventualmente rebaixados pelo adapter. GPT-5.6 Luna é a única exceção OpenAI autorizada a usar `max`, sempre com `ModelCapabilityProfile`, provider efetivo e benchmark que demonstrem suporte; GPT-5.6 Sol, os demais modelos OpenAI e Anthropic nunca usam `max`. Outras famílias dependem do profile e do benchmark.
- Filas são separadas em líder, especialidade compartilhada e classe física (`LLM`, `CPU`, `GPU`, `BROWSER`, `RENDER`), com prioridade, FIFO por faixa, aging, justiça, limite de concorrência, backpressure, lease/heartbeat, retry técnico idempotente, deduplicação quando aplicável, dead-letter e cancelamento em cascata.
- `WAITING_USER` e `WAITING_APPROVAL` persistem checkpoint e liberam a execução física. Falha técnica e falha semântica têm tratamentos distintos.

## Banco de dados e migrations

- PostgreSQL é o banco de dados da aplicação e Prisma ORM é a camada de acesso e evolução do modelo.
- Toda alteração persistente — incluindo modelos, campos, relações, enums, índices ou restrições — deve gerar uma migration Prisma versionada.
- A migration e a alteração do schema devem entrar no mesmo commit da funcionalidade.
- Não use alteração manual no banco ou prisma db push para substituir uma migration versionada.
- Valide a migration em banco local limpo, confirme prisma migrate status e registre incompatibilidades ou etapas de dados na sprint.
- Alterações de dados existentes devem ser seguras, repetíveis e acompanhadas de estratégia explícita de backfill quando necessário.
- Zod valida entradas e dados nas bordas da aplicação; não substitui a migration nem a integridade do PostgreSQL.

## Fonte de verdade

Antes de escolher ou iniciar uma sprint, leia:

1. docs/sprints/SPRINT_STATUS.md
2. docs/sprints/00-meta/SPRINT_MANIFEST.json
3. docs/sprints/00-meta/SUPERVISOR_PROMPT.md
4. a README e o arquivo da sprint escolhida
5. docs/history/README.md e o registro histórico mais recente relacionado ao escopo

O manifesto define ordem, dependências, ambiente e prioridade. Sprints ativas ficam em docs/sprints/<fase>/. Sprints concluídas ficam em docs/sprints/completed/<fase>/.

A próxima prioridade é SPRINT-07-02 — Upload e armazenamento de arquivos. A SPRINT-07-01 foi concluída com requisitos de integração; a fundação 06-01 a 06-07 precedeu a Sprint 05-01 por override explícito do manifesto.

Toda mudança de produto, arquitetura, contrato, sprint, estado visível ou decisão de integração deve criar ou atualizar um registro em `docs/history/` no mesmo conjunto de trabalho. O histórico é append-only: registros anteriores não são reescritos; correções e novas decisões entram em um novo registro relacionado.

## Checkpoints executivos

- Depois de cada conjunto relevante de sprints executadas — no mínimo ao encerrar uma fase ou uma fundação que altere a direção do produto — criar um checkpoint executivo objetivo e detalhado.
- Os checkpoints ficam em pastas irmãs de `docs/sprints`, imediatamente depois da última fase incluída no conjunto e antes da próxima fase planejada.
- Usar o padrão `docs/sprints/<última-fase>-checkpoint-<n>` para preservar a ordenação natural. Exemplo: `docs/sprints/06-checkpoint-1` deve aparecer depois de `06-account-platform` e antes de `07-onboarding-knowledge`.
- O `README.md` do checkpoint deve registrar o corte temporal, escopo, status, entregas por fase e sprint, evidências de validação, integrações pendentes, riscos, itens explicitamente fora do escopo e a próxima prioridade, com links para os documentos-fonte.
- Para produzir o checkpoint, conferir `SPRINT_STATUS.md`, `SPRINT_MANIFEST.json`, `SUPERVISOR_PROMPT.md`, o README da fase e seus relatórios de conclusão e integração. Não apresentar integração pendente, mock, fixture ou evidência ausente como funcionalidade concluída.
- Numerar checkpoints em sequência e manter os anteriores imutáveis, salvo correção explícita de fato ou decisão documentada.

## Ordem de criação dos agentes do MVP

A ordem abaixo é obrigatória para criação dos primeiros agentes e deve permanecer visível no roadmap e nas implementações. Ela não define um funil de execução nem obriga os agentes a trabalharem em conjunto:

1. SPRINT-10-01 — Mídias Sociais
2. SPRINT-10-02 — Redator
3. SPRINT-10-03 — Designer
4. SPRINT-10-04 — colaboração opcional entre Mídias Sociais, Redator e Designer
5. SPRINT-10-05 — presença dos três no escritório
6. SPRINT-10-06 — primeira tarefa independente e primeira colaboração pós-onboarding
7. SPRINT-10-07 — experiência local integrada

O Gate A0 é: pedido contextualizado → agente responsável escolhido → execução independente ou colaboração explícita → aprovação humana quando necessária → entrega confirmada. Mídias Sociais, Redator e Designer podem participar de uma mesma colaboração, mas nenhum deles é etapa obrigatória para toda tarefa; quando a tarefa for bem resolvida por um agente, ela deve concluir sem criar etapas artificiais.

## Comportamento dos agentes

- Usuários leigos recebem perguntas curtas de refinamento quando a instrução estiver ambígua.
- A camada de refinamento confirma um brief antes de executar ou delegar ao líder ou ao agente direto.
- A instrução original, perguntas, respostas e decisões permanecem rastreáveis.
- Agentes podem colaborar para melhorar o pedido antes de produzir o resultado, mas a colaboração é opt-in, tem participantes e motivo explícitos e não substitui a responsabilidade individual de cada agente.
- A tarefa deve registrar se será executada em modo independente (`SOLO`) ou colaborativo (`COLLABORATION`), quem é o responsável, quais agentes participam, o motivo da composição e o resultado de cada participante.
- Aprovação, espera, cancelamento, takeover e escalonamento são estados visíveis.
- Takeover humano interrompe ações protegidas e novos envios.
- Fatos ausentes ou conflitantes geram pergunta ou escalonamento; não invente preço, política, prazo ou promessa.
- Ferramentas são autorizadas por capacidade, permissão, conexão, autonomia e contexto do workspace.
- Pedidos aceitam referências anexadas pelo usuário, incluindo imagens, PDFs, documentos, planilhas, textos e outros formatos suportados. O vínculo da referência ao pedido, tarefa e agente, além do nome, tipo, versão, origem, permissão e estado de compreensão, deve ser rastreável.
- A fundação de referências deve existir antes da criação do primeiro agente: armazenamento, validação, acesso controlado, extração/normalização e entendimento por agentes de imagens e documentos suportados. Áudio, vídeo e música podem ser armazenados como referência com metadados desde o início, mas sua interpretação semântica é uma feature futura e não pode ser simulada como disponível.
- O contexto entregue ao agente deve indicar quais referências foram compreendidas, quais estão apenas armazenadas e quais falharam, sem inventar conteúdo ausente.
- Toda memória dos agentes — compartilhada, individual, de projeto, preferência, decisão, tarefa ou conversa elegível — usa PostgreSQL com pgvector; não crie um segundo armazenamento de memória.
- Preferências alteradas, tarefas concluídas, decisões confirmadas e outros fatos duráveis podem ser salvos em memória com origem, escopo, data e confiança para serem recuperados depois.
- Um agente pode solicitar, por tool, alteração da própria configuração quando isso for necessário, mas a mudança só ocorre após a permissão adequada e deve gerar notificação em tempo real e feedback visível no card.
- Todos os agentes devem usar o sistema de notificações em tempo real para pedidos de permissão, espera, falha, conclusão e eventos que exigem atenção humana ou de outro agente.
- WhatsApp e Instagram usam um núcleo de mensagens neutro ao provedor; contas são autenticadas por workspace e atribuídas com permissões por especialidade. A inbox unificada cobre mensagens, DMs e comentários. Takeover humano exige sinal confiável de coexistência e a escalação preserva agente, superior, humano, motivo e auditoria.

## Histórico obrigatório de mudanças

- Antes de implementar qualquer alteração relevante, identificar o registro histórico correspondente ou criar um novo em `docs/history/`.
- Cada registro deve informar data, escopo, motivo, estado anterior, novo estado, impacto em produto/arquitetura/roadmap, sprints afetadas, evidências, riscos, pendências e decisão necessária quando houver.
- Alterações de código, configuração, schema, migration, sprint, contrato ou interface só podem ser consideradas concluídas quando o histórico relacionado também estiver atualizado.
- Não apagar, sobrescrever ou reordenar registros históricos para esconder decisões anteriores. Se uma decisão mudar, registrar o antes e o depois em um novo documento e apontar para o registro anterior.
- O histórico em `docs/history/` complementa relatórios de sprint e checkpoints; não substitui evidências de testes nem os documentos de integração.

## Linguagem da aplicação

- A interface usa português do Brasil natural, direto e próximo da fala comum. Escreva para uma pessoa que não conhece a arquitetura interna do produto.
- Evite traduções literais de jargões de produto ou de convenções estrangeiras quando houver uma expressão clara em português. Por exemplo, prefira “Caminho completo”, “Em andamento”, “Pedir uma informação”, “Pedir aprovação”, “Erro recuperável” e “Continuar de onde parou” a traduções pouco naturais ou termos técnicos sem explicação.
- Marcas, nomes próprios e termos técnicos que realmente não tenham equivalente adequado permanecem no original, como Apple, Deskverse, UploadThing, workspace, API ou PostgreSQL. O uso deve ser consistente e não transformar a interface em uma mistura desnecessária de idiomas.
- Estados internos, enums, nomes de ferramentas e contratos de código podem permanecer em inglês quando isso evitar ambiguidade; a camada visível ao usuário deve apresentar uma descrição simples em português.
- Botões, títulos, mensagens de erro, notificações e estados de espera devem dizer claramente o que aconteceu e qual ação a pessoa pode tomar. Não use rótulos abstratos como “Fluxo feliz”, “retry” ou “checkpoint” sem contexto.
- Quando um termo técnico for indispensável, explique-o na própria interface ou em um texto de apoio curto. Use a mesma palavra para o mesmo conceito em todas as telas.

## Organização de schemas, resolvers e tipos

- Schemas compartilhados do Zod ficam em `src/zod/schemas`, separados por domínio. Rotas e componentes não devem criar schemas inline quando o contrato puder ser reutilizado.
- Resolvers usados pelo React Hook Form ficam em `src/zod/resolvers`, separados dos schemas. Componentes de formulário devem consumir os resolvers exportados desse diretório.
- Tipos compartilhados ficam em `src/types` e todos os arquivos de tipos usam a extensão `.d.ts`. Tipos de domínio, entradas de formulário e contratos entre camadas devem ser exportados de lá quando puderem ser reutilizados.
- Sempre tente ao máximo separar funções, tipos e componentes em arquivos reutilizáveis, pequenos e orientados por domínio. Extraia lógica compartilhada antes de duplicá-la e mantenha APIs próximas da responsabilidade que elas realmente compartilham.
- Antes de usar Zod, React Hook Form, resolvers ou qualquer biblioteca nova, verifique a documentação local e evite APIs marcadas como `deprecated`. Quando houver dúvida sobre a API ou sua vigência, pesquise primeiro a documentação oficial na web e registre a decisão quando ela afetar a sprint.

## Capacidades específicas

- O agente de imagem tem dois níveis: Apenas criação de imagens e Criação e edição.
- No MVP, a arte social media usa um LLM orquestrador e a API de imagens da OpenAI, com UploadThing para os arquivos produzidos. A plataforma própria de imagem — Qwen-Image, FLUX.2 Klein e Image Editing Tool — é posterior e não bloqueia os três primeiros agentes.
- A tool própria de imagem, quando iniciada na SPRINT-15-19, trabalha com composição JSON, layers, transformações, alpha, blend modes, máscaras, ajustes, comandos undo/redo, API para agentes e exportação PNG; serviços/API e Redis compartilhado rodam no Railway, workers com GPU rodam no RunPod Serverless e seus assets de mídia usam Cloudflare R2.
- O agente de motion design usa Remotion e uma tool/MCP interna baseada no clone do Figma para criar vetores. Essa tool é interna aos agentes e não ganha uma tela pública sem decisão explícita.
- O agente de edição de vídeo possui níveis Básico, Intermediário e Avançado. As capacidades de cada nível são definidas na sprint de implementação.
- O futuro Masterizador de Áudio é um profissional independente que recebe referências de áudio e um propósito de uso, produz um diagnóstico técnico — loudness, true peak, clipping, faixa dinâmica, ruído, equilíbrio espectral e compatibilidade mono/estéreo — e pode propor ou executar uma cadeia não destrutiva de EQ, compressão, limitação e ganho. Essa análise técnica não equivale à interpretação semântica de música, que continua futura.
- A tool/MCP do Masterizador de Áudio deve ficar atrás de um adapter privado do Deskverse e ser derivada de projetos open source versionados, reproduzíveis e auditados quanto a licença, checksum, codecs, limites de recurso e comportamento. O agente nunca sobrescreve o original: cada render gera uma versão, compara antes/depois e registra parâmetros, ferramenta, provider efetivo e evidência.
- Social Media, Design e Edição de Vídeo oferecem estilos diferentes por select na interface de criação/configuração. As famílias de estilo são definidas durante a implementação de cada agente.
- Convites e entrada de colaboradores pertencem à SPRINT-16-01 e não fazem parte do primeiro uso. Ela só pode iniciar após os agentes do MVP existirem, mas não bloqueia nem depende de uma posição fixa nas fases posteriores.

## Canvas, movimento e imersão

- Use componentes DOM e mantenha as regras próximas da feature, com tipos, estado e fixtures locais.
- O canvas deve ocupar toda a viewport. Não reserve uma coluna permanente para menus, filtros, atividade ou contexto; essas superfícies devem abrir em sheets/drawers sobre o canvas.
- Os controles do canvas devem ser botões somente com ícone, com `aria-label` e tooltip, distribuídos harmonicamente em posição absoluta sobre o canvas. Não adicionar zoom in/out ou tela cheia à barra; a escala deve permanecer simples e adequada a gestos do dispositivo.
- A composição principal é uma grade espacial única de logos/tiles de agentes, sem lanes, colunas, agrupamentos de trabalho ou semântica de Kanban.
- O número de colunas do wall deve considerar a quantidade de agentes visíveis: priorize uma geometria próxima de quadrado, usando a raiz quadrada arredondada para cima como referência, e aceite uma última linha parcial quando a quantidade não formar um quadrado perfeito; adapte o limite de colunas à largura mobile.
- Em mobile e tablet, mantenha o wall compacto e centralizado, permitindo que os tiles ocupem a largura disponível sem perder a proporção 1:1.
- Em mobile e tablet, use quatro posições por linha, como uma tela inicial de ícones; mantenha espaçamento uniforme e compacto, aceitando a última linha incompleta sem esticar os cards.
- Os tiles de agentes devem ser minimalistas e manter proporção 1:1 em qualquer viewport. Não crie molduras, badges ou bordas internas envolvendo a logo; mantenha apenas a borda externa necessária para foco e estado de atividade.
- Ícones/logos devem usar traços finos. Tags de estado ficam no canto superior direito do tile, sem competir com a logo ou com o nome do agente.
- O ícone/logo deve ser grande, centralizado e ter opacidade baixa, aproximadamente 30%; nome e cargo ficam centralizados sobre a logo. O rodapé exibe uma frase de no máximo três palavras preenchida pelo agente para resumir a ação atual.
- O status visual do tile é somente uma bolinha colorida no canto superior direito, e a borda externa acompanha a mesma cor: roxo para trabalhando, vermelho para erro/ajuda, verde para disponível e amarelo para aguardando resposta.
- A logo de cada agente começa neutra, cinza e dessaturada. Ela só ganha a cor própria, halo ou pulso quando o agente estiver trabalhando ou participando de uma comunicação; espera e disponibilidade permanecem visualmente discretas.
- Quando um agente se comunicar com outro, mova o card emissor para um slot ao lado do destinatário.
- Enquanto a comunicação estiver ativa, conecte os dois tiles com uma linha animada e discreta, desenhada entre as bordas externas dos cards e sincronizada com o reflow.
- O usuário pode reposicionar qualquer tile com interação de ponteiro/toque: inicia o arraste após segurar o tile por um segundo. Enquanto arrasta, os demais tiles fazem reflow fluido e rápido, inspirado no rearranjo de ícones do iOS.
- A ordem manual é uma preferência por usuário e workspace. A atualização visual não pode esperar a rede; persista a nova ordem de forma assíncrona em PostgreSQL por meio de Prisma, com migration obrigatória, retry/feedback não bloqueante e sem perder a ordem local em caso de falha.
- Grupos de agentes com comunicação interna mediada por um líder pertencem a uma funcionalidade futura. Não antecipe containers, hierarquias ou regras de execução de grupo no canvas atual; quando a sprint futura for iniciada, cada grupo deve coexistir no mesmo canvas e preservar os princípios de reflow, acessibilidade e comunicação visual.
- Reorganize os demais cards com reflow animado e preserve a continuidade espacial.
- Mudanças no grid devem nascer de atividade explícita, manter seleção e foco e mostrar o estado da comunicação.
- Animações devem ser fluidas, suaves e rápidas, sem espera artificial ou sensação de lentidão.
- Hover, foco, mudança de status e entrada/saída de atividade devem ter transições curtas e suaves; o hover do tile deve elevar e ampliar sutilmente o card com Motion, enquanto fundo, borda e logo fazem transição. Quando o status mudar, anime discretamente o ponto, a borda e o halo para comunicar a mudança sem distrair.
- Toda animação relevante deve considerar prefers-reduced-motion.
- Não esconda erro, espera humana ou indisponibilidade atrás de animação.
- A aplicação mobile/tablet deve usar `100svh` como referência de altura da viewport; drawers, canvas e superfícies de tela cheia devem respeitar essa altura segura.
- Drawers não devem focar inputs automaticamente nem abrir o teclado; os campos recebem foco somente após ação explícita da pessoa usuária.
- O grip de drawers deve manter uma área de toque generosa e fixa, mesmo quando a barra visual for compacta, para tornar o arraste de fechamento confiável em telas touch.

## UI / Style Guide

- A fonte de verdade visual é `STYLE_GUIDE_DARK_APPLE.md`: apesar do nome histórico, a interface usa a identidade drawer-first dark workspace como padrão global.
- Reutilize os tokens de `src/app/globals.css` para cor, raio, tipografia, borda e sombra; não crie novos valores locais sem justificativa.
- A paleta base deve permanecer em preto, grafite, cinza e branco. Turquesa é a cor primária; cores de status só aparecem em estados e atividade.
- Não introduza azul como cor estrutural, neon, glow, glassmorphism ou estética gamer. Prefira bordas discretas, sombras suaves e superfícies opacas.
- Use a pilha tipográfica Apple (`-apple-system`, `BlinkMacSystemFont`, `SF Pro Display`, `SF Pro Text`, `Inter`) e pesos 400 para texto, 500 para controles e 600 para títulos.
- Use somente os raios 10, 14, 18, 22 e 28px definidos nos tokens. Ícones devem usar traço fino e controles devem ter foco visível acessível.
- Movimento segue o padrão drawer-first: transições curtas (~180ms), sem bounce, respeitando `prefers-reduced-motion` e sem esconder estados de erro ou espera.
- Todo componente shadcn baixado, instalado ou criado deve ser composto com esses mesmos tokens e superfícies — inclusive `dialog`, `sheet/drawer`, `button`, `input`, `select`, `tabs`, `tooltip` e estados de feedback. Não aceite o tema padrão do shadcn como acabamento final e não crie exceções visuais por componente.
- Preserve espaço visual: a superfície principal deve priorizar a tarefa central e não acumular controles, contexto ou metadados acima dela.
- Conteúdo secundário deve abrir sob demanda em `dialog`, drawer, modal ou collapse, com o estado inicial fechado quando não for necessário para completar a tarefa principal.
- Prefira listas verticais a trilhos, carrosséis ou grupos horizontais; rolagem horizontal só é aceitável quando a natureza do conteúdo a exigir e não houver alternativa vertical mais clara.

## Execução de sprints

1. Confirme todas as dependências e gates antes de iniciar.
2. Entregue uma sprint por agente ou worktree e não misture fases sem decisão de integração.
3. Implemente o fluxo principal e os estados loading, empty, error, success e WAITING_USER.
4. Registre dependências externas e decisões pendentes em integration-requirements.
5. Não conecte módulos silenciosamente nem aumente o escopo da sprint.
6. Preserve os arquivos e alterações de outras tarefas.
7. Um agente subordinado não cria ou delega trabalho para outro agente.
8. Antes da Fase 10, confirme o gate de referências: anexos de imagem e documentos devem poder ser armazenados, consultados e compreendidos por agentes; áudio e vídeo devem ao menos ser armazenados com estado explícito de interpretação futura.

## Qualidade e conclusão

Uma sprint só pode ser marcada como COMPLETE ou COMPLETE_WITH_INTEGRATION_REQUIREMENTS depois de:

- executar testes, lint, typecheck, build e validações específicas;
- demonstrar a interface no navegador quando houver mudança visual;
- registrar evidências, artefatos, riscos e integrações pendentes;
- verificar acessibilidade, teclado, viewport estreita e redução de movimento quando aplicável.

BLOCKED_BY_FOUNDATION_GATE e FAILED_ACCEPTANCE permanecem visíveis até resolução.

## Git

- Verifique git status antes e depois do trabalho.
- Não inclua arquivos alterados por outras tarefas, artefatos temporários ou dependências geradas.
- Use mensagem curta e descritiva.
- Ao concluir, faça commit das alterações relacionadas e git push para o remoto da branch atual.
- Confirme que a branch local está sincronizada com o remoto.
- Se commit ou push falhar, informe o erro exato e não declare a tarefa concluída.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Next 16: SSR, Cache Components e revalidação

- O Deskverse usa `cacheComponents: true` em `next.config.ts`. O App Router deve renderizar no servidor o bootstrap necessário para a primeira pintura; não substituir dados essenciais por um `fetch` client-side disparado apenas depois da hidratação.
- `use cache` é opt-in e só pode ser usado em funções/componentes `async`. Ele gera uma entrada por build, função, argumentos serializáveis e valores capturados; sempre declarar `cacheLife` explicitamente quando o tempo de atualização importar.
- Dentro de um escopo `use cache`, não ler `cookies()`, `headers()` ou `searchParams`. Ler dados de sessão fora do escopo e passar identificadores serializáveis, como `userId` e `workspaceId`, para manter o cache isolado por usuário.
- `cacheLife` controla `stale` no Router Cache do cliente, `revalidate` para regeneração em background no servidor e `expire` para a próxima requisição bloqueante. Use perfis curtos (`seconds`/`minutes`) para estado operacional e perfis maiores apenas para conteúdo estável.
- Dados cacheados devem receber `cacheTag`. Após mutações em Server Actions, usar `updateTag` quando a pessoa precisa ver a própria alteração imediatamente; em Route Handlers/webhooks, usar `revalidateTag(tag, "max")` para stale-while-revalidate. Preferir tags a `revalidatePath` quando a invalidação puder ser específica.
- Não cachear sessão, autorização ou dados altamente voláteis dentro de uma chave global. Toda consulta autenticada deve carregar o escopo do usuário/workspace na chave e invalidar as tags afetadas após escrita.
- O Playwright é o padrão de verificação visual e E2E: `playwright.config.ts` cobre Chromium desktop e mobile, sobe `yarn next dev` quando necessário, e guarda screenshot/trace em falha. Mudanças visuais devem ser demonstradas com `yarn test:e2e` e verificadas em viewport estreita.
- Referências oficiais: [diretiva `use cache`](https://nextjs.org/docs/app/api-reference/directives/use-cache), [`cacheLife`](https://nextjs.org/docs/app/api-reference/functions/cacheLife), [revalidação](https://nextjs.org/docs/app/getting-started/revalidating) e [Next.js 16](https://nextjs.org/blog/next-16).
