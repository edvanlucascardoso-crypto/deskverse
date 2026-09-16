# Integration requirements — SPRINT-15-13

## Pendências antes de produção

1. Confirmar contrato, scopes OAuth, tratamento de revogação e termos de uso do Higgsfield MCP.
2. Confirmar como o broker obtém custo estimado/real, saldo, job status, cancelamento e resultado sem depender de scraping.
3. Definir retenção, região, uso de dados, consentimento de likeness/Soul e tratamento de conteúdo sensível.
4. Implementar `assetInputRef`, Asset Service/UploadThing, checksum, scan, MIME allowlist e lineage.
5. Conectar `SPRINT-15-12-SVC-01`, filas físicas, notificações, approval, `AgentRuntime` e `InferenceGateway`.
6. Fazer revisão jurídica separada para Higgsfield proprietário e para qualquer uso de Natron/ComfyUI GPL.

## Decisões que não podem ficar implícitas

- A geração automatizada sempre pode debitar créditos; aprovação e budget são política do Deskverse.
- Higgsfield é provider externo; nenhum output externo é fonte de verdade da timeline.
- Falha externa não marca sucesso, não substitui a versão anterior e não publica.
- Natron/ComfyUI são fallback experimental isolado; ausência deles não é falha do caminho Higgsfield.

## Evidência esperada

Preflight reproduzível, chamada aprovada em fixture, job assíncrono, webhook duplicado, retry idempotente, cancelamento, asset confirmado, asset rejeitado e rollback para o serviço de vídeo.
