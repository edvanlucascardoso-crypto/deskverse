# PRD — Agente de edição de vídeo

**Capability:** `video.editing`
**Tipo:** `SpecialistAgent` + workers efêmeros CPU/GPU/RENDER
**Bloqueia MVP/Gate A0:** não

## Resultado

O agente decide intenção editorial; o Video Engine decide como executar. A entrega é uma timeline editável com versões, proxies, preview, approval, render e lineage, sem enviar binários brutos ao LLM.

## Fluxo e tools

`brief.confirm` → `asset.ingest` → `timeline.inspect` → `edit.plan` → `operations.apply` → `preview.render` → `visual.review` → `approval` → `render.final` → `asset.publish`.

Tools mínimas: `video.project.create`, `video.asset.inspect`, `video.timeline.inspect`, `video.operations.apply`, `video.preview.render`, `video.render.start`, `video.job.inspect`, `video.job.cancel`, `video.version.restore`. Todas usam versão base, schema versionado e idempotência.

## Open source recomendado

- [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO), Apache-2.0: interchange e adapters de timeline; não é container de mídia nem fonte de verdade do Deskverse.
- [FFmpeg](https://ffmpeg.org/): encode, probe, mux e transcode em worker isolado; fixar build, allowlistar argumentos e validar licença/configuração.
- [OpenCut](https://github.com/OpenCut-app/OpenCut): referência de UX/estrutura de edição; reutilização de código somente após inventário de licença e isolamento da UI.

## Aceite específico

- Preview usa proxy; render final usa revisão imutável e input confirmado.
- Worker possui lease, heartbeat, cancelamento, retry técnico e dead-letter.
- Conflito de versão, codec ausente e falha semântica têm estados diferentes.
- Tela de arquivos mostra output somente após confirmação do storage.
