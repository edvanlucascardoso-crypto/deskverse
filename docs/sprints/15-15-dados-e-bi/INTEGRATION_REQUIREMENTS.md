# Requisitos de integração — SPRINT-15-15

- Definir catálogo, ownership, PII, freshness, row limits e políticas de dataset.
- Usar Superset por API documentada; DuckDB em worker efêmero e filesystem restrito.
- Validar SQL/expressões, limite de custo/tempo/linhas e cancelamento.
- Reproduzir query, parâmetros, snapshot, checksum e definição da métrica.
- Exportar somente após approval/policy e confirmação do UploadThing.
