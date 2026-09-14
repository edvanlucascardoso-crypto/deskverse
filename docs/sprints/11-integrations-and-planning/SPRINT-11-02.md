# SPRINT-11-02 — Reservada: plataforma própria de imagem

**Fase:** 11 — Integrações e Planejamento  
**Status inicial:** DEFERRED_TO_SPRINT-15-19
**Dependências:** SPRINT-11-01  
**Superfície principal:** geração, scene/layers, edição local e versionamento

## Objetivo

O escopo desta sprint foi transferido para a SPRINT-15-19 para não bloquear o MVP. O Designer inicial usa a API de imagens da OpenAI e UploadThing.

## Stack visual

Quando retomada na SPRINT-15-19: Qwen-Image, FLUX.2 Klein, Image Editing Tool própria, Asset Service sobre Cloudflare R2 e workers no Northflank.

## Scene/Command Engine

Scene JSON reproduzível com canvas explícito, layers, ordem, visibility, opacity, alpha/blend (`normal`, `multiply`, `screen`), transform x/y/scale/rotation/flip, mask alpha, brightness/contrast/saturation e histórico undo/redo.

API mínima:

`addLayer`, `removeLayer`, `move`, `scale`, `rotate`, `setOpacity`, `setBlendMode`, `setMask`, `adjust`, `undo`, `redo`, `export`.

Toda alteração é um comando versionado e reversível. Export inicial: PNG com alpha quando aplicável.

## Composição complexa

A tool recebe uma master aprovada como referência estrutural. Assets substitutos devem ser inseridos preservando bounds, transform, z-order e anchors; não reinterpretar layout por conta própria.

## Jobs/assets

Persistir job, modelo, prompt adaptado, seed/options quando disponíveis, input/output asset, versão, custo e erro. Jobs de geração/edição devem passar por fila com workers CPU/GPU e limites de concorrência. Upload/download pesado usa storage direto/signed URLs; não transportar binários pelo LLM.

## Critérios de aceite

- Reconstituir scene JSON sem perda geométrica.
- Substituir uma layer sem alterar as demais.
- Undo/redo é determinístico.
- Uma fixture de poster preserva master -> partes -> recomposição -> edição pontual -> export.
- Artefatos e versões aparecem na tela de arquivos após persistência confirmada.
