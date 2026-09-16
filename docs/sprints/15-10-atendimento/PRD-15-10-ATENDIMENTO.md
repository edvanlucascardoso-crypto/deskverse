# PRD — Agente de atendimento

**Capability:** `support.service`
**Tipo:** `SpecialistAgent` com takeover humano
**Bloqueia MVP/Gate A0:** não

## Resultado

Responder dúvidas dentro do conhecimento aprovado, coletar contexto mínimo, classificar prioridade e encaminhar o caso. O agente não diagnostica fora do escopo, não revela dados de outro workspace e não promete política ausente.

## Fluxo e tools

`message.receive` → `identity.resolve` → `knowledge.retrieve` → `answer.draft` → `confidence.check` → `reply.send` ou `human.handoff` → `case.update`.

O envio usa o núcleo de mensagens da Fase 11. Base de conhecimento é versionada, com fonte e validade. Baixa confiança, pedido sensível, cliente em takeover e conflito de política suspendem resposta automática.

## Open source recomendado

- [Rasa](https://github.com/RasaHQ/rasa) com [REST/OpenAPI](https://rasa.com/docs/openapi/http-api/): classificação/intenção e handoff atrás de adapter; não substituir policy do Deskverse.
- [Chatwoot](https://github.com/chatwoot/chatwoot): inbox, webhooks e atendimento humano; connector com assinatura e deduplicação.

## Aceite específico

- Toda resposta cita artigo/fonte de conhecimento quando necessário.
- Handoff preserva agente, motivo, histórico e estado.
- Webhook duplicado, timeout e indisponibilidade não enviam resposta duplicada.
