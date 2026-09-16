# PRD — Agente de dados e BI

**Capability:** `analytics.bi`
**Tipo:** `SpecialistAgent` com workers CPU para consulta/export
**Bloqueia MVP/Gate A0:** não

## Resultado

Responder perguntas com consultas reproduzíveis, métricas com definição, visualizações e explicações. O agente não executa SQL arbitrário, não expõe PII fora do escopo e não altera dataset sem aprovação.

## Fluxo e tools

`question.refine` → `catalog.inspect` → `query.plan` → `query.validate` → `query.run` → `result.explain` → `chart.build` → `export.confirm`.

O catálogo registra owner, schema, sensibilidade, freshness e regra de acesso. SQL é parseado/allowlisted, limitado por tempo/linhas/custo e executado em worker. Resultado guarda query, parâmetros, snapshot e checksum.

## Open source recomendado

- [Apache Superset](https://github.com/apache/superset) com [REST API](https://superset.apache.org/developer-docs/api/dashboards/): connector para dashboards e consultas aprovadas; preferir endpoints documentados, não ORM privado.
- [DuckDB](https://github.com/duckdb/duckdb): worker local/efêmero para análise de arquivos e fixtures, com limites de memória e sem acesso arbitrário ao filesystem.

## Aceite específico

- Toda métrica tem definição, janela, filtros e fonte.
- Resultado vazio, incompleto, atrasado ou com erro é visível.
- Export só chega ao UploadThing após confirmação e permanece read-only para o usuário.
