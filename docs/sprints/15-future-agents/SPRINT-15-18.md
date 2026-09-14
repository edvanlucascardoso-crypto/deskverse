# SPRINT-15-18 — Liderança multi-grupo e workforce compartilhada

**Fase:** 15 — Agentes Futuros  
**Status:** PLANNED  
**Dependências:** SPRINT-15-17 e especialistas compartilhados estáveis  
**Superfície principal:** organizações maiores no mesmo canvas


## Inference profile default

**Primary:** Muse Spark 1.3  \
**Escalation:** GPT-5.6 Sol  \
A senioridade vem da Fase 09; trocar o modelo padrão exige benchmark/decisão registrada, não apenas preferência do implementador.
## Objetivo

Escalar o padrão já existente de líderes + especialistas compartilhados para múltiplos grupos/departamentos, sem containers rígidos ou duplicação de especialistas.

## Trabalho

- Modelar grupos, líderes, membership e preferências por capability.
- Um especialista pode servir vários grupos respeitando workspace/policies/queue.
- Comunicação interna pode ser mediada pelo líder, mas especialistas continuam globalmente referenciáveis quando policy permitir. Cada grupo apresenta turnos de comunicação sequenciais: há uma conversa ativa por fluxo e o próximo agente fala somente após a conversa anterior concluir ou entrar em espera.
- Canvas usa zoom semântico, capability portals e conexões contextuais/temporárias; sem spaghetti graph.
- Fallback de líder indisponível e escalation humano são persistidos/auditados.

## Critérios de aceite

- Grupos coexistem sem duplicar SpecialistAgents.
- Um especialista mantém uma identidade e filas separáveis por run/workspace.
- Reorganização não altera permissões implicitamente.
- Canvas permanece acessível, responsivo e não se parece com Kanban.
