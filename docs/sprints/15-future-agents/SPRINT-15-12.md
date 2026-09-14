# SPRINT-15-12 — Agente de edição de vídeo + serviços headless

**Fase:** 15 — Agentes Futuros  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-15-11, Fase 09 e segurança de serviços  
**Superfície principal:** briefing -> timeline -> preview -> approval -> render

## Objetivo

Construir edição de vídeo headless e orientada a agentes. **O agente decide o que editar; o engine executa como editar.**

## Inference profile

- Primário: **Qwen 3.5 Plus** pelo custo, multimodalidade e tool use.
- Escalation: **Kimi K3** para análise de vídeo/long-horizon complexa.
- Senioridade segue Júnior/Pleno/Sênior/Especialista da Fase 09; não criar “Básico/Intermediário/Avançado” paralelo.

## Arquitetura

```text
Video Leader/Specialist
  -> Video MCP (auth + schemas fino)
  -> Video API
  -> Project/Timeline Engine
  -> Queue
      -> CPU workers
      -> GPU workers
  -> Render
  -> Asset Storage
```

Base possível: reaproveitar conceitos/código compatível do OpenCut Classic (MIT), sem manter editor visual. FFmpeg cobre encode/decode/trim/concat/áudio; engine crítica pode usar Rust; API/MCP em TypeScript. Persistência: PostgreSQL; fila: Redis/BullMQ ou equivalente; objetos: Cloudflare R2; workers CPU/GPU rodam no Northflank. Storage pesado usa signed/multipart direto, nunca passa pelo LLM/MCP.

## Modelo de edição

Toda mudança é operação estruturada e preferencialmente em lote. `baseVersion` usa optimistic locking e cada alteração gera nova versão. Suportar `list_versions`, `restore_version`, `compare_versions`.

Efeitos possuem `id`, versão, params, keyframes, renderer e metadata; interpolações mínimas: linear, ease-in/out/in-out, cubic-bezier e spring.

Ingestão: upload -> ffprobe/metadata -> thumbnail -> proxy -> ready. Preview usa proxy; render final usa original.

Tools mínimas: `create_project`, `inspect_project`, `inspect_asset`, `apply_operations`, `render_preview`, `render_final`, `get_job`, `cancel_job`, `list_effects`.

## Critérios de aceite

- Criar projeto, ingerir mídia, aplicar lote transacional, gerar preview, aprovar e renderizar final.
- Conflito de versão não sobrescreve timeline silenciosamente.
- Job CPU/GPU é observável, cancelável e idempotente.
- Assets, previews e exports ficam versionados/rastreáveis na tela de arquivos.
- Agente não recebe binário bruto quando metadata/proxy é suficiente.
