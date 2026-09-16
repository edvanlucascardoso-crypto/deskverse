# Serviços externos — Fase 06

## Escopo

Esta é a fase que prepara a infraestrutura comum. A decisão operacional desta documentação é:

```text
Vercel (app/API pública) → Neon PostgreSQL
                         → gateway de fila autenticado
Railway (Redis privado, scheduler e workers CPU; RunPod Serverless para GPU/RENDER posteriores)
UploadThing (arquivos)
```

Cada ambiente deve ter credenciais e recursos próprios: `development`, `staging` e `production`.

## Mapa por sprint

| Sprint | Serviço | O que configurar |
|---|---|---|
| 06-01 | Nenhum | Adaptador local e limites de responsabilidade |
| 06-02 | Neon PostgreSQL | Banco multi-tenant, Prisma, migrations e pgvector |
| 06-03 | Better Auth + Neon | Secret, URL base, tabelas e sessão persistente |
| 06-04 | Neon | Organizações, workspaces e membros |
| 06-05 | Neon | Papéis, scopes e negativa segura |
| 06-06 | Neon, Redis no Railway e UploadThing | Ambientes, fila, storage, segredos e healthchecks |
| 06-07 | Vercel | Deploy do shell protegido e variáveis por ambiente |

## Neon PostgreSQL

Provisionar um projeto/banco por ambiente. Usar:

- conexão pooled para a aplicação;
- conexão direta separada para migrations;
- `workspace_id` em todo dado multi-tenant;
- extensão `pgvector` por migration versionada;
- backup, restore de teste e `prisma migrate status`.

Variáveis lógicas mínimas:

```env
DATABASE_URL=
DIRECT_URL=
```

Nunca substituir migration por `prisma db push` em ambiente compartilhado.

## Better Auth

Better Auth é biblioteca da aplicação, não um serviço hospedado obrigatório. Para e-mail/senha, configurar no servidor:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
```

`BETTER_AUTH_SECRET` deve ser uma chave de alta entropia com pelo menos 32 caracteres e diferente por ambiente. OAuth, SMTP, magic link e infraestrutura adicional de Better Auth são decisões posteriores, não pré-requisitos desta fase.

## Redis no Railway

Criar um Redis por ambiente no Railway, vinculado aos serviços privados do ambiente e separado das credenciais dos endpoints RunPod Serverless.

Configuração obrigatória:

- TLS habilitado;
- rede privada para scheduler e workers;
- política `noeviction`;
- AOF e backup agendado;
- Sentinel/replicas conforme o nível de disponibilidade do ambiente;
- memória reservada para reescrita do AOF;
- `REDIS_URL` disponível somente a processos que precisam da fila.

O Redis não é fonte definitiva de tarefas ou memória: Neon mantém o estado durável. O contrato `QueueBackend` deve esconder o fornecedor.

Como o app público está na Vercel, não expor Redis diretamente ao navegador. Para a API da Vercel enfileirar tarefas, preferir um Queue Gateway HTTPS autenticado no Railway. A exposição TCP pública do Redis fica como exceção operacional, sempre com TLS e rotação de credenciais.

## UploadThing no MVP e migração posterior

Criar aplicação/token separado por ambiente:

```env
UPLOADTHING_TOKEN=
```

No MVP, o banco guarda referências e metadados e o binário fica no UploadThing. O usuário não recebe credencial do storage e nenhuma chave é enviada para o LLM.

Depois do MVP, o destino da migração de gerenciamento de arquivos é um serviço headless privado no Railway, com storage aprovado. A troca deve acontecer atrás de um contrato `AssetStorage`/`AssetRepository`, preservando `workspaceId`, `assetId`, versões, checksum, lineage, status e autorização no Deskverse. O serviço de arquivos não vira fonte de verdade de usuários, workspaces, permissões de domínio ou metadados do produto.

Não provisionar Pydio nesta fase. Antes da migração, definir um serviço Pydio privado por ambiente, banco próprio do Pydio e storage persistente próprio; executar cópia, validação de checksum, período de dual-read e rollback sem interromper o UploadThing. A migração só termina quando os assets confirmados e suas referências puderem ser lidos pelo contrato sem depender de URLs específicas do UploadThing.

## Vercel, segredos e validação

- Criar projeto e variáveis separadas para preview/staging/production.
- Não reutilizar segredo de produção em preview.
- Manter segredos no Vercel/Railway e nos mecanismos de segredo do RunPod, nunca no Git ou em logs.
- Registrar owner, rotação, redaction e healthcheck de cada serviço.
- Testar isolamento de workspace, migration/restore, Redis indisponível e UploadThing indisponível.

Eve, Vercel AI Gateway, MCPs concretos, GPU, canais, billing e serviços próprios de mídia entram nas fases funcionais correspondentes; nesta fase ficam apenas contratos e adaptadores.
