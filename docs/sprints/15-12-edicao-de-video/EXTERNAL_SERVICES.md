# Serviços externos — Grupo 15-12

## Configuração

O serviço de vídeo headless é privado no Railway. API/MCP, workers CPU e Redis ficam atrás de `WorkerExecutionProvider`, com estado e auditoria no PostgreSQL; jobs GPU/RENDER são executados por endpoints RunPod Serverless. FFmpeg executa o pipeline de mídia.

```env
VIDEO_MCP_URL=
DATABASE_URL=
REDIS_URL=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
```

Use URLs assinadas, multipart, leases, heartbeat e idempotency keys. Workers não recebem credenciais amplas e binários não passam pelo LLM.

## Relação com o storage de arquivos

O UploadThing continua atendendo o MVP até a migração. Um serviço headless privado no Railway é o destino posterior para gerenciamento de arquivos do projeto; referências, versões, checksum, lineage e autorização continuam no Deskverse/Neon. O Cloudflare R2 permanece separado quando o pipeline de vídeo precisar de object storage pesado para ingestão, intermediários ou renderização.
