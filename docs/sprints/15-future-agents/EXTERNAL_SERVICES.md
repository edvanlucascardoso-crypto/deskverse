# Serviços externos — Fase 15

## Regra de reuso

Agentes futuros reutilizam Gateway, Eve, Neon/pgvector, Redis, UploadThing e workers Northflank da Fase 09. UploadThing continua sendo o caminho compatível enquanto a migração não for concluída; Pydio Cells hospedado no Northflank é o destino posterior de gerenciamento de arquivos. Um agente novo não cria conector, fila, storage ou especialista duplicado sem decisão explícita.

## Mapa de serviços

| Grupo | Serviço |
|---|---|
| Agentes de negócio 15-01 a 15-11, 15-14 a 15-18 | Gateway, Eve, Neon, Redis, UploadThing no MVP ou Pydio após a migração, e MCPs já existentes quando aplicável |
| Motion 15-02 | Remotion e MCP interno do clone do Figma; artefatos no storage do contrato, UploadThing no MVP |
| Vídeo 15-12 | Northflank, API/MCP privado, workers CPU/GPU, Redis/BullMQ, PostgreSQL, FFmpeg e Cloudflare R2 |
| VFX 15-13 | Reuso integral do serviço de vídeo; nenhum storage/fila/render novo |
| Plataforma de imagem 15-19 | Northflank, API/MCP privado, workers próprios, Cloudflare R2 e modelos Qwen/FLUX |

## Artefatos comuns

Relatórios, documentos, exports e mídias dos agentes de negócio usam UploadThing por tool autorizada no MVP. Após a migração, o Pydio Cells recebe o conteúdo por um adapter privado; a tela de arquivos continua recebendo apenas referências confirmadas e metadados do Neon. `workspaceId`, versões, checksum, lineage e autorização permanecem no Deskverse.

Não confundir essa migração de gerenciamento de arquivos com o storage de mídia pesada: a plataforma própria de vídeo/imagem da SPRINT-15-19 ainda pode exigir Cloudflare R2 para uploads multipart e jobs de renderização, conforme o serviço específico.

## Serviços de mídia pesada

Os detalhes canônicos estão em:

- [serviço de vídeo](agents/15-12-edicao-de-video/services/SPRINT-15-12-SVC-01-video-engine.md);
- [extensão VFX](agents/15-13-efeitos-visuais/services/SPRINT-15-13-SVC-01-vfx-extension.md).

Para vídeo e imagem própria:

- API/MCP fica privado no Northflank;
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
NORTHFLANK_API_URL=
```

Não configurar R2, GPU ou workers próprios antes da sprint que os requer. A plataforma própria de imagem não bloqueia o MVP e deve ter feature flag para rollback ao provider externo.
