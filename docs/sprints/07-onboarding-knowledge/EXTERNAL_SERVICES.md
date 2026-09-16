# Serviços externos — Fase 07

## Serviços reutilizados

A fase consome a fundação da Fase 06 e não cria um novo fornecedor obrigatório de IA. Os componentes reais são:

- Neon PostgreSQL com pgvector para documentos, versões, chunks e embeddings;
- Redis no Railway para fila e jobs assíncronos;
- workers CPU no Railway para validação, normalização, OCR quando aplicável e indexação;
- UploadThing para o arquivo original no MVP; serviço headless privado no Railway é o destino de gerenciamento de arquivos após a migração;
- provider de embeddings e OCR atrás de adapters, sem escolha direta no domínio.

## Mapa por sprint

| Sprint | Serviço necessário | Observação |
|---|---|---|
| 07-01 | Redis Railway + worker CPU | Fila, lease, heartbeat, retry e dead-letter |
| 07-02 | UploadThing + Neon | Conteúdo no storage; referência e metadados no banco |
| 07-03 | Neon | Progresso e retomada do onboarding |
| 07-04 | UploadThing + worker CPU | Extração, Markdown canônico e OCR adapter |
| 07-05 | Neon/pgvector + embeddings | Busca híbrida e isolamento por workspace |
| 07-06 | Neon | Conflitos, confiança e validade |
| 07-07 | Neon | BrandProfile, fatos e readiness |

## Variáveis e execução

```env
DATABASE_URL=
REDIS_URL=
UPLOADTHING_TOKEN=
```

O worker deve receber apenas referências assinadas e payload mínimo. Deve persistir estado e checksum no Neon antes de avançar a etapa. O código deve usar `AssetStorage`, sem espalhar URLs ou SDK do UploadThing pela normalização, OCR ou indexação, para permitir a migração posterior para o Pydio sem reprocessar documentos.

Não escolher nesta fase uma API direta de embeddings ou OCR. Quando a inferência for necessária, usar o `InferenceGateway` definido na Fase 09; OCR e normalização permanecem adapters substituíveis.

## Segurança e validação

- Uma fila e um worker nunca podem atravessar `workspaceId`.
- Repetição de uma versão não pode duplicar chunks nem embeddings.
- `WAITING_USER`, falha de OCR e provider indisponível devem ser recuperáveis.
- O original no UploadThing nunca é sobrescrito pelo Markdown derivado; depois da migração, a mesma regra vale para o Pydio.
- Testar fila cheia, lease expirado, retry técnico, dead-letter e restore do Neon.

Nenhum Pydio, serviço de mídia própria, R2, GPU, canal social ou billing é necessário nesta fase. O Pydio será provisionado somente no plano de migração pós-MVP.
