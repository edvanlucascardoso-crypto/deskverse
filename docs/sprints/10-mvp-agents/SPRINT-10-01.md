# SPRINT-10-01 — Agente de conteúdo para redes

**Fase:** 10 — Agentes do MVP
**Status inicial:** PLANNED
**Dependências:** SPRINT-09-08, SPRINT-08-02 e SPRINT-08-03
**Ordem de criação:** 1 de 7
**Superfície principal:** Mídias Sociais (`SocialMediaLead` internamente)


## Inference profile default

**Kind:** `LeaderAgent`  \
**Primary:** Muse Spark 1.3  \
**Escalation:** GPT-5.6 Sol  \
Subtarefas simples podem ser delegadas aos especialistas compartilhados com DeepSeek V4.1 Flash/Luna quando o benchmark permitir.
## Objetivo

Entregar **Mídias Sociais** como uma fatia utilizável do MVP, com responsabilidades claras, estado rastreável e integração explícita com o canvas.

## Regras obrigatórias

- Criar calendário, briefing, pauta, CTA, reaproveitamento e recomendação de conteúdo.
- Classificar interações em PRAISE, POSITIVE, QUESTION, LEAD, NEUTRAL, COMPLAINT, NEGATIVE, ABUSIVE e SPAM.
- Curtir ou responder praise somente quando seguro; responder lead e question com contexto; nunca curtir automaticamente complaint, negative, abusive ou spam.
- Usar fatos verificados e pedir recurso quando faltar contexto; nunca inventar preço, prazo, condição ou política.
- Delegar trabalho rastreável e produzir intenção de aprovação antes de enviar ou publicar.
- Oferecer estilos selecionáveis para perfis diferentes de usuário; a lista de estilos será definida na implementação do agente, e a interface usará um select.
- Consultar e atualizar o planejamento de conteúdo, a pauta, o calendário e as tarefas relacionadas por tools autorizadas, mantendo origem, versão, dependências e próximo passo.
- Enviar briefings, pautas, calendários e demais trabalhos produzidos ao UploadThing por tool, vinculando cada arquivo ao projeto, tarefa, versão e agente responsável.
- Usar o chat global para colaboração e o chat privado quando precisar falar diretamente com um agente, emitindo notificações em tempo real, atualizando o feedback do card e salvando preferências ou decisões duráveis na memória pgvector quando autorizadas.

## Tela dedicada de projetos

Mídias Sociais usa a tela dedicada de gerenciamento de projetos, separada do canvas e dos painéis contextuais, para acompanhar o projeto, plano, pauta, calendário, tarefas, dependências, prazos e saúde do trabalho. Para o usuário, essa tela é somente de visualização: não há criação, edição, exclusão, reordenação ou alteração direta de itens.

Quando Mídias Sociais precisar modificar o planejamento, a operação deve passar por uma tool do agente e o painel deve refletir o resultado confirmado, incluindo agente responsável, mudança realizada, motivo, timestamp e próximo passo. O painel não pode simular sucesso enquanto a tool estiver processando ou tiver falhado.

Os trabalhos concluídos por Mídias Sociais devem aparecer na tela de arquivos dos projetos após upload confirmado, com copy ou descrição, data, versão, origem e status para consulta do usuário.

## Refinamento de intenção

Mídias Sociais deve colaborar com os demais agentes para transformar instruções vagas em briefing útil. Antes do plano final, pode perguntar objetivo, público, canal, tom, prazo e restrições, sem presumir respostas.

## Trabalho

Implementar o caminho acima com fixtures locais, estados loading, empty, error, success e WAITING_USER. Cada etapa deve apontar para origem, responsável, versão, dependências e próximo passo.

## Critérios de aceite

- As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

- O fluxo principal pode ser demonstrado do início ao fim.
- Mídias Sociais consegue consultar a tela dedicada e alterar seu planejamento por tools, enquanto o usuário apenas visualiza o estado resultante.
- Não existem controles de CRUD para o usuário na tela dedicada de projetos.
- Briefing, pauta ou calendário produzido por Mídias Sociais pode ser localizado na tela de arquivos após upload confirmado pelo UploadThing.
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
