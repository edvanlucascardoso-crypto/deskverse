# SPRINT-10-04 — Fluxo mídias sociais, texto e design

**Fase:** 10 — Agentes do MVP
**Status inicial:** PLANNED
**Dependências:** SPRINT-10-01, SPRINT-10-02 e SPRINT-10-03
**Ordem de criação:** 4 de 7
**Superfície principal:** Gate A0

## Objetivo

Compor os três agentes no primeiro fluxo demonstrável do produto, preservando a ordem de criação e tornando a espera humana, a indisponibilidade do Designer e a entrega final observáveis.

## Regras obrigatórias

- Mídias Sociais cria plano e DAG.
- Redator recebe o briefing e cria o texto.
- Designer consome briefing, copy e BrandProfile quando capacidade e entitlement estiverem disponíveis.
- Aprovação humana pausa antes da ação protegida; após aprovar, registra artefato final e atividade no canvas.
- Sem Designer, o fluxo degrada para Mídias Sociais → Redator e não transforma a etapa opcional em falha fatal.
- Cada trabalho produzido no fluxo é enviado pelo agente responsável ao UploadThing por tool e fica vinculado ao projeto, tarefa, versão, origem e status para consulta na tela de arquivos.
- A colaboração do Gate A0 usa o chat global e chats privados quando necessário; cada etapa publica notificações em tempo real, atualiza o card responsável e registra memória pgvector somente quando o fato for elegível e autorizado.
- Cada etapa emite eventos pelo contrato do escritório, com `runId`, responsável, próximo passo e correlação opcional com aprovação, conversa e artefato; eventos operacionais não abrem conversas por padrão.
- A aprovação do Gate A0 identifica o material e a versão exatos. Se houver mais de uma aprovação obrigatória, a entrega permanece pausada até todas as decisões serem confirmadas.

## Gate A0

A sequência obrigatória é: Mídias Sociais planeja → Redator cria o texto → Designer cria a imagem quando disponível → humano aprova → entrega final. A queda de capacidade do Designer segue Mídias Sociais → Redator, com aviso honesto e sem falha global.

## Refinamento colaborativo

Os agentes devem elaborar juntos o que o usuário leigo quis dizer. O brief pode ser enriquecido por perguntas do líder, do Redator ou do Designer antes de cada etapa; as respostas confirmadas seguem para os próximos agentes sem apagar a instrução original.

## Comunicação visível no grid

Ao delegar Mídias Sociais para Redator, e depois Redator para Designer quando aplicável, o tile emissor deve mover-se para um slot ao lado do agente destinatário. Os outros tiles fazem reflow animado como em uma collection do iOS; a comunicação permanece rastreável e o fallback Mídias Sociais → Redator mantém o mesmo comportamento. Os handoffs são sequenciais: Mídias Sociais fala com Redator e, só após essa conversa concluir ou aguardar, Redator fala com Designer; nunca mostrar todos os agentes se comunicando ao mesmo tempo.

## Critérios de aceite

- As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

- O fluxo principal pode ser demonstrado do início ao fim.
- O fluxo completo deixa briefing/planejamento, texto e imagem ou export disponíveis na tela de arquivos após uploads confirmados.
- O usuário apenas consulta os arquivos e metadados; não há CRUD ou upload manual na tela.
- Falta de contexto, ferramenta, capacidade ou entitlement tem recuperação ou escalonamento.
- Aprovação, recusa e pedido de mudança alteram o fluxo de modo explícito.
- Takeover humano impede novos envios e não repete ações já confirmadas.
- A presença no canvas e o painel contextual mostram a mesma atividade.
- Não há dependência de engine 3D, runtime de jogo ou modelos legados.
- Lint, typecheck, build e testes da feature passam.

## Verificação

Executar fluxo completo, Designer indisponível, aprovação recusada e Redator com contexto faltante. Confirmar a ordem de eventos e a ausência de tarefas órfãs.

## Entregáveis

Código do agente ou fluxo, fixtures, testes, roteiro de demonstração e registro das integrações futuras.
