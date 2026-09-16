# Serviços externos — Grupo 10-03

## Configuração

O Designer do MVP usa a API de imagens da OpenAI atrás do adapter privado definido em [SPRINT-10-03-SVC-01](services/SPRINT-10-03-SVC-01-mcp-media.md). Os artefatos confirmados são enviados ao UploadThing por tool autorizada.

```env
AI_GATEWAY_API_KEY=
OPENAI_API_KEY=
DATABASE_URL=
REDIS_URL=
UPLOADTHING_TOKEN=
```

`OPENAI_API_KEY` e `UPLOADTHING_TOKEN` ficam somente no servidor/adaptador autorizado. O navegador, o prompt e o trace do LLM não recebem esses segredos.

## Limites

UploadThing é o storage do MVP. A migração posterior de gerenciamento de arquivos para um serviço headless privado no Railway pertence ao contrato `AssetStorage`; ela deve preservar versão, checksum, lineage, `workspaceId` e referência do asset. Não provisionar serviço de arquivos, R2 ou workers próprios de mídia para iniciar esta sprint.
