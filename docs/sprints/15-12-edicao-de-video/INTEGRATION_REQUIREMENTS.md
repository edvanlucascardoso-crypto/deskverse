# Requisitos de integração — SPRINT-15-12

- Fixar versões de FFmpeg, OpenTimelineIO e qualquer adapter OpenCut avaliado.
- Confirmar licença, codecs, fontes, mídia e execução headless no Railway/RunPod Serverless conforme a classe física do job.
- Implementar ingestão, probe, proxy, checksum, AssetVersion, UploadThing/R2 e lineage.
- Testar fila CPU/GPU/RENDER, lease, heartbeat, cancelamento, retry e dead-letter.
- Preview e render usam revisão imutável; browser nunca é autoridade do render final.
