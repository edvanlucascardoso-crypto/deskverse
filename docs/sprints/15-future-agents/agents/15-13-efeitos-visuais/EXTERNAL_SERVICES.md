# Serviços externos — Grupo 15-13

## Configuração

VFX reutiliza integralmente o serviço de vídeo da SPRINT-15-12 e seu [SVC](services/SPRINT-15-13-SVC-01-vfx-extension.md). Não criar novo storage, fila, renderizador, endpoint público ou identidade persistente.

```env
VIDEO_MCP_URL=
DATABASE_URL=
REDIS_URL=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
```

UploadThing permanece como storage do MVP. Depois, Pydio Cells no Northflank pode receber o gerenciamento de arquivos por meio do contrato compartilhado; R2 continua reservado aos objetos pesados do pipeline de vídeo/mídia quando aplicável.
