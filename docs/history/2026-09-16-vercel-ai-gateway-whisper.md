# 2026-09-16 — Vercel AI Gateway para Whisper na Fase 07

## Escopo

Atualização da integração de transcrição de áudio da SPRINT-07-04, sem alterar a ordem obrigatória de normalização antes do RAG.

## Motivo e contexto

A implementação inicial usava a API de áudio da OpenAI diretamente atrás de `AudioTranscriptionProvider`. O produto já define o Vercel AI Gateway como gateway primário e o usuário solicitou que o Whisper da Sprint 7 fosse acessado por essa camada.

## Estado anterior

- O adapter enviava `FormData` diretamente para `/v1/audio/transcriptions` da OpenAI.
- A configuração exigia `OPENAI_API_KEY`, `OPENAI_TRANSCRIPTION_MODEL` e `OPENAI_TRANSCRIPTION_URL`.
- A revisão da transcrição já era feita separadamente pelo `InferenceGateway` com `gpt-5.6-luna` e raciocínio `medium`.

## Novo estado

- O adapter usa AI SDK 7 (`experimental_transcribe`) e `@ai-sdk/gateway`.
- O modelo permanece explicitamente `openai/whisper-1`, agora roteado pelo endpoint de transcrição do Vercel AI Gateway.
- A autenticação usa `AI_GATEWAY_API_KEY`; em deployments Vercel, OIDC também é aceito pelo SDK.
- Sem credencial do Gateway ou OIDC disponível, o áudio permanece em `WAITING_USER`. Falhas autenticadas do Gateway permanecem recuperáveis em `FAILED`.
- A aplicação não chama diretamente a API de áudio da OpenAI. O modelo subjacente ainda é da OpenAI, conforme o catálogo do Vercel AI Gateway.

## Impacto

- Produto: o onboarding continua armazenando o original e só cria evidência de RAG depois de Whisper + revisão Luna + Markdown canônico.
- Arquitetura: a transcrição passa a compartilhar autenticação, observabilidade, billing e roteamento do Vercel AI Gateway; `AudioTranscriptionProvider` permanece o limite do domínio.
- Roadmap: não altera a ordem das fases nem antecipa a criação dos agentes do MVP.
- Sprints afetadas: SPRINT-07-04 e documentação de integração da Fase 07.

## Arquivos e contratos afetados

- `src/features/knowledge/audio-transcription.ts`
- `src/app/api/workspaces/[workspaceId]/knowledge/documents/route.ts`
- `src/zod/schemas/platform.ts`
- `src/lib/platform/env.ts`
- `.env.example`
- `ai@7` e `@ai-sdk/gateway@4.0.85`

## Evidências

- O catálogo oficial do Vercel AI Gateway documenta `openai/whisper-1` com `experimental_transcribe` e autenticação por API key/OIDC: https://vercel.com/ai-gateway/models/whisper-1
- O SDK instalado expõe `transcriptionModel`, usa o endpoint `/v4/ai/transcription-model` e aceita bytes de áudio.
- Testes unitários cobrem o modelo, os bytes enviados ao adapter fake, ausência de credencial e falha recuperável do Gateway.
- O smoke externo continua deliberadamente pendente porque a credencial ainda será adicionada pelo usuário.

## Riscos e pendências

- A modalidade de transcrição do AI Gateway está em beta e o acesso/modelos podem ter rollout gradual; confirmar disponibilidade do modelo no time/projeto Vercel antes do smoke.
- Validar em ambiente integrado limites de duração/tamanho, formatos de áudio aceitos, custo, observabilidade e comportamento de OIDC.
- A revisão real via `InferenceGateway` com `gpt-5.6-luna` `medium` continua pendente de endpoint e credencial integrados.

## Decisão

Adotar o Vercel AI Gateway como caminho único de acesso ao Whisper da Sprint 7, mantendo o provider e o modelo configuráveis somente no adapter e proibindo chamadas diretas de fornecedor no fluxo de onboarding.

## Relação

Substitui a decisão de integração descrita em `docs/history/2026-09-16-fase-07-onboarding-knowledge.md` apenas no transporte/autenticação da transcrição; a regra de revisão antes do RAG e o uso de PostgreSQL/pgvector permanecem inalterados.
