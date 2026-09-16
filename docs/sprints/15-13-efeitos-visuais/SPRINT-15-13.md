# SPRINT-15-13 — Especialista de efeitos visuais

**Fase:** 15 — Agentes Futuros
**Status inicial:** PLANNED
**Dependências:** `SPRINT-15-12-SVC-01`, contrato de assets e policy; reutiliza o serviço de vídeo, sem depender da sprint funcional de edição.
**Superfície principal:** composição, efeitos, segurança e approval

**Documentação:** [README](README.md) · [PRD](PRD-15-13-VFX-HIGGSFIELD-MCP.md) · [integrações](INTEGRATION_REQUIREMENTS.md)

## Objetivo

Adicionar um `SpecialistAgent` compartilhado de VFX que opere sobre o mesmo Project/Timeline Engine do vídeo, sem duplicar ingestão, storage, versionamento ou render.

## Inference profile

Primário: **Qwen 3.5 Plus**. Escalation: **Kimi K3** para tarefas multimodais/long-horizon mais difíceis.

## Regras

- Receber capability requests de Social, Motion, Vídeo e outros líderes.
- Trabalhar por operações estruturadas/versionadas; nunca mutar arquivo final diretamente.
- Composições, masks, tracking, overlays e efeitos preservam lineage de assets.
- Preview vem antes de render caro quando a mudança for visualmente verificável.
- Ações irreversíveis/publicação exigem approval conforme policy.

## Critérios de aceite

- O mesmo especialista lógico atende mais de um líder pela área compartilhada de Especialistas.
- Uma alteração de VFX é reproduzível a partir da versão/operations.
- Falha de render não perde composição nem marca sucesso.
- Artefatos finais e intermediários relevantes permanecem rastreáveis.
