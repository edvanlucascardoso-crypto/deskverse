# Serviços externos — Grupo 15-13

## Configuração

VFX reutiliza integralmente o serviço de vídeo da `SPRINT-15-12` e seu [SVC](services/SPRINT-15-13-SVC-01-vfx-extension.md). Não criar novo storage, fila, renderizador, endpoint público ou identidade persistente.

O único conector gerador obrigatório é o [MCP oficial do Higgsfield](https://mcp.higgsfield.ai/mcp), que usa OAuth e cobra créditos em cada geração automatizada. Higgsfield é proprietário; não baixar nem incorporar o servidor. O Deskverse mantém apenas um adapter/broker privado compatível com o contrato do agente.

```env
VIDEO_MCP_URL=
HIGGSFIELD_MCP_URL=https://mcp.higgsfield.ai/mcp
DATABASE_URL=
REDIS_URL=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
```

UploadThing permanece como storage do MVP. Depois, um serviço headless privado no Railway pode receber o gerenciamento de arquivos por meio do contrato compartilhado; R2 continua reservado aos objetos pesados do pipeline de vídeo/mídia quando aplicável. Fallbacks de composição que exigirem GPU usam RunPod Serverless.

## Open source recomendado

- [OpenTimelineIO](https://github.com/AcademySoftwareFoundation/OpenTimelineIO), Apache-2.0: intercâmbio de cortes, referências e lineage; integrar como adapter, não como fonte de verdade.
- [OpenColorIO](https://github.com/AcademySoftwareFoundation/OpenColorIO), BSD-3-Clause: normalização de color management no worker.
- [Natron](https://github.com/NatronGitHub/Natron), GPL-2.0: fallback de composição/roto/keying em worker isolado, somente após revisão jurídica; não importar no Next nem no broker.
