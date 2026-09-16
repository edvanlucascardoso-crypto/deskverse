# SPRINT-07-02 — Relatório de conclusão

## Estado

`COMPLETE_WITH_INTEGRATION_REQUIREMENTS`

## Corte

16/09/2026. A sprint foi executada depois da fundação de filas da 07-01 e antes do onboarding, conforme a ordem da fase.

## Entrega

- Upload autenticado e limitado a 50 MB, com checksum, MIME type, descrição opcional, `workspaceId` e deduplicação por chave original.
- Adapter `AssetStorage` para UploadThing: original privado, referência persistida no PostgreSQL, URL assinada e remoção protegida pelo workspace.
- `Document` e `DocumentVersion` versionados em Prisma, com estados explícitos para arquivo recebido, conversão, espera, falha e pronto.
- Remoção do arquivo separada da limpeza do RAG: apagar o índice não apaga o original nem Markdown/CSV/transcrição derivados.
- Gate de formato para PDF, DOC/DOCX, XLS/XLSX, CSV, texto, Markdown, HTML, JSON e áudio; formatos desconhecidos são recusados sem entrar na base.

## Evidências

- `yarn test`: 15 arquivos e 46 testes aprovados, incluindo fixtures de conversão e estados.
- `yarn lint`: aprovado.
- `yarn typecheck`: aprovado com geração do Prisma Client.
- `yarn db:validate`: schema válido.
- `yarn next build` com `BETTER_AUTH_URL` e `BETTER_AUTH_SECRET` locais: build Next 16/Turbopack aprovado, incluindo as rotas de conhecimento e RAG.
- E2E do drawer de onboarding/conhecimento: 2 testes aprovados em Chromium desktop e mobile.

## Integrações pendentes

- Smoke real de upload, URL assinada e remoção no UploadThing, com ACL privada e token por ambiente.
- Aplicação da migration de conhecimento e ciclo de vida do RAG no Neon; o ambiente Windows falhou em `prisma migrate deploy`/`yarn build` com `P1011` de TLS.
- Worker assíncrono, fila Redis, lease, retry, dead-letter e processamento fora do request.

## Próxima prioridade

`SPRINT-07-03 — Fluxo de onboarding`.
