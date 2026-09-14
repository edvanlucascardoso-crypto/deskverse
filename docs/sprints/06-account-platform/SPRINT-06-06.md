# SPRINT-06-06 — Configuração operacional da plataforma

**Fase:** 06 — Conta e Plataforma  
**Status inicial:** PLANNED  
**Dependências:** SPRINT-06-05  
**Superfície principal:** ambientes, Neon, Redis, storage e contratos de serviços

## Objetivo

Configurar a fundação operacional do MVP antes das melhorias visuais posteriores: ambientes isolados, Neon PostgreSQL, Redis, UploadThing e contratos para Eve, Vercel AI Gateway e MCPs. Esta sprint não implementa agentes, canais, GPU, serviços próprios de mídia ou soluções futuras.

## Trabalho

1. Criar `development`, `staging` e `production`, com variáveis/credenciais segregadas.
2. Provisionar Neon por ambiente, migrations versionadas, conexão pooled da aplicação e isolamento por `workspace_id`.
3. Provisionar Redis atrás de `QueueBackend`, sem antecipar workers de produção; validar idempotency key, lease e heartbeat por contrato/teste.
4. Configurar storage abstrato para UploadThing no MVP, preservando interface de asset para futura troca por R2/S3.
5. Registrar contratos `AgentRuntime`, `InferenceGateway`, `WorkerExecutionProvider` e MCP remoto, sem acoplar regra de negócio ao fornecedor. Northflank é reservado aos serviços próprios de mídia posteriores.
6. Criar inventário de segredos, rotação, redaction de logs, healthcheck e ownership operacional.
7. Atualizar o guia de infraestrutura com os valores reais escolhidos, sem expor segredos.

## Não incluído

Autenticação de canal, WhatsApp/Instagram, execução GPU, render, envio externo, agentes futuros ou UI adicional. Esses itens entram somente nas sprints funcionais e SVC correspondentes.

## Critérios de aceite

- Cada ambiente usa Neon/Redis/storage e variáveis independentes.
- Migration e restore de teste são reproduzíveis; acesso de um workspace não retorna dados de outro.
- Contratos de fila e serviços existem sem o app web chamar worker diretamente.
- Nenhum segredo é commitado, exibido em log ou compartilhado entre ambientes.
- O MVP pode prosseguir para onboarding, tarefas e agentes sem depender de serviços futuros.
