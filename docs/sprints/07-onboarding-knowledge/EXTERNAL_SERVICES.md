# Serviços externos — Fase 07

## Serviços reutilizados

A fase consome a fundação da Fase 06 e não cria um novo fornecedor obrigatório de IA. Os componentes reais são:

- Neon PostgreSQL com pgvector para documentos, versões, chunks e embeddings;
- Redis no Railway para fila e jobs assíncronos;
- workers CPU no Railway para validação, normalização, OCR quando aplicável e indexação;
- UploadThing para o arquivo original no MVP; serviço headless privado no Railway é o destino de gerenciamento de arquivos após a migração;
- provider de embeddings e OCR atrás de adapters, sem escolha direta no domínio.
- Vercel AI Gateway para transcrição de áudio com o modelo `openai/whisper-1`, somente atrás de `AudioTranscriptionProvider` e autenticado por `AI_GATEWAY_API_KEY` ou OIDC da Vercel. O aplicativo não chama a API de áudio da OpenAI diretamente; o modelo subjacente continua sendo o Whisper da OpenAI.
- GPT-5.6 Luna para correção e aprimoramento de transcrições, solicitado com raciocínio `medium` por meio do `InferenceGateway`; não usar `max`.

## Mapa por sprint

| Sprint | Serviço necessário | Observação |
|---|---|---|
| 07-01 | Redis Railway + worker CPU | Fila, lease, heartbeat, retry e dead-letter |
| 07-02 | UploadThing + Neon | Conteúdo no storage; referência e metadados no banco |
| 07-03 | Neon | Progresso e retomada do onboarding |
| 07-04 | UploadThing + worker CPU + Vercel AI Gateway + InferenceGateway | PDF/DOCX/XLSX, Markdown/CSV, OCR, transcrição e revisão de áudio |
| 07-05 | Neon/pgvector + embeddings | Busca híbrida, ciclo de vida do RAG e isolamento por workspace |
| 07-06 | Neon | Conflitos, confiança e validade |
| 07-07 | Neon | BrandProfile, fatos e readiness |

## Variáveis e execução

```env
DATABASE_URL=
REDIS_URL=
UPLOADTHING_TOKEN=
AI_GATEWAY_API_KEY=
AI_GATEWAY_TRANSCRIPTION_MODEL=openai/whisper-1
INFERENCE_GATEWAY_URL= (opcional)
```

O worker deve receber apenas referências assinadas e payload mínimo. Deve persistir estado e checksum no Neon antes de avançar a etapa. O código deve usar `AssetStorage`, sem espalhar URLs ou SDK do UploadThing pela normalização, OCR ou indexação, para permitir a migração posterior para o Pydio sem reprocessar documentos.

Não escolher nesta fase uma API direta de embeddings ou OCR. A transcrição usa o Vercel AI Gateway atrás de `AudioTranscriptionProvider`, com `openai/whisper-1`, autenticação por chave do Gateway ou OIDC da Vercel e observabilidade centralizada. Quando a inferência de revisão de texto for necessária, usar o `InferenceGateway` definido na Fase 09. O modelo de revisão é `gpt-5.6-luna` com raciocínio `medium`, sem `max`.

## Segurança e validação

- Uma fila e um worker nunca podem atravessar `workspaceId`.
- Repetição de uma versão não pode duplicar chunks nem embeddings.
- `WAITING_USER`, falha de OCR e provider indisponível devem ser recuperáveis.
- O original no UploadThing nunca é sobrescrito pelo Markdown derivado; depois da migração, a mesma regra vale para o Pydio.
- A limpeza total do RAG remove chunks/embeddings, mas preserva original, derivados e auditoria; reconstrução e substituição por arquivo usam transações Prisma e confirmação explícita.
- Testar fila cheia, lease expirado, retry técnico, dead-letter e restore do Neon.

Nenhum Pydio, serviço de mídia própria, R2, GPU, canal social ou billing é necessário nesta fase. O Pydio será provisionado somente no plano de migração pós-MVP.
