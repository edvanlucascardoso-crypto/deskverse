# Serviços externos — Fase 14

## Objetivo

Consolidar a operação de produção sem criar um segundo runtime. A topologia de release é:

```text
Vercel → app/API pública e proteção de borda
Neon → dados duráveis e pgvector
Northflank → Redis, scheduler e workers
UploadThing → artefatos
OpenTelemetry → traces/métricas para collector escolhido
```

## Mapa por sprint

| Sprint | Serviço/configuração |
|---|---|
| 14-01 | Neon, Redis e storage com isolamento por workspace |
| 14-02 | Secret Groups, Vercel/Northflank e rotação |
| 14-03 | Neon, UploadThing e política de retenção |
| 14-04 | OpenTelemetry + logs/erros/métricas |
| 14-05 | Vercel, Neon, Northflank e rollback |
| 14-06 | Ambiente de staging, browser runner e dados de teste |
| 14-07 | Alertas, suporte e evidências de go/no-go |
| 14-08 | Limpeza de dependências, rotas e serviços sem uso |

## Segredos e ambientes

- Criar `development`, `staging` e `production` isolados.
- Vercel guarda segredos do app; Northflank Secret Groups guardam os dos serviços.
- Northflank não deve receber credenciais amplas do banco ou dos canais.
- Rotacionar secrets sem imprimir valor antigo ou novo em log.
- Fazer healthcheck, readiness, restore e rollback ensaiados.

## Observabilidade

O contrato mínimo deve propagar `traceId`, `workspaceId`, `leaderRunId`, `taskId` e `idempotencyKey`. O collector/provider de logs e traces ainda não está fixado; usar adapter OpenTelemetry e registrar a escolha antes do release.

Variáveis lógicas possíveis:

```env
OTEL_EXPORTER_OTLP_ENDPOINT=
OTEL_EXPORTER_OTLP_HEADERS=
```

Redigir tokens, prompts sensíveis, credenciais, conteúdo privado e URLs assinadas antes do envio.

## Validação de release

Testar DDoS/WAF na borda da Vercel, migrations, restore, perda de Redis, worker parado, fila em dead-letter, webhook inválido, segredo revogado e rollback. Não declarar release pronto apenas porque o deploy está verde.
