# Serviços externos — Fase 15

## Regra de reuso

Agentes futuros reutilizam Gateway, Eve, Neon/pgvector, Redis, UploadThing e os serviços compartilhados do Railway. Jobs que exigem GPU/RENDER usam endpoints assíncronos do RunPod Serverless. UploadThing continua sendo o caminho compatível enquanto a migração não for concluída; qualquer gerenciamento posterior de arquivos deve usar um serviço Railway e storage aprovado. Um agente novo não cria conector, fila, storage ou especialista duplicado sem decisão explícita.

## Mapa de serviços

| Grupo | Serviço |
|---|---|
| Agentes de negócio 15-01 a 15-11, 15-14 a 15-18 | Gateway, Eve, Neon, Redis no Railway, UploadThing e MCPs já existentes quando aplicável |
| Motion 15-02 | Motion engine/MCP estruturado, Remotion para caminho code-first/template, MCP interno do clone do Figma quando aplicável; artefatos no storage do contrato, UploadThing no MVP |
| Vídeo 15-12 | Railway para API/MCP, Redis/BullMQ e CPU; RunPod Serverless para GPU/RENDER; PostgreSQL, FFmpeg e Cloudflare R2 |
| VFX 15-13 | Reuso integral do serviço de vídeo; nenhum storage/fila/render novo |
| Plataforma de imagem 15-19 | Railway para API/MCP e scheduler; RunPod Serverless para workers GPU; Cloudflare R2 e modelos Qwen/FLUX |

## Artefatos comuns

Relatórios, documentos, exports e mídias dos agentes de negócio usam UploadThing por tool autorizada no MVP. Após a migração, um serviço headless privado no Railway recebe o conteúdo por um adapter; a tela de arquivos continua recebendo apenas referências confirmadas e metadados do Neon. `workspaceId`, versões, checksum, lineage e autorização permanecem no Deskverse.

Não confundir essa migração de gerenciamento de arquivos com o storage de mídia pesada: a plataforma própria de vídeo/imagem da SPRINT-15-19 ainda pode exigir Cloudflare R2 para uploads multipart e jobs de renderização, conforme o serviço específico.

## Serviços de mídia pesada

Os detalhes canônicos estão em:

- [serviço de vídeo](../15-12-edicao-de-video/services/SPRINT-15-12-SVC-01-video-engine.md);
- [extensão VFX](../15-13-efeitos-visuais/services/SPRINT-15-13-SVC-01-vfx-extension.md).

Para vídeo e imagem própria:

- API/MCP e scheduler ficam privados no Railway;
- workers com GPU/RENDER são jobs assíncronos no RunPod Serverless, acionados pelo scheduler;
- jobs entram na fila com `workspaceId`, versão e idempotency key;
- workers CPU/GPU recebem URLs assinadas, não credenciais amplas;
- GPU só é alocada pelo scheduler;
- R2 usa URLs assinadas/multipart e não passa binários pelo LLM;
- preview deve preceder render caro quando aplicável;
- lineage, versão, cancelamento e restore permanecem no Neon.

Variáveis lógicas específicas, somente nos serviços autorizados:

```env
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
RAILWAY_SERVICE_URL=
RUNPOD_ENDPOINT_ID=
RUNPOD_API_KEY=
```

Não configurar R2, GPU ou workers próprios antes da sprint que os requer. O endpoint RunPod Serverless deve ter cold start, timeout, concorrência, retry e custo por segundo documentados. A plataforma própria de imagem não bloqueia o MVP e deve ter feature flag para rollback ao provider externo.
