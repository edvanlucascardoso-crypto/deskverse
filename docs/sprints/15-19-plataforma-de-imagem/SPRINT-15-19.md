# SPRINT-15-19 — Plataforma própria de imagem e migração gradual

**Fase:** 15 — Agentes futuros
**Status inicial:** PLANNED
**Dependências:** Fase 09, Fase 14 e Asset Service compartilhado disponível
**Superfície principal:** geração/edição própria, assets e migração sem interromper o MVP

**Documentação:** [README](README.md) · [PRD](PRD-15-19-PLATAFORMA-DE-IMAGEM.md) · [integrações](INTEGRATION_REQUIREMENTS.md)

## Objetivo

Substituir gradualmente o provider externo de imagens do MVP por uma plataforma própria de mídia, sem alterar o contrato visível do Designer nem interromper Mídias Sociais, Redator e Designer.

## Arquitetura

- Railway hospeda o MCP/API privado, scheduler e workers CPU; RunPod Serverless hospeda os endpoints assíncronos de workers GPU.
- Cloudflare R2 recebe conteúdo por URLs assinadas e multipart.
- Asset Service próprio é o "UploadThing headless" para assets de mídia; UploadThing continua atendendo os artefatos do MVP enquanto a migração ocorre.
- Filas dedicadas: `image.klein`, `image.qwen`, `image.edit` e `image.priority`.
- FLUX.2 Klein atende geração geral e partes; Qwen-Image atende composição, layout e tipografia.
- Image Editing Tool própria mantém scene/layers, máscaras, transformações, undo/redo e recomposição determinística.

## Migração

1. Preservar o adapter de imagens externas como fallback do MVP.
2. Introduzir roteamento por capability e feature flag por workspace.
3. Migrar primeiro geração simples; depois composição aprovada, edição local e recomposição.
4. Registrar provider, modelo, prompt adaptado, custo, versão, inputs/outputs e lineage.
5. Só promover o caminho próprio quando qualidade, latência e custo forem aceitos pelo benchmark.

## Critérios de aceite

- O fluxo existente do Designer continua funcional durante a migração.
- Uma composição master aprovada suporta troca local de layer sem alteração geométrica das demais.
- Upload/download de mídia usa R2 diretamente e nunca passa pelo LLM.
- Jobs são idempotentes, canceláveis, rastreáveis e isolados por workspace.
- O rollback para a API de imagens externa é seguro por feature flag.
