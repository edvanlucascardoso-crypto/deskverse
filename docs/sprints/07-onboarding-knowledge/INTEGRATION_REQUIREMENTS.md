# Integration requirements — SPRINT-07-01

## Status

`COMPLETE_WITH_INTEGRATION_REQUIREMENTS`

## Limite da entrega local

`createInMemoryQueueBackend` é um adapter determinístico para desenvolvimento e testes. Ele não representa Redis, não mantém estado entre processos e não substitui o Neon como fonte durável. O drawer explicita essa condição por meio das fixtures locais.

## Próxima integração

1. Implementar o gateway autenticado entre a aplicação e o Redis privado no Northflank.
2. Persistir o registro durável de cada job antes de publicar ou liberar a próxima etapa.
3. Garantir que o worker receba apenas payload mínimo, `workspaceId`, referência do documento, checksum e chave de idempotência.
4. Reconciliar lease, heartbeat, retry, dead-letter e cancelamento em cascata entre Redis e Neon sem permitir travessia de workspace.
5. Repetir os cenários de fila cheia, fairness, lease expirado, retry técnico, espera humana, dead-letter, reprocessamento e restore em ambiente limpo.

## Fora do escopo

Não foram conectados Redis, workers Northflank, OCR, embeddings, UploadThing, publicação externa, cobrança ou novos modelos Prisma. Não há bloqueio de decisão de produto registrado para promover a próxima sprint; há apenas dependências de infraestrutura e adapters reais.
