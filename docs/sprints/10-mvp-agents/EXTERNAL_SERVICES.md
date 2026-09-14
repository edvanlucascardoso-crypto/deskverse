# Serviços externos — Fase 10

## Serviços do MVP

Os três primeiros agentes reutilizam a Fase 09 e exigem somente serviços já definidos. UploadThing é o storage de arquivos do MVP; a migração posterior de gerenciamento de arquivos para Pydio Cells no Northflank não altera o Gate A0:

- Vercel AI Gateway para toda inferência;
- Northflank para workers efêmeros/scheduler;
- Neon com pgvector para estado, auditoria e memória;
- UploadThing para artefatos confirmados no MVP;
- API de imagens da OpenAI somente para o Designer, atrás de adapter privado.

## Mapa por sprint

| Sprint | Serviço necessário |
|---|---|
| 10-01 | Gateway, Neon, Redis Northflank e UploadThing |
| 10-02 | Gateway, Neon, Redis Northflank e UploadThing |
| 10-03 | Gateway, OpenAI Images, UploadThing e Neon |
| 10-04 | Serviços das três funções e aprovação humana |
| 10-05 | Registry, filas e workers da Fase 09 |
| 10-06 | UploadThing, memória e runtime |
| 10-07 | Integração dos serviços anteriores |

## Variáveis lógicas

```env
AI_GATEWAY_API_KEY=
OPENAI_API_KEY=
DATABASE_URL=
REDIS_URL=
UPLOADTHING_TOKEN=
```

`OPENAI_API_KEY` fica somente no serviço/adaptador autorizado. O LLM não recebe a chave e o navegador não chama a API de imagens diretamente.

## Designer e fallback

O serviço detalhado está em [SPRINT-10-03-SVC-01](10-03-designer/services/SPRINT-10-03-SVC-01-mcp-media.md). Ele deve registrar provider, modelo, prompt adaptado, versão, custo, lineage e erro no Neon.

Se o Designer não tiver capacidade ou entitlement, o Gate A0 termina honestamente em Mídias Sociais → Redator. R2, Qwen-Image, FLUX.2 Klein, edição própria, workers de mídia próprios e Pydio não devem ser provisionados nesta fase; pertencem às sprints posteriores de mídia/migração. O contrato de storage deve preservar a possibilidade de migrar os artefatos sem alterar o fluxo dos agentes.

## Validação

- Testar provider de imagens indisponível e retry idempotente.
- Confirmar upload somente após resultado confirmado.
- Verificar que segredos não aparecem em prompt, trace ou UI.
- Executar Gate A0 com Designer disponível e indisponível.
