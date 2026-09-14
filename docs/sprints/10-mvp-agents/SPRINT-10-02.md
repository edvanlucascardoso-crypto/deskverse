# SPRINT-10-02 — Redator

**Fase:** 10 — Agentes do MVP
**Status inicial:** PLANNED
**Dependências:** SPRINT-09-08, SPRINT-07-07 e SPRINT-08-02
**Ordem de criação:** 2 de 7
**Superfície principal:** Redator (`CopywriterSpecialist` internamente)


## Inference profile default

**Kind:** `SpecialistAgent` compartilhado  \
**Primary:** Qwen 3.5 Plus  \
**Escalation:** Muse Spark 1.3
## Objetivo

Entregar o **Redator** como uma fatia utilizável do MVP, com responsabilidades claras, estado rastreável e integração explícita com o canvas.

## Regras obrigatórias

- Produzir legendas, headlines, CTA, variações curtas e roteiros.
- Aplicar tom, público, fatos verificados e restrições do BrandProfile.
- Emitir artefato versionado com origem do briefing, autor, revisão e próximo passo.
- Pedir informação em vez de inventar preço, condição, prazo ou promessa.
- Aceitar delegação de Mídias Sociais e devolver o texto sem publicar nem criar imagem.
- Enviar cada texto produzido ao UploadThing por tool, vinculada ao projeto, tarefa, briefing, versão, data e agente responsável, sem depender de upload manual do usuário.
- Usar o chat global e o chat privado do agente destinatário para esclarecer o briefing, emitindo notificações em tempo real para espera, permissão, falha e conclusão e registrando preferências ou decisões autorizadas na memória pgvector.

## Trabalho

Implementar o caminho acima com fixtures locais, estados loading, empty, error, success e WAITING_USER. Cada etapa deve apontar para origem, responsável, versão, dependências e próximo passo.

## Critérios de aceite

- As transições devem ser fluidas, suaves e rápidas: comunicar causa, destino e estado sem criar espera artificial. O movimento deve preservar o contexto espacial e respeitar prefers-reduced-motion.

- O fluxo principal pode ser demonstrado do início ao fim.
- O texto produzido aparece na tela de arquivos dos projetos com arquivo ou conteúdo, data, versão, origem e status após upload confirmado.
- O usuário consulta o artefato na tela de arquivos sem receber controles de CRUD ou edição.
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
