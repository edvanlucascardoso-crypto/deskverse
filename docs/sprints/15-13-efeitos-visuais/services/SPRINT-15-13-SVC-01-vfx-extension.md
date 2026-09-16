# SPRINT-15-13-SVC-01 — Extensão VFX do serviço de mídia

**Depende de:** `SPRINT-15-12-SVC-01`, contrato de assets e policy do Deskverse.
**Não bloqueia:** MVP.
**Integração externa principal:** [Higgsfield MCP oficial](https://mcp.higgsfield.ai/mcp).

**Runtime:** broker/API, scheduler, Redis e CPU no Railway; fallback GPU/RENDER em endpoints RunPod Serverless.

Adicionar ao serviço de vídeo/mídia um broker privado para o MCP do Higgsfield e operações versionadas de composição, máscaras, tracking, referências e preview. Não criar novo storage, fila, renderizador ou identidade persistente de especialista.

## Fronteira do serviço

```text
AgentRuntime / SpecialistAgent
  -> VFX AgentPolicy + TaskPolicy + ModelAdapter
  -> VFX MCP broker privado
  -> OAuth connector Higgsfield MCP
  -> Higgsfield job
  -> webhook/polling do broker
  -> AssetVersion + preview + lineage no Deskverse
```

O broker mantém o token OAuth fora do LLM, browser, logs e banco de prompts. Cada chamada recebe um `workspaceId` derivado do contexto autenticado, `runId`, `taskId`, `traceId`, `idempotencyKey`, `budget` e `approvalState`. O broker não aceita URL, path, credencial ou `workspaceId` arbitrários no corpo da tool.

## Contrato mínimo

O contrato interno usa nomes estáveis e não replica nomes acidentais do endpoint externo:

- `vfx.higgsfield.preflight`: capability, OAuth, saldo, custo estimado, limites e disponibilidade;
- `vfx.higgsfield.generate_image`: imagem com prompt e `assetInputRef`s autorizados;
- `vfx.higgsfield.generate_video`: vídeo curto a partir de imagem, vídeo ou referência autorizada;
- `vfx.higgsfield.inspect_job`: estado, progresso, custo, warnings e output confirmado;
- `vfx.higgsfield.cancel_job`: cancelamento permitido e idempotente;
- `vfx.asset.attach_result`: anexa somente resultado verificado ao projeto, com nova versão e lineage.

O adapter pode mapear essas operações para o catálogo real do Higgsfield, que pode mudar. Mudança de schema externo não altera o contrato do agente sem uma nova versão do adapter. Geração é sempre `WAITING_APPROVAL` quando a policy exigir confirmação de crédito, likeness, publicação ou conteúdo de risco.

## Aceite

- VFX usa o mesmo lineage, fila e cancelamento do vídeo.
- O MCP oficial é acessado somente pelo broker OAuth privado; o browser e o LLM não conhecem token nem endpoint mutável.
- O preflight informa saldo/custo e a geração não começa antes da aprovação exigida.
- Preview é aprovado antes de render caro quando aplicável.
- Jobs são assíncronos, idempotentes, canceláveis e não exigem polling pelo LLM.
- Resultado só vira `AssetVersion` depois de checksum, MIME, tamanho, scan e confirmação do storage.
- Um especialista compartilhado atende líderes diferentes com isolamento de workspace.
