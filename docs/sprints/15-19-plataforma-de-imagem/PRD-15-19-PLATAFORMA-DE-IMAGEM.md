# PRD — Plataforma própria de imagem

**Capability:** `image.create_edit`
**Tipo:** workers `GPU`/`CPU` atrás de `InferenceGateway` e Asset Service
**Bloqueia MVP/Gate A0:** não

## Resultado

Introduzir geração e edição própria gradualmente, mantendo o contrato do Designer e o fallback da API externa do MVP. A ferramenta própria conserva composição, layers, transformações, masks, blend, undo/redo e exportação PNG.

## Fluxo e tools

`image.brief.confirm` → `asset.reference` → `image.generate` → `image.edit.apply` → `image.preview` → `human.approval` → `image.export` → `asset.publish`.

O JSON de composição é canônico para o worker, mas a persistência continua PostgreSQL/pgvector para memória e R2/UploadThing conforme a fase. Inputs e outputs usam `assetInputRef`; modelos não recebem URL arbitrária. Feature flag permite rollback por workspace.

## Open source recomendado

- [Diffusers](https://github.com/huggingface/diffusers), Apache-2.0: base de pipelines no endpoint RunPod Serverless, com model cards, licenças e pesos aprovados por allowlist.
- [ComfyUI](https://github.com/Comfy-Org/ComfyUI), GPL-3.0: referência/API para workflows e prototipação isolada; não importar GPL para o Next/Asset Service nem usar como fonte de verdade.

## Aceite específico

- Designer continua funcionando durante desligamento do worker próprio.
- Composição aprovada permite trocar layer sem mover as demais.
- GPU/CPU jobs têm lease, heartbeat, cancelamento, idempotência, custo e lineage.
- R2 recebe bytes por signed/multipart; LLM recebe metadata/referências, não binário.
